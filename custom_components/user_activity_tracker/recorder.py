"""Event listeners that capture user-initiated interactions."""
from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any

from homeassistant.const import EVENT_CALL_SERVICE, EVENT_STATE_CHANGED
from homeassistant.core import Event, HomeAssistant

from .const import IGNORED_SERVICES, TRACKED_DOMAINS
from .storage import ActivityStore

_LOGGER = logging.getLogger(__name__)


class ActivityRecorder:
    """Listens to HA events and writes user-initiated ones to the DB.

    Detection rule:
        context.user_id is not None  AND  context.parent_id is None

    user_id present  -> there is a real user attribution
    parent_id is None -> this is a ROOT context (not chained from automation/script)

    This gives us "user pressed a thing in UI / app / voice" while excluding
    automations/scripts even when they were originally triggered by a user.
    """

    def __init__(self, hass: HomeAssistant, store: ActivityStore) -> None:
        self.hass = hass
        self.store = store
        self._unsub_call_service = None
        self._unsub_state = None

    # ------------------------------------------------------------------ wire

    def async_start(self) -> None:
        self._unsub_call_service = self.hass.bus.async_listen(
            EVENT_CALL_SERVICE, self._on_call_service
        )
        self._unsub_state = self.hass.bus.async_listen(
            EVENT_STATE_CHANGED, self._on_state_changed
        )
        _LOGGER.debug("ActivityRecorder started")

    def async_stop(self) -> None:
        for unsub in (self._unsub_call_service, self._unsub_state):
            if unsub:
                unsub()
        self._unsub_call_service = None
        self._unsub_state = None
        _LOGGER.debug("ActivityRecorder stopped")

    # ------------------------------------------------------------------ helpers

    def _is_user_initiated(self, event: Event) -> bool:
        ctx = event.context
        if ctx is None:
            return False
        if ctx.user_id is None:
            return False
        if ctx.parent_id is not None:
            # chained from automation/script — exclude
            return False
        return True

    def _user_name(self, user_id: str | None) -> str | None:
        if not user_id:
            return None
        try:
            user = self.hass.auth._store._users.get(user_id)  # type: ignore[attr-defined]
            return user.name if user else None
        except Exception:  # pylint: disable=broad-except
            return None

    # ------------------------------------------------------------------ handlers

    async def _on_call_service(self, event: Event) -> None:
        if not self._is_user_initiated(event):
            return

        domain = event.data.get("domain")
        service = event.data.get("service")

        if not domain or domain not in TRACKED_DOMAINS:
            return
        if service in IGNORED_SERVICES:
            return

        service_data = event.data.get("service_data") or {}
        entity_ids = service_data.get("entity_id")
        if isinstance(entity_ids, str):
            entity_ids = [entity_ids]
        elif not entity_ids:
            entity_ids = []

        # If no specific entity, log a single domain-level event
        if not entity_ids:
            entity_ids = [f"{domain}.*"]

        ts = int(datetime.now(tz=timezone.utc).timestamp())
        user_id = event.context.user_id
        user_name = self._user_name(user_id)
        extra = json.dumps(
            {k: v for k, v in service_data.items() if k != "entity_id"},
            default=str,
            ensure_ascii=False,
        )[:2000]

        for entity_id in entity_ids:
            await self.store.async_log(
                {
                    "ts": ts,
                    "domain": domain,
                    "entity_id": entity_id,
                    "service": service,
                    "user_id": user_id,
                    "user_name": user_name,
                    "source": "service",
                    "context_id": event.context.id,
                    "parent_id": event.context.parent_id,
                    "extra": extra,
                }
            )

    async def _on_state_changed(self, event: Event) -> None:
        # Backup signal: catches state changes that were user-initiated but
        # didn't go through call_service (e.g. some integrations push state).
        if not self._is_user_initiated(event):
            return

        entity_id: str = event.data.get("entity_id", "")
        if not entity_id:
            return
        domain = entity_id.split(".", 1)[0]
        if domain not in TRACKED_DOMAINS:
            return

        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")
        if new_state is None or old_state is None:
            return
        if new_state.state == old_state.state:
            return

        # Skip if there was a service call with the same context — already logged
        if await self._already_logged(event.context.id):
            return

        ts = int(datetime.now(tz=timezone.utc).timestamp())
        user_id = event.context.user_id
        user_name = self._user_name(user_id)

        await self.store.async_log(
            {
                "ts": ts,
                "domain": domain,
                "entity_id": entity_id,
                "service": None,
                "user_id": user_id,
                "user_name": user_name,
                "source": "state",
                "context_id": event.context.id,
                "parent_id": event.context.parent_id,
                "extra": json.dumps(
                    {"from": old_state.state, "to": new_state.state}, ensure_ascii=False
                ),
            }
        )

    async def _already_logged(self, context_id: str | None) -> bool:
        if not context_id:
            return False
        rows = await self.hass.async_add_executor_job(
            self.store._query,
            "SELECT 1 FROM events WHERE context_id = ? LIMIT 1",
            (context_id,),
        )
        return bool(rows)
