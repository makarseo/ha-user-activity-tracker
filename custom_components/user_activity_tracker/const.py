"""Constants for User Activity Tracker."""
from __future__ import annotations

DOMAIN = "user_activity_tracker"
PLATFORMS = ["sensor"]

# DB
DB_FILENAME = "user_activity.db"

# Domains we treat as "interactive" — actively used by people
TRACKED_DOMAINS = {
    "switch",
    "light",
    "input_boolean",
    "input_button",
    "button",
    "scene",
    "script",
    "cover",
    "lock",
    "media_player",
    "climate",
    "fan",
    "vacuum",
    "select",
    "input_select",
    "number",
    "input_number",
    "humidifier",
    "water_heater",
    "alarm_control_panel",
    "remote",
    "siren",
    "valve",
    "lawn_mower",
}

# Services we ignore (read-only / non-state-changing)
IGNORED_SERVICES = {
    "reload",
    "load_platform",
    "set_default_level",
    "update_entity",
}

# Static resource paths
PANEL_URL = f"/{DOMAIN}_panel/index.html"
PANEL_TITLE = "User Activity"
PANEL_ICON = "mdi:gesture-tap-button"

CARD_URL = f"/{DOMAIN}_static/user-activity-card.js"
PANEL_JS_URL = f"/{DOMAIN}_static/user-activity-panel.js"

# API
API_BASE = f"/api/{DOMAIN}"
