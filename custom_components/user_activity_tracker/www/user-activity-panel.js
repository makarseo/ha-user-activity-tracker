/**
 * Custom panel: Home Activity Intelligence
 * v0.2.0 — full rewrite: 6 tabs, KPI w/ deltas, donut, stacked bar,
 *           insights, anomalies, rooms, friendly names + areas
 */

const I18N = {
  en: {
    title: "Home Activity Intelligence",
    tab_overview: "Overview", tab_people: "People", tab_auto: "Automations",
    tab_devices: "Devices", tab_rooms: "Rooms", tab_anomalies: "Anomalies", tab_journal: "Journal",
    p_24h: "24h", p_7d: "7 days", p_14d: "14 days", p_30d: "30 days", p_90d: "90 days", p_year: "year",
    today: "events today", week: "last 7 days", month: "last 30 days",
    events_period: "events", auto_period: "automated", manual_period: "manual",
    peak: "peak hour", unique_entities: "active devices", unique_users: "users",
    unique_areas: "rooms involved", unique_triggers: "automations",
    automation_ratio: "Automation level",
    activity_dynamics: "Activity dynamics",
    sources: "Sources of activity",
    insights: "Insights",
    top_rooms: "Activity by room", top_devices: "Top devices",
    recent_events: "Recent events",
    heatmap: "Hour × weekday heatmap",
    top_automations: "Top automations",
    top_users: "Top users",
    top_services: "Top services",
    by_domain: "By domain",
    anomaly_rapid: "Rapid toggling",
    anomaly_cancelled: "User actions cancelled by automations",
    anomaly_dup: "Possible duplicate automations",
    anomaly_night: "Night activity (00:00–06:00)",
    th_time: "Time", th_user: "User", th_entity: "Device",
    th_service: "Action", th_source: "Source", th_trigger: "Trigger", th_room: "Room",
    by_user: "by", at_time: "at", in_room: "in",
    no_data_short: "No data yet.",
    no_data_long: "No data yet — keep using HA, refresh in a minute.",
    no_data_heatmap: "Need 3–7 days of data for a meaningful heatmap.",
    no_events: "No events recorded yet.",
    no_anomalies: "No anomalies detected. Looking good.",
    loading: "Loading…", error: "Error:",
    trigger_user: "User", trigger_automation: "Automation",
    trigger_script: "Script", trigger_system: "System",
    delta_more: "more vs prev", delta_less: "less vs prev", delta_same: "same as prev",
    sort_hint: "Click headers to sort",
    auto_ratio_low: "Low — most actions are manual",
    auto_ratio_good: "Good — healthy autonomy",
    auto_ratio_warn: "Very high — make sure you're still in control",
    insight_most_active: "Most active device: {name} — {n} events in {days}d",
    insight_automation_ratio: "{ratio}% of actions are done by automations ({n_auto} of {total})",
    insight_peak_hour: "Peak activity hour: {hour}:00 ({n} events)",
    insight_anomalies: "Detected {rapid} rapid toggle, {cancelled} cancelled actions, {dups} possible duplicates",
    insight_top_room: "Most active room: {area_name} — {n} events",
    insight_top_user: "Most active user: {user_name} — {n} events",
    night_alert: "events between 00:00 and 06:00",
    rapid_alert: "actions in",
    minutes: "min",
    cancelled_alert: "{user} did {action1}, automation {auto} did {action2} {sec}s later",
    dup_alert: "{auto1} and {auto2} both did {action} on {entity} within {sec}s",
    services: {
      turn_on: "Turn on", turn_off: "Turn off", toggle: "Toggle",
      open_cover: "Open", close_cover: "Close", set_cover_position: "Set position",
      lock: "Lock", unlock: "Unlock",
      set_temperature: "Set temp", set_hvac_mode: "Set mode",
      play_media: "Play", media_play: "Play", media_pause: "Pause", media_stop: "Stop",
      volume_set: "Volume", volume_mute: "Mute",
      select_option: "Select",
      set_value: "Set value", increment: "+1", decrement: "-1",
      press: "Press",
      start: "Start", stop: "Stop", pause: "Pause", return_to_base: "Return",
    },
    dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  ru: {
    title: "Аналитика активности дома",
    tab_overview: "Обзор", tab_people: "Люди", tab_auto: "Автоматизации",
    tab_devices: "Устройства", tab_rooms: "Комнаты", tab_anomalies: "Аномалии", tab_journal: "Журнал",
    p_24h: "24ч", p_7d: "7 дней", p_14d: "14 дней", p_30d: "30 дней", p_90d: "90 дней", p_year: "год",
    today: "событий сегодня", week: "за 7 дней", month: "за 30 дней",
    events_period: "событий", auto_period: "автоматических", manual_period: "ручных",
    peak: "пик активности", unique_entities: "активных устройств", unique_users: "юзеров",
    unique_areas: "задействовано комнат", unique_triggers: "автоматизаций",
    automation_ratio: "Уровень автоматизации",
    activity_dynamics: "Динамика активности",
    sources: "Источники активности",
    insights: "Инсайты",
    top_rooms: "Активность по комнатам", top_devices: "Топ устройств",
    recent_events: "Последние события",
    heatmap: "Тепловая карта: час × день недели",
    top_automations: "Топ автоматизаций",
    top_users: "Топ пользователей",
    top_services: "Топ действий",
    by_domain: "По типам устройств",
    anomaly_rapid: "Слишком частые переключения",
    anomaly_cancelled: "Действия пользователя отменены автоматизациями",
    anomaly_dup: "Возможные дублирующиеся автоматизации",
    anomaly_night: "Ночная активность (00:00–06:00)",
    th_time: "Время", th_user: "Юзер", th_entity: "Устройство",
    th_service: "Действие", th_source: "Источник", th_trigger: "Триггер", th_room: "Комната",
    by_user: "от", at_time: "в", in_room: "в",
    no_data_short: "Пока нет данных.",
    no_data_long: "Данных нет — потыкай в HA и обнови через минуту.",
    no_data_heatmap: "Нужно 3–7 дней данных для нормальной тепловой карты.",
    no_events: "Событий ещё не записано.",
    no_anomalies: "Аномалий не обнаружено. Всё выглядит хорошо.",
    loading: "Загрузка…", error: "Ошибка:",
    trigger_user: "Пользователь", trigger_automation: "Автоматизация",
    trigger_script: "Скрипт", trigger_system: "Система",
    delta_more: "больше чем вчера", delta_less: "меньше чем вчера", delta_same: "как вчера",
    sort_hint: "Клик по заголовку — сортировка",
    auto_ratio_low: "Низкий — большинство действий ручные",
    auto_ratio_good: "Хороший — здоровая автономия",
    auto_ratio_warn: "Очень высокий — убедись что контроль за тобой",
    insight_most_active: "Самое активное устройство: {name} — {n} событий за {days} дн.",
    insight_automation_ratio: "{ratio}% действий выполняют автоматизации ({n_auto} из {total})",
    insight_peak_hour: "Пик активности: {hour}:00 ({n} событий)",
    insight_anomalies: "Обнаружено: {rapid} частых переключений, {cancelled} отменённых ручных действий, {dups} возможных дублей",
    insight_top_room: "Самая активная комната: {area_name} — {n} событий",
    insight_top_user: "Самый активный пользователь: {user_name} — {n} событий",
    night_alert: "событий между 00:00 и 06:00",
    rapid_alert: "действий за",
    minutes: "мин",
    cancelled_alert: "{user} сделал {action1}, автоматизация {auto} сделала {action2} через {sec}с",
    dup_alert: "{auto1} и {auto2} обе сделали {action} на {entity} в течение {sec}с",
    services: {
      turn_on: "Включено", turn_off: "Выключено", toggle: "Переключено",
      open_cover: "Открыто", close_cover: "Закрыто", set_cover_position: "Позиция",
      lock: "Заперто", unlock: "Разблокировано",
      set_temperature: "Темп.", set_hvac_mode: "Режим",
      play_media: "Воспр.", media_play: "Воспр.", media_pause: "Пауза", media_stop: "Стоп",
      volume_set: "Громкость", volume_mute: "Mute",
      select_option: "Выбрано",
      set_value: "Значение", increment: "+1", decrement: "-1",
      press: "Нажато",
      start: "Старт", stop: "Стоп", pause: "Пауза", return_to_base: "Базу",
    },
    dow: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  },
  uk: {
    title: "Аналітика активності дому",
    tab_overview: "Огляд", tab_people: "Люди", tab_auto: "Автоматизації",
    tab_devices: "Пристрої", tab_rooms: "Кімнати", tab_anomalies: "Аномалії", tab_journal: "Журнал",
    p_24h: "24г", p_7d: "7 днів", p_14d: "14 днів", p_30d: "30 днів", p_90d: "90 днів", p_year: "рік",
    today: "подій сьогодні", week: "за 7 днів", month: "за 30 днів",
    events_period: "подій", auto_period: "автоматичних", manual_period: "ручних",
    peak: "пік активності", unique_entities: "активних пристроїв", unique_users: "користувачів",
    unique_areas: "задіяно кімнат", unique_triggers: "автоматизацій",
    automation_ratio: "Рівень автоматизації",
    activity_dynamics: "Динаміка активності",
    sources: "Джерела активності",
    insights: "Інсайти",
    top_rooms: "Активність по кімнатах", top_devices: "Топ пристроїв",
    recent_events: "Останні події",
    heatmap: "Теплова карта: година × день тижня",
    top_automations: "Топ автоматизацій",
    top_users: "Топ користувачів",
    top_services: "Топ дій",
    by_domain: "За типами пристроїв",
    anomaly_rapid: "Занадто часті перемикання",
    anomaly_cancelled: "Дії користувача скасовані автоматизаціями",
    anomaly_dup: "Можливі дублюючі автоматизації",
    anomaly_night: "Нічна активність (00:00–06:00)",
    th_time: "Час", th_user: "Юзер", th_entity: "Пристрій",
    th_service: "Дія", th_source: "Джерело", th_trigger: "Тригер", th_room: "Кімната",
    by_user: "від", at_time: "о", in_room: "у",
    no_data_short: "Поки немає даних.",
    no_data_long: "Даних немає — потицяй у HA та онови за хвилину.",
    no_data_heatmap: "Потрібно 3–7 днів даних для нормальної теплової карти.",
    no_events: "Подій ще не записано.",
    no_anomalies: "Аномалій не виявлено. Все виглядає добре.",
    loading: "Завантаження…", error: "Помилка:",
    trigger_user: "Користувач", trigger_automation: "Автоматизація",
    trigger_script: "Скрипт", trigger_system: "Система",
    delta_more: "більше ніж вчора", delta_less: "менше ніж вчора", delta_same: "як вчора",
    sort_hint: "Клік по заголовку — сортування",
    auto_ratio_low: "Низький — більшість дій ручні",
    auto_ratio_good: "Хороший — здорова автономія",
    auto_ratio_warn: "Дуже високий — переконайся що контроль за тобою",
    insight_most_active: "Найактивніший пристрій: {name} — {n} подій за {days} дн.",
    insight_automation_ratio: "{ratio}% дій виконують автоматизації ({n_auto} з {total})",
    insight_peak_hour: "Пік активності: {hour}:00 ({n} подій)",
    insight_anomalies: "Виявлено: {rapid} частих перемикань, {cancelled} скасованих ручних дій, {dups} можливих дублів",
    insight_top_room: "Найактивніша кімната: {area_name} — {n} подій",
    insight_top_user: "Найактивніший користувач: {user_name} — {n} подій",
    night_alert: "подій між 00:00 та 06:00",
    rapid_alert: "дій за",
    minutes: "хв",
    cancelled_alert: "{user} зробив {action1}, автоматизація {auto} зробила {action2} через {sec}с",
    dup_alert: "{auto1} та {auto2} обидві зробили {action} на {entity} протягом {sec}с",
    services: {
      turn_on: "Увімкнено", turn_off: "Вимкнено", toggle: "Перемкнено",
      open_cover: "Відкрито", close_cover: "Закрито", set_cover_position: "Позиція",
      lock: "Замкнено", unlock: "Розблоковано",
      set_temperature: "Темп.", set_hvac_mode: "Режим",
      play_media: "Відтв.", media_play: "Відтв.", media_pause: "Пауза", media_stop: "Стоп",
      volume_set: "Гучність", volume_mute: "Mute",
      select_option: "Обрано",
      set_value: "Значення", increment: "+1", decrement: "-1",
      press: "Натиснуто",
      start: "Старт", stop: "Стоп", pause: "Пауза", return_to_base: "Базу",
    },
    dow: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  },
};

// Soft Warm-Nordic palette (2026)
const PALETTE = [
  "#fda4af", "#fcd34d", "#86efac", "#7dd3fc", "#c4b5fd",
  "#f9a8d4", "#5eead4", "#fdba74", "#67e8f9", "#d8b4fe",
];
const HEAT = ["transparent", "#e0e7ff", "#bae6fd", "#fde68a", "#fdba74", "#fda4af"];
const ACCENTS = {
  events: "#7dd3fc", auto: "#c4b5fd", user: "#fda4af", peak: "#fcd34d",
  rooms: "#86efac", anomaly: "#fda4af",
};
const TRIGGER_COLORS = {
  user: "#7dd3fc", automation: "#c4b5fd", script: "#f9a8d4", system: "#cbd5e1",
};

class HomeActivityPanel extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    this._lang = (hass.language || hass.locale?.language || "en").slice(0, 2);
    if (!I18N[this._lang]) this._lang = "en";
    this._t = I18N[this._lang];
    if (!this._initialized) {
      this._initialized = true;
      this._days = 14;
      this._tab = "overview";
      this._sortBy = "ts"; this._sortDir = "desc";
      this._render();
      this._fetch();
      this._timer = setInterval(() => this._fetch(), 30_000);
    }
  }

  disconnectedCallback() { if (this._timer) clearInterval(this._timer); }

  _t_str(key, params) {
    let s = this._t[key] || I18N.en[key] || key;
    if (params) for (const k in params) s = s.replace(`{${k}}`, params[k]);
    return s;
  }

  _label_service(s) {
    if (!s) return "";
    const l = this._t.services[s];
    return l || s;
  }

  async _fetch() {
    if (!this._hass) return;
    const d = this._days;
    const endpoints = {
      summary:    `summary?days=${d}`,
      compare:    `compare?days=${d}`,
      series:     `series?group=day&days=${d}&split=trigger`,
      heatmap:    `heatmap?days=${d}`,
      sources:    `breakdown?by=trigger_type&limit=10&days=${d}`,
      insights:   `insights?days=${d}`,
      anomalies:  `anomalies?days=${d}`,
      rooms:      `rooms?days=${d}`,
      topEntity:  `breakdown?by=entity_id&limit=20&days=${d}`,
      topAuto:    `breakdown?by=trigger_entity_id&limit=20&days=${d}&trigger_type=automation`,
      topUser:    `breakdown?by=user_id&limit=20&days=${d}`,
      topService: `breakdown?by=service&limit=20&days=${d}`,
      byDomain:   `breakdown?by=domain&limit=20&days=${d}`,
      recent:     `events?limit=200`,
      peak:       `stats`,
    };
    // Each call independent — partial failures don't take down the whole panel
    const results = await Promise.all(
      Object.entries(endpoints).map(async ([k, p]) => {
        try {
          const v = await this._call(p);
          return [k, v, null];
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`[UAT] ${p} failed:`, e);
          return [k, this._defaultFor(k), this._fmtError(e, p)];
        }
      })
    );
    this._data = {};
    const errs = [];
    for (const [k, v, err] of results) {
      this._data[k] = v;
      if (err) errs.push(err);
    }
    this._error = errs.length ? errs.join(" · ") : null;
    this._renderBody();
  }

  _defaultFor(key) {
    if (["recent", "series", "heatmap", "sources", "insights",
         "rooms", "topEntity", "topAuto", "topUser", "topService", "byDomain"].includes(key)) return [];
    if (key === "anomalies") return { rapid_toggle: [], user_cancelled: [], duplicate_automations: [], night_activity: [] };
    return {};
  }

  _fmtError(e, path) {
    if (!e) return `${path}: unknown`;
    if (typeof e === "string") return `${path}: ${e}`;
    if (e.message) return `${path}: ${e.message}`;
    if (e.body && e.body.message) return `${path}: ${e.body.message}`;
    if (e.status_code) return `${path}: HTTP ${e.status_code}`;
    try { return `${path}: ${JSON.stringify(e)}`; } catch (_) { return `${path}: error`; }
  }

  _call(path) { return this._hass.callApi("GET", `user_activity_tracker/${path}`); }

  _render() {
    this.attachShadow({ mode: "open" });
    const t = this._t;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; height:100%; background: var(--primary-background-color); color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family);}
        header { padding: 12px 24px 0;
                 background: linear-gradient(135deg, #c7d2fe 0%, #ddd6fe 35%, #fbcfe8 70%, #fed7aa 100%);
                 color: #1f2937; position: sticky; top:0; z-index:5;
                 box-shadow: 0 1px 3px rgba(15,23,42,.06); border-bottom: 1px solid rgba(15,23,42,.06);}
        .top { display:flex; align-items:center; gap:16px; padding-bottom: 12px;}
        h1 { margin:0; font-size: 1.25rem; font-weight: 600; flex:1; letter-spacing: 0.2px; color:#1f2937;}
        select { padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(15,23,42,.12);
                 background: rgba(255,255,255,.55); color: #1f2937; font-weight: 500; cursor: pointer;
                 backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);}
        .tabs { display:flex; gap: 2px; overflow-x:auto;}
        .tab { padding: 10px 16px; cursor: pointer; border: none; background: transparent;
               color: rgba(31,41,55,.55); font-size: 0.85rem; font-weight: 600;
               border-bottom: 2px solid transparent; transition: all .15s; white-space: nowrap;}
        .tab:hover { color: #1f2937; background: rgba(255,255,255,.35);}
        .tab.active { color: #1f2937; border-bottom-color: #6366f1;}
        main { padding: 16px 24px; display: grid; gap: 16px; grid-template-columns: repeat(12, 1fr);}
        .card { background: var(--card-background-color); border-radius: 14px; padding: 16px;
                box-shadow: 0 1px 4px rgba(15,23,42,.05); overflow:hidden; min-height: 60px;}
        .card h3 { margin: 0 0 12px 0; font-size: 0.95rem; font-weight: 600; color: var(--primary-text-color);
                   display:flex; align-items:center; justify-content:space-between;}
        .card .sub { font-size: 0.75rem; color: var(--secondary-text-color); font-weight: 500;}
        .col-2 { grid-column: span 2;} .col-3 { grid-column: span 3;}
        .col-4 { grid-column: span 4;} .col-6 { grid-column: span 6;}
        .col-8 { grid-column: span 8;} .col-12 { grid-column: span 12;}
        @media (max-width: 1100px) { .col-2,.col-3 { grid-column: span 6;} .col-4,.col-6,.col-8 { grid-column: span 12;} }
        @media (max-width: 600px) { .col-2,.col-3 { grid-column: span 12;} }
        .kpi-big { font-size: 2rem; font-weight: 700; line-height: 1; color: var(--primary-text-color);}
        .kpi-sub { font-size: 0.7rem; color: var(--secondary-text-color); margin-top:6px; text-transform: uppercase; letter-spacing: 0.5px;}
        .kpi-delta { font-size: 0.78rem; font-weight: 600; margin-top: 6px; display:inline-block; padding: 2px 8px; border-radius: 8px;}
        .delta-up { background: #dcfce7; color: #166534;}
        .delta-down { background: #fee2e2; color: #991b1b;}
        .delta-flat { background: #f1f5f9; color: #475569;}
        .empty { color: var(--secondary-text-color); font-size: 0.85rem; padding: 8px 0; font-style: italic;}
        .err { color: #dc2626; padding: 8px; font-weight: 500;}
        table { width:100%; border-collapse: collapse;}
        th, td { text-align:left; padding: 8px; border-bottom: 1px solid var(--divider-color); font-size: 0.85rem;}
        th { font-weight: 600; color: var(--secondary-text-color); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.5px; cursor: pointer; user-select:none; white-space: nowrap;}
        th:hover { color: var(--primary-color);} th .arrow { margin-left: 4px; opacity: 0.6;}
        td.n, th.n { text-align:right; font-variant-numeric: tabular-nums;}
        td.n { font-weight: 600;}
        tr:hover td { background: var(--secondary-background-color);}
        .name-main { font-weight: 600; color: var(--primary-text-color);}
        .name-sub { font-size: 0.72rem; color: var(--secondary-text-color); font-family: ui-monospace, monospace;}
        .pill { display:inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.68rem; font-weight: 600;}
        .pill-user       { background: #dbeafe; color: #1d4ed8;}
        .pill-automation { background: #ede9fe; color: #6d28d9;}
        .pill-script     { background: #fce7f3; color: #be185d;}
        .pill-system     { background: #e2e8f0; color: #475569;}
        .pill-action     { background: #f1f5f9; color: #475569;}
        .bars { display:flex; flex-direction:column; gap:6px;}
        .bar { position:relative; height: 26px; background: var(--secondary-background-color); border-radius: 6px; overflow:hidden; font-size: 0.8rem;}
        .bar > .fill { position:absolute; left:0; top:0; bottom:0; opacity: 0.55; border-radius: 6px;}
        .bar > .lbl { position:relative; z-index:1; padding: 4px 10px; display:flex; justify-content:space-between; line-height: 18px; color: var(--primary-text-color);}
        .bar > .lbl > .l { display:flex; flex-direction:column; line-height: 1.1;}
        .bar > .lbl > .l > .n2 { font-size: 0.65rem; color: var(--secondary-text-color); margin-top: 1px; font-family: ui-monospace, monospace;}
        .heat { display:grid; grid-template-columns: 36px repeat(24, 1fr); grid-auto-rows: 24px; gap: 3px; font-size: 0.68rem;}
        .heat .hh { color: var(--secondary-text-color); display:flex; align-items:center; justify-content:center; font-weight: 600;}
        .heat .cell { border-radius: 4px; display:flex; align-items:center; justify-content:center; color: rgba(15,23,42,.85); font-weight: 600;}
        .insight { padding: 10px 14px; border-radius: 10px; margin-bottom: 8px; display:flex; align-items:center; gap:12px;}
        .insight.info { background: #dbeafe; color: #1e3a8a;}
        .insight.good { background: #dcfce7; color: #14532d;}
        .insight.warning { background: #fef3c7; color: #78350f;}
        .insight .icon { font-size: 1.4rem;}
        .insight .text { flex:1; font-size: 0.88rem; line-height: 1.4;}
        .anomaly { padding: 12px 14px; border-radius: 10px; margin-bottom: 8px; background: #fef2f2; color: #991b1b; border-left: 3px solid #dc2626;}
        .anomaly.night { background: #ede9fe; color: #5b21b6; border-left-color: #7c3aed;}
        .anomaly .a-title { font-weight: 600; font-size: 0.88rem; margin-bottom: 4px;}
        .anomaly .a-detail { font-size: 0.78rem; opacity: 0.85;}
        .donut { display:flex; align-items:center; gap: 16px;}
        .donut svg { flex-shrink: 0;}
        .donut .legend { display:flex; flex-direction: column; gap: 6px; font-size: 0.85rem;}
        .donut .legend > div { display:flex; align-items:center; gap: 6px;}
        .donut .legend .dot { width: 10px; height: 10px; border-radius: 50%;}
        .donut .legend .pct { color: var(--secondary-text-color); margin-left: 4px;}
        .gauge { display:flex; flex-direction: column; align-items: center; padding: 16px 8px;}
        .gauge .v { font-size: 2.5rem; font-weight: 700; line-height: 1;}
        .gauge .l { font-size: 0.8rem; color: var(--secondary-text-color); margin-top: 6px; text-align:center;}
        .room-card { background: var(--secondary-background-color); border-radius: 10px; padding: 12px; margin-bottom: 8px;}
        .room-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;}
        .room-name { font-weight: 600; font-size: 0.95rem;}
        .room-stats { font-size: 0.75rem; color: var(--secondary-text-color);}
        .room-ents { display:flex; flex-wrap: wrap; gap: 6px;}
        .room-ent { background: var(--card-background-color); padding: 4px 10px; border-radius: 6px; font-size: 0.78rem;}
        .room-ent .n { color: var(--primary-color); font-weight: 600; margin-left: 4px;}
        .ts { color: var(--secondary-text-color); font-size: 0.72rem; white-space: nowrap; font-family: ui-monospace, monospace;}
      </style>
      <header>
        <div class="top">
          <h1>${t.title}</h1>
          <select id="days">
            <option value="1">${t.p_24h}</option>
            <option value="7">${t.p_7d}</option>
            <option value="14" selected>${t.p_14d}</option>
            <option value="30">${t.p_30d}</option>
            <option value="90">${t.p_90d}</option>
            <option value="365">${t.p_year}</option>
          </select>
        </div>
        <div class="tabs">
          <button class="tab active" data-tab="overview">${t.tab_overview}</button>
          <button class="tab" data-tab="people">${t.tab_people}</button>
          <button class="tab" data-tab="auto">${t.tab_auto}</button>
          <button class="tab" data-tab="devices">${t.tab_devices}</button>
          <button class="tab" data-tab="rooms">${t.tab_rooms}</button>
          <button class="tab" data-tab="anomalies">${t.tab_anomalies}</button>
          <button class="tab" data-tab="journal">${t.tab_journal}</button>
        </div>
      </header>
      <main id="body"></main>
    `;
    this.shadowRoot.getElementById("days").addEventListener("change", (e) => {
      this._days = parseInt(e.target.value, 10); this._fetch();
    });
    this.shadowRoot.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        this._tab = btn.dataset.tab;
        this.shadowRoot.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === btn));
        this._renderBody();
      });
    });
  }

  _renderBody() {
    const root = this.shadowRoot.getElementById("body");
    if (!root) return;
    const t = this._t;
    if (!this._data) { root.innerHTML = `<div class="card col-12 empty">${t.loading}</div>`; return; }

    // render the requested tab
    switch (this._tab) {
      case "people":    this._renderPeople(root); break;
      case "auto":      this._renderAuto(root); break;
      case "devices":   this._renderDevices(root); break;
      case "rooms":     this._renderRooms(root); break;
      case "anomalies": this._renderAnomalies(root); break;
      case "journal":   this._renderJournal(root); break;
      default:          this._renderOverview(root);
    }

    // non-blocking error banner if any endpoint failed
    if (this._error) {
      const banner = document.createElement("div");
      banner.className = "card col-12";
      banner.style.cssText = "background:#fef2f2;color:#991b1b;border-left:3px solid #dc2626;font-size:.82rem;";
      banner.innerHTML = `<b>${t.error}</b> ${this._error}`;
      root.insertBefore(banner, root.firstChild);
    }
  }

  // =================== OVERVIEW ===================
  _renderOverview(root) {
    const t = this._t;
    const { compare, summary, series, sources, insights, rooms, topEntity, recent, peak } = this._data;
    const cur = compare?.current || {};
    const prv = compare?.previous || {};
    const total = cur.total || 0;
    const ratio = total > 0 ? Math.round((cur.n_auto || 0) / total * 100) : 0;

    root.innerHTML = `
      ${this._kpi(t.events_period, total, prv.total, ACCENTS.events)}
      ${this._kpi(t.auto_period, cur.n_auto || 0, prv.n_auto, ACCENTS.auto)}
      ${this._kpi(t.manual_period, cur.n_user || 0, prv.n_user, ACCENTS.user)}
      ${this._kpi(t.unique_entities, cur.unique_entities || 0, prv.unique_entities, ACCENTS.events, true)}
      ${this._kpi(t.unique_areas, cur.unique_areas || 0, prv.unique_areas, ACCENTS.rooms, true)}
      ${this._peakKpi(peak)}

      <div class="card col-8">
        <h3>${t.activity_dynamics} <span class="sub">${this._t_str("events_period")} / ${this._days}d</span></h3>
        ${this._stackedBar(series)}
      </div>
      <div class="card col-4">
        <h3>${t.sources}</h3>
        ${this._donut(sources)}
        ${this._gauge(ratio)}
      </div>

      <div class="card col-12">
        <h3>${t.insights}</h3>
        ${this._renderInsights(insights)}
      </div>

      <div class="card col-12">
        <h3>${t.heatmap}</h3>
        ${this._heatmap(this._data.heatmap)}
      </div>

      <div class="card col-6">
        <h3>${t.top_rooms}</h3>
        ${this._roomsList(rooms || [])}
      </div>
      <div class="card col-6">
        <h3>${t.top_devices}</h3>
        ${this._barList(topEntity, "device")}
      </div>

      <div class="card col-12">
        <h3>${t.recent_events}</h3>
        ${this._eventsTable(recent.slice(0, 50), false)}
      </div>
    `;
    this._wireSort();
    this._wireRowClicks();
  }

  // =================== PEOPLE ===================
  _renderPeople(root) {
    const t = this._t;
    const { topUser, recent, summary } = this._data;
    const userEvents = recent.filter((r) => r.trigger_type === "user");
    root.innerHTML = `
      <div class="card col-3">
        <div class="kpi-big" style="color:${ACCENTS.user}">${summary.n_user || 0}</div>
        <div class="kpi-sub">${t.manual_period}</div>
      </div>
      <div class="card col-3">
        <div class="kpi-big" style="color:${ACCENTS.events}">${summary.unique_users || 0}</div>
        <div class="kpi-sub">${t.unique_users}</div>
      </div>
      <div class="card col-6">
        <h3>${t.top_users}</h3>
        ${this._barList(topUser.map(u => ({...u, key: u.user_name || u.key})), "plain")}
      </div>
      <div class="card col-12">
        <h3>${t.recent_events} — ${t.tab_people}</h3>
        ${this._eventsTable(userEvents.slice(0, 100), true)}
      </div>
    `;
    this._wireSort();
  }

  // =================== AUTOMATIONS ===================
  _renderAuto(root) {
    const t = this._t;
    const { topAuto, recent, summary, anomalies } = this._data;
    const autoEvents = recent.filter((r) => ["automation", "script"].includes(r.trigger_type));
    root.innerHTML = `
      <div class="card col-3">
        <div class="kpi-big" style="color:${ACCENTS.auto}">${summary.n_auto || 0}</div>
        <div class="kpi-sub">${t.auto_period}</div>
      </div>
      <div class="card col-3">
        <div class="kpi-big" style="color:${ACCENTS.events}">${summary.unique_triggers || 0}</div>
        <div class="kpi-sub">${t.unique_triggers}</div>
      </div>
      <div class="card col-6">
        <h3>${t.top_automations}</h3>
        ${this._barList(topAuto.map(a => ({...a, friendly_name: a.automation_name, key: a.key})), "auto")}
      </div>
      ${anomalies?.duplicate_automations?.length ? `
      <div class="card col-12">
        <h3>${t.anomaly_dup}</h3>
        ${this._dupAnomalies(anomalies.duplicate_automations)}
      </div>` : ""}
      <div class="card col-12">
        <h3>${t.recent_events} — ${t.tab_auto}</h3>
        ${this._eventsTable(autoEvents.slice(0, 100), true)}
      </div>
    `;
    this._wireSort();
  }

  // =================== DEVICES ===================
  _renderDevices(root) {
    const t = this._t;
    const { topEntity, byDomain, topService, recent } = this._data;
    root.innerHTML = `
      <div class="card col-12">
        <h3>${t.top_devices}</h3>
        ${this._barList(topEntity, "device")}
      </div>
      <div class="card col-6">
        <h3>${t.by_domain}</h3>
        ${this._barList(byDomain, "domain")}
      </div>
      <div class="card col-6">
        <h3>${t.top_services}</h3>
        ${this._barList(topService.map(s => ({...s, key: this._label_service(s.key)})), "plain")}
      </div>
    `;
  }

  // =================== ROOMS ===================
  _renderRooms(root) {
    const t = this._t;
    const { rooms } = this._data;
    if (!rooms || rooms.length === 0) {
      root.innerHTML = `<div class="card col-12 empty">${t.no_data_long}</div>`;
      return;
    }
    root.innerHTML = `
      <div class="card col-12">
        <h3>${t.top_rooms}</h3>
        ${rooms.map((r) => `
          <div class="room-card">
            <div class="room-head">
              <div class="room-name">${r.area_name}</div>
              <div class="room-stats">
                ${r.n} ${this._t_str("events_period")} ·
                <span class="pill pill-automation">${this._t_str("auto_period")}: ${r.n_auto || 0}</span>
                <span class="pill pill-user">${this._t_str("manual_period")}: ${r.n_user || 0}</span>
              </div>
            </div>
            <div class="room-ents">
              ${(r.top_entities || []).map((e) => `
                <div class="room-ent">${e.friendly_name || e.entity_id}<span class="n">${e.n}</span></div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // =================== ANOMALIES ===================
  _renderAnomalies(root) {
    const t = this._t;
    const a = this._data.anomalies || {};
    const empty = !a.rapid_toggle?.length && !a.user_cancelled?.length && !a.duplicate_automations?.length && !a.night_activity?.length;
    if (empty) {
      root.innerHTML = `<div class="card col-12 empty">${t.no_anomalies}</div>`;
      return;
    }
    root.innerHTML = `
      ${a.rapid_toggle?.length ? `
      <div class="card col-12">
        <h3>${t.anomaly_rapid}</h3>
        ${a.rapid_toggle.map((r) => {
          const dur = Math.round((r.last_ts - r.first_ts) / 60);
          const name = r.friendly_name || r.entity_id;
          return `<div class="anomaly">
            <div class="a-title">${name} — ${r.n} ${this._t_str("rapid_alert")} ${dur} ${this._t_str("minutes")}</div>
            <div class="a-detail">${r.entity_id}${r.area_name ? ` · ${r.area_name}` : ""}</div>
          </div>`;
        }).join("")}
      </div>` : ""}

      ${a.user_cancelled?.length ? `
      <div class="card col-12">
        <h3>${t.anomaly_cancelled}</h3>
        ${a.user_cancelled.map((c) => {
          const sec = c.auto_ts - c.user_ts;
          const params = {
            user: c.user_name || "—",
            action1: this._label_service(c.user_service),
            auto: c.auto_name || c.auto_eid,
            action2: this._label_service(c.auto_service),
            sec,
          };
          return `<div class="anomaly">
            <div class="a-title">${c.friendly_name || c.entity_id}</div>
            <div class="a-detail">${this._t_str("cancelled_alert", params)}</div>
          </div>`;
        }).join("")}
      </div>` : ""}

      ${a.duplicate_automations?.length ? `
      <div class="card col-12">
        <h3>${t.anomaly_dup}</h3>
        ${this._dupAnomalies(a.duplicate_automations)}
      </div>` : ""}

      ${a.night_activity?.length ? `
      <div class="card col-12">
        <h3>${t.anomaly_night}</h3>
        ${a.night_activity.map((n) => `
          <div class="anomaly night">
            <div class="a-title">${n.friendly_name || n.entity_id} — ${n.n} ${this._t_str("night_alert")}</div>
            <div class="a-detail">${n.entity_id}${n.area_name ? ` · ${n.area_name}` : ""}</div>
          </div>
        `).join("")}
      </div>` : ""}
    `;
  }

  _dupAnomalies(rows) {
    return rows.map((d) => {
      const sec = d.ts2 - d.ts1;
      const params = {
        auto1: d.auto1_name || d.auto1,
        auto2: d.auto2_name || d.auto2,
        action: this._label_service(d.service),
        entity: d.friendly_name || d.entity_id,
        sec,
      };
      return `<div class="anomaly">
        <div class="a-title">${d.friendly_name || d.entity_id}</div>
        <div class="a-detail">${this._t_str("dup_alert", params)}</div>
      </div>`;
    }).join("");
  }

  // =================== JOURNAL ===================
  _renderJournal(root) {
    const t = this._t;
    root.innerHTML = `
      <div class="card col-12">
        <h3>${t.recent_events} <span class="sub">${t.sort_hint}</span></h3>
        ${this._eventsTable(this._data.recent, true)}
      </div>
    `;
    this._wireSort();
  }

  // =================== KPI ===================
  _kpi(label, val, prev, color, smaller) {
    const t = this._t;
    let delta = "";
    if (prev != null && prev !== undefined) {
      if (prev === 0 && val === 0) delta = `<div class="kpi-delta delta-flat">— ${t.delta_same}</div>`;
      else if (prev === 0) delta = `<div class="kpi-delta delta-up">+${val} ${t.delta_more}</div>`;
      else {
        const diff = val - prev;
        const pct = Math.round((diff / prev) * 100);
        if (diff > 0) delta = `<div class="kpi-delta delta-up">+${pct}% ${t.delta_more}</div>`;
        else if (diff < 0) delta = `<div class="kpi-delta delta-down">${pct}% ${t.delta_less}</div>`;
        else delta = `<div class="kpi-delta delta-flat">${t.delta_same}</div>`;
      }
    }
    return `<div class="card col-2">
      <div class="kpi-big" style="color:${color}; ${smaller ? "font-size:1.6rem;" : ""}">${val}</div>
      <div class="kpi-sub">${label}</div>
      ${delta}
    </div>`;
  }

  _peakKpi(stats) {
    const t = this._t;
    const peakHr = this._data?.insights?.find?.((i) => i.type === "peak_hour");
    if (!peakHr) return `<div class="card col-2"><div class="kpi-big" style="color:${ACCENTS.peak}">—</div><div class="kpi-sub">${t.peak}</div></div>`;
    return `<div class="card col-2">
      <div class="kpi-big" style="color:${ACCENTS.peak}">${peakHr.params.hour}:00</div>
      <div class="kpi-sub">${t.peak}</div>
      <div class="kpi-delta delta-flat">${peakHr.params.n} ${this._t_str("events_period")}</div>
    </div>`;
  }

  // =================== INSIGHTS ===================
  _renderInsights(insights) {
    if (!insights || !insights.length) return `<div class="empty">${this._t.no_data_long}</div>`;
    const icons = { most_active: "📊", automation_ratio: "🤖", peak_hour: "⏰", anomalies: "⚠️", top_room: "🏠", top_user: "👤" };
    return insights.map((ins) => {
      const text = this._t_str(ins.key, ins.params || {});
      const icon = icons[ins.type] || "💡";
      return `<div class="insight ${ins.severity}"><div class="icon">${icon}</div><div class="text">${text}</div></div>`;
    }).join("");
  }

  // =================== STACKED BAR ===================
  _stackedBar(series) {
    if (!series || !series.length) return `<div class="empty">${this._t.no_data_short}</div>`;
    // group by bucket → {user, automation, script, system}
    const buckets = {};
    for (const r of series) {
      buckets[r.bucket] = buckets[r.bucket] || { user: 0, automation: 0, script: 0, system: 0 };
      buckets[r.bucket][r.trigger_type || "system"] = r.n;
    }
    const keys = Object.keys(buckets).sort();
    if (!keys.length) return `<div class="empty">${this._t.no_data_short}</div>`;
    const w = 800, h = 220, pad = 30;
    const max = Math.max(1, ...keys.map((k) => buckets[k].user + buckets[k].automation + buckets[k].script + buckets[k].system));
    const stepX = (w - pad * 2) / keys.length;
    const segOrder = [["user", TRIGGER_COLORS.user], ["automation", TRIGGER_COLORS.automation], ["script", TRIGGER_COLORS.script], ["system", TRIGGER_COLORS.system]];
    const bars = keys.map((k, i) => {
      const b = buckets[k];
      const total = b.user + b.automation + b.script + b.system;
      const bw = Math.max(8, stepX * 0.7);
      const x = pad + i * stepX + (stepX - bw) / 2;
      let y = h - pad;
      let segs = "";
      for (const [seg, color] of segOrder) {
        const sh = (b[seg] / max) * (h - pad * 2 - 12);
        if (sh > 0) {
          y -= sh;
          segs += `<rect x="${x}" y="${y}" width="${bw}" height="${sh}" fill="${color}" opacity="0.85"/>`;
        }
      }
      return `<g>
        ${segs}
        <text x="${x + bw/2}" y="${y - 5}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--primary-text-color)">${total}</text>
        <text x="${x + bw/2}" y="${h - 8}" text-anchor="middle" font-size="9" fill="var(--secondary-text-color)">${this._shortBucket(k)}</text>
      </g>`;
    }).join("");
    const legend = segOrder.map(([k, c]) => `<span style="display:inline-flex;align-items:center;gap:4px;margin-right:12px;font-size:.78rem;"><span style="width:10px;height:10px;background:${c};border-radius:2px;display:inline-block;"></span>${this._t["trigger_" + k]}</span>`).join("");
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:240px;">${bars}</svg><div style="margin-top:8px;">${legend}</div>`;
  }

  _shortBucket(b) {
    if (!b) return "";
    if (b.length === 10) return b.slice(5);
    if (b.length === 13) return b.slice(11);
    return b;
  }

  // =================== DONUT ===================
  _donut(sources) {
    if (!sources || !sources.length) return `<div class="empty">${this._t.no_data_short}</div>`;
    const t = this._t;
    const total = sources.reduce((s, r) => s + r.n, 0) || 1;
    const labelMap = { user: t.trigger_user, automation: t.trigger_automation, script: t.trigger_script, system: t.trigger_system };
    const r = 50, cx = 70, cy = 70;
    let acc = 0;
    const segs = sources.map((s) => {
      const start = (acc / total) * 2 * Math.PI;
      acc += s.n;
      const end = (acc / total) * 2 * Math.PI;
      const x1 = cx + r * Math.sin(start), y1 = cy - r * Math.cos(start);
      const x2 = cx + r * Math.sin(end), y2 = cy - r * Math.cos(end);
      const large = end - start > Math.PI ? 1 : 0;
      const color = TRIGGER_COLORS[s.key] || "#cbd5e1";
      return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${color}" opacity="0.9"/>`;
    }).join("");
    const legend = sources.map((s) => {
      const pct = Math.round((s.n / total) * 100);
      const color = TRIGGER_COLORS[s.key] || "#cbd5e1";
      return `<div><span class="dot" style="background:${color}"></span>${labelMap[s.key] || s.key} <span class="pct">${pct}% (${s.n})</span></div>`;
    }).join("");
    return `<div class="donut">
      <svg width="140" height="140" viewBox="0 0 140 140">
        ${segs}
        <circle cx="${cx}" cy="${cy}" r="30" fill="var(--card-background-color)"/>
        <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--primary-text-color)">${total}</text>
      </svg>
      <div class="legend">${legend}</div>
    </div>`;
  }

  // =================== GAUGE ===================
  _gauge(ratio) {
    const t = this._t;
    const status = ratio < 30 ? "low" : (ratio > 95 ? "warn" : "good");
    const labelKey = "auto_ratio_" + status;
    const color = status === "good" ? "#16a34a" : (status === "warn" ? "#d97706" : "#64748b");
    return `<div class="gauge" style="margin-top:16px;border-top:1px solid var(--divider-color);padding-top:16px;">
      <div class="v" style="color:${color}">${ratio}%</div>
      <div class="l">${t.automation_ratio}</div>
      <div class="l" style="margin-top:4px;color:${color};font-weight:600">${t[labelKey]}</div>
    </div>`;
  }

  // =================== BAR LIST ===================
  _barList(rows, mode) {
    if (!rows || !rows.length) return `<div class="empty">${this._t.no_data_long}</div>`;
    const max = Math.max(1, ...rows.map((r) => r.n));
    return `<div class="bars">${rows.map((r, i) => {
      const color = PALETTE[i % PALETTE.length];
      let label;
      if (mode === "device") {
        const fname = r.friendly_name || r.key;
        const sub = r.area_name ? `${r.key} · ${r.area_name}` : r.key;
        label = `<div class="l"><div class="name-main">${fname}</div><div class="n2">${sub}</div></div>`;
      } else if (mode === "auto") {
        const fname = r.friendly_name || r.automation_name || r.key;
        label = `<div class="l"><div class="name-main">${fname}</div><div class="n2">${r.key}</div></div>`;
      } else if (mode === "domain") {
        label = `<div class="l"><div class="name-main">${r.key}</div></div>`;
      } else {
        label = `<div class="l"><div class="name-main">${r.key ?? "—"}</div></div>`;
      }
      return `<div class="bar">
        <div class="fill" style="width:${(r.n/max)*100}%;background:${color};"></div>
        <div class="lbl">${label}<span style="font-weight:700;font-size:.95rem;">${r.n}</span></div>
      </div>`;
    }).join("")}</div>`;
  }

  // =================== ROOMS LIST (compact for overview) ===================
  _roomsList(rooms) {
    if (!rooms.length) return `<div class="empty">${this._t.no_data_long}</div>`;
    const max = Math.max(1, ...rooms.map((r) => r.n));
    return `<div class="bars">${rooms.slice(0, 10).map((r, i) => {
      const color = PALETTE[i % PALETTE.length];
      const ratio = r.n > 0 ? Math.round((r.n_auto / r.n) * 100) : 0;
      return `<div class="bar">
        <div class="fill" style="width:${(r.n/max)*100}%;background:${color};"></div>
        <div class="lbl">
          <div class="l"><div class="name-main">${r.area_name}</div><div class="n2">🤖 ${ratio}% ${this._t_str("auto_period")}</div></div>
          <span style="font-weight:700">${r.n}</span>
        </div>
      </div>`;
    }).join("")}</div>`;
  }

  // =================== EVENTS TABLE ===================
  _eventsTable(rows, full) {
    const t = this._t;
    if (!rows || !rows.length) return `<div class="empty">${t.no_events}</div>`;
    const sorted = [...rows].sort((a, b) => {
      const av = a[this._sortBy], bv = b[this._sortBy];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return this._sortDir === "asc" ? cmp : -cmp;
    });
    const arrow = (col) => col === this._sortBy ? `<span class="arrow">${this._sortDir === "asc" ? "▲" : "▼"}</span>` : "";
    const pillFor = (r) => {
      const tt = r.trigger_type || "system";
      const labelMap = { user: t.trigger_user, automation: t.trigger_automation, script: t.trigger_script, system: t.trigger_system };
      const detail = r.automation_name ? ` · ${r.automation_name}` : (r.trigger_entity_id ? ` · ${r.trigger_entity_id}` : "");
      return `<span class="pill pill-${tt}">${labelMap[tt]}${detail}</span>`;
    };

    return `<table>
      <thead><tr>
        <th data-sort="ts">${t.th_time}${arrow("ts")}</th>
        <th data-sort="entity_id">${t.th_entity}${arrow("entity_id")}</th>
        <th data-sort="area_name">${t.th_room}${arrow("area_name")}</th>
        <th data-sort="service">${t.th_service}${arrow("service")}</th>
        <th data-sort="user_name">${t.th_user}${arrow("user_name")}</th>
        <th data-sort="trigger_type">${t.th_trigger}${arrow("trigger_type")}</th>
      </tr></thead>
      <tbody>
        ${sorted.map((r) => `<tr>
          <td class="ts">${this._fmtTs(r.ts)}</td>
          <td>
            <div class="name-main">${r.friendly_name || r.entity_id}</div>
            <div class="name-sub">${r.entity_id}</div>
          </td>
          <td>${r.area_name || "—"}</td>
          <td><span class="pill pill-action">${this._label_service(r.service)}</span></td>
          <td>${r.user_name || r.user_id || "—"}</td>
          <td>${pillFor(r)}</td>
        </tr>`).join("")}
      </tbody>
    </table>`;
  }

  _wireSort() {
    this.shadowRoot.querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const col = th.dataset.sort;
        if (this._sortBy === col) this._sortDir = this._sortDir === "asc" ? "desc" : "asc";
        else { this._sortBy = col; this._sortDir = col === "ts" ? "desc" : "asc"; }
        this._renderBody();
      });
    });
  }

  _wireRowClicks() { /* reserved for v0.2.1 detail modal */ }

  _fmtTs(ts) {
    return new Date(ts * 1000).toLocaleString(this._lang === "uk" ? "uk-UA" : this._lang === "ru" ? "ru-RU" : "en-US");
  }

  // =================== HEATMAP ===================
  _heatmap(rows) {
    const t = this._t;
    if (!rows || !rows.length) return `<div class="empty">${t.no_data_heatmap}</div>`;
    const grid = {};
    let maxV = 0;
    for (const r of rows) {
      grid[r.dow] = grid[r.dow] || {};
      grid[r.dow][r.hour] = r.n;
      if (r.n > maxV) maxV = r.n;
    }
    const bucket = (n) => {
      if (!n) return 0;
      const ratio = n / maxV;
      if (ratio > 0.8) return 5;
      if (ratio > 0.6) return 4;
      if (ratio > 0.4) return 3;
      if (ratio > 0.2) return 2;
      return 1;
    };
    let html = `<div class="heat"><div></div>`;
    for (let h = 0; h < 24; h++) html += `<div class="hh">${h}</div>`;
    const order = [1, 2, 3, 4, 5, 6, 0];
    for (const dow of order) {
      html += `<div class="hh">${t.dow[dow]}</div>`;
      for (let h = 0; h < 24; h++) {
        const v = (grid[dow] && grid[dow][h]) || 0;
        const bIdx = bucket(v);
        const bg = HEAT[bIdx] || "transparent";
        const showVal = bIdx >= 3 ? v : "";
        html += `<div class="cell" style="background:${bg}" title="${t.dow[dow]} ${h}:00 — ${v}">${showVal}</div>`;
      }
    }
    html += `</div>`;
    return html;
  }
}

customElements.define("user-activity-panel", HomeActivityPanel);
