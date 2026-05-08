"""Aggregate sensors for User Activity Tracker."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)

from .const import DOMAIN
from .storage import ActivityStore

_LOGGER = logging.getLogger(__name__)
UPDATE_INTERVAL = timedelta(seconds=30)


class ActivityCoordinator(DataUpdateCoordinator):
    """Pulls aggregate stats from SQLite on a fixed interval."""

    def __init__(self, hass: HomeAssistant, store: ActivityStore) -> None:
        super().__init__(
            hass,
            logger=_LOGGER,
            name=f"{DOMAIN}_coordinator",
            update_interval=UPDATE_INTERVAL,
        )
        self.store = store

    async def _async_update_data(self) -> dict:
        now = datetime.now(tz=timezone.utc)
        start_today = int(now.replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
        start_week = int((now - timedelta(days=7)).timestamp())
        start_month = int((now - timedelta(days=30)).timestamp())

        today = await self.store.async_count_since(start_today)
        week = await self.store.async_count_since(start_week)
        month = await self.store.async_count_since(start_month)

        top_entity = await self.store.async_top_entity(start_week, limit=1)
        top_user = await self.store.async_top_user(start_week, limit=1)

        return {
            "today": today,
            "week": week,
            "month": month,
            "top_entity": top_entity[0] if top_entity else None,
            "top_user": top_user[0] if top_user else None,
        }


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities,
) -> None:
    store: ActivityStore = hass.data[DOMAIN][entry.entry_id]["store"]
    coordinator = ActivityCoordinator(hass, store)
    await coordinator.async_config_entry_first_refresh()

    async_add_entities(
        [
            ActivityCountSensor(coordinator, "today", "Activity Today", "mdi:gesture-tap"),
            ActivityCountSensor(coordinator, "week", "Activity This Week", "mdi:calendar-week"),
            ActivityCountSensor(coordinator, "month", "Activity This Month", "mdi:calendar-month"),
            ActivityTopEntitySensor(coordinator),
            ActivityTopUserSensor(coordinator),
        ]
    )


class _Base(CoordinatorEntity, SensorEntity):
    _attr_has_entity_name = True

    def __init__(self, coordinator: ActivityCoordinator, key: str) -> None:
        super().__init__(coordinator)
        self._key = key
        self._attr_unique_id = f"{DOMAIN}_{key}"


class ActivityCountSensor(_Base):
    _attr_state_class = "measurement"
    _attr_native_unit_of_measurement = "events"

    def __init__(self, coordinator, key: str, name: str, icon: str) -> None:
        super().__init__(coordinator, key)
        self._attr_name = name
        self._attr_icon = icon

    @property
    def native_value(self):
        return self.coordinator.data.get(self._key, 0)


class ActivityTopEntitySensor(_Base):
    _attr_icon = "mdi:trophy"
    _attr_name = "Top Entity (week)"

    def __init__(self, coordinator) -> None:
        super().__init__(coordinator, "top_entity")

    @property
    def native_value(self):
        top = self.coordinator.data.get("top_entity")
        return top["entity_id"] if top else None

    @property
    def extra_state_attributes(self):
        top = self.coordinator.data.get("top_entity") or {}
        return {"count": top.get("n", 0)}


class ActivityTopUserSensor(_Base):
    _attr_icon = "mdi:account-star"
    _attr_name = "Top User (week)"

    def __init__(self, coordinator) -> None:
        super().__init__(coordinator, "top_user")

    @property
    def native_value(self):
        top = self.coordinator.data.get("top_user")
        return (top.get("user_name") or top.get("user_id")) if top else None

    @property
    def extra_state_attributes(self):
        top = self.coordinator.data.get("top_user") or {}
        return {
            "user_id": top.get("user_id"),
            "count": top.get("n", 0),
        }
