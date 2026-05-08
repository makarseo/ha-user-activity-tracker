"""User Activity Tracker integration."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    CARD_URL,
    DB_FILENAME,
    DOMAIN,
    PANEL_ICON,
    PANEL_JS_URL,
    PANEL_TITLE,
    PLATFORMS,
)
from .http_api import async_register_views
from .recorder import ActivityRecorder
from .storage import ActivityStore

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up via YAML — no-op, we use config_flow only."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration from a config entry."""
    db_path = Path(hass.config.path(".storage", DB_FILENAME))
    store = ActivityStore(hass, db_path)
    await store.async_init()

    recorder = ActivityRecorder(hass, store)
    recorder.async_start()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "store": store,
        "recorder": recorder,
    }

    # Register HTTP views (REST API)
    async_register_views(hass, store)

    # Serve static frontend assets (card + panel)
    static_dir = Path(__file__).parent / "www"
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                f"/{DOMAIN}_static",
                str(static_dir),
                cache_headers=False,
            ),
            StaticPathConfig(
                f"/{DOMAIN}_panel",
                str(static_dir),
                cache_headers=False,
            ),
        ]
    )

    # Lovelace card is served at CARD_URL — users add as a JS Module resource
    _LOGGER.debug("Card available at %s", CARD_URL)

    # Register sidebar panel as a custom JS module (has access to `hass`)
    try:
        async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            frontend_url_path=DOMAIN,
            config={
                "_panel_custom": {
                    "name": "user-activity-panel",
                    "embed_iframe": False,
                    "trust_external": False,
                    "js_url": PANEL_JS_URL,
                }
            },
            require_admin=False,
        )
    except ValueError:
        # already registered
        pass

    # Forward to platforms (sensors)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    data = hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    if data:
        data["recorder"].async_stop()

    try:
        async_remove_panel(hass, DOMAIN)
    except Exception:  # pylint: disable=broad-except
        pass

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    return unload_ok
