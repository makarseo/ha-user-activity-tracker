# User Activity Tracker for Home Assistant

Zero-config integration that tracks **only manual user interactions** (button taps, switches, lights, scenes, etc.) — not automations, not scripts, not state restorations. Stores everything in a separate SQLite DB so it never bloats the HA recorder.

Comes with sensors, a REST API, a Lovelace card and a full sidebar panel.

---

## What it tracks

Every event where:

- `context.user_id` is set (a real user attribution exists), **and**
- `context.parent_id` is `None` (root context — not chained from an automation/script)

across these domains:

`switch`, `light`, `input_boolean`, `input_button`, `button`, `scene`, `script`, `cover`, `lock`, `media_player`, `climate`, `fan`, `vacuum`, `select`, `input_select`, `number`, `input_number`, `humidifier`, `water_heater`, `alarm_control_panel`, `remote`, `siren`, `valve`, `lawn_mower`.

---

## Install via HACS (custom repository)

1. HACS → Integrations → ⋮ → Custom repositories
2. Add `https://github.com/makarseo/ha-user-activity-tracker` as **Integration**
3. Install **User Activity Tracker**
4. Restart Home Assistant
5. Settings → Devices & Services → Add Integration → **User Activity Tracker**

That's it. No options, no YAML.

---

## Sensors

- `sensor.activity_today` — events count today
- `sensor.activity_this_week`
- `sensor.activity_this_month`
- `sensor.top_entity_week` — most-touched entity (count in attributes)
- `sensor.top_user_week` — most-active user (id + count in attributes)

---

## REST API

All endpoints require auth (long-lived token or HA UI session).

| Method | URL | Query | Description |
|---|---|---|---|
| GET | `/api/user_activity_tracker/stats` | — | counts: today, week, month + top entities/users |
| GET | `/api/user_activity_tracker/events` | `limit` | recent raw events |
| GET | `/api/user_activity_tracker/breakdown` | `by=entity_id\|domain\|user_id\|service`, `days`, `limit` | aggregated counts |
| GET | `/api/user_activity_tracker/series` | `days`, `group=day\|hour` | time-bucketed activity |
| POST | `/api/user_activity_tracker/purge` | body: `{"keep_days": 365}` | delete older rows + VACUUM |

Example:

```bash
curl -H "Authorization: Bearer $HA_TOKEN" \
  "http://homeassistant.local:8123/api/user_activity_tracker/breakdown?by=entity_id&days=30&limit=20"
```

---

## Lovelace card

Add the resource (HACS does this automatically; otherwise add manually):

- URL: `/user_activity_tracker_static/user-activity-card.js`
- Type: JavaScript Module

Then in your dashboard:

```yaml
type: custom:user-activity-card
days: 7
limit: 10
```

---

## Sidebar panel

After install you'll see **User Activity** in the left sidebar with:

- counters (today / 7d / 30d)
- activity-over-time chart
- breakdowns by entity / user / domain
- last 200 raw events

---

## Where data lives

`<config>/.storage/user_activity.db` (SQLite, WAL mode).

Backup it with the rest of your HA config.

---

## Automation idea

```yaml
automation:
  - alias: "Monthly purge of user activity older than 1 year"
    trigger:
      - platform: time
        at: "03:30:00"
    condition:
      - condition: template
        value_template: "{{ now().day == 1 }}"
    action:
      - service: rest_command.user_activity_purge

rest_command:
  user_activity_purge:
    url: "http://localhost:8123/api/user_activity_tracker/purge"
    method: POST
    headers:
      Authorization: !secret ha_long_lived_token
      Content-Type: application/json
    payload: '{"keep_days": 365}'
```

---

## Development

```
custom_components/user_activity_tracker/
  __init__.py        # setup, panel + static + API wiring
  manifest.json
  config_flow.py     # zero-option single-instance flow
  const.py
  storage.py         # SQLite layer, executor-bound
  recorder.py        # event listeners + user-initiated detection
  sensor.py          # 5 aggregate sensors via DataUpdateCoordinator
  http_api.py        # REST views
  www/
    user-activity-card.js
    user-activity-panel.js
```
