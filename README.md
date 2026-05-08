# Home Activity Intelligence

<p align="center">
  <img src="icon.png" alt="Home Activity Intelligence" width="160"/>
</p>

> Not just an event log — operational analytics for your Home Assistant that explains **who**, **when**, and **why** something happens at home.

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/makarseo/ha-user-activity-tracker/releases)
[![hacs](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.1+-blue.svg)](https://www.home-assistant.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

🇬🇧 English · [🇷🇺 Русский](README.ru.md)

![Overview](screenshots/01-overview.png)

---

## What is this?

Home Assistant out of the box knows *what* happened, but **doesn't tell you who did it or why**. Logbook is a flat list of events. Recorder is a technical store.

This integration turns raw events into **operational analytics for your smart home**:
- which people in your household actually use which devices
- which automations work usefully and which fire in vain
- where automations override the user — and where the user overrides automations
- which repeated manual actions are crying out to be automated
- where you have conflicts, duplicates, rapid toggling, and other anomalies

Stored in a **separate SQLite** database (`/config/.storage/user_activity.db`) so it never bloats the HA recorder. No external dependencies. No cloud. No telemetry.

---

## Why you might want this

| | |
|---|---|
| **Real attribution** | Every event is tagged: User / Automation / Script / System. You see the actual person and the actual automation. |
| **Friendly names + rooms** | Resolved through entity / device / area registries on write — clean labels in the UI, never raw `entity_id` only. |
| **8 anomaly detectors** | Duplicate automations, rapid toggling, dead automations, conflicts, automation candidates — built-in algorithms (see below). |
| **Period-over-period KPIs** | `+24% vs prev` deltas on every counter. The trend is visible immediately. |
| **Heatmap with periods** | Hour × weekday. Chip selector: 1h / 3h / 6h / Today / Yesterday / 7d / 14d / 30d / 90d. |
| **REST API** | 13 endpoints. Use from Node-RED, Apps Script, or any external dashboard. |
| **Multi-language** | English, Ukrainian, Russian. Auto-switches with HA's UI language. |
| **Zero-config** | Install → Restart → done. No YAML, no options. |

---

## Screenshots

### Overview
The most important things on one screen: KPI tiles with period-over-period deltas, sources of activity, insights, daily activity dynamics.

![Overview](screenshots/01-overview.png)

### Anomalies — built-in audit of your home
Eight detectors find typical smart-home problems: duplicate automations, conflicts, rituals that should already be automated.

![Anomalies](screenshots/02-anomalies.png)

### Automations — what's working, what's silent
Top automations by run count, average runs per automation, most active.

![Automations](screenshots/03-automations.png)

### People — per-user profiles
Each household member as a card: peak activity hour, top devices, top rooms.

![People](screenshots/04-people.png)

### Heatmap with switchable periods
When the household actually uses HA — hour × weekday. Period from 1 hour to 1 year.

![Heatmap](screenshots/05-heatmap.png)

---

## Install via HACS

1. HACS → **Integrations** → ⋮ (top right) → **Custom repositories**
2. Repository: `https://github.com/makarseo/ha-user-activity-tracker`
3. Type: **Integration** → **Add**
4. Find **User Activity Tracker** in HACS list → **Download**
5. **Restart Home Assistant**
6. Settings → Devices & Services → **Add Integration** → search `User Activity` → add it
7. **Home Activity** appears in the sidebar with a chart icon

No YAML. No configuration options. One config_flow per installation.

---

## What is tracked

Every service call (`EVENT_CALL_SERVICE`) in one of the interactive domains:

```
switch · light · input_boolean · input_button · button · scene · script
cover · lock · media_player · climate · fan · vacuum
select · input_select · number · input_number
humidifier · water_heater · alarm_control_panel
remote · siren · valve · lawn_mower
```

Each event is stored with full context:

| Field | Source | What it gives you |
|---|---|---|
| `entity_id` | event data | technical name |
| `friendly_name` | state.attributes | human-readable name |
| `area_id` / `area_name` | entity_registry → device_registry → area_registry | which room |
| `domain`, `service` | event data | what was actually done |
| `user_id` / `user_name` | context.user_id → auth | who initiated it |
| `trigger_type` | classification algorithm | user / automation / script / system |
| `trigger_entity_id` | parent_id chain | which exact automation |
| `automation_name` | state.attributes friendly_name | human-readable automation name |
| `context_id` / `parent_id` | event.context | for chain reconstruction |

---

## Anomaly detection algorithms

This is the heart of the integration. 8 detectors, written as plain SQL on top of the collected events. They run on the Anomalies tab and via REST `/api/user_activity_tracker/anomalies`.

### 1. Rapid toggling

**What it finds:** one device toggled N+ times within T minutes.

**SQL:**
```sql
SELECT entity_id, COUNT(*) AS n,
       MIN(ts) AS first_ts, MAX(ts) AS last_ts
FROM events WHERE ts >= ?
GROUP BY entity_id
HAVING n >= 8 AND (MAX(ts) - MIN(ts)) <= 1800
```

**Why it matters:** light cycling every 30 seconds → bad PIR timer. Fan toggling every 5 minutes → conflicting automations. Candidate for hysteresis, debounce, or merging logic.

### 2. User actions cancelled by automations

**What it finds:** user did action A, within ≤5 minutes an automation did the opposite (turn_on → turn_off, open → close).

**SQL approach:** self-join `events a JOIN events b` on `entity_id`, filter `b.ts > a.ts AND b.ts - a.ts <= 300`, check service inversion.

**Why it matters:** the automation is fighting a real human. Either the trigger condition is too aggressive, or you need an override mode.

### 3. Manual override after automation (mirror of #2)

**What it finds:** automation did action A, user immediately reverted it manually within 5 minutes.

**Why it matters:** the user disagrees with the automation logic. Maybe the brightness is wrong, or the timing is off.

### 4. Possible duplicate automations

**What it finds:** two different automations did the **same service** on the **same entity** within a 60-second window.

**SQL:**
```sql
SELECT a.entity_id, a.trigger_entity_id AS auto1, b.trigger_entity_id AS auto2
FROM events a JOIN events b
  ON a.entity_id = b.entity_id
 AND a.service = b.service
 AND a.trigger_entity_id < b.trigger_entity_id
 AND b.ts > a.ts AND (b.ts - a.ts) <= 60
WHERE a.trigger_type IN ('automation','script')
  AND b.trigger_type IN ('automation','script')
```

**Why it matters:** duplicates are the #1 cause of "why does the light flicker on and off". Candidate for deleting one of the automations.

### 5. Dead automations

**What it finds:** automations that fired before but haven't fired in 7+ days.

**SQL approach:** `GROUP BY trigger_entity_id HAVING MAX(ts) < threshold`.

**Why it matters:** maybe the trigger is broken, an entity was removed, or the automation is obsolete. Candidate for review or deletion.

### 6. Low-impact automations

**What it finds:** automation ran 3+ times but only ever touched **one entity** with **one service**.

**SQL:**
```sql
SELECT trigger_entity_id, COUNT(*) AS n_runs,
       COUNT(DISTINCT entity_id) AS n_entities,
       COUNT(DISTINCT service) AS n_services
FROM events WHERE ts >= ?
GROUP BY trigger_entity_id
HAVING n_runs >= 3 AND n_entities = 1 AND n_services <= 1
```

**Why it matters:** unnecessary complexity. Such logic can be rolled into one condition or merged with adjacent automations ("night mode", "away mode").

### 7. Routine candidates — automation suggestions

**What it finds:** the **same user** does the **same action** on the **same entity** at the **same hour** 5+ times within the period.

**SQL:**
```sql
SELECT entity_id, user_name,
       CAST(strftime('%H', datetime(ts,'unixepoch','localtime')) AS INT) AS hour,
       service, COUNT(*) AS n
FROM events
WHERE ts >= ? AND trigger_type = 'user'
GROUP BY entity_id, user_name, hour, service
HAVING n >= 5
```

**Why it matters:** **the most valuable detector**. If you turn off the living-room light at 22:00 every day by hand — that's not a habit, that's a missing automation. The algorithm finds these patterns and suggests turning them into automations.

### 8. Night activity

**What it finds:** events between 00:00 and 06:00.

**Why it matters:** nighttime activations are often a sign that something has gone off-script — a flaky sensor, a forgotten device left on, an automation with a misaligned schedule.

---

## Auto-generated insights

Beyond detectors there's a separate insights engine on the Overview tab. These are **not anomalies** — they're one-sentence facts about your home:

- "Most active device: Bathroom Fan — 18 events in 14d"
- "67% of actions are done by automations — healthy autonomy level"
- "Peak activity hour: 21:00 (105 events)"
- "Most active room: Hallway — 31 events"
- "Most active user: Anna — 42 events"

The Automation Ratio is shown with a verdict:
- **< 30%** — Mostly manual (automate more)
- **50–85%** — Healthy autonomy (green zone)
- **> 95%** — Very high — verify control (the home is too autonomous, make sure you can still control things manually)

---

## REST API

All endpoints require HA authentication (long-lived token or session cookie).

| Method | URL | What it returns |
|---|---|---|
| GET | `/api/user_activity_tracker/stats` | today / week / month counters |
| GET | `/api/user_activity_tracker/summary?days=14` | period aggregates |
| GET | `/api/user_activity_tracker/compare?days=14` | current vs previous period |
| GET | `/api/user_activity_tracker/series?days=14&split=trigger` | chart data points by day |
| GET | `/api/user_activity_tracker/heatmap?period=today` | heatmap (period: 1h/3h/6h/today/yesterday or days=N) |
| GET | `/api/user_activity_tracker/breakdown?by=entity_id&days=14&limit=20` | tops (by: entity_id, domain, user_id, service, trigger_entity_id, area_id) |
| GET | `/api/user_activity_tracker/insights?days=14` | auto-generated insights |
| GET | `/api/user_activity_tracker/anomalies?days=14` | all 8 detectors at once |
| GET | `/api/user_activity_tracker/rooms?days=14` | room-grouped activity |
| GET | `/api/user_activity_tracker/users_profile?days=14` | profiles for all users |
| GET | `/api/user_activity_tracker/entity?entity_id=X&days=14` | per-entity drill-down |
| GET | `/api/user_activity_tracker/automation?entity_id=automation.X&days=14` | what an automation actually did |
| GET | `/api/user_activity_tracker/events?limit=200` | raw recent events |
| POST | `/api/user_activity_tracker/purge` | cleanup `{"keep_days": 365}` |

Example:
```bash
curl -H "Authorization: Bearer $HA_TOKEN" \
  "http://homeassistant.local:8123/api/user_activity_tracker/anomalies?days=30" \
  | jq '.routine_candidates'
```

---

## Sensors

Created automatically on install:

| Sensor | What it shows |
|---|---|
| `sensor.activity_today` | event count for today |
| `sensor.activity_this_week` | for 7 days |
| `sensor.activity_this_month` | for 30 days |
| `sensor.top_entity_week` | most active device (state) + count in attributes |
| `sensor.top_user_week` | most active user + count |

Use them in dashboards, templates, automations like any other sensor.

---

## Lovelace card

```yaml
type: custom:user-activity-card
days: 7
limit: 10
```

Compact card for embedding in your Overview dashboard: today / 7d / 30d counters + top-N devices. The resource is added by HACS automatically.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Home Assistant Core                        │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Events  │  │    Auth      │  │   Entity Registry    │  │
│  │   Bus    │  │   Manager    │  │   Device Registry    │  │
│  └────┬─────┘  └──────┬───────┘  │   Area Registry      │  │
│       │               │          └──────────┬───────────┘  │
└───────┼───────────────┼─────────────────────┼──────────────┘
        │               │                     │
        ▼               ▼                     ▼
   ┌─────────────────────────────────────────────────┐
   │            ActivityRecorder                     │
   │  - listens: call_service, automation_triggered, │
   │             script_started                      │
   │  - LRU(4096) context_id → trigger metadata      │
   │  - resolves friendly_name + area on each event  │
   └────────────────────┬────────────────────────────┘
                        │
                        ▼
   ┌─────────────────────────────────────────────────┐
   │           ActivityStore (SQLite WAL)            │
   │  /config/.storage/user_activity.db              │
   │  - events(ts, entity, area, trigger_type, …)   │
   │  - 7 indices for fast aggregations              │
   └────────┬─────────────────────────┬──────────────┘
            │                         │
            ▼                         ▼
   ┌──────────────────┐    ┌────────────────────────┐
   │  REST Views      │    │   Sensor Coordinator   │
   │  13 endpoints    │    │   5 aggregate sensors  │
   └────────┬─────────┘    └────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────────────────┐
   │  Custom Frontend Panel + Lovelace Card          │
   │  7 tabs · vibrant dark theme · i18n             │
   └─────────────────────────────────────────────────┘
```

---

## Privacy & Security

- **100% local.** No cloud, no telemetry. Everything is stored in your `/config/.storage/`.
- **No external services.** The integration makes zero outbound requests.
- **Auth-protected.** REST API requires HA tokens, just like any other HA endpoint.
- **Open source.** Full code is open. Fork it, audit it, review it.

---

## Compatibility

- Home Assistant **2024.1+**
- HACS as a Custom Repository (Integration type)
- Supervisor / Container / OS / Core — any HA installation method
- Light + Dark themes — the panel has its own dark aesthetic that reads well on either

---

## Tip: getting maximum value

1. **Run with the home for 1–2 weeks** to accumulate data
2. Open **Anomalies** → **Routine candidates** — that's your list of new automations to write
3. Open **Anomalies** → **Duplicate automations** — clean up the duplicates
4. Open **Anomalies** → **Dead automations** — delete what doesn't work
5. Open **Heatmap** → switch to **Yesterday** — see yesterday's pattern at a glance
6. Open **People** → pick each household member's profile — see what they actually use

Within a month you'll have a fact-checked, data-driven list of smart-home improvements.

---

## Roadmap

- v1.1: event chain grouping (collapse consecutive events in the journal)
- v1.2: detail modal on entity / automation click
- v1.3: CSV / JSON export + custom date range
- v1.4: Telegram notifications on new anomalies

---

## License

MIT — do whatever you want, fork, sell. PRs and issue reports welcome.
