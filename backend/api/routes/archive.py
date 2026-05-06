"""
RSE — Archive Route

GET  /api/archive — Fetch all archived research state snapshots
POST /api/archive — Save a new archive entry
"""

from datetime import datetime, timezone
from fastapi import APIRouter
from schemas.claim_schema import ArchiveEntry, ArchiveCreateRequest

router = APIRouter()

# ── In-memory archive store ──────────────────────────────────────────────────

_archive: list[dict] = []

_next_id = 4


# ── Routes ───────────────────────────────────────────────────────────────────

@router.get("/archive")
async def get_archive() -> list[ArchiveEntry]:
    """Fetch all archived research state snapshots."""
    return [ArchiveEntry(**entry) for entry in _archive]


@router.post("/archive")
async def save_archive(request: ArchiveCreateRequest) -> ArchiveEntry:
    """Save a new archive entry and return it."""
    global _next_id

    now = datetime.now(timezone.utc)
    entry = {
        "id": f"a{_next_id}",
        "date": now.strftime("%b %d, %Y"),
        "time": now.strftime("%H:%M UTC"),
        "title": request.title,
        "summary": request.summary,
        "state": request.state,
    }
    _next_id += 1

    _archive.insert(0, entry)  # newest first
    return ArchiveEntry(**entry)
