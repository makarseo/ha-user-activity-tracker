/**
 * Custom panel: User Activity Tracker
 * v0.1.1 — heatmap, service breakdown, fixed top users, summary stats
 */

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; height:100%; background: var(--primary-background-color); color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family); }
        header { display:flex; align-items:center; gap:16px; padding: 16px 24px; background: var(--app-header-background-color, var(--primary-color)); color: var(--app-header-text-color, white); position: sticky; top:0; z-index:5;}
        header h1 { margin:0; font-size: 1.2rem; font-weight: 500; flex:1;}
        select { padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,.3); background: rgba(0,0,0,.15); color: inherit; }
        main { padding: 16px 24px; display: grid; gap: 16px; grid-template-columns: repeat(12, 1fr);}
        .card { background: var(--card-background-color); border-radius: 12px; padding: 16px; box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,.05)); overflow:hidden; min-height: 60px;}
        .card h3 { margin: 0 0 12px 0; font-size: 1rem; font-weight: 500; color: var(--secondary-text-color);}
        .col-2 { grid-column: span 2;}
        .col-3 { grid-column: span 3;}
        .col-4 { grid-column: span 4;}
        .col-6 { grid-column: span 6;}
        .col-8 { grid-column: span 8;}
        .col-12 { grid-column: span 12;}
        @media (max-width: 1100px) { .col-2,.col-3 { grid-column: span 6;} .col-4,.col-6,.col-8 { grid-column: span 12;} }
        @media (max-width: 600px) { .col-2,.col-3 { grid-column: span 12;} }
        .big { font-size: 2rem; font-weight: 600; color: var(--primary-color); line-height: 1.1;}
        .small { font-size: 1.2rem; font-weight: 600; color: var(--primary-text-color);}
        .label { font-size: 0.78rem; color: var(--secondary-text-color); margin-top: 4px;}
        table { width:100%; border-collapse: collapse;}
        th, td { text-align:left; padding: 6px 8px; border-bottom: 1px solid var(--divider-color); font-size: 0.88rem;}
        td.n, th.n { text-align:right; font-variant-numeric: tabular-nums;}
        td.n { color: var(--primary-color); font-weight: 500;}
        .bars { display:flex; flex-direction:column; gap:6px;}
        .bar { position:relative; height: 22px; background: var(--secondary-background-color); border-radius: 4px; overflow:hidden; font-size: 0.8rem; }
        .bar > .fill { position:absolute; left:0; top:0; bottom:0; background: var(--primary-color); opacity: 0.3;}
        .bar > .lbl { position:relative; z-index:1; padding: 2px 8px; display:flex; justify-content:space-between; line-height: 18px;}
        .err { color: var(--error-color); padding: 8px;}
        .ts { color: var(--secondary-text-color); font-size: 0.75rem; white-space: nowrap;}
        .empty { color: var(--secondary-text-color); font-size: 0.85rem; padding: 8px 0;}
        /* heatmap */
        .heat { display:grid; grid-template-columns: 32px repeat(24, 1fr); grid-auto-rows: 22px; gap: 2px; font-size: 0.7rem; }
        .heat .hh { color: var(--secondary-text-color); display:flex; align-items:center; justify-content:center;}
        .heat .cell { background: var(--secondary-background-color); border-radius: 3px; display:flex; align-items:center; justify-content:center; color: rgba(255,255,255,.85); position: relative;}
        .heat .cell.v0 { background: var(--secondary-background-color); }
        .heat .cell.v1 { background: rgba(var(--rgb-primary-color, 33,150,243), .15);}
        .heat .cell.v2 { background: rgba(var(--rgb-primary-color, 33,150,243), .35);}
        .heat .cell.v3 { background: rgba(var(--rgb-primary-color, 33,150,243), .55);}
        .heat .cell.v4 { background: rgba(var(--rgb-primary-color, 33,150,243), .75);}
        .heat .cell.v5 { background: rgba(var(--rgb-primary-color, 33,150,243), .95);}
        .chart { width:100%; height: 220px;}
        .pill { display:inline-block; padding: 2px 8px; border-radius: 10px; background: var(--secondary-background-color); color: var(--secondary-text-color); font-size: 0.75rem; margin-right: 4px;}
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
    const { stats, summary, byEntity, byUser, byDomain, byService, series, heatmap, recent } = this._data;
    const avgPerDay = summary && summary.total ? (summary.total / this._days).toFixed(1) : "0";

    root.innerHTML = `
      <div class="card col-2"><div class="big">${stats.today ?? 0}</div><div class="label">events today</div></div>
      <div class="card col-2"><div class="big">${stats.week ?? 0}</div><div class="label">last 7 days</div></div>
      <div class="card col-2"><div class="big">${stats.month ?? 0}</div><div class="label">last 30 days</div></div>
      <div class="card col-2"><div class="small">${summary?.unique_entities ?? 0}</div><div class="label">unique entities (${this._days}d)</div></div>
      <div class="card col-2"><div class="small">${summary?.unique_users ?? 0}</div><div class="label">unique users (${this._days}d)</div></div>
      <div class="card col-2"><div class="small">${avgPerDay}</div><div class="label">avg / day (${this._days}d)</div></div>

      <div class="card col-8"><h3>Activity over time</h3>${this._sparkline(series)}</div>
      <div class="card col-4"><h3>By domain</h3>${this._barList(byDomain, "key")}</div>

      <div class="card col-12"><h3>When you actually use HA — hour × weekday</h3>${this._heatmap(heatmap)}</div>

      <div class="card col-6"><h3>Top entities</h3>${this._barList(byEntity, "key")}</div>
      <div class="card col-6"><h3>Top users</h3>${this._barList(this._mapUsers(byUser), "key")}</div>

      <div class="card col-6"><h3>Top services</h3>${this._barList(byService, "key")}</div>
      <div class="card col-6"><h3>Most recent</h3>${this._mostRecent(recent)}</div>

      <div class="card col-12"><h3>Recent events (last 200)</h3>${this._recentTable(recent)}</div>
    `;
  }

  _mapUsers(rows) {
    return (rows || []).map((r) => ({ ...r, key: r.user_name || r.key || "—" }));
  }

  _barList(rows, keyField) {
    if (!rows || !rows.length) return `<div class="empty">No data yet — keep using HA, refresh in a minute.</div>`;
    const max = Math.max(1, ...rows.map((r) => r.n));
    return `<div class="bars">${rows
      .map(
        (r) => `
      <div class="bar">
        <div class="fill" style="width:${(r.n / max) * 100}%"></div>
        <div class="lbl"><span>${r[keyField] ?? "—"}</span><span>${r.n}</span></div>
      </div>`
      )
      .join("")}</div>`;
  }

  _mostRecent(recent) {
    if (!recent || !recent.length) return `<div class="empty">No data yet.</div>`;
    const r = recent[0];
    return `
      <div style="font-size: 1.4rem; font-weight: 600; color: var(--primary-color); margin-bottom: 4px;">${r.entity_id}</div>
      <div class="label" style="font-size:0.9rem;">
        <span class="pill">${r.service || r.source}</span>
        by ${r.user_name || r.user_id || "—"} at ${this._fmtTs(r.ts)}
      </div>
    `;
  }

  _recentTable(rows) {
    if (!rows || !rows.length) return `<div class="empty">No events recorded yet.</div>`;
    return `
      <table>
        <thead><tr><th>Time</th><th>User</th><th>Entity</th><th>Service</th><th class="n">Source</th></tr></thead>
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
    return new Date(ts * 1000).toLocaleString();
  }

  _sparkline(series) {
    if (!series || series.length === 0) {
      return `<div class="empty">No data yet.</div>`;
    }
    // pad sparse data to all days in window
    const w = 800, h = 200, pad = 24;
    const max = Math.max(1, ...series.map((s) => s.n));
    const stepX = (w - pad * 2) / Math.max(1, series.length);
    const bars = series
      .map((s, i) => {
        const bw = Math.max(8, stepX * 0.7);
        const bh = (s.n / max) * (h - pad * 2 - 14);
        const x = pad + i * stepX + (stepX - bw) / 2;
        const y = h - pad - bh;
        return `
          <g>
            <rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="var(--primary-color)" opacity="0.7" rx="3"/>
            <text x="${x + bw / 2}" y="${y - 4}" text-anchor="middle" font-size="11" fill="var(--primary-text-color)">${s.n}</text>
            <text x="${x + bw / 2}" y="${h - 6}" text-anchor="middle" font-size="10" fill="var(--secondary-text-color)">${this._shortBucket(s.bucket)}</text>
            <title>${s.bucket}: ${s.n}</title>
          </g>
        `;
      })
      .join("");
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}</svg>`;
  }

  _shortBucket(b) {
    if (!b) return "";
    // YYYY-MM-DD or YYYY-MM-DD HH:00 → MM-DD or HH:00
    if (b.length === 10) return b.slice(5);
    if (b.length === 13) return b.slice(11);
    return b;
  }

  _heatmap(rows) {
    if (!rows || !rows.length) {
      return `<div class="empty">No data yet — needs more events to build the heatmap.</div>`;
    }
    // build dow x hour map
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
    // header row
    html += `<div></div>`;
    for (let h = 0; h < 24; h++) html += `<div class="hh">${h}</div>`;
    // body rows: weekdays Mon..Sun (HA-style — start Mon)
    const order = [1, 2, 3, 4, 5, 6, 0];
    for (const dow of order) {
      html += `<div class="hh">${DOW[dow]}</div>`;
      for (let h = 0; h < 24; h++) {
        const v = (grid[dow] && grid[dow][h]) || 0;
        const cls = `cell v${bucket(v)}`;
        html += `<div class="${cls}" title="${DOW[dow]} ${h}:00 — ${v} events">${v || ""}</div>`;
      }
    }
    html += `</div>`;
    return html;
  }
}

customElements.define("user-activity-panel", UserActivityPanel);
