"""User Activity Tracker integration."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import panel_custom
from homeassistant.components.frontend import async_remove_panel
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

_STATIC_PATHS_REGISTERED = "_uat_static_registered"
_PANEL_REGISTERED = "_uat_panel_registered"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """YAML setup — no-op."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up from a config entry."""
    _LOGGER.info("Setting up User Activity Tracker (entry %s)", entry.entry_id)

    # --- Storage ---
    db_path = Path(hass.config.path(".storage", DB_FILENAME))
    store = ActivityStore(hass, db_path)
    try:
        await store.async_init()
    except Exception:
        _LOGGER.exception("Failed to initialize storage at %s", db_path)
        raise

    # --- Recorder ---
    recorder = ActivityRecorder(hass, store)
    recorder.async_start()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {"store": store, "recorder": recorder}

    # --- HTTP views ---
    async_register_views(hass, store)

    # --- Static frontend assets (idempotent across reloads) ---
    if not hass.data[DOMAIN].get(_STATIC_PATHS_REGISTERED):
        static_dir = Path(__file__).parent / "www"
        try:
            await hass.http.async_register_static_paths(
                [
                    StaticPathConfig(f"/{DOMAIN}_static", str(static_dir), False),
                    StaticPathConfig(f"/{DOMAIN}_panel", str(static_dir), False),
                ]
            )
            hass.data[DOMAIN][_STATIC_PATHS_REGISTERED] = True
            _LOGGER.debug("Static path /%s_static -> %s", DOMAIN, static_dir)
        except Exception:  # pylint: disable=broad-except
            _LOGGER.exception("Failed to register static paths")

    _LOGGER.debug("Lovelace card available at %s", CARD_URL)

    # --- Sidebar panel (uses official panel_custom API) ---
    if not hass.data[DOMAIN].get(_PANEL_REGISTERED):
        try:
            await panel_custom.async_register_panel(
                hass,
                webcomponent_name="user-activity-panel",
                frontend_url_path=DOMAIN,
                sidebar_title=PANEL_TITLE,
                sidebar_icon=PANEL_ICON,
                js_url=PANEL_JS_URL,
                embed_iframe=False,
                require_admin=False,
            )
            hass.data[DOMAIN][_PANEL_REGISTERED] = True
            _LOGGER.info("Sidebar panel registered: /%s -> %s", DOMAIN, PANEL_JS_URL)
        except ValueError as err:
            # already registered (e.g. after reload) — try to refresh
            _LOGGER.debug("Panel register raised ValueError: %s", err)
            hass.data[DOMAIN][_PANEL_REGISTERED] = True
        except Exception:  # pylint: disable=broad-except
            _LOGGER.exception("Failed to register sidebar panel")

    # --- Sensors ---
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload an entry."""
    data = hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    if data:
        try:
            data["recorder"].async_stop()
        except Exception:  # pylint: disable=broad-except
            _LOGGER.exception("Recorder stop failed")

    # Remove sidebar panel — it'll be re-added on next setup
    try:
        async_remove_panel(hass, DOMAIN)
        hass.data.get(DOMAIN, {}).pop(_PANEL_REGISTERED, None)
    except Exception:  # pylint: disable=broad-except
        pass

    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
