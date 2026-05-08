"""Constants for User Activity Tracker."""
from __future__ import annotations

DOMAIN = "user_activity_tracker"
PLATFORMS = ["sensor"]

DB_FILENAME = "user_activity.db"

TRACKED_DOMAINS = {
    "switch", "light", "input_boolean", "input_button", "button",
    "scene", "script", "cover", "lock", "media_player", "climate",
    "fan", "vacuum", "select", "input_select", "number", "input_number",
    "humidifier", "water_heater", "alarm_control_panel", "remote",
    "siren", "valve", "lawn_mower",
}

IGNORED_SERVICES = {
    "reload", "load_platform", "set_default_level", "update_entity",
}

PANEL_URL = f"/{DOMAIN}_panel/index.html"
PANEL_TITLE = "Home Activity"
PANEL_ICON = "mdi:chart-timeline-variant-shimmer"

CARD_URL = f"/{DOMAIN}_static/user-activity-card.js"
PANEL_JS_URL = f"/{DOMAIN}_static/user-activity-panel.js"

API_BASE = f"/api/{DOMAIN}"

# Domain icons (mdi:* without prefix)
DOMAIN_ICONS = {
    "switch": "toggle-switch",
    "light": "lightbulb",
    "cover": "blinds",
    "climate": "thermostat",
    "fan": "fan",
    "vacuum": "robot-vacuum",
    "lock": "lock",
    "media_player": "play",
    "scene": "palette",
    "script": "script-text",
    "automation": "robot",
    "button": "gesture-tap-button",
    "input_boolean": "toggle-switch-outline",
    "input_button": "gesture-tap",
    "select": "form-select",
    "input_select": "form-select",
    "number": "numeric",
    "input_number": "numeric",
    "humidifier": "air-humidifier",
    "water_heater": "water-boiler",
    "alarm_control_panel": "shield-home",
    "remote": "remote",
    "siren": "alarm-light",
    "valve": "valve",
    "lawn_mower": "robot-mower",
}
