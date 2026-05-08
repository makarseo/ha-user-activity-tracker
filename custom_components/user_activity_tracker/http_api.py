"""REST API endpoints for User Activity Tracker."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import API_BASE
from .storage import ActivityStore


def _since(request: web.Request, default_days: int = 7) -> int:
    raw = request.query.get("days")
    try:
        days = int(raw) if raw else default_days
    except ValueError:
        days = default_days
    days = max(1, min(days, 3650))
    return int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())


def _trigger(request: web.Request) -> str | None:
    val = request.query.get("trigger_type")
    if val in ("user", "automation", "system", "all"):
        return val
    return None


def async_register_views(hass: HomeAssistant, store: ActivityStore) -> None:
    for v in (StatsView, EventsView, BreakdownView, SeriesView, PurgeView,
              SummaryView, HeatmapView, AutomationDetailView):
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
        now = datetime.now(tz=timezone.utc)
        start_today = int(now.replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
        start_week = int((now - timedelta(days=7)).timestamp())
        start_month = int((now - timedelta(days=30)).timestamp())
        return self.json(
            {
                "today": await self.store.async_count_since(start_today, tt),
                "week": await self.store.async_count_since(start_week, tt),
                "month": await self.store.async_count_since(start_month, tt),
                "top_entity_week": await self.store.async_top_entity(start_week, 5, tt),
                "top_user_week": await self.store.async_top_user(start_week, 5, tt),
            }
        )


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
        return self.json(await self.store.async_stats(since, group_by=group, trigger_type=tt))


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
        return self.json(await self.store.async_automation_detail(since, eid))


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
