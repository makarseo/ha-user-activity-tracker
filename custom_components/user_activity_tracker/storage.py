"""SQLite storage layer for User Activity Tracker."""
from __future__ import annotations

import asyncio
import logging
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable

_LOGGER = logging.getLogger(__name__)

BASE_SCHEMA = """
CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          INTEGER NOT NULL,
    domain      TEXT    NOT NULL,
    entity_id   TEXT    NOT NULL,
    service     TEXT,
    user_id     TEXT,
    user_name   TEXT,
    source      TEXT    NOT NULL,
    context_id  TEXT,
    parent_id   TEXT,
    extra       TEXT
);
"""

COLUMN_MIGRATIONS = [
    "ALTER TABLE events ADD COLUMN trigger_type TEXT",
    "ALTER TABLE events ADD COLUMN trigger_entity_id TEXT",
    "ALTER TABLE events ADD COLUMN friendly_name TEXT",
    "ALTER TABLE events ADD COLUMN area_id TEXT",
    "ALTER TABLE events ADD COLUMN area_name TEXT",
    "ALTER TABLE events ADD COLUMN automation_name TEXT",
]

INDEX_MIGRATIONS = [
    "CREATE INDEX IF NOT EXISTS idx_events_ts            ON events(ts)",
    "CREATE INDEX IF NOT EXISTS idx_events_entity        ON events(entity_id)",
    "CREATE INDEX IF NOT EXISTS idx_events_user          ON events(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_events_domain        ON events(domain)",
    "CREATE INDEX IF NOT EXISTS idx_events_trigger_type  ON events(trigger_type)",
    "CREATE INDEX IF NOT EXISTS idx_events_trigger_eid   ON events(trigger_entity_id)",
    "CREATE INDEX IF NOT EXISTS idx_events_area          ON events(area_id)",
]


def _trigger_clause(trigger_type: str | None) -> str:
    if not trigger_type or trigger_type == "all":
        return ""
    if trigger_type == "user":
        return "AND trigger_type = 'user'"
    if trigger_type == "automation":
        return "AND trigger_type IN ('automation','script')"
    if trigger_type == "system":
        return "AND (trigger_type = 'system' OR trigger_type IS NULL)"
    return ""


