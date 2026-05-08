"""REST API endpoints."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import API_BASE
from .storage import ActivityStore


def _now_utc() -> datetime:
    return datetime.now(tz=timezone.utc)


def _since(request: web.Request, default_days: int = 7) -> int:
    raw = request.query.get("days")
    try:
        days = int(raw) if raw else default_days
    except ValueError:
        days = default_days
    days = max(1, min(days, 3650))
    return int((_now_utc() - timedelta(days=days)).timestamp())


def _trigger(request: web.Request) -> str | None:
    val = request.query.get("trigger_type")
    if val in ("user", "automation", "system", "all"):
        return val
    return None


def async_register_views(hass: HomeAssistant, store: ActivityStore) -> None:
    for v in (StatsView, EventsView, BreakdownView, SeriesView, PurgeView,
              SummaryView, HeatmapView, AutomationDetailView,
              CompareView, InsightsView, AnomaliesView, RoomsView, EntityDetailView):
        hass.http.register_view(v(store))


class _BaseView(HomeAssistantView):
    requires_auth = True

    def __init__(self, store: ActivityStore) -> None:
        self.store = store


class StatsView(_BaseView):
    url = f"{API_BASE}/stats"
    name = "api:user_activity_tracker:stats"

    async def get(self, request: web.Request) -> web.Response:
        tt = _trigger(request)
        now = _now_utc()
        start_today = int(now.replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
        start_week = int((now - timedelta(days=7)).timestamp())
        start_month = int((now - timedelta(days=30)).timestamp())
        return self.json({
            "today": await self.store.async_count_since(start_today, trigger_type=tt),
            "week": await self.store.async_count_since(start_week, trigger_type=tt),
            "month": await self.store.async_count_since(start_month, trigger_type=tt),
        })


class CompareView(_BaseView):
    """Current period vs previous (same length)."""
    url = f"{API_BASE}/compare"
    name = "api:user_activity_tracker:compare"

    async def get(self, request: web.Request) -> web.Response:
        try:
            days = int(request.query.get("days", "1"))
        except ValueError:
            days = 1
        days = max(1, min(days, 365))
        tt = _trigger(request)
        now = _now_utc()
        cur_start = int((now - timedelta(days=days)).timestamp())
        cur_end = int(now.timestamp())
        prev_start = int((now - timedelta(days=days * 2)).timestamp())
        prev_end = cur_start
        cur = await self.store.async_summary(cur_start, tt, cur_end)
        prv = await self.store.async_summary(prev_start, tt, prev_end)
        return self.json({"current": cur, "previous": prv, "days": days})


class EventsView(_BaseView):
    url = f"{API_BASE}/events"
    name = "api:user_activity_tracker:events"

    async def get(self, request: web.Request) -> web.Response:
        tt = _trigger(request)
        try:
            limit = int(request.query.get("limit", "100"))
        except ValueError:
            limit = 100
        limit = max(1, min(limit, 1000))
        return self.json(await self.store.async_recent(limit, tt))


class BreakdownView(_BaseView):
    url = f"{API_BASE}/breakdown"
    name = "api:user_activity_tracker:breakdown"

    async def get(self, request: web.Request) -> web.Response:
        field = request.query.get("by", "entity_id")
        since = _since(request)
        tt = _trigger(request)
        try:
            limit = int(request.query.get("limit", "50"))
        except ValueError:
            limit = 50
        limit = max(1, min(limit, 500))
        return self.json(await self.store.async_breakdown(since, field, limit, tt))


class SeriesView(_BaseView):
    url = f"{API_BASE}/series"
    name = "api:user_activity_tracker:series"

    async def get(self, request: web.Request) -> web.Response:
        since = _since(request, default_days=14)
        group = request.query.get("group", "day")
        tt = _trigger(request)
        split = request.query.get("split") == "trigger"
        return self.json(await self.store.async_series(
            since, group_by=group, trigger_type=tt, split_by_trigger=split))


class SummaryView(_BaseView):
    url = f"{API_BASE}/summary"
    name = "api:user_activity_tracker:summary"

    async def get(self, request: web.Request) -> web.Response:
        since = _since(request)
        tt = _trigger(request)
        return self.json(await self.store.async_summary(since, tt))


class HeatmapView(_BaseView):
    url = f"{API_BASE}/heatmap"
    name = "api:user_activity_tracker:heatmap"

    async def get(self, request: web.Request) -> web.Response:
        since = _since(request, default_days=30)
        tt = _trigger(request)
        return self.json(await self.store.async_heatmap(since, tt))


class AutomationDetailView(_BaseView):
    url = f"{API_BASE}/automation"
    name = "api:user_activity_tracker:automation"

    async def get(self, request: web.Request) -> web.Response:
        eid = request.query.get("entity_id")
        if not eid:
            return self.json({"error": "missing entity_id"}, status_code=400)
        since = _since(request, default_days=30)
        rows = await self.store.async_breakdown(since, "entity_id", 50, "automation")
        # Filter to this automation's events
        filtered = [r for r in rows]  # breakdown not filtered by trigger_eid; re-query
        # Use raw recent query instead
        events = await self.store.async_recent(200, "automation")
        events = [e for e in events if e.get("trigger_entity_id") == eid]
        return self.json({"entity_id": eid, "events": events[:50]})


class EntityDetailView(_BaseView):
    """Per-entity drill-down for the detail modal."""
    url = f"{API_BASE}/entity"
    name = "api:user_activity_tracker:entity"

    async def get(self, request: web.Request) -> web.Response:
        eid = request.query.get("entity_id")
        if not eid:
            return self.json({"error": "missing entity_id"}, status_code=400)
        since = _since(request, default_days=30)
        rows = await self.store.async_recent(500)
        events = [e for e in rows if e.get("entity_id") == eid][:50]
        # quick aggs
        n_total = len(events)
        n_user = sum(1 for e in events if e.get("trigger_type") == "user")
        n_auto = sum(1 for e in events if e.get("trigger_type") in ("automation", "script"))
        services = {}
        for e in events:
            s = e.get("service") or ""
            services[s] = services.get(s, 0) + 1
        users = {}
        for e in events:
            u = e.get("user_name") or e.get("user_id") or ""
            if u:
                users[u] = users.get(u, 0) + 1
        autos = {}
        for e in events:
            a = e.get("automation_name") or e.get("trigger_entity_id") or ""
            if a and e.get("trigger_type") in ("automation", "script"):
                autos[a] = autos.get(a, 0) + 1
        return self.json({
            "entity_id": eid,
            "friendly_name": events[0].get("friendly_name") if events else None,
            "area_name": events[0].get("area_name") if events else None,
            "domain": events[0].get("domain") if events else None,
            "n_total": n_total,
            "n_user": n_user,
            "n_auto": n_auto,
            "services": [{"key": k, "n": v} for k, v in sorted(services.items(), key=lambda x: -x[1])],
            "users": [{"key": k, "n": v} for k, v in sorted(users.items(), key=lambda x: -x[1])],
            "automations": [{"key": k, "n": v} for k, v in sorted(autos.items(), key=lambda x: -x[1])[:10]],
            "events": events[:30],
        })


class RoomsView(_BaseView):
    """Activity grouped by area + their top entities."""
    url = f"{API_BASE}/rooms"
    name = "api:user_activity_tracker:rooms"

    async def get(self, request: web.Request) -> web.Response:
        since = _since(request, default_days=14)
        areas = await self.store.async_breakdown(since, "area_id", 50)
        # for each area, fetch top 5 entities and user/auto split
        result = []
        for area in areas:
            area_id = area.get("key")
            if not area_id:
                continue
            ents = await self.store.hass.async_add_executor_job(
                self.store._query,
                """
                SELECT entity_id, MAX(friendly_name) AS friendly_name, COUNT(*) AS n
                FROM events
                WHERE ts >= ? AND area_id = ?
                GROUP BY entity_id ORDER BY n DESC LIMIT 5
                """,
                (since, area_id),
            )
            split = await self.store.hass.async_add_executor_job(
                self.store._query,
                """
                SELECT
                    SUM(CASE WHEN trigger_type='user' THEN 1 ELSE 0 END) AS n_user,
                    SUM(CASE WHEN trigger_type IN ('automation','script') THEN 1 ELSE 0 END) AS n_auto
                FROM events WHERE ts >= ? AND area_id = ?
                """,
                (since, area_id),
            )
            result.append({
                "area_id": area_id,
                "area_name": area.get("area_name") or area_id,
                "n": area.get("n", 0),
                "n_user": split[0]["n_user"] if split else 0,
                "n_auto": split[0]["n_auto"] if split else 0,
                "top_entities": ents,
            })
        return self.json(result)


class InsightsView(_BaseView):
    """Auto-generated text insights."""
    url = f"{API_BASE}/insights"
    name = "api:user_activity_tracker:insights"

    async def get(self, request: web.Request) -> web.Response:
        since = _since(request, default_days=14)
        days = max(1, int((datetime.now(tz=timezone.utc).timestamp() - since) / 86400))
        insights: list[dict] = []

        summary = await self.store.async_summary(since)
        total = summary.get("total", 0) or 0
        n_user = summary.get("n_user", 0) or 0
        n_auto = summary.get("n_auto", 0) or 0

        # 1. Most active entity
        top_ent = await self.store.async_breakdown(since, "entity_id", 1)
        if top_ent:
            insights.append({
                "type": "most_active",
                "severity": "info",
                "key": "insight_most_active",
                "params": {
                    "entity_id": top_ent[0]["key"],
                    "name": top_ent[0].get("friendly_name") or top_ent[0]["key"],
                    "n": top_ent[0]["n"],
                    "days": days,
                },
            })

        # 2. Automation ratio
        if total > 0:
            ratio = round(n_auto / total * 100)
            sev = "good" if 50 <= ratio <= 85 else ("warning" if ratio > 95 else "info")
            insights.append({
                "type": "automation_ratio",
                "severity": sev,
                "key": "insight_automation_ratio",
                "params": {"ratio": ratio, "n_auto": n_auto, "total": total},
            })

        # 3. Peak hour
        peak = await self.store.async_peak_hour(since)
        if peak and peak.get("n"):
            insights.append({
                "type": "peak_hour",
                "severity": "info",
                "key": "insight_peak_hour",
                "params": {"hour": peak["hour"], "n": peak["n"]},
            })

        # 4. Anomalies count
        rapid = await self.store.async_rapid_toggle(since)
        cancelled = await self.store.async_user_cancelled(since)
        dups = await self.store.async_duplicate_automations(since)
        if rapid or cancelled or dups:
            insights.append({
                "type": "anomalies",
                "severity": "warning",
                "key": "insight_anomalies",
                "params": {
                    "rapid": len(rapid),
                    "cancelled": len(cancelled),
                    "dups": len(dups),
                },
            })

        # 5. Most active room
        rooms = await self.store.async_breakdown(since, "area_id", 1)
        if rooms:
            insights.append({
                "type": "top_room",
                "severity": "info",
                "key": "insight_top_room",
                "params": {
                    "area_name": rooms[0].get("area_name") or rooms[0]["key"],
                    "n": rooms[0]["n"],
                },
            })

        # 6. Most active user
        users = await self.store.async_breakdown(since, "user_id", 1)
        if users:
            insights.append({
                "type": "top_user",
                "severity": "info",
                "key": "insight_top_user",
                "params": {
                    "user_name": users[0].get("user_name") or users[0]["key"],
                    "n": users[0]["n"],
                },
            })

        return self.json(insights)


class AnomaliesView(_BaseView):
    url = f"{API_BASE}/anomalies"
    name = "api:user_activity_tracker:anomalies"

    async def get(self, request: web.Request) -> web.Response:
        since = _since(request, default_days=14)
        return self.json({
            "rapid_toggle": await self.store.async_rapid_toggle(since),
            "user_cancelled": await self.store.async_user_cancelled(since),
            "duplicate_automations": await self.store.async_duplicate_automations(since),
            "night_activity": await self.store.async_night_activity(since),
        })


class PurgeView(_BaseView):
    url = f"{API_BASE}/purge"
    name = "api:user_activity_tracker:purge"

    async def post(self, request: web.Request) -> web.Response:
        try:
            body = await request.json()
        except Exception:  # pylint: disable=broad-except
            body = {}
        days = int(body.get("keep_days", 365))
        deleted = await self.store.async_purge_older_than(days)
        return self.json({"deleted": deleted, "kept_days": days})
