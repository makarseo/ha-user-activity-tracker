"""Event listeners — log every interactive action with full context."""
from __future__ import annotations

import json
import logging
from collections import OrderedDict
from datetime import datetime, timezone

from homeassistant.const import EVENT_CALL_SERVICE
from homeassistant.core import Event, HomeAssistant
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
)

from .const import IGNORED_SERVICES, TRACKED_DOMAINS
from .storage import ActivityStore

_LOGGER = logging.getLogger(__name__)

EVENT_AUTOMATION_TRIGGERED = "automation_triggered"
EVENT_SCRIPT_STARTED = "script_started"

CTX_MAP_MAX = 4096


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
    def __init__(self, hass: HomeAssistant, store: ActivityStore) -> None:
        self.hass = hass
        self.store = store
        self._unsubs: list = []
        self._ctx_map: _LRU = _LRU(CTX_MAP_MAX)

    def async_start(self) -> None:
        self._unsubs.append(self.hass.bus.async_listen(EVENT_CALL_SERVICE, self._on_call_service))
        self._unsubs.append(self.hass.bus.async_listen(EVENT_AUTOMATION_TRIGGERED, self._on_automation))
        self._unsubs.append(self.hass.bus.async_listen(EVENT_SCRIPT_STARTED, self._on_script))
        _LOGGER.debug("ActivityRecorder started")

    def async_stop(self) -> None:
        for unsub in self._unsubs:
            try:
                unsub()
            except Exception:  # pylint: disable=broad-except
                pass
        self._unsubs = []

    # ---- helpers ----------------------------------------------------

    def _user_name(self, user_id: str | None) -> str | None:
        if not user_id:
            return None
        try:
            user = self.hass.auth._store._users.get(user_id)  # type: ignore[attr-defined]
            return user.name if user else None
        except Exception:  # pylint: disable=broad-except
            return None

    def _resolve_entity(self, entity_id: str) -> tuple[str | None, str | None, str | None]:
        """Return (friendly_name, area_id, area_name) for an entity_id."""
        friendly = None
        area_id = None
        area_name = None
        try:
            state = self.hass.states.get(entity_id)
            if state:
                friendly = state.attributes.get("friendly_name")
            ent_reg = er.async_get(self.hass)
            entry = ent_reg.async_get(entity_id)
            if entry:
                if entry.area_id:
                    area_id = entry.area_id
                elif entry.device_id:
                    dev_reg = dr.async_get(self.hass)
                    device = dev_reg.async_get(entry.device_id)
                    if device and device.area_id:
                        area_id = device.area_id
            if area_id:
                area_reg = ar.async_get(self.hass)
                area = area_reg.async_get_area(area_id)
                if area:
                    area_name = area.name
        except Exception:  # pylint: disable=broad-except
            pass
        return friendly, area_id, area_name

    def _classify(self, ctx) -> tuple[str, str | None, str | None]:
        """Return (trigger_type, trigger_entity_id, automation_name)."""
        if ctx.parent_id and ctx.parent_id in self._ctx_map:
            typ, eid, name = self._ctx_map[ctx.parent_id]
            self._ctx_map[ctx.id] = (typ, eid, name)
            return typ, eid, name
        if ctx.id in self._ctx_map:
            return self._ctx_map[ctx.id]
        if ctx.user_id is not None:
            return "user", None, None
        return "system", None, None

    # ---- automation/script trackers --------------------------------

    async def _on_automation(self, event: Event) -> None:
        eid = event.data.get("entity_id")
        if not eid:
            return
        name = event.data.get("name")
        if not name:
            state = self.hass.states.get(eid)
            if state:
                name = state.attributes.get("friendly_name") or eid
        self._ctx_map[event.context.id] = ("automation", eid, name or eid)

    async def _on_script(self, event: Event) -> None:
        eid = event.data.get("entity_id")
        if not eid:
            return
        name = event.data.get("name")
        if not name:
            state = self.hass.states.get(eid)
            if state:
                name = state.attributes.get("friendly_name") or eid
        self._ctx_map[event.context.id] = ("script", eid, name or eid)

    # ---- main handler ----------------------------------------------

    async def _on_call_service(self, event: Event) -> None:
        domain = event.data.get("domain")
        service = event.data.get("service")

        if not domain or domain not in TRACKED_DOMAINS:
            return
        if service in IGNORED_SERVICES:
            return

        trigger_type, trigger_eid, trigger_name = self._classify(event.context)

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
            default=str, ensure_ascii=False,
        )[:2000]

        for entity_id in entity_ids:
            friendly, area_id, area_name = self._resolve_entity(entity_id)
            await self.store.async_log({
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
                "friendly_name": friendly,
                "area_id": area_id,
                "area_name": area_name,
                "automation_name": trigger_name,
                "extra": extra,
            })
