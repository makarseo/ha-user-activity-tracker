# Home Activity Intelligence

> Не просто журнал событий — а аналитика умного дома, которая объясняет **кто**, **когда**, и **зачем** что-то делает.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/makarseo/ha-user-activity-tracker/releases)
[![hacs](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.1+-blue.svg)](https://www.home-assistant.io/)

![Overview](screenshots/01-overview.png)

---

## Что это и зачем

Home Assistant из коробки знает что произошло, но **не знает кто это сделал и почему**. Logbook — это голый список событий. Recorder — техническое хранилище.

Этот компонент превращает сырые события в **операционную аналитику умного дома**:
- кто из домашних чем реально пользуется
- какие автоматизации работают полезно, а какие срабатывают вхолостую
- где автоматизации мешают пользователю и наоборот
- какие повторяющиеся ручные действия пора автоматизировать
- где есть конфликты, дубли, частые тычки и аномалии

Хранит всё в **отдельной SQLite** базе (`/config/.storage/user_activity.db`), не раздувает HA recorder. Без зависимостей, без облака, без телеметрии.

---

## Главные преимущества

| | |
|---|---|
| **Реальная атрибуция** | Каждое событие помечено: User / Automation / Script / System. Видно конкретного пользователя и конкретную автоматизацию. |
| **Friendly names + комнаты** | Резолвятся через registry при записи — в UI красивые имена, не голые `entity_id`. |
| **8 детекторов аномалий** | Дубли автоматизаций, частые переключения, мёртвые автоматизации, конфликты, кандидаты на автоматизацию — встроенные алгоритмы (см. ниже). |
| **Сравнение периодов** | KPI с дельтами `+24% vs prev`. Сразу видно тренд. |
| **Heatmap с периодами** | Час × день недели. Чипы переключения: 1ч / 3ч / 6ч / Сегодня / Вчера / 7д / 14д / 30д / 90д. |
| **REST API** | 13 эндпоинтов. Используй из Node-RED, Apps Script, или внешних дашбордов. |
| **Multi-language** | Английский, Украинский, Русский. Переключается автоматически. |
| **Zero-config** | Установил → Restart → готово. Никаких YAML, никаких настроек. |

---

## Скриншоты

### Обзор (Overview)
Самое важное на одном экране: KPI-плитки с динамикой, источники активности, инсайты, динамика по дням.

![Overview](screenshots/01-overview.png)

### Аномалии — встроенный аудит дома
Алгоритмы детектируют типичные проблемы умного дома: дубли автоматизаций, конфликты, ритуалы которые пора автоматизировать.

![Anomalies](screenshots/02-anomalies.png)

### Автоматизации — что работает, что молчит
Топ автоматизаций по запускам, средняя нагрузка, самая активная.

![Automations](screenshots/03-automations.png)

### Люди — профили пользователей
Каждый пользователь как карточка: пик активности, любимые устройства, любимые комнаты.

![People](screenshots/04-people.png)

### Heatmap с переключаемыми периодами
Когда домашние реально пользуются HA — час × день недели. Период от часа до года.

![Heatmap](screenshots/05-heatmap.png)

---

## Установка через HACS

1. HACS → **Integrations** → ⋮ (правый верх) → **Custom repositories**
2. Repository: `https://github.com/makarseo/ha-user-activity-tracker`
3. Type: **Integration** → **Add**
4. В списке HACS найди **User Activity Tracker** → **Download**
5. **Restart Home Assistant**
6. Settings → Devices & Services → **Add Integration** → ищи `User Activity` → добавь
7. В сайдбаре появится **Home Activity** с иконкой графика

Никакого YAML. Никаких опций конфигурации. Один config_flow на всю установку.

---

## Что трекается

Каждый вызов сервиса (`EVENT_CALL_SERVICE`) в одном из доменов:

```
switch · light · input_boolean · input_button · button · scene · script
cover · lock · media_player · climate · fan · vacuum
select · input_select · number · input_number
humidifier · water_heater · alarm_control_panel
remote · siren · valve · lawn_mower
```

Каждое событие сохраняется с полным контекстом:

| Поле | Источник | Что даёт |
|---|---|---|
| `entity_id` | event data | техническое имя |
| `friendly_name` | state.attributes | человекочитаемое имя |
| `area_id` / `area_name` | entity_registry → device_registry → area_registry | в какой комнате |
| `domain`, `service` | event data | что именно делалось |
| `user_id` / `user_name` | context.user_id → auth | кто инициировал |
| `trigger_type` | алгоритм классификации | user / automation / script / system |
| `trigger_entity_id` | parent_id chain | какая именно автоматизация |
| `automation_name` | state.attributes friendly_name | человекочитаемое имя автоматизации |
| `context_id` / `parent_id` | event.context | для построения цепочек |

---

## Алгоритмы детекции аномалий

Это сердце интеграции. 8 детекторов, написанных как чистый SQL поверх собранных событий. Каждый запускается при открытии вкладки `Anomalies` и через REST `/api/user_activity_tracker/anomalies`.

### 1. Rapid toggling — частые переключения

**Что ищет:** одно устройство переключилось N+ раз в окне T минут.

**SQL:**
```sql
SELECT entity_id, COUNT(*) AS n,
       MIN(ts) AS first_ts, MAX(ts) AS last_ts
FROM events WHERE ts >= ?
GROUP BY entity_id
HAVING n >= 8 AND (MAX(ts) - MIN(ts)) <= 1800
```

**Почему важно:** свет дёргается каждые 30 секунд → плохой PIR-таймер. Вентилятор включается-выключается каждые 5 минут → конфликт автоматизаций. Кандидат на хистерезис, debounce или объединение логики.

### 2. User actions cancelled by automations

**Что ищет:** пользователь сделал действие, через ≤5 мин автоматизация сделала противоположное (включил → выключила, открыл → закрыла).

**SQL:** self-join `events a JOIN events b` по `entity_id`, фильтр `b.ts > a.ts AND b.ts - a.ts <= 300`, проверка инверсии сервиса.

**Почему важно:** автоматизация мешает живому человеку. Возможно условие триггера слишком агрессивное, или нужно добавить override-режим.

### 3. Manual override after automation (зеркало #2)

**Что ищет:** автоматизация сделала действие, пользователь сразу руками вернул как было.

**Почему важно:** пользователь не согласен с логикой автоматизации. Или интенсивность не та (свет ярче чем хочется), или время не то.

### 4. Possible duplicate automations

**Что ищет:** две разные автоматизации сделали **одно и то же действие** (`service`) на **одном entity** в окне 60 секунд.

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

**Почему важно:** дубли — самая частая причина "почему свет включается через раз". Кандидат на удаление одной из автоматизаций.

### 5. Dead automations

**Что ищет:** автоматизации, которые раньше работали, но не срабатывали 7+ дней.

**SQL:** `GROUP BY trigger_entity_id HAVING MAX(ts) < threshold`.

**Почему важно:** возможно сломан триггер, удалена сущность, или автоматизация устарела. Кандидат на ревизию или удаление.

### 6. Low-impact automations

**Что ищет:** автоматизация запускалась 3+ раз, но управляет **только одним entity** одним сервисом.

**SQL:**
```sql
SELECT trigger_entity_id, COUNT(*) AS n_runs,
       COUNT(DISTINCT entity_id) AS n_entities,
       COUNT(DISTINCT service) AS n_services
FROM events WHERE ts >= ?
GROUP BY trigger_entity_id
HAVING n_runs >= 3 AND n_entities = 1 AND n_services <= 1
```

**Почему важно:** избыточная сложность. Такую логику можно свернуть в одно условие либо объединить с соседними автоматизациями ("ночной режим", "режим отсутствия").

### 7. Routine candidates — кандидаты на автоматизацию

**Что ищет:** один и тот же пользователь делает **одно и то же действие** на **одном entity** в **один и тот же час** 5+ раз за период.

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

**Почему важно:** **самая ценная штука**. Если каждый день в 22:00 ты вручную выключаешь свет в гостиной — это не привычка, это пропавшая автоматизация. Алгоритм находит такие паттерны и предлагает их автоматизировать.

### 8. Night activity

**Что ищет:** события между 00:00 и 06:00.

**Почему важно:** ночные срабатывания часто признак того, что что-то идёт не по плану — лажующий датчик, забытое устройство в режиме "on", автоматизация со сдвинутым расписанием.

---

## Auto-generated insights

Сверх детекторов — есть отдельный engine инсайтов на странице Overview. Это **не аномалии**, а просто факты о доме в одно предложение:

- "Most active device: Bathroom Fan — 18 events in 14d"
- "67% of actions are done by automations — healthy autonomy level"
- "Peak activity hour: 21:00 (105 events)"
- "Most active room: Hallway — 31 events"
- "Most active user: Anna — 42 events"

Уровень автоматизации (Automation Ratio) выводится с оценкой:
- **< 30%** — Mostly manual (можно автоматизировать больше)
- **50–85%** — Healthy autonomy (зелёная зона)
- **> 95%** — Very high — verify control (дом слишком сам всё делает, проверь что ты ещё можешь чем-то управлять руками)

---

## REST API

Все эндпоинты требуют HA-аутентификацию (long-lived token или session cookie).

| Метод | URL | Что возвращает |
|---|---|---|
| GET | `/api/user_activity_tracker/stats` | счётчики today / week / month |
| GET | `/api/user_activity_tracker/summary?days=14` | агрегаты периода |
| GET | `/api/user_activity_tracker/compare?days=14` | текущий период vs предыдущий |
| GET | `/api/user_activity_tracker/series?days=14&split=trigger` | точки графика по дням |
| GET | `/api/user_activity_tracker/heatmap?period=today` | heatmap (period: 1h/3h/6h/today/yesterday или days=N) |
| GET | `/api/user_activity_tracker/breakdown?by=entity_id&days=14&limit=20` | топы (by: entity_id, domain, user_id, service, trigger_entity_id, area_id) |
| GET | `/api/user_activity_tracker/insights?days=14` | автогенерированные инсайты |
| GET | `/api/user_activity_tracker/anomalies?days=14` | все 8 детекторов сразу |
| GET | `/api/user_activity_tracker/rooms?days=14` | активность по комнатам |
| GET | `/api/user_activity_tracker/users_profile?days=14` | профили всех юзеров |
| GET | `/api/user_activity_tracker/entity?entity_id=X&days=14` | детальная инфа по entity |
| GET | `/api/user_activity_tracker/automation?entity_id=automation.X&days=14` | что делала эта автоматизация |
| GET | `/api/user_activity_tracker/events?limit=200` | сырые последние события |
| POST | `/api/user_activity_tracker/purge` | очистка `{"keep_days": 365}` |

Пример:
```bash
curl -H "Authorization: Bearer $HA_TOKEN" \
  "http://homeassistant.local:8123/api/user_activity_tracker/anomalies?days=30" \
  | jq '.routine_candidates'
```

---

## Sensors

Создаются автоматически при установке:

| Сенсор | Что показывает |
|---|---|
| `sensor.activity_today` | счётчик событий за сегодня |
| `sensor.activity_this_week` | за 7 дней |
| `sensor.activity_this_month` | за 30 дней |
| `sensor.top_entity_week` | самое активное устройство (state) + count в attributes |
| `sensor.top_user_week` | самый активный юзер + count |

Используй в дашбордах, шаблонах, автоматизациях как обычные сенсоры.

---

## Lovelace card

```yaml
type: custom:user-activity-card
days: 7
limit: 10
```

Компактная карточка для встраивания в Overview-дашборд: счётчики today / 7d / 30d + топ-N устройств. Ресурс добавляется HACS автоматически.

---

## Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                  Home Assistant Core                        │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Events  │  │    Auth      │  │   Entity Registry    │  │
│  │  Bus     │  │   Manager    │  │   Device Registry    │  │
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

- **100% local.** Никакого облака, никакой телеметрии. Всё хранится в твоей `/config/.storage/`.
- **Никаких внешних сервисов.** Интеграция вообще не делает исходящих запросов.
- **Auth защищён.** REST API требует HA-токены, как и любой другой эндпоинт HA.
- **Опенсорс.** Полный код открыт. Можешь форкать, аудитить, ревьюить.

---

## Совместимость

- Home Assistant **2024.1+**
- HACS как Custom Repository (Integration type)
- Supervisor / Container / OS / Core — все варианты установки HA
- Light + Dark темы HA — панель имеет свою dark-aesthetic, читается на любой теме

---

## Tip: для максимальной пользы

1. **Поработай с домом 1–2 недели**, чтобы накопились данные
2. Открой **Anomalies** → **Routine candidates** — это твой список новых автоматизаций
3. Открой **Anomalies** → **Duplicate automations** — почисти дубли
4. Открой **Anomalies** → **Dead automations** — удали то что не работает
5. Открой **Heatmap** → переключи на **Yesterday** — увидишь паттерны вчерашнего дня
6. Открой **People** → выбери профиль каждого домашнего → увидишь чем он реально пользуется

Через месяц у тебя на руках будет факт-чекнутый, основанный на данных список улучшений умного дома.

---

## Roadmap (что в работе)

- v1.1: event chain grouping (склейка цепочек подряд в журнале)
- v1.2: detail modal по клику на entity / automation
- v1.3: CSV / JSON экспорт + кастомный date range
- v1.4: telegram-нотификации о новых аномалиях

---

## License

MIT — делай что хочешь, форкай, продавай. PR-ы и issue-репорты приветствуются.
