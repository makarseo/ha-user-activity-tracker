/**
 * Custom panel: Home Activity Intelligence
 * v0.3.0 — Behavioral Analytics:
 *   - Default period 24h (was 14d)
 *   - Loading progress bar 0-100% with elapsed time
 *   - Overview rebuilt: Health Bar → Critical Events → AI Summary → Scores → Trends → Details
 *   - Series auto-groups by hour for 24h, by day for longer periods
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
      this._days = 1;
      this._tab = "overview";
      this._heatPeriod = "today";
      this._sortBy = "ts"; this._sortDir = "desc";
      this._loading = { active: false, progress: 0, done: 0, total: 0, started: 0, elapsed: 0 };
      this._loadingTimer = null;
      this._render();

      // Cache-first: hydrate from localStorage if fresh (< 15 min).
      // No background interval — only refresh on (a) cache expired,
      // (b) tab change requiring missing data, (c) refresh button click.
      const cache = this._loadCache();
      if (cache && cache.days === this._days) {
        this._data = cache.data;
        this._lastFetchTs = cache.ts;
        this._renderBody();
      } else {
        this._fetch();
      }
    }
  }

  disconnectedCallback() { /* no-op (no interval) */ }

  // ---- 15-min localStorage cache ------------------------------------
  _cacheKey() { return `uat_panel_v1`; }
  _loadCache() {
    try {
      const raw = localStorage.getItem(this._cacheKey());
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.ts || Date.now() - obj.ts > 15 * 60 * 1000) return null;
      return obj;
    } catch (_) { return null; }
  }
  _saveCache() {
    try {
      localStorage.setItem(this._cacheKey(), JSON.stringify({
        ts: Date.now(), days: this._days, data: this._data,
      }));
    } catch (_) { /* quota / disabled */ }
  }
  _clearCache() {
    try { localStorage.removeItem(this._cacheKey()); } catch (_) {}
  }

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

  async _fetch(forTab) {
    if (!this._hass) return;
    const d = this._days;
    const seriesGroup = d <= 1 ? "hour" : "day";
    const tab = forTab || this._tab;

    // Always-needed (cheap or central)
    const endpoints = {
      health: `health`,
      summary: `summary?days=${d}`,
      compare: `compare?days=${d}`,
      series: `series?group=${seriesGroup}&days=${d}&split=trigger`,
      sources: `breakdown?by=trigger_type&limit=10&days=${d}`,
      insights: `insights?days=${d}`,
      rooms: `rooms?days=${d}`,
      topEntity: `breakdown?by=entity_id&limit=20&days=${d}`,
      recent: `events?limit=200`,
      peak: `stats`,
      heatmap: this._heatmapQuery(),
    };
    // Heavy or tab-specific — only fetch if user is actually on that tab
    if (tab === "anomalies" || tab === "auto") {
      endpoints.anomalies = `anomalies?days=${d}`;
    }
    if (tab === "auto") {
      endpoints.topAuto = `breakdown?by=trigger_entity_id&limit=20&days=${d}&trigger_type=automation`;
    }
    if (tab === "people") {
      endpoints.topUser = `breakdown?by=user_id&limit=20&days=${d}`;
      endpoints.usersProfile = `users_profile?days=${d}`;
    }
    if (tab === "devices") {
      endpoints.topService = `breakdown?by=service&limit=20&days=${d}`;
      endpoints.byDomain = `breakdown?by=domain&limit=20&days=${d}`;
    }

    const entries = Object.entries(endpoints);
    this._loading = { active: true, progress: 0, done: 0, total: entries.length, started: performance.now(), elapsed: 0 };
    this._updateProgressUI();
    if (this._loadingTimer) clearInterval(this._loadingTimer);
    this._loadingTimer = setInterval(() => {
      this._loading.elapsed = (performance.now() - this._loading.started) / 1000;
      this._updateProgressUI();
    }, 100);

    const results = await Promise.all(
      entries.map(async ([k, p]) => {
        try {
          const r = await this._call(p);
          this._loading.done++;
          this._loading.progress = Math.round(this._loading.done / this._loading.total * 100);
          this._updateProgressUI();
          return [k, r, null];
        } catch (e) {
          console.error(`[UAT] ${p} failed:`, e);
          this._loading.done++;
          this._loading.progress = Math.round(this._loading.done / this._loading.total * 100);
          this._updateProgressUI();
          return [k, this._defaultFor(k), this._fmtError(e, p)];
        }
      })
    );

    this._loading.elapsed = (performance.now() - this._loading.started) / 1000;
    this._loading.active = false;
    this._loading.progress = 100;
    if (this._loadingTimer) { clearInterval(this._loadingTimer); this._loadingTimer = null; }
    this._updateProgressUI();
    setTimeout(() => this._updateProgressUI(true), 900);

    // Merge instead of replace — incremental tab loads keep Overview data alive
    if (!this._data) this._data = {};
    const errs = [];
    for (const [k, v, err] of results) {
      this._data[k] = v;
      if (err) errs.push(err);
    }
    this._error = errs.length ? errs.join(" · ") : null;
    this._lastFetchTs = Date.now();
    this._saveCache();
    this._renderBody();
  }

  _updateProgressUI(hide = false) {
    const el = this.shadowRoot && this.shadowRoot.getElementById("progress");
    const refreshBtn = this.shadowRoot && this.shadowRoot.getElementById("refresh");
    if (refreshBtn) refreshBtn.classList.toggle("spinning", this._loading.active);
    if (!el) return;
    const L = this._loading;
    if (hide && !L.active) { el.classList.remove("is-visible"); return; }
    el.classList.add("is-visible");
    el.classList.toggle("is-done", !L.active && L.progress >= 100);
    const bar = el.querySelector(".progress__bar-fill");
    const pct = el.querySelector(".progress__pct");
    const meta = el.querySelector(".progress__meta");
    if (bar) bar.style.width = L.progress + "%";
    if (pct) pct.textContent = L.progress + "%";
    if (meta) {
      const elapsed = L.elapsed.toFixed(1);
      meta.textContent = L.active
        ? `загрузка · ${L.done}/${L.total} · ${elapsed}с`
        : `готово за ${elapsed}с`;
    }
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
          background: radial-gradient(ellipse at top left, #2c3349 0%, #1c2336 50%, #161c2c 100%);
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
        }
        .refresh-btn {
          background: rgba(255,255,255,0.04); color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;
          padding: 7px 9px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
          transition: all .15s; line-height: 0;
        }
        .refresh-btn:hover { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.35); color: #93c5fd; }
        .refresh-btn.spinning svg { animation: uat-spin 0.7s linear infinite; }
        @keyframes uat-spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        header {
          padding: 16px 28px 0;
          background: linear-gradient(180deg, rgba(40,48,68,0.92) 0%, rgba(28,35,54,0.6) 100%);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 5;
          border-bottom: 1px solid rgba(255,255,255,0.08);
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
        /* Progress bar */
        .progress {
          position: relative; padding: 6px 0 8px;
          display: flex; align-items: center; gap: 12px;
          opacity: 0; max-height: 0; overflow: hidden;
          transition: opacity .25s ease, max-height .25s ease;
        }
        .progress.is-visible { opacity: 1; max-height: 50px; }
        .progress__bar {
          flex: 1; height: 6px; border-radius: 999px;
          background: rgba(255,255,255,0.06); overflow: hidden;
          position: relative;
        }
        .progress__bar-fill {
          height: 100%; width: 0%;
          background: linear-gradient(90deg, #60a5fa, #c084fc, #f472b6);
          border-radius: 999px;
          transition: width .15s ease;
          box-shadow: 0 0 12px rgba(96,165,250,0.4);
        }
        .progress.is-done .progress__bar-fill {
          background: linear-gradient(90deg, #4ade80, #22c55e);
          box-shadow: 0 0 12px rgba(74,222,128,0.4);
        }
        .progress__pct {
          font-variant-numeric: tabular-nums; font-weight: 700; font-size: 0.82rem;
          color: #e2e8f0; min-width: 42px; text-align: right;
        }
        .progress__meta {
          font-size: 0.72rem; color: #94a3b8; font-weight: 500;
          font-variant-numeric: tabular-nums; white-space: nowrap;
        }
        main { padding: 20px 28px; display: grid; gap: 16px; grid-template-columns: repeat(12, 1fr); align-items: start; }
        .card {
          background: linear-gradient(160deg, rgba(48,58,82,0.65) 0%, rgba(34,42,62,0.65) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 18px; overflow: hidden;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06);
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

        /* ── HEALTH BAR ── */
        .health-bar {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        @media (max-width: 1100px) { .health-bar { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .health-bar { grid-template-columns: 1fr; } }
        .health {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 18px;
          background: linear-gradient(160deg, rgba(30,38,54,0.7), rgba(20,26,40,0.7));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          position: relative;
          overflow: hidden;
        }
        .health::before {
          content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
        }
        .health--good::before { background: #4ade80; }
        .health--info::before { background: #60a5fa; }
        .health--warn::before { background: #fbbf24; }
        .health--bad::before  { background: #ef4444; }
        .health--muted::before{ background: #475569; }
        .health__icon {
          font-size: 1.6rem; flex-shrink: 0;
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
        }
        .health--good .health__icon { background: rgba(74,222,128,0.12); }
        .health--info .health__icon { background: rgba(96,165,250,0.12); }
        .health--warn .health__icon { background: rgba(251,191,36,0.12); }
        .health--bad  .health__icon { background: rgba(239,68,68,0.12); animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
        .health__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
        .health__label {
          font-size: 0.66rem; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;
        }
        .health__value {
          font-size: 1.05rem; font-weight: 700; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .health--good .health__value { color: #4ade80; }
        .health--warn .health__value { color: #fcd34d; }
        .health--bad  .health__value { color: #fca5a5; }
        .health--info .health__value { color: #93c5fd; }
        .health__sub {
          font-size: 0.7rem; color: #64748b;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* ── CRITICAL ── */
        .critical-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 10px;
        }
        .critical {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.2);
          border-left: 3px solid #ef4444;
          border-radius: 12px;
        }
        .critical--warn { background: rgba(251,191,36,0.06); border-color: rgba(251,191,36,0.25); border-left-color: #fbbf24; }
        .critical--info { background: rgba(96,165,250,0.06); border-color: rgba(96,165,250,0.25); border-left-color: #60a5fa; }
        .critical__icon { font-size: 1.2rem; }
        .critical__title { font-weight: 700; font-size: 0.88rem; color: #fff; margin-bottom: 3px; }
        .critical__text { font-size: 0.78rem; color: #cbd5e1; opacity: 0.9; }

        .critical-ok {
          display: flex; align-items: center; gap: 18px;
          padding: 18px 22px;
          background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.02));
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 14px;
        }
        .critical-ok__icon {
          font-size: 1.8rem; color: #4ade80;
          width: 48px; height: 48px;
          border-radius: 50%;
          background: rgba(74,222,128,0.15);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .critical-ok__title { font-weight: 700; color: #4ade80; font-size: 0.98rem; }
        .critical-ok__sub { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }

        /* ── AI Summary ── */
        .ai-line {
          padding: 10px 14px;
          background: linear-gradient(135deg, rgba(96,165,250,0.06), rgba(167,139,250,0.04));
          border: 1px solid rgba(96,165,250,0.12);
          border-radius: 10px;
          font-size: 0.86rem;
          line-height: 1.5;
          margin-bottom: 8px;
          color: #cbd5e1;
        }
        .ai-line b { color: #fff; font-weight: 700; }
        .ai-line:last-child { margin-bottom: 0; }

        /* ── SCORE CARDS ── */
        .score-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 1100px) { .score-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .score-grid { grid-template-columns: 1fr; } }
        .score {
          background: linear-gradient(160deg, rgba(30,38,54,0.7), rgba(20,26,40,0.7));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex; flex-direction: column; gap: 8px;
          min-height: 130px;
        }
        .score--good { border-color: rgba(74,222,128,0.25); }
        .score--warn { border-color: rgba(251,191,36,0.25); }
        .score--bad  { border-color: rgba(239,68,68,0.3); }
        .score__head { display: flex; align-items: center; gap: 8px; }
        .score__icon { font-size: 1.1rem; }
        .score__label {
          font-size: 0.7rem; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;
        }
        .score__big {
          font-size: 2rem; font-weight: 800; color: #fff;
          line-height: 1; letter-spacing: -1px;
          font-variant-numeric: tabular-nums;
        }
        .score__big small { font-size: 0.7rem; opacity: 0.6; font-weight: 600; }
        .score--good .score__big { color: #4ade80; }
        .score--warn .score__big { color: #fcd34d; }
        .score--bad  .score__big { color: #fca5a5; }
        .score__status { font-size: 0.78rem; color: #94a3b8; font-weight: 600; margin-top: auto; }
        .score__bar { height: 5px; border-radius: 999px; background: rgba(255,255,255,0.06); overflow: hidden; }
        .score__bar-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #60a5fa, #c084fc);
          transition: width .4s ease;
        }
        .score--good .score__bar-fill { background: linear-gradient(90deg, #4ade80, #22c55e); }
        .score--warn .score__bar-fill { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
        .score--bad  .score__bar-fill { background: linear-gradient(90deg, #ef4444, #dc2626); }

        /* ── DETAILS (collapsible) ── */
        .details-block summary {
          list-style: none;
          cursor: pointer;
          padding: 4px 0;
          user-select: none;
        }
        .details-block summary::-webkit-details-marker { display: none; }
        .details-block summary::before {
          content: "▸";
          display: inline-block;
          color: #64748b;
          margin-right: 8px;
          transition: transform .2s;
          font-size: 0.8rem;
        }
        .details-block[open] summary::before { transform: rotate(90deg); }
        .details-block summary h3 {
          color: #e2e8f0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        /* === Status badges (per severity) === */
        .status-badge {
          display: inline-block; padding: 3px 10px; border-radius: 10px;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.2px;
          border: 1px solid transparent;
        }
        .status-good { background: rgba(52,211,153,0.15); color: #6ee7b7; border-color: rgba(52,211,153,0.35);}
        .status-info { background: rgba(96,165,250,0.15); color: #93c5fd; border-color: rgba(96,165,250,0.35);}
        .status-warn { background: rgba(251,191,36,0.15); color: #fde68a; border-color: rgba(251,191,36,0.35);}
        .status-bad  { background: rgba(248,113,113,0.15); color: #fecaca; border-color: rgba(248,113,113,0.35);}
        .status-muted{ background: rgba(148,163,184,0.13); color: #cbd5e1; border-color: rgba(148,163,184,0.25);}

        /* === Entity card (used in Automations / Devices / Rooms tabs) === */
        .entity-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-left: 4px solid #64748b;
          border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;
        }
        .entity-card--good  { border-left-color: #34d399; }
        .entity-card--info  { border-left-color: #60a5fa; }
        .entity-card--warn  { border-left-color: #fbbf24; }
        .entity-card--bad   { border-left-color: #f87171; background: rgba(248,113,113,0.04); }
        .entity-card--muted { border-left-color: #94a3b8; opacity: 0.75; }
        .entity-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px;}
        .entity-info { flex: 1; min-width: 0; }
        .entity-name { font-weight: 700; font-size: 1rem; color: #fff; }
        .entity-id { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; font-family: ui-monospace,monospace;}
        .entity-score { font-size: 2rem; font-weight: 800; line-height: 1; flex-shrink: 0;}
        .entity-stats {
          display: flex; gap: 16px; padding: 8px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-wrap: wrap;
        }
        .entity-stat { display: flex; flex-direction: column; gap: 2px; }
        .entity-stat .v { font-size: 0.95rem; font-weight: 700; color: #e2e8f0; }
        .entity-stat .l { font-size: 0.66rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px;}

        /* === User card (People tab) === */
        .user-card--good  { border-left: 4px solid #34d399; }
        .user-card--info  { border-left: 4px solid #60a5fa; }
        .user-card--muted { border-left: 4px solid #94a3b8; opacity: 0.85; }
        .user-card .user-stats { gap: 18px; }
        .user-card .user-stat .v { font-size: 1.05rem; }
        .user-card .ai-block { margin-top: 6px; margin-bottom: 12px;}

        /* === AI line (used everywhere) === */
        .ai-line {
          font-size: 0.85rem; line-height: 1.45; color: #cbd5e1;
          padding: 4px 0;
        }
        .ai-block .ai-line { padding: 2px 0; }

        /* === Severity summary (Anomalies tab) === */
        .severity-summary {
          display: flex; gap: 10px; flex-wrap: wrap;
          padding: 0; margin: 0;
          grid-column: span 12;
        }
        .sev-pill {
          padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 0.85rem;
          border: 1px solid transparent;
        }
        .sev-pill--bad  { background: rgba(248,113,113,0.15); color: #fecaca; border-color: rgba(248,113,113,0.35);}
        .sev-pill--warn { background: rgba(251,191,36,0.15); color: #fde68a; border-color: rgba(251,191,36,0.35);}
        .sev-pill--info { background: rgba(96,165,250,0.15); color: #93c5fd; border-color: rgba(96,165,250,0.35);}
        .sev-pill--good { background: rgba(52,211,153,0.15); color: #6ee7b7; border-color: rgba(52,211,153,0.35);}

        /* Severity blocks */
        .sev-block { padding: 18px; }
        .sev-block--bad  { border-top: 3px solid #f87171; }
        .sev-block--warn { border-top: 3px solid #fbbf24; }
        .sev-block--info { border-top: 3px solid #60a5fa; }
        .sev-block--good { border-top: 3px solid #34d399; }

        .anom-item {
          padding: 10px 14px; border-radius: 10px; margin-bottom: 6px;
          background: rgba(255,255,255,0.02); border-left: 3px solid #64748b;
        }
        .anom-item--bad  { border-left-color: #f87171; background: rgba(248,113,113,0.06);}
        .anom-item--warn { border-left-color: #fbbf24; background: rgba(251,191,36,0.05);}
        .anom-item--info { border-left-color: #60a5fa; background: rgba(96,165,250,0.05);}
        .anom-item--good { border-left-color: #34d399; background: rgba(52,211,153,0.06);}
        .anom-item__title { font-weight: 700; font-size: 0.9rem; color: #fff; margin-bottom: 3px;}
        .anom-item__text  { font-size: 0.82rem; color: #cbd5e1; line-height: 1.4;}
        .anom-item__sub   { font-size: 0.72rem; color: #94a3b8; margin-top: 4px; font-style: italic;}

      </style>
      <header>
        <div class="top">
          <h1>${t.title}</h1>
          <button id="refresh" class="refresh-btn" title="Refresh">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
          <select id="days">
            <option value="1" selected>${t.p_24h}</option>
            <option value="7">${t.p_7d}</option>
            <option value="14">${t.p_14d}</option>
            <option value="30">${t.p_30d}</option>
            <option value="90">${t.p_90d}</option>
            <option value="365">${t.p_year}</option>
          </select>
        </div>
        <div id="progress" class="progress">
          <div class="progress__bar"><div class="progress__bar-fill"></div></div>
          <div class="progress__pct">0%</div>
          <div class="progress__meta">—</div>
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
      this._days = parseInt(e.target.value, 10);
      this._clearCache();
      this._data = null;
      this._fetch();
    });
    this.shadowRoot.getElementById("refresh").addEventListener("click", () => {
      this._clearCache();
      this._fetch();
    });
    this.shadowRoot.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        this._tab = btn.dataset.tab;
        this.shadowRoot.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === btn));
        // Lazy-load the heavy tab-specific endpoints if missing
        if (this._tabNeedsExtraFetch()) {
          this._fetch();
        } else {
          this._renderBody();
        }
      });
    });
  }

  _tabNeedsExtraFetch() {
    const d = this._data || {};
    if (this._tab === "anomalies" && !d.anomalies) return true;
    if (this._tab === "auto" && (!d.anomalies || !d.topAuto)) return true;
    if (this._tab === "people" && (!d.usersProfile || !d.topUser)) return true;
    if (this._tab === "devices" && (!d.byDomain || !d.topService)) return true;
    return false;
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

  // ===== OVERVIEW (behavioral analytics) =====
  _renderOverview(root) {
    const t = this._t;
    const { compare, summary, series, sources, insights, anomalies, rooms, topEntity, topAuto, topUser, recent, health } = this._data;
    const cur = compare?.current || {};
    const prv = compare?.previous || {};
    // Prefer /health data on Overview (since /anomalies is lazy-loaded for the Anomalies tab).
    // /health returns top 3 of each anomaly type via anomaly_top, and full counts via anomaly_counts.
    const h = health || {};
    const top = h.anomaly_top || {};
    const counts = h.anomaly_counts || {};
    const a = anomalies || {
      rapid_toggle: top.rapid || [],
      duplicate_automations: top.duplicates || [],
      user_cancelled: top.cancelled || [],
      manual_after_auto: [],
      dead_automations: [],
      night_activity: [],
    };

    // ── Compute derived signals ──
    const now = Math.floor(Date.now() / 1000);
    const lastTs = recent && recent.length ? recent[0].ts : 0;
    const minsSinceLast = lastTs ? Math.floor((now - lastTs) / 60) : null;
    let houseState, houseSev;
    if (minsSinceLast == null) { houseState = "—"; houseSev = "muted"; }
    else if (minsSinceLast < 5) { houseState = "АКТИВЕН"; houseSev = "good"; }
    else if (minsSinceLast < 60) { houseState = "ТИХО"; houseSev = "info"; }
    else { houseState = "СПИТ"; houseSev = "muted"; }

    // Counts: prefer /health full counts (real numbers, not just top-3 truncated lists)
    const anomCount = anomalies
      ? ((a.rapid_toggle?.length || 0) + (a.user_cancelled?.length || 0) +
         (a.duplicate_automations?.length || 0) + (a.dead_automations?.length || 0) +
         (a.manual_after_auto?.length || 0))
      : ((counts.critical || 0) + (counts.warning || 0));
    let autoState, autoSev;
    if (anomCount === 0) { autoState = "СТАБИЛЬНО"; autoSev = "good"; }
    else if (anomCount <= 5) { autoState = "ВНИМАНИЕ"; autoSev = "warn"; }
    else { autoState = "НЕСТАБИЛЬНО"; autoSev = "bad"; }

    const total = cur.total || 0;
    const prvTotal = prv.total || 0;
    let actState = "—", actSev = "muted";
    if (prvTotal > 0) {
      const r = total / prvTotal;
      if (r > 1.3) { actState = "ВЫШЕ среднего"; actSev = "warn"; }
      else if (r < 0.7) { actState = "НИЖЕ"; actSev = "info"; }
      else { actState = "НОРМА"; actSev = "good"; }
    } else if (total > 0) { actState = "НОРМА"; actSev = "good"; }

    const peopleCount = cur.unique_users || 0;
    const presenceState = peopleCount > 0 ? `${peopleCount} активн.` : "никого";
    const presenceSev = peopleCount > 0 ? "good" : "muted";

    // Last manual action
    const userEvents = (recent || []).filter(e => e.trigger_type === "user");
    const lastManual = userEvents[0];

    // ── Behavioral Scores ──
    const autoRatio = total > 0 ? Math.round((cur.n_auto || 0) / total * 100) : 0;
    let autoHealth;
    if (autoRatio === 0) autoHealth = 30;
    else if (autoRatio >= 50 && autoRatio <= 85) autoHealth = 95;
    else if (autoRatio < 50) autoHealth = 40 + autoRatio;
    else autoHealth = 100 - (autoRatio - 85) * 2;
    autoHealth -= (a.rapid_toggle?.length || 0) * 3;
    autoHealth -= (a.duplicate_automations?.length || 0) * 5;
    autoHealth -= (a.user_cancelled?.length || 0) * 2;
    autoHealth -= (a.manual_after_auto?.length || 0) * 1;
    autoHealth = Math.max(0, Math.min(100, Math.round(autoHealth)));

    const devCount = Math.max(1, cur.unique_entities || 1);
    let devStability = 100;
    devStability -= (a.rapid_toggle?.length || 0) / devCount * 200;
    devStability -= (a.dead_automations?.length || 0) * 2;
    devStability = Math.max(0, Math.min(100, Math.round(devStability)));

    const activityScore = actState;

    // ── Render ──
    root.innerHTML = `
      ${this._healthBar([
        { icon: "🏠", label: "Дом", value: houseState, sev: houseSev, sub: minsSinceLast != null ? `последнее: ${this._humanTime(minsSinceLast)}` : "" },
        { icon: "🤖", label: "Автоматизации", value: autoState, sev: autoSev, sub: anomCount > 0 ? `${anomCount} проблем` : "без отклонений" },
        { icon: "⚠", label: "Аномалии", value: String(anomCount), sev: anomCount > 0 ? (anomCount > 5 ? "bad" : "warn") : "good", sub: anomCount > 0 ? "см. вкладку «Аномалии»" : "всё чисто" },
        { icon: "📈", label: "Активность", value: actState, sev: actSev, sub: prvTotal > 0 ? `${total} vs ${prvTotal}` : `${total} событий` },
        { icon: "👥", label: "Присутствие", value: presenceState, sev: presenceSev, sub: lastManual ? `последнее: ${lastManual.friendly_name || lastManual.entity_id}` : "" },
      ])}

      ${this._criticalBlock(a)}

      <div class="card col-12">
        <h3>🧠 AI Summary <span class="sub">за последние ${this._humanDays(this._days)}</span></h3>
        ${this._aiSummary(cur, prv, a, recent, insights, topEntity, rooms)}
      </div>

      <div class="col-12 score-grid">
        ${this._scoreCard("Automation Health", autoHealth, this._scoreLabel(autoHealth), "🤖", autoSev)}
        ${this._scoreCard("Device Stability", devStability, this._scoreLabel(devStability), "📡", devStability < 70 ? "warn" : "good")}
        ${this._scoreCard("House Activity", null, activityScore, "📊", actSev)}
        ${this._scoreCard("Automation %", autoRatio + "%", autoRatio >= 50 && autoRatio <= 85 ? "Здоровая" : (autoRatio > 85 ? "Очень высокая" : "Мало"), "⚙", autoSev)}
      </div>

      <div class="card col-8">
        <h3>${t.activity_dynamics} <span class="sub">${this._humanDays(this._days)} ${prvTotal > 0 ? `· vs предыдущий период (${prvTotal})` : ""}</span></h3>
        ${this._areaChart(series)}
      </div>
      <div class="card col-4">
        <h3>${t.sources}</h3>
        ${this._donut(sources)}
        ${this._gauge(autoRatio)}
      </div>

      <details class="card col-12 details-block" open>
        <summary><h3 style="display:inline-block;margin:0">📋 Подробности и инсайты</h3></summary>
        <div style="margin-top:14px">${this._renderInsights(insights)}</div>
      </details>

      <details class="card col-12 details-block">
        <summary><h3 style="display:inline-block;margin:0">🔥 Тепловая карта · час × день</h3></summary>
        <div style="margin-top:14px">
          ${this._heatmapChips()}
          ${this._heatmap(this._data.heatmap)}
        </div>
      </details>

      <details class="card col-6 details-block">
        <summary><h3 style="display:inline-block;margin:0">🏠 Топ комнат</h3></summary>
        <div style="margin-top:14px">${this._roomsList(rooms || [])}</div>
      </details>
      <details class="card col-6 details-block">
        <summary><h3 style="display:inline-block;margin:0">💡 Топ устройств</h3></summary>
        <div style="margin-top:14px">${this._barList(topEntity, "device")}</div>
      </details>

      <details class="card col-12 details-block">
        <summary><h3 style="display:inline-block;margin:0">📜 Последние события (raw)</h3></summary>
        <div style="margin-top:14px">${this._eventsTable((recent||[]).slice(0,50))}</div>
      </details>
    `;
    this._wireSort();
  }

  _healthBar(items) {
    const cards = items.map(it => `
      <div class="health health--${it.sev}">
        <div class="health__icon">${it.icon}</div>
        <div class="health__body">
          <div class="health__label">${it.label}</div>
          <div class="health__value">${it.value}</div>
          ${it.sub ? `<div class="health__sub">${it.sub}</div>` : ""}
        </div>
      </div>`).join("");
    return `<div class="col-12 health-bar">${cards}</div>`;
  }

  _criticalBlock(a) {
    const crit = [];
    (a.rapid_toggle || []).slice(0, 5).forEach(r => crit.push({
      sev: "warn", icon: "⚡", title: "Флапинг устройства",
      text: `${r.friendly_name || r.entity_id || "—"} · ${r.n || 0}× за ${r.minutes || "?"} мин`
    }));
    (a.duplicate_automations || []).slice(0, 3).forEach(d => crit.push({
      sev: "warn", icon: "🔀", title: "Дубль автоматизации",
      text: `${d.auto1 || ""} ↔ ${d.auto2 || ""}${d.entity ? " · " + d.entity : ""}`
    }));
    (a.user_cancelled || []).slice(0, 3).forEach(c => crit.push({
      sev: "bad", icon: "⊘", title: "Автоматизация отменила пользователя",
      text: `${c.user_name || c.user_id || "user"} → ${c.entity_id || ""} · отменила ${c.auto_name || c.auto || "?"}`
    }));
    (a.dead_automations || []).slice(0, 3).forEach(d => crit.push({
      sev: "info", icon: "💤", title: "Мёртвая автоматизация",
      text: `${d.friendly_name || d.entity_id} · ${d.days_ago || "7+"} дн без срабатывания`
    }));
    (a.manual_after_auto || []).slice(0, 3).forEach(m => crit.push({
      sev: "warn", icon: "✋", title: "Ручное действие после автоматизации",
      text: `${m.user_name || "user"} переделал за ${m.sec || "?"}с после ${m.auto_name || m.auto || ""}`
    }));

    if (crit.length === 0) {
      return `<div class="col-12 critical-ok">
        <div class="critical-ok__icon">✓</div>
        <div>
          <div class="critical-ok__title">Критичных проблем нет</div>
          <div class="critical-ok__sub">Дом работает в штатном режиме</div>
        </div>
      </div>`;
    }
    return `<div class="col-12 critical-grid">
      ${crit.map(c => `<div class="critical critical--${c.sev}">
        <div class="critical__icon">${c.icon}</div>
        <div>
          <div class="critical__title">${this._esc(c.title)}</div>
          <div class="critical__text">${this._esc(c.text)}</div>
        </div>
      </div>`).join("")}
    </div>`;
  }

  _aiSummary(cur, prv, a, recent, insights, topEntity, rooms) {
    const parts = [];
    const total = cur.total || 0;
    const prvTotal = prv.total || 0;
    const autoRatio = total > 0 ? Math.round((cur.n_auto || 0) / total * 100) : 0;

    if (total === 0) {
      return `<div class="ai-line">Данных пока нет. Подожди несколько событий в HA — анализ появится автоматически.</div>`;
    }

    // 1) overall
    if (prvTotal > 0) {
      const diff = total - prvTotal;
      const pct = Math.round(diff / prvTotal * 100);
      const verb = diff > 0 ? "выросла" : (diff < 0 ? "снизилась" : "не изменилась");
      parts.push(`За период обработано <b>${total}</b> событий (активность ${verb} на <b>${Math.abs(pct)}%</b> относительно предыдущего такого же интервала).`);
    } else {
      parts.push(`За период обработано <b>${total}</b> событий.`);
    }

    // 2) automation balance
    if (autoRatio >= 50 && autoRatio <= 85) {
      parts.push(`Уровень автоматизации <b>${autoRatio}%</b> — здоровый баланс: дом работает сам, но оставляет контроль.`);
    } else if (autoRatio > 85) {
      parts.push(`Уровень автоматизации <b>${autoRatio}%</b> — почти всё автономно. Стоит проверить, не зацикливаются ли сценарии.`);
    } else if (autoRatio > 0) {
      parts.push(`Только <b>${autoRatio}%</b> действий автоматизированы — большинство делается вручную, есть простор для роста.`);
    }

    // 3) top room
    const topRoom = (rooms || [])[0];
    if (topRoom) parts.push(`Самая активная комната — <b>${this._esc(topRoom.area_name || topRoom.area_id)}</b> (${topRoom.n} событий).`);

    // 4) peak hour
    const peakIns = (insights || []).find(i => i.type === "peak_hour");
    if (peakIns) parts.push(`Пик активности — в <b>${peakIns.params.hour}:00</b> (${peakIns.params.n} событий).`);

    // 5) anomalies
    const anomCount =
      (a.rapid_toggle?.length || 0) + (a.duplicate_automations?.length || 0) +
      (a.user_cancelled?.length || 0) + (a.manual_after_auto?.length || 0);
    if (anomCount === 0) {
      parts.push(`Аномалий не обнаружено — поведение устройств стабильное.`);
    } else {
      const details = [];
      if (a.rapid_toggle?.length) details.push(`${a.rapid_toggle.length} флапающих устройств`);
      if (a.duplicate_automations?.length) details.push(`${a.duplicate_automations.length} дублей автоматизаций`);
      if (a.user_cancelled?.length) details.push(`${a.user_cancelled.length} отменённых действий`);
      if (a.manual_after_auto?.length) details.push(`${a.manual_after_auto.length} ручных правок после авто`);
      parts.push(`Замечено: <b>${details.join(", ")}</b>. Подробности на вкладке «Аномалии».`);
    }

    return parts.map(p => `<div class="ai-line">${p}</div>`).join("");
  }

  _scoreCard(label, value, status, icon, sev) {
    const isPct = typeof value === "number";
    const big = isPct ? `${value}<small>/100</small>` : (value != null ? value : status);
    return `<div class="score score--${sev || 'info'}">
      <div class="score__head">
        <span class="score__icon">${icon}</span>
        <span class="score__label">${label}</span>
      </div>
      <div class="score__big">${big}</div>
      <div class="score__status">${this._esc(status || "")}</div>
      ${isPct ? `<div class="score__bar"><div class="score__bar-fill" style="width:${value}%"></div></div>` : ""}
    </div>`;
  }

  _scoreLabel(v) {
    if (v >= 90) return "Отлично";
    if (v >= 70) return "Хорошо";
    if (v >= 50) return "Норма";
    if (v >= 30) return "Слабо";
    return "Плохо";
  }

  _humanTime(mins) {
    if (mins < 1) return "только что";
    if (mins < 60) return `${mins} мин назад`;
    const h = Math.floor(mins / 60);
    if (h < 24) return `${h} ч назад`;
    return `${Math.floor(h / 24)} дн назад`;
  }
  _humanDays(d) {
    if (d <= 1) return "24 часа";
    if (d === 7) return "7 дней";
    if (d === 14) return "14 дней";
    if (d === 30) return "30 дней";
    if (d === 90) return "90 дней";
    if (d === 365) return "год";
    return `${d} дн`;
  }
  _esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ===== PEOPLE — behavioral patterns ===========================
  _renderPeople(root) {
    const t = this._t;
    const profiles = this._data.usersProfile || [];
    const recent = this._data.recent || [];
    const summary = this._data.summary || {};

    if (!profiles.length) {
      root.innerHTML = `<div class="card col-12 empty">${t.no_data_long}</div>`;
      return;
    }

    // Build per-user enrichments from `recent`
    const profilesEnriched = profiles.map((p) => {
      const userEvents = recent.filter(r => (r.user_id === p.user_id) || (p.user_id == null && r.user_name === p.user_name));
      const manualEvents = userEvents.filter(r => r.trigger_type === "user");
      const overrodeAuto = recent.filter(r =>
        r.trigger_type === "user" &&
        (r.user_id === p.user_id || r.user_name === p.user_name)
      ).length;
      const totalUserEvents = manualEvents.length;
      // Derive sleep/wake heuristic: earliest morning user event hour, latest evening
      let earliest = null, latest = null;
      for (const e of manualEvents) {
        const hour = new Date(e.ts * 1000).getHours();
        if (hour >= 4 && hour <= 12 && (earliest == null || hour < earliest)) earliest = hour;
        if (hour >= 18 || hour <= 3) {
          const adj = hour < 4 ? hour + 24 : hour;
          if (latest == null || adj > latest) latest = adj;
        }
      }
      // Behavioral score: consistency (# unique hours) + activity level
      const uniqueHours = new Set(manualEvents.map(e => new Date(e.ts*1000).getHours())).size;
      let bScore = Math.min(100, Math.round(uniqueHours * 8 + Math.min(40, totalUserEvents)));
      const verdict = bScore >= 70 ? "Активный" : (bScore >= 40 ? "Умеренный" : "Тихий");
      const sev = bScore >= 70 ? "good" : (bScore >= 40 ? "info" : "muted");
      // AI insight
      const insights = [];
      if (p.peak_hour != null) {
        const period = p.peak_hour < 12 ? "утром" : (p.peak_hour < 18 ? "днём" : "вечером");
        insights.push(`Пик активности — ${period} (${p.peak_hour}:00, ${p.peak_n}× за период)`);
      }
      if ((p.top_entities||[]).length > 0) {
        const topEnt = p.top_entities[0];
        insights.push(`Чаще всего управляет: <b>${topEnt.friendly_name || topEnt.entity_id}</b>`);
      }
      if ((p.top_areas||[]).length > 0) {
        insights.push(`Любимая комната — <b>${p.top_areas[0].area_name || p.top_areas[0].area_id}</b>`);
      }
      return { ...p, bScore, verdict, sev, earliest, latest, insights, totalUserEvents };
    });

    // Comparison summary at top
    const totalManual = summary.n_user || 0;
    root.innerHTML = `
      ${this._tile(2, totalManual, null, "ручных действий", "👆")}
      ${this._tile(1, profilesEnriched.length, null, "активных юзеров", "👥")}
      ${this._tile(0, (profilesEnriched.sort((a,b) => b.bScore - a.bScore)[0]?.user_name) || "—", null, "самый активный", "🏆")}

      <div class="card col-12">
        <h3>👥 Профили пользователей <span class="sub">поведенческая аналитика</span></h3>
        ${profilesEnriched.map(p => this._userProfileCard(p)).join("")}
      </div>

      <details class="card col-12 details-block">
        <summary><h3 style="display:inline-block;margin:0">📜 Только ручные действия</h3></summary>
        <div style="margin-top:14px">${this._eventsTable(recent.filter(r => r.trigger_type === "user").slice(0,100))}</div>
      </details>
    `;
    this._wireSort();
  }

  _userProfileCard(p) {
    const t = this._t;
    const name = p.user_name || p.user_id || "—";
    const initials = (name.match(/\b\w/g) || ["?"]).slice(0, 2).join("").toUpperCase();
    const ents = (p.top_entities || []).slice(0, 6);
    const areas = (p.top_areas || []).slice(0, 4);
    const maxE = Math.max(1, ...ents.map(e => e.n));
    const wakeStr = p.earliest != null ? `${String(p.earliest).padStart(2,"0")}:00` : "—";
    const sleepStr = p.latest != null ? `${String(p.latest % 24).padStart(2,"0")}:00` : "—";

    return `<div class="user-card user-card--${p.sev}">
      <div class="user-head">
        <div class="user-avatar">${initials}</div>
        <div class="user-info">
          <div class="user-name-big">${name}</div>
          <div class="user-meta"><span class="status-badge status-${p.sev}">${p.verdict}</span> · score ${p.bScore}/100</div>
        </div>
        <div class="user-score" style="font-size:1.6rem;font-weight:800;color:${p.sev==="good"?"#34d399":p.sev==="info"?"#60a5fa":"#94a3b8"}">${p.bScore}</div>
      </div>

      <div class="user-stats">
        <div class="user-stat"><div class="v">${p.n}</div><div class="l">всего</div></div>
        <div class="user-stat"><div class="v">${p.totalUserEvents}</div><div class="l">ручных</div></div>
        <div class="user-stat"><div class="v">${wakeStr}</div><div class="l">первое утром</div></div>
        <div class="user-stat"><div class="v">${sleepStr}</div><div class="l">последнее вечером</div></div>
        <div class="user-stat"><div class="v">${ents.length}</div><div class="l">устройств</div></div>
      </div>

      ${p.insights.length ? `<div class="ai-block">${p.insights.map(i => `<div class="ai-line">💡 ${i}</div>`).join("")}</div>` : ""}

      ${ents.length ? `
      <div class="user-section-title">ТОП УСТРОЙСТВ</div>
      <div class="bars" style="margin-bottom:12px;">
        ${ents.map((e,i) => {
          const c = CHART[i % CHART.length];
          return `<div class="bar"><div class="fill" style="width:${(e.n/maxE)*100}%;background:linear-gradient(90deg,${c},${c}aa);--bar-glow:${c}88;"></div><div class="lbl"><div class="l"><div class="name-main">${e.friendly_name || e.entity_id}</div><div class="n2">${e.area_name || e.entity_id}</div></div><span class="v">${e.n}</span></div></div>`;
        }).join("")}
      </div>` : ""}

      ${areas.length ? `
      <div class="user-section-title">КОМНАТЫ</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${areas.map(a => `<span class="status-badge status-info">${a.area_name || a.area_id}<b style="margin-left:6px">${a.n}</b></span>`).join("")}
      </div>` : ""}
    </div>`;
  }

  // ===== AUTOMATIONS — efficiency analytics =====================
  _renderAuto(root) {
    const t = this._t;
    const topAuto = this._data.topAuto || [];
    const recent = this._data.recent || [];
    const a = this._data.anomalies || {};
    const summary = this._data.summary || {};

    if (!topAuto.length) {
      root.innerHTML = `<div class="card col-12 empty">${t.no_data_long}</div>`;
      return;
    }

    // Index anomalies for fast lookup
    const inDuplicates = new Set();
    (a.duplicate_automations || []).forEach(d => {
      if (d.auto1) inDuplicates.add(d.auto1);
      if (d.auto2) inDuplicates.add(d.auto2);
    });
    const inDead = new Set((a.dead_automations || []).map(d => d.entity_id));
    const inLowImpact = new Set((a.low_impact_automations || []).map(l => l.entity_id));
    const cancelledBy = {};
    (a.user_cancelled || []).forEach(c => {
      const k = c.auto_eid;
      if (k) cancelledBy[k] = (cancelledBy[k] || 0) + 1;
    });
    const overriddenBy = {};
    (a.manual_after_auto || []).forEach(m => {
      const k = m.auto_eid;
      if (k) overriddenBy[k] = (overriddenBy[k] || 0) + 1;
    });

    // Score each automation
    const scored = topAuto.map(au => {
      const eid = au.key;
      const runs = au.n;
      const cancels = cancelledBy[eid] || 0;
      const overrides = overriddenBy[eid] || 0;
      const isDup = inDuplicates.has(eid);
      const isDead = inDead.has(eid);
      const isLow = inLowImpact.has(eid);

      let score = 100;
      score -= Math.round(cancels / Math.max(1, runs) * 100 * 0.6);
      score -= Math.round(overrides / Math.max(1, runs) * 100 * 0.4);
      if (isDup) score -= 25;
      if (isLow) score -= 15;
      if (isDead) score -= 50;
      score = Math.max(0, Math.min(100, score));

      let verdict, sev;
      if (isDead) { verdict = "Мёртвая"; sev = "muted"; }
      else if (score >= 80) { verdict = "Стабильная"; sev = "good"; }
      else if (score >= 60) { verdict = "Рабочая"; sev = "info"; }
      else if (score >= 30) { verdict = "Нестабильная"; sev = "warn"; }
      else { verdict = "Проблемная"; sev = "bad"; }

      const tags = [];
      if (isDup) tags.push({ sev: "warn", label: "дубль" });
      if (isLow) tags.push({ sev: "info", label: "низкая польза" });
      if (cancels > 0) tags.push({ sev: "warn", label: `отменена ${cancels}×` });
      if (overrides > 0) tags.push({ sev: "warn", label: `переделана ${overrides}×` });
      if (isDead) tags.push({ sev: "muted", label: "не работает" });

      return { ...au, eid, runs, cancels, overrides, isDup, isDead, isLow, score, verdict, sev, tags };
    });

    // Aggregate stats
    const stableCount = scored.filter(s => s.score >= 80).length;
    const problemCount = scored.filter(s => s.score < 30).length;
    const totalRuns = scored.reduce((s, x) => s + x.runs, 0);

    root.innerHTML = `
      ${this._tile(3, summary.n_auto || 0, null, "запусков", "🤖")}
      ${this._tile(0, scored.length, null, "автоматизаций", "⚙️")}
      ${this._tile(2, stableCount, null, "стабильных", "✅")}
      ${this._tile(5, problemCount, null, "проблемных", "🔴")}

      <div class="card col-12">
        <h3>🤖 Эффективность автоматизаций <span class="sub">${scored.length} автоматизаций · ${totalRuns} запусков</span></h3>
        ${scored.map(s => this._automationCard(s)).join("")}
      </div>

      <details class="card col-12 details-block">
        <summary><h3 style="display:inline-block;margin:0">📜 Только события автоматизаций</h3></summary>
        <div style="margin-top:14px">${this._eventsTable(recent.filter(r => ["automation","script"].includes(r.trigger_type)).slice(0,100))}</div>
      </details>
    `;
    this._wireSort();
  }

  _automationCard(s) {
    const name = s.friendly_name || s.automation_name || s.eid;
    const insight = s.isDead
      ? "Не срабатывала уже неделю — кандидат на удаление или починку триггера."
      : s.isDup
      ? "Конфликтует с другой автоматизацией — управляют одним устройством одновременно."
      : s.isLow
      ? "Управляет всего одним устройством одним сервисом — можно объединить с другой."
      : s.cancels > 0
      ? `Пользователь ${s.cancels}× отменял её действия — возможно условие срабатывает не вовремя.`
      : s.overrides > 0
      ? `Пользователь ${s.overrides}× переделывал результат — проверь яркость/время/режим.`
      : s.score >= 80
      ? "Работает стабильно, без конфликтов с пользователем."
      : "Работает, но с небольшими шероховатостями.";

    const scoreColor = s.sev === "good" ? "#34d399"
      : s.sev === "info" ? "#60a5fa"
      : s.sev === "warn" ? "#fbbf24"
      : s.sev === "bad" ? "#f87171"
      : "#94a3b8";

    return `<div class="entity-card entity-card--${s.sev}">
      <div class="entity-head">
        <div class="entity-info">
          <div class="entity-name">${name}</div>
          <div class="entity-id">${s.eid}</div>
        </div>
        <div class="entity-score" style="color:${scoreColor}">${s.score}<span style="font-size:0.6em;opacity:.6">/100</span></div>
      </div>
      <div class="entity-stats">
        <div class="entity-stat"><div class="v">${s.runs}</div><div class="l">запусков</div></div>
        <div class="entity-stat"><div class="v">${s.cancels}</div><div class="l">отменено</div></div>
        <div class="entity-stat"><div class="v">${s.overrides}</div><div class="l">переделано</div></div>
        <div class="entity-stat"><span class="status-badge status-${s.sev}">${s.verdict}</span></div>
      </div>
      ${s.tags.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">${s.tags.map(t => `<span class="status-badge status-${t.sev}">${t.label}</span>`).join("")}</div>` : ""}
      <div class="ai-line" style="margin-top:10px">💡 ${insight}</div>
    </div>`;
  }

  // ===== DEVICES — stability analytics ==========================
  _renderDevices(root) {
    const t = this._t;
    const topEntity = this._data.topEntity || [];
    const recent = this._data.recent || [];
    const a = this._data.anomalies || this._data.health?.anomaly_top || {};
    const byDomain = this._data.byDomain || [];
    const topService = this._data.topService || [];

    if (!topEntity.length) {
      root.innerHTML = `<div class="card col-12 empty">${t.no_data_long}</div>`;
      return;
    }

    const inRapid = {};
    (a.rapid_toggle || a.rapid || []).forEach(r => {
      inRapid[r.entity_id] = r.n || 0;
    });
    const inNight = new Set();
    (a.night_activity || []).forEach(n => inNight.add(n.entity_id));

    // Per-entity manual/auto split + last seen
    const now = Math.floor(Date.now() / 1000);
    const lastByEntity = {};
    const splitByEntity = {};
    recent.forEach(r => {
      if (!lastByEntity[r.entity_id] || lastByEntity[r.entity_id] < r.ts) lastByEntity[r.entity_id] = r.ts;
      const sp = splitByEntity[r.entity_id] = splitByEntity[r.entity_id] || { user: 0, auto: 0 };
      if (r.trigger_type === "user") sp.user++;
      else if (["automation","script"].includes(r.trigger_type)) sp.auto++;
    });

    const scored = topEntity.map(e => {
      const eid = e.key;
      const rapid = inRapid[eid] || 0;
      const night = inNight.has(eid);
      const lastTs = lastByEntity[eid] || 0;
      const lastMins = lastTs ? Math.floor((now - lastTs) / 60) : null;
      const split = splitByEntity[eid] || { user: 0, auto: 0 };
      const userPct = e.n > 0 ? Math.round(split.user / e.n * 100) : 0;

      let score = 100;
      if (rapid > 0) score -= 50;
      if (night) score -= 20;
      score = Math.max(0, Math.min(100, score));

      let verdict, sev;
      if (rapid > 0) { verdict = "Спам/Флапинг"; sev = "bad"; }
      else if (night) { verdict = "Ночная активность"; sev = "warn"; }
      else if (lastMins != null && lastMins > 60 * 24) { verdict = "Не использовался"; sev = "muted"; }
      else if (score >= 80) { verdict = "Стабилен"; sev = "good"; }
      else { verdict = "Нормально"; sev = "info"; }

      return { ...e, eid, rapid, night, lastMins, split, userPct, score, verdict, sev };
    });

    const stable = scored.filter(s => s.score >= 80 && s.sev !== "muted").length;
    const issues = scored.filter(s => s.score < 60).length;

    root.innerHTML = `
      ${this._tile(0, scored.length, null, "устройств", "💡")}
      ${this._tile(2, stable, null, "стабильных", "✅")}
      ${this._tile(5, issues, null, "с проблемами", "⚠️")}
      ${this._tile(1, byDomain.length, null, "типов устройств", "📦")}

      <div class="card col-12">
        <h3>💡 Состояние устройств <span class="sub">${scored.length} активных</span></h3>
        ${scored.map(s => this._deviceCard(s)).join("")}
      </div>

      <div class="card col-6">
        <h3>📦 По типам</h3>
        ${this._barList(byDomain, "domain")}
      </div>
      <div class="card col-6">
        <h3>⚡ Топ действий</h3>
        ${this._barList((topService||[]).map(s => ({...s, key: this._label_service(s.key)})), "plain")}
      </div>
    `;
  }

  _deviceCard(s) {
    const name = s.friendly_name || s.eid;
    const lastSeen = s.lastMins == null ? "—"
      : s.lastMins < 1 ? "только что"
      : s.lastMins < 60 ? `${s.lastMins} мин назад`
      : s.lastMins < 60 * 24 ? `${Math.round(s.lastMins/60)} ч назад`
      : `${Math.round(s.lastMins/60/24)} дн назад`;

    const insight = s.rapid > 0
      ? `⚡ Переключался ${s.rapid} раз за короткое время — возможен флапинг или цикл автоматизации.`
      : s.night
      ? `🌙 Активен ночью — проверь не забыто ли включенным или нет ли ложного срабатывания.`
      : s.userPct > 70
      ? `👆 ${s.userPct}% действий — ручные. Можно автоматизировать.`
      : s.userPct < 10
      ? `🤖 ${100-s.userPct}% действий — автоматические. Хорошо настроен.`
      : `Сбалансированное использование (${s.userPct}% ручных).`;

    const scoreColor = s.sev === "good" ? "#34d399"
      : s.sev === "info" ? "#60a5fa"
      : s.sev === "warn" ? "#fbbf24"
      : s.sev === "bad" ? "#f87171"
      : "#94a3b8";

    return `<div class="entity-card entity-card--${s.sev}">
      <div class="entity-head">
        <div class="entity-info">
          <div class="entity-name">${name}</div>
          <div class="entity-id">${s.eid}${s.area_name ? " · " + s.area_name : ""}</div>
        </div>
        <div class="entity-score" style="color:${scoreColor}">${s.score}<span style="font-size:0.6em;opacity:.6">/100</span></div>
      </div>
      <div class="entity-stats">
        <div class="entity-stat"><div class="v">${s.n}</div><div class="l">событий</div></div>
        <div class="entity-stat"><div class="v">${s.split.user}/${s.split.auto}</div><div class="l">user/auto</div></div>
        <div class="entity-stat"><div class="v">${lastSeen}</div><div class="l">последнее</div></div>
        <div class="entity-stat"><span class="status-badge status-${s.sev}">${s.verdict}</span></div>
      </div>
      <div class="ai-line" style="margin-top:10px">${insight}</div>
    </div>`;
  }

  // ===== ROOMS — living entities =================================
  _renderRooms(root) {
    const t = this._t;
    const rooms = this._data.rooms || [];
    const a = this._data.anomalies || this._data.health?.anomaly_top || {};

    if (!rooms.length) {
      root.innerHTML = `<div class="card col-12 empty">${t.no_data_long}</div>`;
      return;
    }

    // Anomalies per room (rapid_toggle has area_name field)
    const anomByRoom = {};
    (a.rapid_toggle || a.rapid || []).forEach(r => {
      if (r.area_name) {
        anomByRoom[r.area_name] = anomByRoom[r.area_name] || [];
        anomByRoom[r.area_name].push({ type: "rapid", entity: r.friendly_name || r.entity_id });
      }
    });
    (a.night_activity || []).forEach(n => {
      if (n.area_name) {
        anomByRoom[n.area_name] = anomByRoom[n.area_name] || [];
        anomByRoom[n.area_name].push({ type: "night", entity: n.friendly_name || n.entity_id });
      }
    });

    // Score each room
    const scored = rooms.map(r => {
      const ratio = r.n > 0 ? Math.round((r.n_auto || 0) / r.n * 100) : 0;
      const anomalies = anomByRoom[r.area_name] || [];
      let verdict, sev;
      if (anomalies.length > 0) { verdict = `${anomalies.length} аномалий`; sev = "warn"; }
      else if (ratio >= 80) { verdict = "Полностью авто"; sev = "good"; }
      else if (ratio >= 50) { verdict = "Сбалансированная"; sev = "info"; }
      else if (ratio > 20) { verdict = "Больше ручного"; sev = "info"; }
      else { verdict = "Только ручное"; sev = "muted"; }
      return { ...r, ratio, anomalies, verdict, sev };
    });

    const totalRooms = scored.length;
    const totalAuto = scored.filter(s => s.ratio >= 80).length;
    const totalManual = scored.filter(s => s.ratio < 30).length;
    const withAnomalies = scored.filter(s => s.anomalies.length > 0).length;

    root.innerHTML = `
      ${this._tile(0, totalRooms, null, "комнат", "🏠")}
      ${this._tile(2, totalAuto, null, "автоматизированных", "🤖")}
      ${this._tile(1, totalManual, null, "ручных", "👆")}
      ${this._tile(5, withAnomalies, null, "с аномалиями", "⚠️")}

      <div class="card col-12">
        <h3>🏠 Активность по комнатам <span class="sub">${totalRooms} комнат</span></h3>
        ${scored.map(r => this._roomCard(r)).join("")}
      </div>
    `;
  }

  _roomCard(r) {
    const insight = r.anomalies.length > 0
      ? `⚠️ В комнате ${r.anomalies.length} аномалий: ${r.anomalies.slice(0,3).map(a => a.entity).join(", ")}.`
      : r.ratio >= 80
      ? "🤖 Полностью автоматизированная комната — почти не требует ручного вмешательства."
      : r.ratio >= 50
      ? "⚖️ Сбалансированная: автоматизация и ручное управление работают вместе."
      : r.ratio > 20
      ? "👆 В основном управляется руками — посмотри что можно автоматизировать."
      : "🛠 Полностью ручное управление — кандидат на автоматизацию.";

    const scoreColor = r.sev === "good" ? "#34d399"
      : r.sev === "info" ? "#60a5fa"
      : r.sev === "warn" ? "#fbbf24"
      : "#94a3b8";

    return `<div class="entity-card entity-card--${r.sev}">
      <div class="entity-head">
        <div class="entity-info">
          <div class="entity-name">🏠 ${r.area_name}</div>
          <div class="entity-id">${(r.top_entities||[]).length} устройств активно</div>
        </div>
        <div class="entity-score" style="color:${scoreColor}">${r.ratio}<span style="font-size:0.6em;opacity:.6">% auto</span></div>
      </div>
      <div class="entity-stats">
        <div class="entity-stat"><div class="v">${r.n}</div><div class="l">событий</div></div>
        <div class="entity-stat"><div class="v">${r.n_auto || 0}</div><div class="l">авто</div></div>
        <div class="entity-stat"><div class="v">${r.n_user || 0}</div><div class="l">ручных</div></div>
        <div class="entity-stat"><span class="status-badge status-${r.sev}">${r.verdict}</span></div>
      </div>
      ${(r.top_entities||[]).length ? `
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">
        ${r.top_entities.map(e => `<span class="status-badge status-info">${e.friendly_name || e.entity_id}<b style="margin-left:6px">${e.n}</b></span>`).join("")}
      </div>` : ""}
      <div class="ai-line" style="margin-top:10px">${insight}</div>
    </div>`;
  }

  // ===== ANOMALIES — diagnostic center by severity ===============
  _renderAnomalies(root) {
    const t = this._t;
    const a = this._data.anomalies || {};
    const empty = !a.rapid_toggle?.length && !a.user_cancelled?.length
      && !a.duplicate_automations?.length && !a.night_activity?.length
      && !a.dead_automations?.length && !a.low_impact_automations?.length
      && !a.manual_after_auto?.length && !a.routine_candidates?.length;
    if (empty) {
      root.innerHTML = `<div class="card col-12">
        <div class="critical-ok" style="margin:0">
          <div class="critical-ok__icon">✓</div>
          <div>
            <div class="critical-ok__title">Аномалий не обнаружено</div>
            <div class="critical-ok__sub">Дом работает в штатном режиме — никаких подозрительных паттернов</div>
          </div>
        </div>
      </div>`;
      return;
    }

    const counts = {
      critical: (a.rapid_toggle?.length||0) + (a.duplicate_automations?.length||0),
      warning: (a.user_cancelled?.length||0) + (a.manual_after_auto?.length||0) + (a.night_activity?.length||0),
      info: (a.dead_automations?.length||0) + (a.low_impact_automations?.length||0),
      suggestion: a.routine_candidates?.length || 0,
    };

    root.innerHTML = `
      <div class="severity-summary col-12">
        <div class="sev-pill sev-pill--bad">🔴 ${counts.critical} критично</div>
        <div class="sev-pill sev-pill--warn">🟡 ${counts.warning} предупреждения</div>
        <div class="sev-pill sev-pill--info">🔵 ${counts.info} информация</div>
        <div class="sev-pill sev-pill--good">💡 ${counts.suggestion} предложений</div>
      </div>

      ${counts.critical > 0 ? `<div class="card col-12 sev-block sev-block--bad">
        <h3>🔴 Критичные проблемы <span class="sub">требуют внимания</span></h3>
        ${(a.rapid_toggle||[]).map(r => this._anomItem("bad", "⚡ Флапинг устройства",
          `${r.friendly_name||r.entity_id} переключилось ${r.n}× за ${Math.round((r.last_ts-r.first_ts)/60)||"?"} мин`,
          r.area_name)).join("")}
        ${(a.duplicate_automations||[]).map(d => this._anomItem("bad", "🔀 Дубль автоматизации",
          `${d.auto1_name||d.auto1} и ${d.auto2_name||d.auto2} управляют одним устройством одновременно`,
          d.friendly_name||d.entity_id)).join("")}
      </div>` : ""}

      ${counts.warning > 0 ? `<div class="card col-12 sev-block sev-block--warn">
        <h3>🟡 Предупреждения <span class="sub">конфликты и аномалии</span></h3>
        ${(a.user_cancelled||[]).map(c => this._anomItem("warn", "⊘ Автоматизация отменила пользователя",
          `${c.user_name||"user"} → ${c.friendly_name||c.entity_id}, отменено через ${c.auto_ts-c.user_ts}с`,
          c.auto_name||c.auto_eid)).join("")}
        ${(a.manual_after_auto||[]).map(m => this._anomItem("warn", "✋ Ручное действие после авто",
          `${m.user_name||"user"} переделал результат за ${m.user_ts-m.auto_ts}с`,
          (m.auto_name||m.auto_eid)+" → "+(m.friendly_name||m.entity_id))).join("")}
        ${(a.night_activity||[]).map(n => this._anomItem("warn", "🌙 Ночная активность",
          `${n.friendly_name||n.entity_id} — ${n.n} событий между 00:00 и 06:00`,
          n.area_name)).join("")}
      </div>` : ""}

      ${counts.info > 0 ? `<div class="card col-12 sev-block sev-block--info">
        <h3>🔵 Информация <span class="sub">кандидаты на ревизию</span></h3>
        ${(a.dead_automations||[]).map(d => this._anomItem("info", "💤 Мёртвая автоматизация",
          `${d.automation_name||d.entity_id} не срабатывала ${Math.round((Date.now()/1000 - (d.last_seen||0))/86400)} дн.`,
          "удалить или починить триггер")).join("")}
        ${(a.low_impact_automations||[]).map(l => this._anomItem("info", "📉 Малоэффективная",
          `${l.automation_name||l.entity_id} запускается ${l.n_runs}× — управляет 1 устройством, 1 сервис`,
          "объединить с соседними автоматизациями")).join("")}
      </div>` : ""}

      ${counts.suggestion > 0 ? `<div class="card col-12 sev-block sev-block--good">
        <h3>💡 Кандидаты на новые автоматизации <span class="sub">повторяющиеся ручные паттерны</span></h3>
        ${(a.routine_candidates||[]).map(r => this._anomItem("good", `★ ${r.friendly_name||r.entity_id}`,
          `${r.user_name||"user"} делает «${this._label_service(r.service)}» в ${r.hour}:00 — ${r.n}× за период`,
          "автоматизировать триггером по времени")).join("")}
      </div>` : ""}
    `;
  }

  _anomItem(sev, title, text, sub) {
    return `<div class="anom-item anom-item--${sev}">
      <div class="anom-item__title">${title}</div>
      <div class="anom-item__text">${this._esc(text)}</div>
      ${sub ? `<div class="anom-item__sub">${this._esc(sub)}</div>` : ""}
    </div>`;
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
