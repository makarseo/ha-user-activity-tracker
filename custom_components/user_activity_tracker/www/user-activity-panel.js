/**
 * Custom panel: User Activity Tracker
 * v0.1.2 — vibrant palette + i18n (en/uk/ru)
 */

const I18N = {
  en: {
    title: "User Activity Tracker",
    p_24h: "last 24h", p_7d: "last 7 days", p_14d: "last 14 days",
    p_30d: "last 30 days", p_90d: "last 90 days", p_year: "last year",
    today: "events today", week: "last 7 days", month: "last 30 days",
    unique_entities: "unique entities", unique_users: "unique users",
    avg_day: "avg / day",
    activity_over_time: "Activity over time",
    by_domain: "By domain",
    heatmap_title: "When you actually use HA — hour × weekday",
    top_entities: "Top entities", top_users: "Top users",
    top_services: "Top services", most_recent: "Most recent",
    recent_events: "Recent events (last 200)",
    th_time: "Time", th_user: "User", th_entity: "Entity",
    th_service: "Service", th_source: "Source",
    by_user: "by", at_time: "at",
    no_data_short: "No data yet.",
    no_data_long: "No data yet — keep using HA, refresh in a minute.",
    no_data_heatmap: "No data yet — needs more events to build the heatmap.",
    no_events: "No events recorded yet.",
    loading: "Loading…", error: "Error:",
    dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  ru: {
    title: "Трекер активности пользователей",
    p_24h: "за 24ч", p_7d: "за 7 дней", p_14d: "за 14 дней",
    p_30d: "за 30 дней", p_90d: "за 90 дней", p_year: "за год",
    today: "событий сегодня", week: "за 7 дней", month: "за 30 дней",
    unique_entities: "уникальных entities", unique_users: "уникальных юзеров",
    avg_day: "среднее / день",
    activity_over_time: "Активность во времени",
    by_domain: "По доменам",
    heatmap_title: "Когда ты реально пользуешься HA — час × день недели",
    top_entities: "Топ entities", top_users: "Топ пользователей",
    top_services: "Топ сервисов", most_recent: "Последнее",
    recent_events: "Последние события (200)",
    th_time: "Время", th_user: "Юзер", th_entity: "Entity",
    th_service: "Сервис", th_source: "Источник",
    by_user: "от", at_time: "в",
    no_data_short: "Пока нет данных.",
    no_data_long: "Данных нет — потыкай в HA и обнови через минуту.",
    no_data_heatmap: "Данных мало — heatmap появится после нескольких событий.",
    no_events: "Событий ещё не записано.",
    loading: "Загрузка…", error: "Ошибка:",
    dow: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  },
  uk: {
    title: "Трекер активності користувачів",
    p_24h: "за 24г", p_7d: "за 7 днів", p_14d: "за 14 днів",
    p_30d: "за 30 днів", p_90d: "за 90 днів", p_year: "за рік",
    today: "подій сьогодні", week: "за 7 днів", month: "за 30 днів",
    unique_entities: "унікальних entities", unique_users: "унікальних юзерів",
    avg_day: "середньо / день",
    activity_over_time: "Активність у часі",
    by_domain: "За доменами",
    heatmap_title: "Коли ти реально користуєшся HA — година × день тижня",
    top_entities: "Топ entities", top_users: "Топ користувачів",
    top_services: "Топ сервісів", most_recent: "Останнє",
    recent_events: "Останні події (200)",
    th_time: "Час", th_user: "Юзер", th_entity: "Entity",
    th_service: "Сервіс", th_source: "Джерело",
    by_user: "від", at_time: "о",
    no_data_short: "Поки немає даних.",
    no_data_long: "Даних немає — потицяй у HA та онови за хвилину.",
    no_data_heatmap: "Даних мало — heatmap з'явиться після кількох подій.",
    no_events: "Подій ще не записано.",
    loading: "Завантаження…", error: "Помилка:",
    dow: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  },
};

// Vibrant palette — works on both light and dark themes
const PALETTE = [
  "#ff6b6b", "#fab005", "#40c057", "#4dabf7", "#9775fa",
  "#f06595", "#20c997", "#fd7e14", "#15aabf", "#e64980",
];
const HEAT = ["transparent", "#c3fae8", "#69db7c", "#fab005", "#fd7e14", "#fa5252"];
const ACCENTS = {
  today: "#ff6b6b",
  week: "#4dabf7",
  month: "#9775fa",
  ent: "#20c997",
  usr: "#fab005",
  avg: "#f06595",
};

class UserActivityPanel extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    this._lang = (hass.language || hass.locale?.language || "en").slice(0, 2);
    if (!I18N[this._lang]) this._lang = "en";
    this._t = I18N[this._lang];
    if (!this._initialized) {
      this._initialized = true;
      this._days = 14;
      this._render();
      this._fetch();
      this._timer = setInterval(() => this._fetch(), 30_000);
    }
  }

  disconnectedCallback() {
    if (this._timer) clearInterval(this._timer);
  }

  async _fetch() {
    if (!this._hass) return;
    const d = this._days;
    try {
      const [stats, summary, byEntity, byUser, byDomain, byService, series, heatmap, recent] =
        await Promise.all([
          this._call("stats"),
          this._call(`summary?days=${d}`),
          this._call(`breakdown?by=entity_id&limit=20&days=${d}`),
          this._call(`breakdown?by=user_id&limit=20&days=${d}`),
          this._call(`breakdown?by=domain&limit=20&days=${d}`),
          this._call(`breakdown?by=service&limit=20&days=${d}`),
          this._call(`series?group=day&days=${d}`),
          this._call(`heatmap?days=${d}`),
          this._call(`events?limit=200`),
        ]);
      this._data = { stats, summary, byEntity, byUser, byDomain, byService, series, heatmap, recent };
      this._error = null;
    } catch (e) {
      this._error = e.message || String(e);
    }
    this._renderBody();
  }

  _call(path) {
    return this._hass.callApi("GET", `user_activity_tracker/${path}`);
  }

  _render() {
    this.attachShadow({ mode: "open" });
    const t = this._t;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; height:100%; background: var(--primary-background-color); color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family); }
        header { display:flex; align-items:center; gap:16px; padding: 16px 24px;
                 background: linear-gradient(135deg, #4dabf7 0%, #9775fa 50%, #f06595 100%);
                 color: #fff; position: sticky; top:0; z-index:5;
                 box-shadow: 0 2px 12px rgba(0,0,0,.15);}
        header h1 { margin:0; font-size: 1.25rem; font-weight: 600; flex:1; letter-spacing: 0.3px;}
        select { padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,.4);
                 background: rgba(255,255,255,.15); color: #fff; font-weight: 500; cursor: pointer;
                 backdrop-filter: blur(4px);}
        select option { color: #222; }
        main { padding: 16px 24px; display: grid; gap: 16px; grid-template-columns: repeat(12, 1fr);}
        .card { background: var(--card-background-color); border-radius: 14px; padding: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,.06); overflow:hidden; min-height: 60px;
                border-top: 3px solid var(--accent, transparent); transition: transform .15s ease;}
        .card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.1);}
        .card h3 { margin: 0 0 12px 0; font-size: 1rem; font-weight: 600; color: var(--primary-text-color); display: flex; align-items: center; gap: 8px;}
        .card h3::before { content:""; width: 4px; height: 16px; background: var(--accent, var(--primary-color)); border-radius: 2px;}
        .col-2 { grid-column: span 2;}
        .col-3 { grid-column: span 3;}
        .col-4 { grid-column: span 4;}
        .col-6 { grid-column: span 6;}
        .col-8 { grid-column: span 8;}
        .col-12 { grid-column: span 12;}
        @media (max-width: 1100px) { .col-2,.col-3 { grid-column: span 6;} .col-4,.col-6,.col-8 { grid-column: span 12;} }
        @media (max-width: 600px) { .col-2,.col-3 { grid-column: span 12;} }
        .big { font-size: 2.2rem; font-weight: 700; line-height: 1.05; color: var(--accent, var(--primary-color));}
        .small { font-size: 1.4rem; font-weight: 700; color: var(--accent, var(--primary-text-color));}
        .label { font-size: 0.78rem; color: var(--secondary-text-color); margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px;}
        table { width:100%; border-collapse: collapse;}
        th, td { text-align:left; padding: 8px; border-bottom: 1px solid var(--divider-color); font-size: 0.88rem;}
        th { font-weight: 600; color: var(--secondary-text-color); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.5px;}
        td.n, th.n { text-align:right; font-variant-numeric: tabular-nums;}
        td.n { font-weight: 600;}
        tr:hover td { background: var(--secondary-background-color);}
        .bars { display:flex; flex-direction:column; gap:6px;}
        .bar { position:relative; height: 24px; background: var(--secondary-background-color); border-radius: 6px; overflow:hidden; font-size: 0.82rem;}
        .bar > .fill { position:absolute; left:0; top:0; bottom:0; opacity: 0.85; border-radius: 6px;}
        .bar > .lbl { position:relative; z-index:1; padding: 3px 10px; display:flex; justify-content:space-between; line-height: 18px; color:#fff; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,.3);}
        .err { color: #fa5252; padding: 8px; font-weight: 500;}
        .ts { color: var(--secondary-text-color); font-size: 0.75rem; white-space: nowrap;}
        .empty { color: var(--secondary-text-color); font-size: 0.85rem; padding: 8px 0; font-style: italic;}
        .heat { display:grid; grid-template-columns: 36px repeat(24, 1fr); grid-auto-rows: 26px; gap: 3px; font-size: 0.7rem;}
        .heat .hh { color: var(--secondary-text-color); display:flex; align-items:center; justify-content:center; font-weight: 600;}
        .heat .cell { border-radius: 4px; display:flex; align-items:center; justify-content:center; color: rgba(0,0,0,.85); font-weight: 600; transition: transform .1s;}
        .heat .cell:hover { transform: scale(1.15); z-index: 2;}
        .pill { display:inline-block; padding: 3px 10px; border-radius: 12px; background: linear-gradient(135deg, #4dabf7, #9775fa); color: #fff; font-size: 0.72rem; font-weight: 600; margin-right: 6px;}
        .recent-entity { font-size: 1.4rem; font-weight: 700; background: linear-gradient(135deg, #ff6b6b, #fab005); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 6px; word-break: break-all;}
      </style>
      <header>
        <h1>⚡ ${t.title}</h1>
        <select id="days">
          <option value="1">${t.p_24h}</option>
          <option value="7">${t.p_7d}</option>
          <option value="14" selected>${t.p_14d}</option>
          <option value="30">${t.p_30d}</option>
          <option value="90">${t.p_90d}</option>
          <option value="365">${t.p_year}</option>
        </select>
      </header>
      <main id="body"></main>
    `;
    this.shadowRoot.getElementById("days").addEventListener("change", (e) => {
      this._days = parseInt(e.target.value, 10);
      this._fetch();
    });
  }

  _renderBody() {
    const root = this.shadowRoot.getElementById("body");
    if (!root) return;
    const t = this._t;
    if (this._error) {
      root.innerHTML = `<div class="card col-12 err">${t.error} ${this._error}</div>`;
      return;
    }
    if (!this._data) {
      root.innerHTML = `<div class="card col-12 empty">${t.loading}</div>`;
      return;
    }
    const { stats, summary, byEntity, byUser, byDomain, byService, series, heatmap, recent } = this._data;
    const avgPerDay = summary && summary.total ? (summary.total / this._days).toFixed(1) : "0";

    root.innerHTML = `
      ${this._statCard("col-2", ACCENTS.today, "big", stats.today ?? 0, t.today)}
      ${this._statCard("col-2", ACCENTS.week, "big", stats.week ?? 0, t.week)}
      ${this._statCard("col-2", ACCENTS.month, "big", stats.month ?? 0, t.month)}
      ${this._statCard("col-2", ACCENTS.ent, "small", summary?.unique_entities ?? 0, t.unique_entities)}
      ${this._statCard("col-2", ACCENTS.usr, "small", summary?.unique_users ?? 0, t.unique_users)}
      ${this._statCard("col-2", ACCENTS.avg, "small", avgPerDay, t.avg_day)}

      <div class="card col-8" style="--accent:${ACCENTS.week}"><h3>${t.activity_over_time}</h3>${this._sparkline(series)}</div>
      <div class="card col-4" style="--accent:${ACCENTS.month}"><h3>${t.by_domain}</h3>${this._barList(byDomain, "key", PALETTE)}</div>

      <div class="card col-12" style="--accent:#fa5252"><h3>${t.heatmap_title}</h3>${this._heatmap(heatmap)}</div>

      <div class="card col-6" style="--accent:${ACCENTS.ent}"><h3>${t.top_entities}</h3>${this._barList(byEntity, "key", PALETTE)}</div>
      <div class="card col-6" style="--accent:${ACCENTS.usr}"><h3>${t.top_users}</h3>${this._barList(this._mapUsers(byUser), "key", PALETTE)}</div>

      <div class="card col-6" style="--accent:${ACCENTS.avg}"><h3>${t.top_services}</h3>${this._barList(byService, "key", PALETTE)}</div>
      <div class="card col-6" style="--accent:${ACCENTS.today}"><h3>${t.most_recent}</h3>${this._mostRecent(recent)}</div>

      <div class="card col-12" style="--accent:#15aabf"><h3>${t.recent_events}</h3>${this._recentTable(recent)}</div>
    `;
  }

  _statCard(col, accent, sizeClass, value, label) {
    return `<div class="card ${col}" style="--accent:${accent}"><div class="${sizeClass}" style="color:${accent}">${value}</div><div class="label">${label}</div></div>`;
  }

  _mapUsers(rows) {
    return (rows || []).map((r) => ({ ...r, key: r.user_name || r.key || "—" }));
  }

  _barList(rows, keyField, palette) {
    if (!rows || !rows.length) return `<div class="empty">${this._t.no_data_long}</div>`;
    const max = Math.max(1, ...rows.map((r) => r.n));
    return `<div class="bars">${rows
      .map((r, i) => {
        const color = palette[i % palette.length];
        return `
          <div class="bar">
            <div class="fill" style="width:${(r.n / max) * 100}%; background:${color};"></div>
            <div class="lbl"><span>${r[keyField] ?? "—"}</span><span>${r.n}</span></div>
          </div>`;
      })
      .join("")}</div>`;
  }

  _mostRecent(recent) {
    const t = this._t;
    if (!recent || !recent.length) return `<div class="empty">${t.no_data_short}</div>`;
    const r = recent[0];
    return `
      <div class="recent-entity">${r.entity_id}</div>
      <div class="label" style="font-size:0.85rem; text-transform:none; letter-spacing:0;">
        <span class="pill">${r.service || r.source}</span>
        ${t.by_user} <b>${r.user_name || r.user_id || "—"}</b> ${t.at_time} ${this._fmtTs(r.ts)}
      </div>
    `;
  }

  _recentTable(rows) {
    const t = this._t;
    if (!rows || !rows.length) return `<div class="empty">${t.no_events}</div>`;
    return `
      <table>
        <thead><tr><th>${t.th_time}</th><th>${t.th_user}</th><th>${t.th_entity}</th><th>${t.th_service}</th><th class="n">${t.th_source}</th></tr></thead>
        <tbody>
          ${rows
            .map(
              (r) => `
            <tr>
              <td class="ts">${this._fmtTs(r.ts)}</td>
              <td>${r.user_name || r.user_id || "—"}</td>
              <td>${r.entity_id}</td>
              <td>${r.service || ""}</td>
              <td class="n">${r.source}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  _fmtTs(ts) {
    return new Date(ts * 1000).toLocaleString(this._lang === "uk" ? "uk-UA" : this._lang === "ru" ? "ru-RU" : "en-US");
  }

  _sparkline(series) {
    if (!series || series.length === 0) return `<div class="empty">${this._t.no_data_short}</div>`;
    const w = 800, h = 220, pad = 28;
    const max = Math.max(1, ...series.map((s) => s.n));
    const stepX = (w - pad * 2) / Math.max(1, series.length);
    const bars = series
      .map((s, i) => {
        const bw = Math.max(8, stepX * 0.7);
        const bh = (s.n / max) * (h - pad * 2 - 14);
        const x = pad + i * stepX + (stepX - bw) / 2;
        const y = h - pad - bh;
        const color = PALETTE[i % PALETTE.length];
        return `
          <g>
            <rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${color}" opacity="0.85" rx="4"/>
            <text x="${x + bw / 2}" y="${y - 5}" text-anchor="middle" font-size="11" font-weight="600" fill="${color}">${s.n}</text>
            <text x="${x + bw / 2}" y="${h - 8}" text-anchor="middle" font-size="10" fill="var(--secondary-text-color)">${this._shortBucket(s.bucket)}</text>
            <title>${s.bucket}: ${s.n}</title>
          </g>
        `;
      })
      .join("");
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:240px;">${bars}</svg>`;
  }

  _shortBucket(b) {
    if (!b) return "";
    if (b.length === 10) return b.slice(5);
    if (b.length === 13) return b.slice(11);
    return b;
  }

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
    let html = `<div class="heat">`;
    html += `<div></div>`;
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

customElements.define("user-activity-panel", UserActivityPanel);
