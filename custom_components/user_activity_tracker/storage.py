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
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          INTEGER NOT NULL,           -- unix seconds (UTC)
    domain      TEXT    NOT NULL,
    entity_id   TEXT    NOT NULL,
    service     TEXT,                       -- service called, if any
    user_id     TEXT,                       -- HA user id (nullable for system)
    user_name   TEXT,                       -- denormalized name at write-time
    source      TEXT    NOT NULL,           -- 'service' | 'state'
    context_id  TEXT,
    parent_id   TEXT,
    extra       TEXT                        -- JSON blob, optional
);
CREATE INDEX IF NOT EXISTS idx_events_ts          ON events(ts);
CREATE INDEX IF NOT EXISTS idx_events_entity      ON events(entity_id);
CREATE INDEX IF NOT EXISTS idx_events_user        ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_domain      ON events(domain);
"""


class ActivityStore:
    """Thin async wrapper over a sync SQLite connection.

    SQLite calls run inside the HA executor to keep the event loop free.
    """

    def __init__(self, hass, db_path: Path) -> None:
        self.hass = hass
        self.db_path = db_path
        self._lock = asyncio.Lock()
        self._initialized = False

    # ------------------------------------------------------------------ utils

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

    def _exec(self, sql: str, params: Iterable[Any] = ()) -> None:
        with self._conn() as c:
            c.executescript(sql) if ";" in sql and sql.count(";") > 1 else c.execute(sql, params)

    def _query(self, sql: str, params: Iterable[Any] = ()) -> list[dict]:
        with self._conn() as c:
            cur = c.execute(sql, params)
            return [dict(r) for r in cur.fetchall()]

    # ------------------------------------------------------------------ init

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

    # ------------------------------------------------------------------ write

    async def async_log(self, row: dict[str, Any]) -> None:
        await self.hass.async_add_executor_job(self._insert, row)

    def _insert(self, row: dict[str, Any]) -> None:
        with self._conn() as c:
            c.execute(
                """
                INSERT INTO events
                    (ts, domain, entity_id, service, user_id, user_name,
                     source, context_id, parent_id, extra)
                VALUES (?,?,?,?,?,?,?,?,?,?)
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
                    row.get("extra"),
                ),
            )

    # ------------------------------------------------------------------ reads

    async def async_count_since(self, since_ts: int) -> int:
        rows = await self.hass.async_add_executor_job(
            self._query, "SELECT COUNT(*) AS n FROM events WHERE ts >= ?", (since_ts,)
        )
        return rows[0]["n"] if rows else 0

    async def async_top_entity(self, since_ts: int, limit: int = 1) -> list[dict]:
        return await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT entity_id, COUNT(*) AS n
            FROM events
            WHERE ts >= ?
            GROUP BY entity_id
            ORDER BY n DESC
            LIMIT ?
            """,
            (since_ts, limit),
        )

    async def async_top_user(self, since_ts: int, limit: int = 1) -> list[dict]:
        return await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT user_id, user_name, COUNT(*) AS n
            FROM events
            WHERE ts >= ? AND user_id IS NOT NULL
            GROUP BY user_id
            ORDER BY n DESC
            LIMIT ?
            """,
            (since_ts, limit),
        )

    async def async_recent(self, limit: int = 100) -> list[dict]:
        return await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT ts, domain, entity_id, service, user_id, user_name, source
            FROM events
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
    ) -> list[dict]:
        until_ts = until_ts or int(datetime.now(tz=timezone.utc).timestamp())
        # group_by: 'hour', 'day'
        fmt = "%Y-%m-%d" if group_by == "day" else "%Y-%m-%d %H:00"
        return await self.hass.async_add_executor_job(
            self._query,
            f"""
            SELECT strftime('{fmt}', datetime(ts, 'unixepoch')) AS bucket,
                   COUNT(*) AS n
            FROM events
            WHERE ts BETWEEN ? AND ?
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
    ) -> list[dict]:
        if field not in ("entity_id", "domain", "user_id", "service"):
            field = "entity_id"
        # Special-case user_id: also surface user_name (latest known)
        if field == "user_id":
            return await self.hass.async_add_executor_job(
                self._query,
                """
                SELECT user_id AS key,
                       MAX(user_name) AS user_name,
                       COUNT(*) AS n
                FROM events
                WHERE ts >= ? AND user_id IS NOT NULL
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
            WHERE ts >= ?
            GROUP BY {field}
            ORDER BY n DESC
            LIMIT ?
            """,
            (since_ts, limit),
        )

    async def async_summary(self, since_ts: int) -> dict:
        rows = await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT
                COUNT(*)                          AS total,
                COUNT(DISTINCT entity_id)         AS unique_entities,
                COUNT(DISTINCT user_id)           AS unique_users,
                COUNT(DISTINCT domain)            AS unique_domains,
                MIN(ts)                           AS first_ts,
                MAX(ts)                           AS last_ts
            FROM events
            WHERE ts >= ?
            """,
            (since_ts,),
        )
        return rows[0] if rows else {}

    async def async_heatmap(self, since_ts: int) -> list[dict]:
        """Return events grouped by (weekday, hour) — strftime: %w 0=Sun, %H 00-23."""
        return await self.hass.async_add_executor_job(
            self._query,
            """
            SELECT
                CAST(strftime('%w', datetime(ts, 'unixepoch', 'localtime')) AS INT) AS dow,
                CAST(strftime('%H', datetime(ts, 'unixepoch', 'localtime')) AS INT) AS hour,
                COUNT(*) AS n
            FROM events
            WHERE ts >= ?
            GROUP BY dow, hour
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
