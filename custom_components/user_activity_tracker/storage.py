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

SCHEMA = """
CREATE TABLE IF NOT EXISTS events (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    ts                 INTEGER NOT NULL,
    domain             TEXT    NOT NULL,
    entity_id          TEXT    NOT NULL,
    service            TEXT,
    user_id            TEXT,
    user_name          TEXT,
    source             TEXT    NOT NULL,
    context_id         TEXT,
    parent_id          TEXT,
    trigger_type       TEXT,                        -- user | automation | script | system
    trigger_entity_id  TEXT,                        -- e.g. automation.morning_routine
    extra              TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_ts            ON events(ts);
CREATE INDEX IF NOT EXISTS idx_events_entity        ON events(entity_id);
CREATE INDEX IF NOT EXISTS idx_events_user          ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_domain        ON events(domain);
CREATE INDEX IF NOT EXISTS idx_events_trigger_type  ON events(trigger_type);
CREATE INDEX IF NOT EXISTS idx_events_trigger_eid   ON events(trigger_entity_id);
"""

# Schema migrations for upgrades from v0.1.x → v0.1.3
MIGRATIONS = [
    "ALTER TABLE events ADD COLUMN trigger_type TEXT",
    "ALTER TABLE events ADD COLUMN trigger_entity_id TEXT",
    "CREATE INDEX IF NOT EXISTS idx_events_trigger_type ON events(trigger_type)",
    "CREATE INDEX IF NOT EXISTS idx_events_trigger_eid ON events(trigger_entity_id)",
]


