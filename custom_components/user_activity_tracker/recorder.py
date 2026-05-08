"""Event listeners — log every interactive action with trigger attribution."""
from __future__ import annotations

import json
import logging
from collections import OrderedDict
from datetime import datetime, timezone

from homeassistant.const import EVENT_CALL_SERVICE
from homeassistant.core import Event, HomeAssistant

from .const import IGNORED_SERVICES, TRACKED_DOMAINS
from .storage import ActivityStore

_LOGGER = logging.getLogger(__name__)

EVENT_AUTOMATION_TRIGGERED = "automation_triggered"
EVENT_SCRIPT_STARTED = "script_started"

CTX_MAP_MAX = 4096  # LRU cap to bound memory


class _LRU(OrderedDict):
    def __init__(self, maxsize: int) -> None:
        super().__init__()
        self.maxsize = maxsize

    def __setitem__(self, key, value):
        if key in self:
            self.move_to_end(key)
        super().__setitem__(key, value)
        if len(self) > self.maxsize:
            self.popitem(last=False)


class ActivityRecorder:
    """Records every service call in tracked domains, classifies its origin.

    trigger_type values:
      - 'user'        — direct UI / mobile / voice action by a user
      - 'automation'  — triggered by an automation (we know which one)
      - 'script'      — triggered by a script
      - 'system'      — fallback (no user, no known parent)
    """

    def __init__(self, hass: HomeAssistant, store: ActivityStore) -> None:
        self.hass = hass
        self.store = store
        self._unsubs: list = []
        # context_id -> (trigger_type, trigger_entity_id)
        self._ctx_map: _LRU = _LRU(CTX_MAP_MAX)

    def async_start(self) -> None:
        self._unsubs.append(
            self.hass.bus.async_listen(EVENT_CALL_SERVICE, self._on_call_service)
        )
        self._unsubs.append(
            self.hass.bus.async_listen(EVENT_AUTOMATION_TRIGGERED, self._on_automation)
        )
        self._unsubs.append(
            self.hass.bus.async_listen(EVENT_SCRIPT_STARTED, self._on_script)
        )
        _LOGGER.debug("ActivityRecorder started")

    def async_stop(self) -> None:
        for unsub in self._unsubs:
            try:
                unsub()
            except Exception:  # pylint: disable=broad-except
                pass
        self._unsubs = []
        _LOGGER.debug("ActivityRecorder stopped")

    # ------------------------------------------------------------------ trigger maps

    async def _on_automation(self, event: Event) -> None:
        eid = event.data.get("entity_id")
        if not eid:
            return
        self._ctx_map[event.context.id] = ("automation", eid)

    async def _on_script(self, event: Event) -> None:
        eid = event.data.get("entity_id")
        if not eid:
            return
        self._ctx_map[event.context.id] = ("script", eid)

    # ------------------------------------------------------------------ helpers

    def _user_name(self, user_id: str | None) -> str | None:
        if not user_id:
            return None
        try:
            user = self.hass.auth._store._users.get(user_id)  # type: ignore[attr-defined]
            return user.name if user else None
        except Exception:  # pylint: disable=broad-except
            return None

    def _classify(self, ctx) -> tuple[str, str | None]:
        """Return (trigger_type, trigger_entity_id)."""
        # 1. Walk up via parent_id (1 level — HA chains usually flat)
        if ctx.parent_id and ctx.parent_id in self._ctx_map:
            typ, eid = self._ctx_map[ctx.parent_id]
            # propagate to current ctx so deeper children resolve too
            self._ctx_map[ctx.id] = (typ, eid)
            return typ, eid
        # 2. Self ctx already mapped (rare — service call from automation_triggered context itself)
        if ctx.id in self._ctx_map:
            return self._ctx_map[ctx.id]
        # 3. User attribution → 'user' (UI / mobile / voice / API)
        if ctx.user_id is not None:
            return "user", None
        # 4. System / unknown
        return "system", None

    # ------------------------------------------------------------------ main handler

    async def _on_call_service(self, event: Event) -> None:
        domain = event.data.get("domain")
        service = event.data.get("service")

        if not domain or domain not in TRACKED_DOMAINS:
            return
        if service in IGNORED_SERVICES:
            return

        trigger_type, trigger_eid = self._classify(event.context)

        service_data = event.data.get("service_data") or {}
        entity_ids = service_data.get("entity_id")
        if isinstance(entity_ids, str):
            entity_ids = [entity_ids]
        elif not entity_ids:
            entity_ids = []
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
                    "trigger_type": trigger_type,
                    "trigger_entity_id": trigger_eid,
                    "extra": extra,
                }
            )
