"""
RSE — Claim & Related Schemas

Pydantic models for claims, focus, relations, archive, and synthesis endpoints.
"""

from pydantic import BaseModel


# ── Evidence (used in Focus) ─────────────────────────────────────────────────

class EvidenceItem(BaseModel):
    """A single piece of supporting or opposing evidence."""
    title: str
    source: str
    confidence: str     # "High" | "Moderate" | "Low"


# ── Focus Response ───────────────────────────────────────────────────────────

class FocusResponse(BaseModel):
    """
    Deep reasoning view for a single claim.
    """
    id: str
    title: str
    source: str
    state: str
    confidence: str
    context: str        # narrative explanation of the core tension
    support: list[EvidenceItem]
    opposition: list[EvidenceItem]


# ── Relations ────────────────────────────────────────────────────────────────

class RelationEdge(BaseModel):
    """A directional edge between two claims."""
    source: str         # claim id
    target: str         # claim id
    type: str           # "supports" | "contradicts" | "related_to"


# ── Archive ──────────────────────────────────────────────────────────────────

class ArchiveEntry(BaseModel):
    """A saved research state snapshot."""
    id: str
    date: str           # e.g. "Oct 24, 2025"
    time: str           # e.g. "14:32 UTC"
    title: str
    summary: str
    state: str          # dominant state: "established" | "debated" | "unknown"


class ArchiveCreateRequest(BaseModel):
    """Request body for POST /api/archive."""
    title: str
    summary: str
    state: str


# ── Synthesis ────────────────────────────────────────────────────────────────

class SynthesisRequest(BaseModel):
    """Request body for POST /api/synthesis."""
    claims: list[str]   # list of claim IDs


class SynthesisNode(BaseModel):
    """A node in the synthesis reasoning graph."""
    id: str
    heading: str        # "Core debate" | "Support" | "Opposition" | "Unknown"
    text: str
    state: str          # "established" | "debated" | "unknown"