def _trigger_clause(trigger_type: str | None) -> tuple[str, list]:
    """Return (SQL fragment, params) — '' if no filter."""
    if not trigger_type or trigger_type == "all":
        return ("", [])
    if trigger_type == "user":
        return ("AND trigger_type = 'user'", [])
    if trigger_type == "automation":
        return ("AND trigger_type IN ('automation','script')", [])
    if trigger_type == "system":
        return ("AND (trigger_type = 'system' OR trigger_type IS NULL)", [])
    return ("", [])


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
            c.executescript(SCHEMA)
            for stmt in MIGRATIONS:
                try:
                    c.execute(stmt)
                except sqlite3.OperationalError:
                    pass  # already applied

    async def async_log(self, row: dict[str, Any]) -> None:
        await self.hass.async_add_executor_job(self._insert, row)

    def _insert(self, row: dict[str, Any]) -> None:
        with self._conn() as c:
            c.execute(
                """
                INSERT INTO events
                    (ts, domain, entity_id, service, user_id, user_name,
                     source, context_id, parent_id,
                     trigger_type, trigger_entity_id, extra)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    row["ts"],
                    row["domain"],
                    row["entity_id"],
                    row.get("service"),
                    row.get("user_id"),
                    row.get("user_name"),
                    row["source"],
                    row.get("context_id"),
                    row.get("parent_id"),
                    row.get("trigger_type"),
                    row.get("trigger_entity_id"),
                    row.get("extra"),
                ),
            )

    # ---- reads --------------------------------------------------------

    async def async_count_since(self, since_ts: int, trigger_type: str | None = None) -> int:
        clause, _ = _trigger_clause(trigger_type)
        rows = await self.hass.async_add_executor_job(
            self._query,
            f"SELECT COUNT(*) AS n FROM events WHERE ts >= ? {clause}",
            (since_ts,),
        )
        return rows[0]["n"] if rows else 0

    async def async_top_entity(
        self, since_ts: int, limit: int = 1, trigger_type: str | None = None
    ) -> list[dict]:
        clause, _ = _trigger_clause(trigger_type)
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT entity_id, COUNT(*) AS n
            FROM events
            WHERE ts >= ? {clause}
            GROUP BY entity_id
            ORDER BY n DESC
            LIMIT ?
            """,
            (since_ts, limit),
        )

    async def async_top_user(
        self, since_ts: int, limit: int = 1, trigger_type: str | None = None
    ) -> list[dict]:
        clause, _ = _trigger_clause(trigger_type)
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT user_id, MAX(user_name) AS user_name, COUNT(*) AS n
            FROM events
            WHERE ts >= ? AND user_id IS NOT NULL {clause}
            GROUP BY user_id
            ORDER BY n DESC
            LIMIT ?
            """,
            (since_ts, limit),
        )

    async def async_recent(
        self, limit: int = 100, trigger_type: str | None = None
    ) -> list[dict]:
        clause, _ = _trigger_clause(trigger_type)
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT ts, domain, entity_id, service, user_id, user_name, source,
                   trigger_type, trigger_entity_id
            FROM events
            WHERE 1=1 {clause}
            ORDER BY ts DESC
            LIMIT ?
            """,
            (limit,),
        )

    async def async_stats(
        self,
        since_ts: int,
        until_ts: int | None = None,
        group_by: str = "day",
        trigger_type: str | None = None,
    ) -> list[dict]:
        until_ts = until_ts or int(datetime.now(tz=timezone.utc).timestamp())
        fmt = "%Y-%m-%d" if group_by == "day" else "%Y-%m-%d %H:00"
        clause, _ = _trigger_clause(trigger_type)
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT strftime('{fmt}', datetime(ts, 'unixepoch')) AS bucket,
                   COUNT(*) AS n
            FROM events
            WHERE ts BETWEEN ? AND ? {clause}
            GROUP BY bucket
            ORDER BY bucket
            """,
            (since_ts, until_ts),
        )

    async def async_breakdown(
        self,
        since_ts: int,
        field: str = "entity_id",
        limit: int = 50,
        trigger_type: str | None = None,
    ) -> list[dict]:
        if field not in ("entity_id", "domain", "user_id", "service", "trigger_entity_id", "trigger_type"):
            field = "entity_id"
        clause, _ = _trigger_clause(trigger_type)
        if field == "user_id":
            return await self.hass.async_add_executor_job(
                self._query,
                f"""
                SELECT user_id AS key,
                       MAX(user_name) AS user_name,
                       COUNT(*) AS n
                FROM events
                WHERE ts >= ? AND user_id IS NOT NULL {clause}
                GROUP BY user_id
                ORDER BY n DESC
                LIMIT ?
                """,
                (since_ts, limit),
            )
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT {field} AS key, COUNT(*) AS n
            FROM events
            WHERE ts >= ? AND {field} IS NOT NULL {clause}
            GROUP BY {field}
            ORDER BY n DESC
            LIMIT ?
            """,
            (since_ts, limit),
        )

    async def async_summary(
        self, since_ts: int, trigger_type: str | None = None
    ) -> dict:
        clause, _ = _trigger_clause(trigger_type)
        rows = await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT
                COUNT(*)                                  AS total,
                COUNT(DISTINCT entity_id)                 AS unique_entities,
                COUNT(DISTINCT user_id)                   AS unique_users,
                COUNT(DISTINCT domain)                    AS unique_domains,
                COUNT(DISTINCT trigger_entity_id)         AS unique_triggers,
                MIN(ts)                                   AS first_ts,
                MAX(ts)                                   AS last_ts
            FROM events
            WHERE ts >= ? {clause}
            """,
            (since_ts,),
        )
        return rows[0] if rows else {}

    async def async_heatmap(
        self, since_ts: int, trigger_type: str | None = None
    ) -> list[dict]:
        clause, _ = _trigger_clause(trigger_type)
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT
                CAST(strftime('%w', datetime(ts, 'unixepoch', 'localtime')) AS INT) AS dow,
                CAST(strftime('%H', datetime(ts, 'unixepoch', 'localtime')) AS INT) AS hour,
                COUNT(*) AS n
            FROM events
            WHERE ts >= ? {clause}
            GROUP BY dow, hour
            """,
            (since_ts,),
        )

    async def async_automation_detail(self, since_ts: int, automation_eid: str) -> list[dict]:
        """Return what entities a specific automation/script touched."""
        return await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT entity_id, service, COUNT(*) AS n
            FROM events
            WHERE ts >= ? AND trigger_entity_id = ?
            GROUP BY entity_id, service
            ORDER BY n DESC
            """,
            (since_ts, automation_eid),
        )

    async def async_purge_older_than(self, days: int) -> int:
        cutoff = int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())

        def _purge() -> int:
            with self._conn() as c:
                cur = c.execute("DELETE FROM events WHERE ts < ?", (cutoff,))
                c.execute("VACUUM;")
                return cur.rowcount or 0

        return await self.hass.async_add_executor_job(_purge)
