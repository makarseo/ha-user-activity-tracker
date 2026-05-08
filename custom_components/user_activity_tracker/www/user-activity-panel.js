/**
 * Custom panel: User Activity Tracker
 * Registered via panel_custom in __init__.py.
 */

class UserActivityPanel extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
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
    try {
      const qs = `?days=${this._days}`;
      const [stats, byEntity, byUser, byDomain, series, recent] = await Promise.all([
        this._hass.callApi("GET", "user_activity_tracker/stats"),
        this._hass.callApi("GET", `user_activity_tracker/breakdown?by=entity_id&limit=20&days=${this._days}`),
        this._hass.callApi("GET", `user_activity_tracker/breakdown?by=user_id&limit=20&days=${this._days}`),
        this._hass.callApi("GET", `user_activity_tracker/breakdown?by=domain&limit=20&days=${this._days}`),
        this._hass.callApi("GET", `user_activity_tracker/series?group=day&days=${this._days}`),
        this._hass.callApi("GET", "user_activity_tracker/events?limit=200"),
      ]);
      this._data = { stats, byEntity, byUser, byDomain, series, recent };
      this._error = null;
    } catch (e) {
      this._error = e.message || String(e);
    }
    this._renderBody();
  }

  _render() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; height:100%; background: var(--primary-background-color); color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family); }
        header { display:flex; align-items:center; gap:16px; padding: 16px 24px; background: var(--app-header-background-color, var(--primary-color)); color: var(--app-header-text-color, white); }
        header h1 { margin:0; font-size: 1.2rem; font-weight: 500; flex:1;}
        select { padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,.3); background: rgba(0,0,0,.15); color: inherit; }
        main { padding: 16px 24px; display: grid; gap: 16px; grid-template-columns: repeat(12, 1fr);}
        .card { background: var(--card-background-color); border-radius: 12px; padding: 16px; box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,.05)); overflow:hidden;}
        .card h3 { margin: 0 0 12px 0; font-size: 1rem; font-weight: 500; color: var(--secondary-text-color);}
        .col-3 { grid-column: span 3;}
        .col-4 { grid-column: span 4;}
        .col-6 { grid-column: span 6;}
        .col-8 { grid-column: span 8;}
        .col-12 { grid-column: span 12;}
        @media (max-width: 900px) { .col-3,.col-4,.col-6,.col-8 { grid-column: span 12; } }
        .big { font-size: 2rem; font-weight: 600; color: var(--primary-color); }
        .label { font-size: 0.8rem; color: var(--secondary-text-color); margin-top: 4px;}
        table { width:100%; border-collapse: collapse;}
        th, td { text-align:left; padding: 6px 8px; border-bottom: 1px solid var(--divider-color); font-size: 0.88rem;}
        td.n, th.n { text-align:right; font-variant-numeric: tabular-nums;}
        td.n { color: var(--primary-color); font-weight: 500;}
        .bars { display:flex; flex-direction:column; gap:6px;}
        .bar { position:relative; height: 22px; background: var(--secondary-background-color); border-radius: 4px; overflow:hidden; font-size: 0.8rem; }
        .bar > .fill { position:absolute; left:0; top:0; bottom:0; background: var(--primary-color); opacity: 0.25;}
        .bar > .lbl { position:relative; z-index:1; padding: 2px 8px; display:flex; justify-content:space-between; line-height: 18px;}
        .err { color: var(--error-color); padding: 8px;}
        .chart { width:100%; height: 220px;}
        .ts { color: var(--secondary-text-color); font-size: 0.75rem; white-space: nowrap;}
      </style>
      <header>
        <h1>User Activity Tracker</h1>
        <select id="days">
          <option value="1">last 24h</option>
          <option value="7">last 7d</option>
          <option value="14" selected>last 14d</option>
          <option value="30">last 30d</option>
          <option value="90">last 90d</option>
          <option value="365">last year</option>
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
    if (this._error) {
      root.innerHTML = `<div class="card col-12 err">Error: ${this._error}</div>`;
      return;
    }
    if (!this._data) {
      root.innerHTML = `<div class="card col-12">Loading…</div>`;
      return;
    }
    const { stats, byEntity, byUser, byDomain, series, recent } = this._data;
    const max = (rows) => Math.max(1, ...rows.map((r) => r.n));
    const bars = (rows, keyField) => {
      const m = max(rows);
      return rows
        .map(
          (r) => `
        <div class="bar">
          <div class="fill" style="width:${(r.n / m) * 100}%"></div>
          <div class="lbl"><span>${this._displayKey(r, keyField)}</span><span>${r.n}</span></div>
        </div>`
        )
        .join("");
    };
    const sparkline = this._sparkline(series);

    root.innerHTML = `
      <div class="card col-3"><div class="big">${stats.today}</div><div class="label">events today</div></div>
      <div class="card col-3"><div class="big">${stats.week}</div><div class="label">last 7 days</div></div>
      <div class="card col-3"><div class="big">${stats.month}</div><div class="label">last 30 days</div></div>
      <div class="card col-3"><div class="big">${recent.length ? recent[0].entity_id : "—"}</div><div class="label">most recent</div></div>

      <div class="card col-8"><h3>Activity over time</h3>${sparkline}</div>
      <div class="card col-4"><h3>By domain</h3><div class="bars">${bars(byDomain, "key")}</div></div>

      <div class="card col-6"><h3>Top entities</h3><div class="bars">${bars(byEntity, "key")}</div></div>
      <div class="card col-6"><h3>Top users</h3><div class="bars">${bars(byUser.map(this._mapUser.bind(this)), "key")}</div></div>

      <div class="card col-12"><h3>Recent events (last 200)</h3>
        <table>
          <thead><tr><th>Time</th><th>User</th><th>Entity</th><th>Service</th><th class="n">Source</th></tr></thead>
          <tbody>
            ${recent
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
      </div>
    `;
  }

  _displayKey(r, field) {
    return r[field] ?? "—";
  }

  _mapUser(r) {
    return { ...r, key: r.user_name || r.user_id || "—" };
  }

  _fmtTs(ts) {
    const d = new Date(ts * 1000);
    return d.toLocaleString();
  }

  _sparkline(series) {
    if (!series || series.length === 0) return `<div>No data yet.</div>`;
    const w = 800;
    const h = 200;
    const pad = 24;
    const max = Math.max(1, ...series.map((s) => s.n));
    const stepX = (w - pad * 2) / Math.max(1, series.length - 1);
    const points = series
      .map((s, i) => `${pad + i * stepX},${h - pad - (s.n / max) * (h - pad * 2)}`)
      .join(" ");
    const bars = series
      .map((s, i) => {
        const bw = Math.max(2, stepX - 2);
        const bh = (s.n / max) * (h - pad * 2);
        const x = pad + i * stepX - bw / 2;
        const y = h - pad - bh;
        return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="var(--primary-color)" opacity="0.4"/><title>${s.bucket}: ${s.n}</title>`;
      })
      .join("");
    return `
      <svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        ${bars}
        <polyline fill="none" stroke="var(--primary-color)" stroke-width="2" points="${points}"/>
      </svg>
    `;
  }
}

customElements.define("user-activity-panel", UserActivityPanel);
