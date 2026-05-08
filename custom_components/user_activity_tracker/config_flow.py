"""Config flow — single instance, zero options."""
from __future__ import annotations

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN


class UserActivityTrackerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Single-instance setup."""

    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None) -> FlowResult:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        return self.async_create_entry(title="User Activity Tracker", data={})

    async def async_step_import(self, user_input: dict | None = None) -> FlowResult:
        return await self.async_step_user(user_input)