class ActivityStore:
    def __init__(self, hass, db_path: Path) -> None:
        self.hass = hass
        self.db_path = db_path
        self._lock = asyncio.Lock()
        self._initialized = False

    @contextmanager
    def _conn(self):
        conn = sqlite3.connect(self.db_path, timeout=10, isolation_level=None)
        try:
            conn.execute("PRAGMA journal_mode=WAL;")
            conn.execute("PRAGMA synchronous=NORMAL;")
            conn.row_factory = sqlite3.Row
            yield conn
        finally:
            conn.close()

    def _query(self, sql: str, params: Iterable[Any] = ()) -> list[dict]:
        with self._conn() as c:
            cur = c.execute(sql, params)
            return [dict(r) for r in cur.fetchall()]

    async def async_init(self) -> None:
        async with self._lock:
            if self._initialized:
                return
            self.db_path.parent.mkdir(parents=True, exist_ok=True)
            await self.hass.async_add_executor_job(self._init_schema)
            self._initialized = True

    def _init_schema(self) -> None:
        with self._conn() as c:
            c.executescript(BASE_SCHEMA)
            for stmt in COLUMN_MIGRATIONS:
                try:
                    c.execute(stmt)
                except sqlite3.OperationalError as err:
                    if "duplicate column name" not in str(err).lower():
                        _LOGGER.warning("Migration failed: %s — %s", stmt, err)
            for stmt in INDEX_MIGRATIONS:
                try:
                    c.execute(stmt)
                except sqlite3.OperationalError as err:
                    _LOGGER.warning("Index creation failed: %s — %s", stmt, err)

    async def async_log(self, row: dict[str, Any]) -> None:
        await self.hass.async_add_executor_job(self._insert, row)

    def _insert(self, row: dict[str, Any]) -> None:
        with self._conn() as c:
            c.execute(
                """
                INSERT INTO events
                    (ts, domain, entity_id, service, user_id, user_name,
                     source, context_id, parent_id,
                     trigger_type, trigger_entity_id,
                     friendly_name, area_id, area_name, automation_name,
                     extra)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    row["ts"], row["domain"], row["entity_id"],
                    row.get("service"), row.get("user_id"), row.get("user_name"),
                    row["source"], row.get("context_id"), row.get("parent_id"),
                    row.get("trigger_type"), row.get("trigger_entity_id"),
                    row.get("friendly_name"), row.get("area_id"),
                    row.get("area_name"), row.get("automation_name"),
                    row.get("extra"),
                ),
            )

    # ---- basic counts/breakdowns -------------------------------------

    async def async_count_since(self, since_ts: int, until_ts: int | None = None,
                                trigger_type: str | None = None) -> int:
        clause = _trigger_clause(trigger_type)
        if until_ts is not None:
            sql = f"SELECT COUNT(*) AS n FROM events WHERE ts BETWEEN ? AND ? {clause}"
            params = (since_ts, until_ts)
        else:
            sql = f"SELECT COUNT(*) AS n FROM events WHERE ts >= ? {clause}"
            params = (since_ts,)
        rows = await self.hass.async_add_executor_job(self._query, sql, params)
        return rows[0]["n"] if rows else 0

    async def async_breakdown(self, since_ts: int, field: str = "entity_id",
                              limit: int = 50, trigger_type: str | None = None,
                              until_ts: int | None = None) -> list[dict]:
        if field not in ("entity_id", "domain", "user_id", "service",
                         "trigger_entity_id", "trigger_type", "area_id"):
            field = "entity_id"
        clause = _trigger_clause(trigger_type)
        if until_ts is None:
            where_ts = "ts >= ?"
            ts_params: tuple = (since_ts,)
        else:
            where_ts = "ts BETWEEN ? AND ?"
            ts_params = (since_ts, until_ts)
        params = ts_params + (limit,)

        if field == "user_id":
            sql = f"""
                SELECT user_id AS key, MAX(user_name) AS user_name, COUNT(*) AS n
                FROM events
                WHERE {where_ts} AND user_id IS NOT NULL {clause}
                GROUP BY user_id ORDER BY n DESC LIMIT ?
            """
        elif field == "entity_id":
            sql = f"""
                SELECT entity_id AS key, MAX(friendly_name) AS friendly_name,
                       MAX(area_name) AS area_name, MAX(domain) AS domain, COUNT(*) AS n
                FROM events
                WHERE {where_ts} {clause}
                GROUP BY entity_id ORDER BY n DESC LIMIT ?
            """
        elif field == "trigger_entity_id":
            sql = f"""
                SELECT trigger_entity_id AS key, MAX(automation_name) AS automation_name,
                       COUNT(*) AS n
                FROM events
                WHERE {where_ts} AND trigger_entity_id IS NOT NULL {clause}
                GROUP BY trigger_entity_id ORDER BY n DESC LIMIT ?
            """
        elif field == "area_id":
            sql = f"""
                SELECT area_id AS key, MAX(area_name) AS area_name, COUNT(*) AS n
                FROM events
                WHERE {where_ts} AND area_id IS NOT NULL {clause}
                GROUP BY area_id ORDER BY n DESC LIMIT ?
            """
        else:
            sql = f"""
                SELECT {field} AS key, COUNT(*) AS n
                FROM events
                WHERE {where_ts} AND {field} IS NOT NULL {clause}
                GROUP BY {field} ORDER BY n DESC LIMIT ?
            """

        return await self.hass.async_add_executor_job(self._query, sql, params)

    async def async_recent(self, limit: int = 100,
                           trigger_type: str | None = None) -> list[dict]:
        clause = _trigger_clause(trigger_type)
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT ts, domain, entity_id, friendly_name, area_id, area_name,
                   service, user_id, user_name, source,
                   trigger_type, trigger_entity_id, automation_name
            FROM events
            WHERE 1=1 {clause}
            ORDER BY ts DESC LIMIT ?
            """,
            (limit,),
        )

    async def async_series(self, since_ts: int, group_by: str = "day",
                           until_ts: int | None = None,
                           trigger_type: str | None = None,
                           split_by_trigger: bool = False) -> list[dict]:
        until_ts = until_ts or int(datetime.now(tz=timezone.utc).timestamp())
        fmt = "%Y-%m-%d" if group_by == "day" else "%Y-%m-%d %H:00"
        clause = _trigger_clause(trigger_type)
        if split_by_trigger:
            return await self.hass.async_add_executor_job(
                self._query,
                f"""
                SELECT strftime('{fmt}', datetime(ts,'unixepoch','localtime')) AS bucket,
                       COALESCE(trigger_type,'system') AS trigger_type,
                       COUNT(*) AS n
                FROM events
                WHERE ts BETWEEN ? AND ? {clause}
                GROUP BY bucket, trigger_type
                ORDER BY bucket
                """,
                (since_ts, until_ts),
            )
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT strftime('{fmt}', datetime(ts,'unixepoch','localtime')) AS bucket,
                   COUNT(*) AS n
            FROM events
            WHERE ts BETWEEN ? AND ? {clause}
            GROUP BY bucket ORDER BY bucket
            """,
            (since_ts, until_ts),
        )

    async def async_summary(self, since_ts: int, trigger_type: str | None = None,
                            until_ts: int | None = None) -> dict:
        clause = _trigger_clause(trigger_type)
        if until_ts is None:
            where = "ts >= ?"
            params = (since_ts,)
        else:
            where = "ts BETWEEN ? AND ?"
            params = (since_ts, until_ts)
        rows = await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT
                COUNT(*) AS total,
                COUNT(DISTINCT entity_id) AS unique_entities,
                COUNT(DISTINCT user_id) AS unique_users,
                COUNT(DISTINCT domain) AS unique_domains,
                COUNT(DISTINCT trigger_entity_id) AS unique_triggers,
                COUNT(DISTINCT area_id) AS unique_areas,
                SUM(CASE WHEN trigger_type='user' THEN 1 ELSE 0 END) AS n_user,
                SUM(CASE WHEN trigger_type IN ('automation','script') THEN 1 ELSE 0 END) AS n_auto,
                SUM(CASE WHEN trigger_type='system' OR trigger_type IS NULL THEN 1 ELSE 0 END) AS n_sys,
                MIN(ts) AS first_ts, MAX(ts) AS last_ts
            FROM events
            WHERE {where} {clause}
            """,
            params,
        )
        return rows[0] if rows else {}

    async def async_heatmap(self, since_ts: int,
                            trigger_type: str | None = None) -> list[dict]:
        clause = _trigger_clause(trigger_type)
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT
                CAST(strftime('%w', datetime(ts,'unixepoch','localtime')) AS INT) AS dow,
                CAST(strftime('%H', datetime(ts,'unixepoch','localtime')) AS INT) AS hour,
                COUNT(*) AS n
            FROM events
            WHERE ts >= ? {clause}
            GROUP BY dow, hour
            """,
            (since_ts,),
        )

    async def async_peak_hour(self, since_ts: int) -> dict | None:
        rows = await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT
                CAST(strftime('%H', datetime(ts,'unixepoch','localtime')) AS INT) AS hour,
                COUNT(*) AS n
            FROM events
            WHERE ts >= ?
            GROUP BY hour
            ORDER BY n DESC LIMIT 1
            """,
            (since_ts,),
        )
        return rows[0] if rows else None

    # ---- anomalies / insights ----------------------------------------

    async def async_rapid_toggle(self, since_ts: int, window_sec: int = 1800,
                                 min_count: int = 8) -> list[dict]:
        return await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT entity_id, MAX(friendly_name) AS friendly_name,
                   MAX(area_name) AS area_name,
                   COUNT(*) AS n,
                   MIN(ts) AS first_ts, MAX(ts) AS last_ts
            FROM events
            WHERE ts >= ?
            GROUP BY entity_id
            HAVING n >= ? AND (MAX(ts)-MIN(ts)) <= ?
            ORDER BY n DESC
            LIMIT 10
            """,
            (since_ts, min_count, window_sec),
        )

    async def async_user_cancelled(self, since_ts: int,
                                   window_sec: int = 300) -> list[dict]:
        return await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT a.entity_id,
                   MAX(a.friendly_name) AS friendly_name,
                   a.user_name AS user_name,
                   a.service AS user_service, a.ts AS user_ts,
                   b.service AS auto_service, b.ts AS auto_ts,
                   b.trigger_entity_id AS auto_eid,
                   b.automation_name AS auto_name
            FROM events a
            JOIN events b ON a.entity_id = b.entity_id
                         AND b.ts > a.ts AND (b.ts - a.ts) <= ?
                         AND b.trigger_type IN ('automation','script')
                         AND a.trigger_type = 'user'
                         AND ((a.service LIKE 'turn_%' AND b.service LIKE 'turn_%' AND a.service != b.service)
                              OR (a.service = 'open_cover' AND b.service = 'close_cover')
                              OR (a.service = 'close_cover' AND b.service = 'open_cover'))
            WHERE a.ts >= ?
            GROUP BY a.id
            ORDER BY a.ts DESC
            LIMIT 20
            """,
            (window_sec, since_ts),
        )

    async def async_duplicate_automations(self, since_ts: int,
                                          window_sec: int = 60) -> list[dict]:
        return await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT a.entity_id,
                   MAX(a.friendly_name) AS friendly_name,
                   a.trigger_entity_id AS auto1,
                   a.automation_name AS auto1_name,
                   b.trigger_entity_id AS auto2,
                   b.automation_name AS auto2_name,
                   a.service,
                   a.ts AS ts1, b.ts AS ts2
            FROM events a
            JOIN events b ON a.entity_id = b.entity_id
                         AND a.service = b.service
                         AND a.trigger_entity_id < b.trigger_entity_id
                         AND b.ts > a.ts AND (b.ts - a.ts) <= ?
                         AND a.trigger_type IN ('automation','script')
                         AND b.trigger_type IN ('automation','script')
            WHERE a.ts >= ?
            GROUP BY a.id, b.id
            ORDER BY a.ts DESC
            LIMIT 20
            """,
            (window_sec, since_ts),
        )

    async def async_night_activity(self, since_ts: int) -> list[dict]:
        return await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT entity_id, MAX(friendly_name) AS friendly_name,
                   MAX(area_name) AS area_name, COUNT(*) AS n
            FROM events
            WHERE ts >= ?
              AND CAST(strftime('%H', datetime(ts,'unixepoch','localtime')) AS INT) IN (0,1,2,3,4,5)
            GROUP BY entity_id
            ORDER BY n DESC
            LIMIT 10
            """,
            (since_ts,),
        )

    async def async_purge_older_than(self, days: int) -> int:
        cutoff = int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())

        def _purge() -> int:
            with self._conn() as c:
                cur = c.execute("DELETE FROM events WHERE ts < ?", (cutoff,))
                c.execute("VACUUM;")
                return cur.rowcount or 0

        return await self.hass.async_add_executor_job(_purge)
