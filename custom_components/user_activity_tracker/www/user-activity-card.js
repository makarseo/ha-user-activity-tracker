/**
 * Lovelace card: User Activity Tracker
 * v0.1.2 — vibrant palette + i18n (en/uk/ru)
 */

const I18N = {
  en: {
    title: "User Activity", today: "today", d7: "7d", d30: "30d",
    no_data: "No data yet — keep using HA.",
    last_d: "last", days: "d",
  },
  ru: {
    title: "Активность пользователей", today: "сегодня", d7: "7д", d30: "30д",
    no_data: "Пока нет данных — потыкай в HA.",
    last_d: "за", days: "д",
  },
  uk: {
    title: "Активність користувачів", today: "сьогодні", d7: "7д", d30: "30д",
    no_data: "Поки немає даних — потицяй у HA.",
    last_d: "за", days: "д",
  },
};

const PALETTE = [
  "#fda4af", "#fcd34d", "#86efac", "#7dd3fc", "#c4b5fd",
  "#f9a8d4", "#5eead4", "#fdba74", "#67e8f9", "#d8b4fe",
];

class UserActivityCard extends HTMLElement {
  setConfig(config) {
    this._config = Object.assign({ days: 7, limit: 10 }, config || {});
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    const lang = (hass.language || "en").slice(0, 2);
    this._t = I18N[lang] || I18N.en;
    if (!this._initialized) {
      this._initialized = true;
      this._fetch();
      this._timer = setInterval(() => this._fetch(), 30_000);
    }
  }

  disconnectedCallback() {
    if (this._timer) clearInterval(this._timer);
  }

  async _fetch() {
    if (!this._hass) return;
    try {
      const [stats, breakdown] = await Promise.all([
        this._hass.callApi("GET", "user_activity_tracker/stats"),
        this._hass.callApi(
          "GET",
          `user_activity_tracker/breakdown?by=entity_id&days=${this._config.days}&limit=${this._config.limit}`
        ),
      ]);
      this._stats = stats;
      this._breakdown = breakdown;
      this._render();
    } catch (e) {
      this._error = e.message || String(e);
      this._render();
    }
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const t = this._t || I18N.en;
    const stats = this._stats || {};
    const list = this._breakdown || [];
    const err = this._error;
    const max = Math.max(1, ...list.map((r) => r.n));

    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        ha-card { padding: 16px; overflow: hidden;}
        h2 { margin: 0 0 14px 0; font-size: 1.05rem; font-weight: 600; background: linear-gradient(135deg,#818cf8,#c4b5fd,#f472b6); -webkit-background-clip:text; background-clip:text; color:transparent;}
        .row { display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap;}
        .stat { flex:1; min-width:80px; padding: 12px 10px; border-radius: 10px; text-align:center; box-shadow: 0 1px 3px rgba(15,23,42,.06);}
        .stat.s1 { background: linear-gradient(135deg,#fecaca,#fda4af); color:#7f1d1d;}
        .stat.s2 { background: linear-gradient(135deg,#bae6fd,#7dd3fc); color:#0c4a6e;}
        .stat.s3 { background: linear-gradient(135deg,#ddd6fe,#c4b5fd); color:#4c1d95;}
        .stat .n { font-size: 1.5rem; font-weight: 700; line-height: 1.1;}
        .stat .l { font-size: 0.72rem; margin-top:4px; opacity:.85; text-transform: uppercase; letter-spacing: 0.5px;}
        .bars { display:flex; flex-direction:column; gap: 5px;}
        .bar { position:relative; height: 22px; background: var(--secondary-background-color); border-radius: 5px; overflow:hidden;}
        .bar > .fill { position:absolute; left:0; top:0; bottom:0; opacity:.55; border-radius: 5px;}
        .bar > .lbl { position:relative; z-index:1; padding: 2px 8px; display:flex; justify-content:space-between; line-height: 18px; font-size: 0.82rem; color: var(--primary-text-color); font-weight: 500;}
        .err { color: #fa5252; padding: 8px;}
        .empty { color: var(--secondary-text-color); padding: 8px 0; font-style: italic; font-size:.85rem;}
      </style>
      <ha-card>
        <h2>⚡ ${t.title} — ${t.last_d} ${this._config.days}${t.days}</h2>
        ${err ? `<div class="err">${err}</div>` : ""}
        <div class="row">
          <div class="stat s1"><div class="n">${stats.today ?? "—"}</div><div class="l">${t.today}</div></div>
          <div class="stat s2"><div class="n">${stats.week ?? "—"}</div><div class="l">${t.d7}</div></div>
          <div class="stat s3"><div class="n">${stats.month ?? "—"}</div><div class="l">${t.d30}</div></div>
        </div>
        ${
          list.length
            ? `<div class="bars">${list
                .map((r, i) => {
                  const c = PALETTE[i % PALETTE.length];
                  return `<div class="bar"><div class="fill" style="width:${(r.n / max) * 100}%;background:${c};"></div><div class="lbl"><span>${r.key}</span><span>${r.n}</span></div></div>`;
                })
                .join("")}</div>`
            : `<div class="empty">${t.no_data}</div>`
        }
      </ha-card>
    `;
  }

  getCardSize() {
    return 4;
  }

  static getStubConfig() {
    return { days: 7, limit: 10 };
  }
}

customElements.define("user-activity-card", UserActivityCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "user-activity-card",
  name: "User Activity Card",
  description: "Top entities, daily/weekly counts of user-initiated actions.",
});
