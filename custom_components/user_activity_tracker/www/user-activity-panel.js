/**
 * Custom panel: Home Activity Intelligence
 * v0.2.3 — dark fintech dashboard style:
 *   navy background, gradient KPI tiles, glowing donut, smooth area chart
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
    anomaly_dead: "Dead automations (not seen in 7+ days)",
    anomaly_low: "Low-impact automations (1 entity, 1 service)",
    anomaly_manual_after: "Manual override after automation",
    anomaly_routine: "Automation candidates (recurring user patterns)",
    hp_1h: "1h", hp_3h: "3h", hp_6h: "6h", hp_today: "Today", hp_yest: "Yesterday",
    hp_7d: "7d", hp_30d: "30d", hp_90d: "90d",
    user_top_devices: "Top devices used", user_top_rooms: "Most used rooms",
    user_peak: "Peak hour", user_total: "Total events",
    automation_candidate_text: "{user} does {action} on {entity} at {hour}:00 — {n}× — automation candidate",
    dead_automation_text: "{name} last fired {days}d ago",
    low_impact_text: "{name} ran {n} times — only touches 1 entity, 1 service",
    manual_after_text: "Automation {auto} did {action1}, {user} did {action2} {sec}s later",
    avg_runs_per_automation: "avg runs / automation", most_active_label: "most active", runs_unit: "runs",
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
    delta_more: "vs prev", delta_less: "vs prev", delta_same: "same",
    sort_hint: "Click headers to sort",
    auto_ratio_low: "Mostly manual",
    auto_ratio_good: "Healthy autonomy",
    auto_ratio_warn: "Very high — verify control",
    insight_most_active: "Most active device: {name} — {n} events in {days}d",
    insight_automation_ratio: "{ratio}% of actions are done by automations ({n_auto} of {total})",
    insight_peak_hour: "Peak activity hour: {hour}:00 ({n} events)",
    insight_anomalies: "Detected {rapid} rapid toggle, {cancelled} cancelled actions, {dups} possible duplicates",
    insight_top_room: "Most active room: {area_name} — {n} events",
    insight_top_user: "Most active user: {user_name} — {n} events",
    night_alert: "events between 00:00 and 06:00",
    rapid_alert: "actions in", minutes: "min",
    cancelled_alert: "{user} did {action1}, automation {auto} did {action2} {sec}s later",
    dup_alert: "{auto1} and {auto2} both did {action} on {entity} within {sec}s",
    services: {
      turn_on: "Turn on", turn_off: "Turn off", toggle: "Toggle",
      open_cover: "Open", close_cover: "Close", set_cover_position: "Set position",
      lock: "Lock", unlock: "Unlock",
      set_temperature: "Set temp", set_hvac_mode: "Set mode",
      play_media: "Play", media_play: "Play", media_pause: "Pause", media_stop: "Stop",
      volume_set: "Volume", volume_mute: "Mute", select_option: "Select",
      set_value: "Set value", increment: "+1", decrement: "-1", press: "Press",
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
    anomaly_dead: "Мёртвые автоматизации (не работали 7+ дней)",
    anomaly_low: "Малоэффективные автоматизации (1 устройство, 1 действие)",
    anomaly_manual_after: "Ручное действие после автоматизации",
    anomaly_routine: "Кандидаты на автоматизацию (повторяющиеся паттерны)",
    hp_1h: "1ч", hp_3h: "3ч", hp_6h: "6ч", hp_today: "Сегодня", hp_yest: "Вчера",
    hp_7d: "7д", hp_30d: "30д", hp_90d: "90д",
    user_top_devices: "Самые используемые устройства", user_top_rooms: "Где чаще всего",
    user_peak: "Пик активности", user_total: "Всего событий",
    automation_candidate_text: "{user} делает {action} на {entity} в {hour}:00 — {n}× — кандидат на автоматизацию",
    dead_automation_text: "{name} последний раз сработала {days} дн. назад",
    low_impact_text: "{name} запускалась {n} раз — управляет только 1 устройством, 1 сервис",
    manual_after_text: "Автоматизация {auto} сделала {action1}, {user} сделал {action2} через {sec}с",
    avg_runs_per_automation: "среднее запусков / авто", most_active_label: "самая активная", runs_unit: "запусков",
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
    delta_more: "к прошл.", delta_less: "к прошл.", delta_same: "без изм.",
    sort_hint: "Клик по заголовку — сортировка",
    auto_ratio_low: "В основном вручную",
    auto_ratio_good: "Здоровая автономия",
    auto_ratio_warn: "Очень высокий — контролируй",
    insight_most_active: "Самое активное устройство: {name} — {n} событий за {days} дн.",
    insight_automation_ratio: "{ratio}% действий выполняют автоматизации ({n_auto} из {total})",
    insight_peak_hour: "Пик активности: {hour}:00 ({n} событий)",
    insight_anomalies: "Обнаружено: {rapid} частых переключений, {cancelled} отменённых действий, {dups} дублей",
    insight_top_room: "Самая активная комната: {area_name} — {n} событий",
    insight_top_user: "Самый активный пользователь: {user_name} — {n} событий",
    night_alert: "событий между 00:00 и 06:00",
    rapid_alert: "действий за", minutes: "мин",
    cancelled_alert: "{user} сделал {action1}, автоматизация {auto} сделала {action2} через {sec}с",
    dup_alert: "{auto1} и {auto2} обе сделали {action} на {entity} в течение {sec}с",
    services: {
      turn_on: "Включено", turn_off: "Выключено", toggle: "Переключено",
      open_cover: "Открыто", close_cover: "Закрыто", set_cover_position: "Позиция",
      lock: "Заперто", unlock: "Разблок.",
      set_temperature: "Темп.", set_hvac_mode: "Режим",
      play_media: "Воспр.", media_play: "Воспр.", media_pause: "Пауза", media_stop: "Стоп",
      volume_set: "Громкость", volume_mute: "Mute", select_option: "Выбрано",
      set_value: "Значение", increment: "+1", decrement: "-1", press: "Нажато",
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
    anomaly_dead: "Мертві автоматизації (не працювали 7+ днів)",
    anomaly_low: "Малоефективні автоматизації (1 пристрій, 1 дія)",
    anomaly_manual_after: "Ручна дія після автоматизації",
    anomaly_routine: "Кандидати на автоматизацію (повторювані патерни)",
    hp_1h: "1г", hp_3h: "3г", hp_6h: "6г", hp_today: "Сьогодні", hp_yest: "Вчора",
    hp_7d: "7д", hp_30d: "30д", hp_90d: "90д",
    user_top_devices: "Найчастіше використовує", user_top_rooms: "Де найчастіше",
    user_peak: "Пік активності", user_total: "Усього подій",
    automation_candidate_text: "{user} робить {action} на {entity} о {hour}:00 — {n}× — кандидат на автоматизацію",
    dead_automation_text: "{name} востаннє спрацювала {days} дн. тому",
    low_impact_text: "{name} спрацювала {n} разів — керує лише 1 пристроєм, 1 сервіс",
    manual_after_text: "Автоматизація {auto} зробила {action1}, {user} зробив {action2} через {sec}с",
    avg_runs_per_automation: "середньо запусків / авто", most_active_label: "найактивніша", runs_unit: "запусків",
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
    delta_more: "до попер.", delta_less: "до попер.", delta_same: "без змін",
    sort_hint: "Клік по заголовку — сортування",
    auto_ratio_low: "Переважно вручну",
    auto_ratio_good: "Здорова автономія",
    auto_ratio_warn: "Дуже високий — контролюй",
    insight_most_active: "Найактивніший пристрій: {name} — {n} подій за {days} дн.",
    insight_automation_ratio: "{ratio}% дій виконують автоматизації ({n_auto} з {total})",
    insight_peak_hour: "Пік активності: {hour}:00 ({n} подій)",
    insight_anomalies: "Виявлено: {rapid} частих перемикань, {cancelled} скасованих дій, {dups} дублів",
    insight_top_room: "Найактивніша кімната: {area_name} — {n} подій",
    insight_top_user: "Найактивніший користувач: {user_name} — {n} подій",
    night_alert: "подій між 00:00 та 06:00",
    rapid_alert: "дій за", minutes: "хв",
    cancelled_alert: "{user} зробив {action1}, автоматизація {auto} зробила {action2} через {sec}с",
    dup_alert: "{auto1} та {auto2} обидві зробили {action} на {entity} протягом {sec}с",
    services: {
      turn_on: "Увімкнено", turn_off: "Вимкнено", toggle: "Перемкнено",
      open_cover: "Відкрито", close_cover: "Закрито", set_cover_position: "Позиція",
      lock: "Замкнено", unlock: "Розблок.",
      set_temperature: "Темп.", set_hvac_mode: "Режим",
      play_media: "Відтв.", media_play: "Відтв.", media_pause: "Пауза", media_stop: "Стоп",
      volume_set: "Гучність", volume_mute: "Mute", select_option: "Обрано",
      set_value: "Значення", increment: "+1", decrement: "-1", press: "Натиснуто",
      start: "Старт", stop: "Стоп", pause: "Пауза", return_to_base: "Базу",
    },
    dow: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  },
};

// Vibrant chart palette (gradients defined inline in SVG)
const CHART = ["#22d3ee", "#a78bfa", "#fb7185", "#fbbf24", "#34d399", "#f472b6", "#60a5fa", "#fb923c", "#2dd4bf", "#c084fc"];

// Stat tile color schemes (4-color rotating palette per reference)
const TILES = [
  { bg: "linear-gradient(135deg, #2dd4bf22, #06b6d422)", border: "#2dd4bf55", glow: "#2dd4bf", text: "#5eead4" }, // mint
  { bg: "linear-gradient(135deg, #60a5fa22, #3b82f622)", border: "#60a5fa55", glow: "#60a5fa", text: "#93c5fd" }, // blue
  { bg: "linear-gradient(135deg, #f472b622, #ec489922)", border: "#f472b655", glow: "#f472b6", text: "#f9a8d4" }, // pink
  { bg: "linear-gradient(135deg, #c084fc22, #a855f722)", border: "#c084fc55", glow: "#c084fc", text: "#d8b4fe" }, // purple
  { bg: "linear-gradient(135deg, #fbbf2422, #f59e0b22)", border: "#fbbf2455", glow: "#fbbf24", text: "#fcd34d" }, // amber
  { bg: "linear-gradient(135deg, #fb718522, #f43f5e22)", border: "#fb718555", glow: "#fb7185", text: "#fda4af" }, // rose
];

const TRIGGER_COLORS = {
  user: "#60a5fa", automation: "#a78bfa", script: "#f472b6", system: "#64748b",
};
const HEAT = ["transparent", "#1e293b", "#155e75", "#854d0e", "#9a3412", "#be123c"];

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
      this._heatPeriod = "14d"; // 1h | 3h | 6h | today | yesterday | 7d | 14d | 30d | 90d
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

  _label_service(s) { if (!s) return ""; return this._t.services[s] || s; }

  _heatmapQuery() {
    const p = this._heatPeriod;
    if (["1h", "3h", "6h", "today", "yesterday"].includes(p)) return `heatmap?period=${p}`;
    if (["7d", "14d", "30d", "90d"].includes(p)) return `heatmap?days=${parseInt(p, 10)}`;
    return `heatmap?days=${this._days}`;
  }

  async _fetch() {
    if (!this._hass) return;
    const d = this._days;
    const endpoints = {
      summary: `summary?days=${d}`, compare: `compare?days=${d}`,
      series: `series?group=day&days=${d}&split=trigger`,
      heatmap: this._heatmapQuery(),
      sources: `breakdown?by=trigger_type&limit=10&days=${d}`,
      insights: `insights?days=${d}`, anomalies: `anomalies?days=${d}`,
      rooms: `rooms?days=${d}`,
      topEntity: `breakdown?by=entity_id&limit=20&days=${d}`,
      topAuto: `breakdown?by=trigger_entity_id&limit=20&days=${d}&trigger_type=automation`,
      topUser: `breakdown?by=user_id&limit=20&days=${d}`,
      topService: `breakdown?by=service&limit=20&days=${d}`,
      byDomain: `breakdown?by=domain&limit=20&days=${d}`,
      recent: `events?limit=200`, peak: `stats`,
      usersProfile: `users_profile?days=${d}`,
    };
    const results = await Promise.all(
      Object.entries(endpoints).map(async ([k, p]) => {
        try { return [k, await this._call(p), null]; }
        catch (e) {
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
    if (["recent","series","heatmap","sources","insights","rooms",
         "topEntity","topAuto","topUser","topService","byDomain","usersProfile"].includes(key)) return [];
    if (key === "anomalies") return {
      rapid_toggle: [], user_cancelled: [], duplicate_automations: [], night_activity: [],
      dead_automations: [], low_impact_automations: [], manual_after_auto: [], routine_candidates: [],
    };
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
        :host {
          display: block; height: 100%;
          background: radial-gradient(ellipse at top left, #1a1f2e 0%, #0a0e1a 50%, #050810 100%);
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
        }
        * { box-sizing: border-box; }
        header {
          padding: 16px 28px 0;
          background: linear-gradient(180deg, rgba(26,31,46,0.95) 0%, rgba(10,14,26,0.6) 100%);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 5;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .top { display: flex; align-items: center; gap: 16px; padding-bottom: 14px; }
        h1 {
          margin: 0; font-size: 1.35rem; font-weight: 700; flex: 1;
          background: linear-gradient(135deg, #60a5fa, #c084fc, #f472b6);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          letter-spacing: -0.3px;
        }
        select {
          padding: 8px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04); color: #e2e8f0; font-weight: 500;
          cursor: pointer; font-size: 0.85rem;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        select option { background: #1a1f2e; color: #e2e8f0; }
        .tabs { display: flex; gap: 2px; overflow-x: auto; }
        .tab {
          padding: 10px 18px; cursor: pointer; border: none; background: transparent;
          color: rgba(226,232,240,0.5); font-size: 0.86rem; font-weight: 600;
          border-bottom: 2px solid transparent; transition: all .15s;
          white-space: nowrap; letter-spacing: 0.2px;
        }
        .tab:hover { color: #e2e8f0; background: rgba(255,255,255,0.04); }
        .tab.active {
          color: #fff; border-bottom-color: transparent;
          background: linear-gradient(180deg, transparent 0%, rgba(96,165,250,0.08) 100%);
          position: relative;
        }
        .tab.active::after {
          content: ""; position: absolute; bottom: -1px; left: 12px; right: 12px; height: 2px;
          background: linear-gradient(90deg, #60a5fa, #c084fc, #f472b6); border-radius: 2px;
        }
        main { padding: 20px 28px; display: grid; gap: 16px; grid-template-columns: repeat(12, 1fr); align-items: start; }
        .card {
          background: linear-gradient(160deg, rgba(30,38,54,0.7) 0%, rgba(20,26,40,0.7) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 18px; overflow: hidden;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04);
          min-height: 60px;
        }
        .card h3 {
          margin: 0 0 14px 0; font-size: 0.95rem; font-weight: 600; color: #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .card .sub { font-size: 0.72rem; color: #64748b; font-weight: 500; }
        .col-2 { grid-column: span 2; } .col-3 { grid-column: span 3; }
        .col-4 { grid-column: span 4; } .col-6 { grid-column: span 6; }
        .col-8 { grid-column: span 8; } .col-12 { grid-column: span 12; }
        @media (max-width: 1100px) { .col-2,.col-3 { grid-column: span 6; } .col-4,.col-6,.col-8 { grid-column: span 12; } }
        @media (max-width: 600px) { .col-2,.col-3 { grid-column: span 12; } }

        /* Stat tiles — gradient background per reference design.
           min-height + flex column keeps every tile the same height
           regardless of whether a delta pill is present. */
        .tile {
          position: relative; border-radius: 16px; padding: 18px;
          min-height: 170px; display: flex; flex-direction: column;
          overflow: hidden; border: 1px solid var(--tile-border, rgba(255,255,255,0.08));
          background: var(--tile-bg, rgba(255,255,255,0.03));
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          transition: transform .15s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05),
                      0 0 0 1px rgba(255,255,255,0.02);
        }
        .tile::before {
          content: ""; position: absolute; top: -40px; right: -40px;
          width: 100px; height: 100px; border-radius: 50%;
          background: radial-gradient(circle, var(--tile-glow, transparent) 0%, transparent 70%);
          opacity: 0.4;
        }
        .tile:hover { transform: translateY(-2px); }
        .tile-icon {
          width: 36px; height: 36px; border-radius: 10px; margin-bottom: 12px;
          background: rgba(255,255,255,0.08); display: flex; align-items: center;
          justify-content: center; font-size: 1.1rem;
        }
        .tile-value {
          font-size: 1.85rem; font-weight: 700; line-height: 1; color: var(--tile-text, #fff);
          letter-spacing: -0.5px;
        }
        .tile-label {
          font-size: 0.7rem; color: rgba(226,232,240,0.55); margin-top: 6px;
          text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;
        }
        .tile-delta {
          margin-top: auto; align-self: flex-start;
          font-size: 0.72rem; font-weight: 600;
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 8px;
        }
        .tile-delta-placeholder { margin-top: auto; height: 22px; }
        .delta-up   { background: rgba(34,197,94,0.15);  color: #4ade80; }
        .delta-down { background: rgba(239,68,68,0.15);  color: #f87171; }
        .delta-flat { background: rgba(100,116,139,0.15); color: #94a3b8; }

        .empty {
          color: #64748b; font-size: 0.85rem; padding: 12px 0;
          font-style: italic; text-align: center;
        }
        .err {
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5; padding: 10px 14px; border-radius: 10px; font-size: 0.82rem;
        }

        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.85rem; }
        th {
          font-weight: 600; color: #94a3b8; text-transform: uppercase;
          font-size: 0.68rem; letter-spacing: 0.5px; cursor: pointer;
          user-select: none; white-space: nowrap;
        }
        th:hover { color: #e2e8f0; }
        th .arrow { margin-left: 4px; opacity: 0.7; }
        td.n, th.n { text-align: right; font-variant-numeric: tabular-nums; }
        td.n { font-weight: 600; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .name-main { font-weight: 600; color: #e2e8f0; }
        .name-sub { font-size: 0.72rem; color: #64748b; font-family: ui-monospace,monospace; margin-top: 2px; }

        .pill { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 0.68rem; font-weight: 600; }
        .pill-user       { background: rgba(96,165,250,0.15); color: #93c5fd; border: 1px solid rgba(96,165,250,0.3); }
        .pill-automation { background: rgba(167,139,250,0.15); color: #c4b5fd; border: 1px solid rgba(167,139,250,0.3); }
        .pill-script     { background: rgba(244,114,182,0.15); color: #f9a8d4; border: 1px solid rgba(244,114,182,0.3); }
        .pill-system     { background: rgba(100,116,139,0.15); color: #94a3b8; border: 1px solid rgba(100,116,139,0.3); }
        .pill-action     { background: rgba(255,255,255,0.06); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.08); }

        .bars { display: flex; flex-direction: column; gap: 10px; }
        .bar {
          position: relative; min-height: 48px; border-radius: 10px; overflow: hidden;
          font-size: 0.85rem; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .bar > .fill {
          position: absolute; left: 0; top: 0; bottom: 0; opacity: 0.7;
          border-radius: 10px;
          box-shadow: 0 0 12px var(--bar-glow, transparent);
        }
        .bar > .lbl {
          position: relative; z-index: 1; padding: 8px 14px; display: flex;
          justify-content: space-between; align-items: center; gap: 10px;
          color: #e2e8f0; min-height: 48px;
        }
        .bar > .lbl > .l { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
        .bar > .lbl > .l > .name-main {
          font-weight: 600; color: #fff; font-size: 0.92rem;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .bar > .lbl > .l > .n2 {
          font-size: 0.72rem; color: rgba(226,232,240,0.55); font-family: ui-monospace,monospace;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .bar > .lbl > .v {
          font-weight: 800; font-size: 1.1rem; color: #fff; flex-shrink: 0;
          font-variant-numeric: tabular-nums;
        }

        .heat {
          display: grid; grid-template-columns: 36px repeat(24, 1fr);
          grid-auto-rows: 26px; gap: 3px; font-size: 0.66rem;
        }
        .heat .hh { color: #64748b; display: flex; align-items: center; justify-content: center; font-weight: 600; }
        .heat .cell {
          border-radius: 5px; display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.95); font-weight: 600;
          border: 1px solid rgba(255,255,255,0.03);
        }
        /* chip-style period selector */
        .chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
        .chip {
          padding: 6px 12px; border-radius: 999px; cursor: pointer; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); color: #94a3b8; font-size: 0.78rem; font-weight: 600;
          transition: all .15s; font-family: inherit;
        }
        .chip:hover { color: #e2e8f0; border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); }
        .chip.active {
          background: linear-gradient(135deg, rgba(96,165,250,0.2), rgba(192,132,252,0.2));
          color: #fff; border-color: rgba(96,165,250,0.4);
          box-shadow: 0 0 12px rgba(96,165,250,0.25);
        }
        /* user profile cards */
        .user-card {
          background: linear-gradient(160deg, rgba(96,165,250,0.06), rgba(167,139,250,0.04));
          border: 1px solid rgba(255,255,255,0.06); border-radius: 14px;
          padding: 16px; margin-bottom: 12px;
        }
        .user-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; }
        .user-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #c084fc); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; font-weight: 700; flex-shrink: 0;
        }
        .user-info { flex: 1; min-width: 0; }
        .user-name-big { font-size: 1.1rem; font-weight: 700; color: #fff; }
        .user-meta { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }
        .user-stats {
          display: flex; gap: 12px; flex-wrap: wrap;
          padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04); margin-bottom: 12px;
        }
        .user-stat { display: flex; flex-direction: column; gap: 2px; }
        .user-stat .v { font-size: 1.1rem; font-weight: 700; color: #fff; }
        .user-stat .l { font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
        .user-section-title {
          font-size: 0.72rem; color: #94a3b8; text-transform: uppercase;
          letter-spacing: 0.5px; font-weight: 600; margin-bottom: 8px;
        }

        .insight {
          padding: 12px 16px; border-radius: 12px; margin-bottom: 8px;
          display: flex; align-items: center; gap: 14px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .insight.info    { background: linear-gradient(135deg, rgba(96,165,250,0.1), rgba(96,165,250,0.04)); color: #bfdbfe; }
        .insight.good    { background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.04)); color: #bbf7d0; }
        .insight.warning { background: linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.04)); color: #fde68a; }
        .insight .icon { font-size: 1.4rem; }
        .insight .text { flex: 1; font-size: 0.88rem; line-height: 1.4; }

        .anomaly {
          padding: 14px 16px; border-radius: 12px; margin-bottom: 8px;
          background: linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02));
          color: #fecaca; border: 1px solid rgba(239,68,68,0.2);
          border-left: 3px solid #ef4444;
        }
        .anomaly.night {
          background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(167,139,250,0.02));
          color: #ddd6fe; border-color: rgba(167,139,250,0.25); border-left-color: #a78bfa;
        }
        .anomaly .a-title { font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: #fff; }
        .anomaly .a-detail { font-size: 0.78rem; opacity: 0.85; }

        .donut-wrap { display: flex; align-items: center; gap: 20px; padding: 8px 0; }
        .donut-wrap svg { flex-shrink: 0; filter: drop-shadow(0 0 12px rgba(96,165,250,0.15)); }
        .donut-legend { display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; flex: 1; }
        .donut-legend > div { display: flex; align-items: center; gap: 8px; }
        .donut-legend .dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
        .donut-legend .pct { color: #94a3b8; margin-left: auto; font-variant-numeric: tabular-nums; }

        .gauge {
          margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; align-items: center;
        }
        .gauge .v { font-size: 2.4rem; font-weight: 800; line-height: 1; letter-spacing: -1px; }
        .gauge .l1 { font-size: 0.8rem; color: #94a3b8; margin-top: 6px; }
        .gauge .l2 { font-size: 0.78rem; margin-top: 4px; font-weight: 600; }

        .room-card {
          background: rgba(255,255,255,0.03); border-radius: 12px; padding: 14px;
          margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.05);
        }
        .room-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; gap: 10px; flex-wrap: wrap; }
        .room-name { font-weight: 700; font-size: 1rem; color: #e2e8f0; }
        .room-stats { font-size: 0.75rem; color: #94a3b8; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
        .room-ents { display: flex; flex-wrap: wrap; gap: 6px; }
        .room-ent {
          background: rgba(255,255,255,0.04); padding: 5px 12px; border-radius: 8px;
          font-size: 0.78rem; border: 1px solid rgba(255,255,255,0.04);
        }
        .room-ent .n { color: #60a5fa; font-weight: 700; margin-left: 6px; }

        .ts { color: #64748b; font-size: 0.72rem; white-space: nowrap; font-family: ui-monospace,monospace; }
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

    switch (this._tab) {
      case "people":    this._renderPeople(root); break;
      case "auto":      this._renderAuto(root); break;
      case "devices":   this._renderDevices(root); break;
      case "rooms":     this._renderRooms(root); break;
      case "anomalies": this._renderAnomalies(root); break;
      case "journal":   this._renderJournal(root); break;
      default:          this._renderOverview(root);
    }

    if (this._error) {
      const banner = document.createElement("div");
      banner.className = "col-12 err";
      banner.innerHTML = `<b>${t.error}</b> ${this._error}`;
      root.insertBefore(banner, root.firstChild);
    }

    // Wire heatmap period chips (only present on overview)
    this.shadowRoot.querySelectorAll('[data-role="heat-chips"] .chip').forEach((btn) => {
      btn.addEventListener("click", () => {
        this._heatPeriod = btn.dataset.heat;
        this._fetch();
      });
    });
  }

  // ===== OVERVIEW =====
  _renderOverview(root) {
    const t = this._t;
    const { compare, summary, series, sources, insights, rooms, topEntity, recent } = this._data;
    const cur = compare?.current || {};
    const prv = compare?.previous || {};
    const total = cur.total || 0;
    const ratio = total > 0 ? Math.round((cur.n_auto || 0) / total * 100) : 0;

    root.innerHTML = `
      ${this._tile(0, total, prv.total, t.events_period, "📊")}
      ${this._tile(1, cur.n_auto || 0, prv.n_auto, t.auto_period, "🤖")}
      ${this._tile(2, cur.n_user || 0, prv.n_user, t.manual_period, "👆")}
      ${this._tile(3, cur.unique_entities || 0, prv.unique_entities, t.unique_entities, "💡")}
      ${this._tile(4, cur.unique_areas || 0, prv.unique_areas, t.unique_areas, "🏠")}
      ${this._peakTile()}

      <div class="card col-8">
        <h3>${t.activity_dynamics} <span class="sub">${this._days}d</span></h3>
        ${this._areaChart(series)}
      </div>
      <div class="card col-4">
        <h3>${t.sources}</h3>
        ${this._donut(sources)}
        ${this._gauge(ratio)}
      </div>

      <div class="card col-12"><h3>${t.insights}</h3>${this._renderInsights(insights)}</div>

      <div class="card col-12">
        <h3>${t.heatmap}</h3>
        ${this._heatmapChips()}
        ${this._heatmap(this._data.heatmap)}
      </div>

      <div class="card col-6"><h3>${t.top_rooms}</h3>${this._roomsList(rooms || [])}</div>
      <div class="card col-6"><h3>${t.top_devices}</h3>${this._barList(topEntity, "device")}</div>

      <div class="card col-12"><h3>${t.recent_events}</h3>${this._eventsTable((recent||[]).slice(0,50))}</div>
    `;
    this._wireSort();
  }

  _renderPeople(root) {
    const t = this._t;
    const { recent, summary, usersProfile } = this._data;
    const userEvents = (recent||[]).filter((r) => r.trigger_type === "user");
    const profiles = usersProfile || [];
    root.innerHTML = `
      ${this._tile(2, summary.n_user || 0, null, t.manual_period, "👆")}
      ${this._tile(1, summary.unique_users || 0, null, t.unique_users, "👥")}
      ${this._tile(0, profiles.length ? profiles[0]?.n || 0 : 0, null, t.top_users, "🏆")}

      <div class="card col-12">
        <h3>${t.top_users}</h3>
        ${profiles.length ? profiles.map((p) => this._userProfileCard(p)).join("") : `<div class="empty">${t.no_data_long}</div>`}
      </div>

      <div class="card col-12"><h3>${t.recent_events} — ${t.tab_people}</h3>${this._eventsTable(userEvents.slice(0,100))}</div>
    `;
    this._wireSort();
  }

  _userProfileCard(p) {
    const t = this._t;
    const name = p.user_name || p.user_id || "—";
    const initials = (name.match(/\b\w/g) || ["?"]).slice(0, 2).join("").toUpperCase();
    const peakStr = p.peak_hour != null ? `${p.peak_hour}:00 (${p.peak_n})` : "—";
    const ents = (p.top_entities || []).slice(0, 8);
    const areas = (p.top_areas || []).slice(0, 5);
    const maxE = Math.max(1, ...ents.map((e) => e.n));
    const maxA = Math.max(1, ...areas.map((a) => a.n));
    return `<div class="user-card">
      <div class="user-head">
        <div class="user-avatar">${initials}</div>
        <div class="user-info">
          <div class="user-name-big">${name}</div>
          <div class="user-meta">${p.user_id || ""}</div>
        </div>
      </div>
      <div class="user-stats">
        <div class="user-stat"><div class="v">${p.n}</div><div class="l">${t.user_total}</div></div>
        <div class="user-stat"><div class="v">${peakStr}</div><div class="l">${t.user_peak}</div></div>
        <div class="user-stat"><div class="v">${ents.length}</div><div class="l">${t.user_top_devices}</div></div>
      </div>
      ${ents.length ? `
      <div class="user-section-title">${t.user_top_devices}</div>
      <div class="bars" style="margin-bottom:14px;">
        ${ents.map((e, i) => {
          const color = CHART[i % CHART.length];
          const fname = e.friendly_name || e.entity_id;
          const sub = e.area_name ? `${e.entity_id} · ${e.area_name}` : e.entity_id;
          return `<div class="bar"><div class="fill" style="width:${(e.n/maxE)*100}%;background:linear-gradient(90deg,${color},${color}aa);--bar-glow:${color}88;"></div><div class="lbl"><div class="l"><div class="name-main">${fname}</div><div class="n2">${sub}</div></div><span class="v">${e.n}</span></div></div>`;
        }).join("")}
      </div>` : ""}
      ${areas.length ? `
      <div class="user-section-title">${t.user_top_rooms}</div>
      <div class="bars">
        ${areas.map((a, i) => {
          const color = CHART[(i+3) % CHART.length];
          return `<div class="bar"><div class="fill" style="width:${(a.n/maxA)*100}%;background:linear-gradient(90deg,${color},${color}aa);--bar-glow:${color}88;"></div><div class="lbl"><div class="l"><div class="name-main">${a.area_name || a.area_id}</div></div><span class="v">${a.n}</span></div></div>`;
        }).join("")}
      </div>` : ""}
    </div>`;
  }

  _renderAuto(root) {
    const t = this._t;
    const { topAuto, recent, summary, anomalies } = this._data;
    const autoEvents = (recent || []).filter((r) => ["automation", "script"].includes(r.trigger_type));
    const nAuto = summary.n_auto || 0;
    const uniq = summary.unique_triggers || 0;
    const avgRuns = uniq > 0 ? (nAuto / uniq).toFixed(1) : "0";
    const topAutoRow = (topAuto || [])[0];
    const topAutoLabel = topAutoRow ? (topAutoRow.automation_name || topAutoRow.key) : "—";
    const topAutoN = topAutoRow ? topAutoRow.n : 0;

    // Truncate long automation names for the tile
    const topShort = topAutoLabel.length > 18 ? topAutoLabel.slice(0, 16) + "…" : topAutoLabel;

    root.innerHTML = `
      ${this._tile(3, nAuto, null, t.auto_period, "🤖", "col-3")}
      ${this._tile(0, uniq, null, t.unique_triggers, "⚙️", "col-3")}
      ${this._tile(2, avgRuns, null, t.avg_runs_per_automation, "📊", "col-3")}
      ${this._tileText(1, topShort, "🏆", t.most_active_label, topAutoN ? `${topAutoN} ${t.runs_unit}` : null)}

      <div class="card col-12"><h3>${t.top_automations}</h3>${this._barList((topAuto || []).map(a => ({...a, friendly_name: a.automation_name})), "auto")}</div>

      ${anomalies?.duplicate_automations?.length ? `<div class="card col-12"><h3>${t.anomaly_dup}</h3>${this._dupAnomalies(anomalies.duplicate_automations)}</div>` : ""}

      <div class="card col-12"><h3>${t.recent_events} — ${t.tab_auto}</h3>${this._eventsTable(autoEvents.slice(0, 100))}</div>
    `;
    this._wireSort();
  }

  _tileText(idx, val, icon, label, sub) {
    const sch = TILES[idx % TILES.length];
    return `<div class="tile col-3" style="--tile-bg:${sch.bg};--tile-border:${sch.border};--tile-glow:${sch.glow};--tile-text:${sch.text}">
      <div class="tile-icon">${icon}</div>
      <div class="tile-value" style="font-size:1.35rem;line-height:1.15;color:${sch.text};">${val}</div>
      <div class="tile-label">${label}</div>
      ${sub ? `<div class="tile-delta delta-flat">${sub}</div>` : `<div class="tile-delta-placeholder"></div>`}
    </div>`;
  }

  _renderDevices(root) {
    const t = this._t;
    const { topEntity, byDomain, topService } = this._data;
    root.innerHTML = `
      <div class="card col-12"><h3>${t.top_devices}</h3>${this._barList(topEntity, "device")}</div>
      <div class="card col-6"><h3>${t.by_domain}</h3>${this._barList(byDomain, "domain")}</div>
      <div class="card col-6"><h3>${t.top_services}</h3>${this._barList((topService||[]).map(s=>({...s, key: this._label_service(s.key)})), "plain")}</div>
    `;
  }

  _renderRooms(root) {
    const t = this._t;
    const { rooms } = this._data;
    if (!rooms?.length) { root.innerHTML = `<div class="card col-12 empty">${t.no_data_long}</div>`; return; }
    root.innerHTML = `<div class="card col-12"><h3>${t.top_rooms}</h3>${rooms.map((r) => `
      <div class="room-card">
        <div class="room-head">
          <div class="room-name">${r.area_name}</div>
          <div class="room-stats">
            <span style="color:#fff;font-weight:700;">${r.n}</span> ${this._t_str("events_period")}
            <span class="pill pill-automation">${this._t_str("auto_period")}: ${r.n_auto || 0}</span>
            <span class="pill pill-user">${this._t_str("manual_period")}: ${r.n_user || 0}</span>
          </div>
        </div>
        <div class="room-ents">${(r.top_entities||[]).map((e) => `<div class="room-ent">${e.friendly_name || e.entity_id}<span class="n">${e.n}</span></div>`).join("")}</div>
      </div>
    `).join("")}</div>`;
  }

  _renderAnomalies(root) {
    const t = this._t;
    const a = this._data.anomalies || {};
    const empty = !a.rapid_toggle?.length && !a.user_cancelled?.length
      && !a.duplicate_automations?.length && !a.night_activity?.length
      && !a.dead_automations?.length && !a.low_impact_automations?.length
      && !a.manual_after_auto?.length && !a.routine_candidates?.length;
    if (empty) { root.innerHTML = `<div class="card col-12 empty">${t.no_anomalies}</div>`; return; }

    const sections = [];

    if (a.rapid_toggle?.length) {
      sections.push(`<div class="card col-12"><h3>${t.anomaly_rapid}</h3>${a.rapid_toggle.map((r) => {
        const dur = Math.round((r.last_ts - r.first_ts) / 60);
        return `<div class="anomaly"><div class="a-title">${r.friendly_name || r.entity_id} — ${r.n} ${this._t_str("rapid_alert")} ${dur} ${this._t_str("minutes")}</div><div class="a-detail">${r.entity_id}${r.area_name ? ` · ${r.area_name}` : ""}</div></div>`;
      }).join("")}</div>`);
    }

    if (a.user_cancelled?.length) {
      sections.push(`<div class="card col-12"><h3>${t.anomaly_cancelled}</h3>${a.user_cancelled.map((c) => {
        const sec = c.auto_ts - c.user_ts;
        const params = { user: c.user_name || "—", action1: this._label_service(c.user_service), auto: c.auto_name || c.auto_eid, action2: this._label_service(c.auto_service), sec };
        return `<div class="anomaly"><div class="a-title">${c.friendly_name || c.entity_id}</div><div class="a-detail">${this._t_str("cancelled_alert", params)}</div></div>`;
      }).join("")}</div>`);
    }

    if (a.manual_after_auto?.length) {
      sections.push(`<div class="card col-12"><h3>${t.anomaly_manual_after}</h3>${a.manual_after_auto.map((m) => {
        const sec = m.user_ts - m.auto_ts;
        const params = { auto: m.auto_name || m.auto_eid, user: m.user_name || "—", action1: this._label_service(m.auto_service), action2: this._label_service(m.user_service), sec };
        return `<div class="anomaly"><div class="a-title">${m.friendly_name || m.entity_id}</div><div class="a-detail">${this._t_str("manual_after_text", params)}</div></div>`;
      }).join("")}</div>`);
    }

    if (a.duplicate_automations?.length) {
      sections.push(`<div class="card col-12"><h3>${t.anomaly_dup}</h3>${this._dupAnomalies(a.duplicate_automations)}</div>`);
    }

    if (a.dead_automations?.length) {
      sections.push(`<div class="card col-12"><h3>${t.anomaly_dead}</h3>${a.dead_automations.map((d) => {
        const days = Math.round((Date.now() / 1000 - d.last_seen) / 86400);
        const params = { name: d.automation_name || d.entity_id, days };
        return `<div class="anomaly night"><div class="a-title">${d.automation_name || d.entity_id}</div><div class="a-detail">${this._t_str("dead_automation_text", params)}</div></div>`;
      }).join("")}</div>`);
    }

    if (a.low_impact_automations?.length) {
      sections.push(`<div class="card col-12"><h3>${t.anomaly_low}</h3>${a.low_impact_automations.map((l) => {
        const params = { name: l.automation_name || l.entity_id, n: l.n_runs };
        return `<div class="anomaly night"><div class="a-title">${l.automation_name || l.entity_id}</div><div class="a-detail">${this._t_str("low_impact_text", params)}</div></div>`;
      }).join("")}</div>`);
    }

    if (a.routine_candidates?.length) {
      sections.push(`<div class="card col-12"><h3>${t.anomaly_routine}</h3>${a.routine_candidates.map((r) => {
        const params = { user: r.user_name || "—", action: this._label_service(r.service), entity: r.friendly_name || r.entity_id, hour: r.hour, n: r.n };
        return `<div class="anomaly" style="background:linear-gradient(135deg,rgba(34,197,94,.08),rgba(34,197,94,.02));color:#bbf7d0;border-left-color:#22c55e;border-color:rgba(34,197,94,.2);"><div class="a-title">💡 ${r.friendly_name || r.entity_id}</div><div class="a-detail">${this._t_str("automation_candidate_text", params)}</div></div>`;
      }).join("")}</div>`);
    }

    if (a.night_activity?.length) {
      sections.push(`<div class="card col-12"><h3>${t.anomaly_night}</h3>${a.night_activity.map((n) => `<div class="anomaly night"><div class="a-title">${n.friendly_name || n.entity_id} — ${n.n} ${this._t_str("night_alert")}</div><div class="a-detail">${n.entity_id}${n.area_name ? ` · ${n.area_name}` : ""}</div></div>`).join("")}</div>`);
    }

    root.innerHTML = sections.join("");
  }

  _heatmapChips() {
    const t = this._t;
    const chips = [
      ["1h", t.hp_1h], ["3h", t.hp_3h], ["6h", t.hp_6h],
      ["today", t.hp_today], ["yesterday", t.hp_yest],
      ["7d", t.hp_7d], ["14d", t.p_14d], ["30d", t.hp_30d], ["90d", t.hp_90d],
    ];
    return `<div class="chips" data-role="heat-chips">${chips.map(([v, l]) =>
      `<button class="chip ${this._heatPeriod === v ? "active" : ""}" data-heat="${v}">${l}</button>`
    ).join("")}</div>`;
  }

  _dupAnomalies(rows) {
    return rows.map((d) => {
      const sec = d.ts2 - d.ts1;
      const params = { auto1: d.auto1_name||d.auto1, auto2: d.auto2_name||d.auto2, action: this._label_service(d.service), entity: d.friendly_name||d.entity_id, sec };
      return `<div class="anomaly"><div class="a-title">${d.friendly_name||d.entity_id}</div><div class="a-detail">${this._t_str("dup_alert", params)}</div></div>`;
    }).join("");
  }

  _renderJournal(root) {
    const t = this._t;
    root.innerHTML = `<div class="card col-12"><h3>${t.recent_events} <span class="sub">${t.sort_hint}</span></h3>${this._eventsTable(this._data.recent || [])}</div>`;
    this._wireSort();
  }

  // ===== TILE (KPI) =====
  _tile(idx, val, prev, label, icon, col) {
    const t = this._t;
    const sch = TILES[idx % TILES.length];
    const c = col || "col-2";
    let delta = "";
    if (prev != null) {
      if (prev === 0 && val === 0) delta = `<div class="tile-delta delta-flat">— ${t.delta_same}</div>`;
      else if (prev === 0) delta = `<div class="tile-delta delta-up">↑ ${val} ${t.delta_more}</div>`;
      else {
        const diff = val - prev;
        const pct = Math.round((diff/prev)*100);
        if (diff > 0) delta = `<div class="tile-delta delta-up">↑ ${pct}% ${t.delta_more}</div>`;
        else if (diff < 0) delta = `<div class="tile-delta delta-down">↓ ${Math.abs(pct)}% ${t.delta_less}</div>`;
        else delta = `<div class="tile-delta delta-flat">${t.delta_same}</div>`;
      }
    }
    return `<div class="tile ${c}" style="--tile-bg:${sch.bg};--tile-border:${sch.border};--tile-glow:${sch.glow};--tile-text:${sch.text}">
      <div class="tile-icon">${icon}</div>
      <div class="tile-value">${val}</div>
      <div class="tile-label">${label}</div>
      ${delta || `<div class="tile-delta-placeholder"></div>`}
    </div>`;
  }

  _peakTile() {
    const t = this._t;
    const peakHr = this._data?.insights?.find?.((i) => i.type === "peak_hour");
    const sch = TILES[5];
    if (!peakHr) {
      return `<div class="tile col-2" style="--tile-bg:${sch.bg};--tile-border:${sch.border};--tile-glow:${sch.glow};--tile-text:${sch.text}">
        <div class="tile-icon">⏰</div>
        <div class="tile-value">—</div>
        <div class="tile-label">${t.peak}</div>
        <div class="tile-delta-placeholder"></div>
      </div>`;
    }
    return `<div class="tile col-2" style="--tile-bg:${sch.bg};--tile-border:${sch.border};--tile-glow:${sch.glow};--tile-text:${sch.text}">
      <div class="tile-icon">⏰</div>
      <div class="tile-value">${peakHr.params.hour}:00</div>
      <div class="tile-label">${t.peak}</div>
      <div class="tile-delta delta-flat">${peakHr.params.n} ${this._t_str("events_period")}</div>
    </div>`;
  }

  // ===== INSIGHTS =====
  _renderInsights(insights) {
    if (!insights?.length) return `<div class="empty">${this._t.no_data_long}</div>`;
    const icons = { most_active:"📊", automation_ratio:"🤖", peak_hour:"⏰", anomalies:"⚠️", top_room:"🏠", top_user:"👤" };
    return insights.map((i) => `<div class="insight ${i.severity}"><div class="icon">${icons[i.type] || "💡"}</div><div class="text">${this._t_str(i.key, i.params || {})}</div></div>`).join("");
  }

  // ===== AREA CHART (replaces stacked bar) =====
  _areaChart(series) {
    if (!series?.length) return `<div class="empty">${this._t.no_data_short}</div>`;
    const buckets = {};
    for (const r of series) {
      buckets[r.bucket] = buckets[r.bucket] || { user: 0, automation: 0, script: 0, system: 0 };
      buckets[r.bucket][r.trigger_type || "system"] = r.n;
    }
    const keys = Object.keys(buckets).sort();
    if (!keys.length) return `<div class="empty">${this._t.no_data_short}</div>`;
    const w = 800, h = 240, pad = 28;
    const totals = keys.map((k) => buckets[k].user + buckets[k].automation + buckets[k].script + buckets[k].system);
    const max = Math.max(1, ...totals);
    const stepX = (w - pad * 2) / Math.max(1, keys.length - 1);

    // smooth area for total + line
    const points = totals.map((v, i) => [pad + i * stepX, h - pad - (v / max) * (h - pad * 2 - 14)]);
    const linePath = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
    const areaPath = `${linePath} L ${points[points.length-1][0]} ${h-pad} L ${points[0][0]} ${h-pad} Z`;

    // dots + labels
    const dots = points.map((p, i) => `
      <circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#0a0e1a" stroke="#60a5fa" stroke-width="2"/>
      <text x="${p[0]}" y="${p[1] - 10}" text-anchor="middle" font-size="10" font-weight="700" fill="#e2e8f0">${totals[i]}</text>
    `).join("");
    const xLabels = keys.map((k, i) => `<text x="${pad + i * stepX}" y="${h - 8}" text-anchor="middle" font-size="9" fill="#64748b">${this._shortBucket(k)}</text>`).join("");

    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:240px;">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#60a5fa" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#areaGrad)"/>
      <path d="${linePath}" fill="none" stroke="url(#lineGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 0 4px #60a5fa88)"/>
      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#60a5fa"/>
        <stop offset="50%" stop-color="#c084fc"/>
        <stop offset="100%" stop-color="#f472b6"/>
      </linearGradient>
      ${dots}
      ${xLabels}
    </svg>`;
  }

  _shortBucket(b) {
    if (!b) return "";
    if (b.length === 10) return b.slice(5);
    if (b.length === 13) return b.slice(11);
    return b;
  }

  // ===== DONUT =====
  _donut(sources) {
    if (!sources?.length) return `<div class="empty">${this._t.no_data_short}</div>`;
    const t = this._t;
    const total = sources.reduce((s, r) => s + r.n, 0) || 1;
    const labelMap = { user:t.trigger_user, automation:t.trigger_automation, script:t.trigger_script, system:t.trigger_system };
    const cx = 70, cy = 70, rOuter = 56, rInner = 36;
    let acc = 0;
    const segs = sources.map((s) => {
      const start = (acc / total) * 2 * Math.PI;
      acc += s.n;
      const end = (acc / total) * 2 * Math.PI;
      const x1o = cx + rOuter * Math.sin(start), y1o = cy - rOuter * Math.cos(start);
      const x2o = cx + rOuter * Math.sin(end),   y2o = cy - rOuter * Math.cos(end);
      const x1i = cx + rInner * Math.sin(start), y1i = cy - rInner * Math.cos(start);
      const x2i = cx + rInner * Math.sin(end),   y2i = cy - rInner * Math.cos(end);
      const large = end - start > Math.PI ? 1 : 0;
      const color = TRIGGER_COLORS[s.key] || "#64748b";
      return `<path d="M ${x1o} ${y1o} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${rInner} ${rInner} 0 ${large} 0 ${x1i} ${y1i} Z" fill="${color}" opacity="0.95"/>`;
    }).join("");
    const legend = sources.map((s) => {
      const pct = Math.round((s.n / total) * 100);
      const color = TRIGGER_COLORS[s.key] || "#64748b";
      return `<div><span class="dot" style="background:${color};color:${color};"></span><span style="color:#e2e8f0;">${labelMap[s.key]||s.key}</span><span class="pct">${pct}% (${s.n})</span></div>`;
    }).join("");
    return `<div class="donut-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        ${segs}
        <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">${total}</text>
      </svg>
      <div class="donut-legend">${legend}</div>
    </div>`;
  }

  _gauge(ratio) {
    const t = this._t;
    const status = ratio < 30 ? "low" : (ratio > 95 ? "warn" : "good");
    const labelKey = "auto_ratio_" + status;
    const color = status === "good" ? "#34d399" : (status === "warn" ? "#fbbf24" : "#94a3b8");
    return `<div class="gauge">
      <div class="v" style="color:${color}; text-shadow: 0 0 20px ${color}88;">${ratio}%</div>
      <div class="l1">${t.automation_ratio}</div>
      <div class="l2" style="color:${color}">${t[labelKey]}</div>
    </div>`;
  }

  _barList(rows, mode) {
    if (!rows?.length) return `<div class="empty">${this._t.no_data_long}</div>`;
    const max = Math.max(1, ...rows.map((r) => r.n));
    return `<div class="bars">${rows.map((r, i) => {
      const color = CHART[i % CHART.length];
      let label;
      if (mode === "device") {
        const fname = r.friendly_name || r.key;
        const sub = r.area_name ? `${r.key} · ${r.area_name}` : r.key;
        label = `<div class="l"><div class="name-main">${fname}</div><div class="n2">${sub}</div></div>`;
      } else if (mode === "auto") {
        const fname = r.friendly_name || r.automation_name || r.key;
        label = `<div class="l"><div class="name-main">${fname}</div><div class="n2">${r.key}</div></div>`;
      } else {
        label = `<div class="l"><div class="name-main">${r.key ?? "—"}</div></div>`;
      }
      return `<div class="bar"><div class="fill" style="width:${(r.n/max)*100}%;background:linear-gradient(90deg, ${color}, ${color}aa);--bar-glow:${color}88;"></div><div class="lbl">${label}<span class="v">${r.n}</span></div></div>`;
    }).join("")}</div>`;
  }

  _roomsList(rooms) {
    if (!rooms.length) return `<div class="empty">${this._t.no_data_long}</div>`;
    const max = Math.max(1, ...rooms.map((r) => r.n));
    return `<div class="bars">${rooms.slice(0, 10).map((r, i) => {
      const color = CHART[i % CHART.length];
      const ratio = r.n > 0 ? Math.round((r.n_auto / r.n) * 100) : 0;
      return `<div class="bar"><div class="fill" style="width:${(r.n/max)*100}%;background:linear-gradient(90deg, ${color}, ${color}aa);--bar-glow:${color}88;"></div><div class="lbl"><div class="l"><div class="name-main">${r.area_name}</div><div class="n2">🤖 ${ratio}% ${this._t_str("auto_period")}</div></div><span class="v">${r.n}</span></div></div>`;
    }).join("")}</div>`;
  }

  _eventsTable(rows) {
    const t = this._t;
    if (!rows?.length) return `<div class="empty">${t.no_events}</div>`;
    const sorted = [...rows].sort((a, b) => {
      const av = a[this._sortBy], bv = b[this._sortBy];
      if (av == null && bv == null) return 0;
      if (av == null) return 1; if (bv == null) return -1;
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return this._sortDir === "asc" ? cmp : -cmp;
    });
    const arrow = (col) => col === this._sortBy ? `<span class="arrow">${this._sortDir === "asc" ? "▲" : "▼"}</span>` : "";
    const pillFor = (r) => {
      const tt = r.trigger_type || "system";
      const labelMap = { user:t.trigger_user, automation:t.trigger_automation, script:t.trigger_script, system:t.trigger_system };
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
      <tbody>${sorted.map((r) => `<tr>
        <td class="ts">${this._fmtTs(r.ts)}</td>
        <td><div class="name-main">${r.friendly_name || r.entity_id}</div><div class="name-sub">${r.entity_id}</div></td>
        <td>${r.area_name || "—"}</td>
        <td><span class="pill pill-action">${this._label_service(r.service)}</span></td>
        <td>${r.user_name || r.user_id || "—"}</td>
        <td>${pillFor(r)}</td>
      </tr>`).join("")}</tbody>
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

  _fmtTs(ts) {
    return new Date(ts * 1000).toLocaleString(this._lang === "uk" ? "uk-UA" : this._lang === "ru" ? "ru-RU" : "en-US");
  }

  _heatmap(rows) {
    const t = this._t;
    if (!rows?.length) return `<div class="empty">${t.no_data_heatmap}</div>`;
    const grid = {};
    let maxV = 0;
    for (const r of rows) {
      grid[r.dow] = grid[r.dow] || {};
      grid[r.dow][r.hour] = r.n;
      if (r.n > maxV) maxV = r.n;
    }
    const bucket = (n) => { if (!n) return 0; const r = n / maxV; if (r > 0.8) return 5; if (r > 0.6) return 4; if (r > 0.4) return 3; if (r > 0.2) return 2; return 1; };
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
