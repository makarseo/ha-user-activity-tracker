/**
 * Lovelace card: User Activity Tracker
 * Usage in Lovelace:
 *   type: custom:user-activity-card
 *   days: 7      # optional, default 7
 *   limit: 10    # optional, default 10
 */

class UserActivityCard extends HTMLElement {
  setConfig(config) {
    this._config = Object.assign({ days: 7, limit: 10 }, config || {});
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
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
    const stats = this._stats || {};
    const list = this._breakdown || [];
    const err = this._error;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        ha-card { padding: 16px; }
        h2 { margin: 0 0 12px 0; font-size: 1.1rem; font-weight: 500; }
        .row { display:flex; gap:12px; margin-bottom:12px; flex-wrap:wrap;}
        .stat { flex:1; min-width:80px; background: var(--secondary-background-color); padding: 10px; border-radius: 8px; text-align:center;}
        .stat .n { font-size: 1.5rem; font-weight: 600; color: var(--primary-text-color); }
        .stat .l { font-size: 0.8rem; color: var(--secondary-text-color); margin-top:4px;}
        table { width:100%; border-collapse: collapse; }
        td { padding: 6px 4px; border-bottom: 1px solid var(--divider-color); font-size: 0.9rem;}
        td.n { text-align:right; font-variant-numeric: tabular-nums; color: var(--primary-color); font-weight: 500; }
        .err { color: var(--error-color); padding: 8px; }
      </style>
      <ha-card>
        <h2>User Activity — last ${this._config.days}d</h2>
        ${err ? `<div class="err">${err}</div>` : ""}
        <div class="row">
          <div class="stat"><div class="n">${stats.today ?? "—"}</div><div class="l">today</div></div>
          <div class="stat"><div class="n">${stats.week ?? "—"}</div><div class="l">7d</div></div>
          <div class="stat"><div class="n">${stats.month ?? "—"}</div><div class="l">30d</div></div>
        </div>
        <table>
          ${list
            .map(
              (r) =>
                `<tr><td>${r.key}</td><td class="n">${r.n}</td></tr>`
            )
            .join("")}
        </table>
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
