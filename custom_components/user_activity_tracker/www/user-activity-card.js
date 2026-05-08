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

const PALETTE = ["#ff6b6b", "#fab005", "#40c057", "#4dabf7", "#9775fa", "#f06595", "#20c997", "#fd7e14", "#15aabf", "#e64980"];

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
        h2 { margin: 0 0 14px 0; font-size: 1.1rem; font-weight: 600; background: linear-gradient(135deg,#4dabf7,#9775fa,#f06595); -webkit-background-clip:text; background-clip:text; color:transparent;}
        .row { display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap;}
        .stat { flex:1; min-width:80px; padding: 12px 10px; border-radius: 10px; text-align:center; color:#fff; box-shadow: 0 2px 6px rgba(0,0,0,.1);}
        .stat.s1 { background: linear-gradient(135deg,#ff6b6b,#fa5252);}
        .stat.s2 { background: linear-gradient(135deg,#4dabf7,#1c7ed6);}
        .stat.s3 { background: linear-gradient(135deg,#9775fa,#7048e8);}
        .stat .n { font-size: 1.5rem; font-weight: 700; line-height: 1.1;}
        .stat .l { font-size: 0.72rem; margin-top:4px; opacity:.95; text-transform: uppercase; letter-spacing: 0.5px;}
        .bars { display:flex; flex-direction:column; gap: 5px;}
        .bar { position:relative; height: 22px; background: var(--secondary-background-color); border-radius: 5px; overflow:hidden;}
        .bar > .fill { position:absolute; left:0; top:0; bottom:0; opacity:.85; border-radius: 5px;}
        .bar > .lbl { position:relative; z-index:1; padding: 2px 8px; display:flex; justify-content:space-between; line-height: 18px; font-size: 0.82rem; color:#fff; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,.35);}
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
