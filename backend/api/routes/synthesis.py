"""
RSE — Synthesis Route

POST /api/synthesis
Generates a synthesis reasoning graph from selected claim IDs.
"""

from fastapi import APIRouter, HTTPException
from schemas.claim_schema import SynthesisRequest, SynthesisNode
from services.query_service import get_cached_topic, get_all_topic_ids

router = APIRouter()


# ── Route ────────────────────────────────────────────────────────────────────

@router.post("/synthesis")
async def generate_synthesis(request: SynthesisRequest) -> list[SynthesisNode]:
    """
    Generate a synthesis reasoning graph from selected claims.

    The synthesis identifies:
    - Core debates
    - Supporting threads
    - Opposing threads
    - Knowledge gaps
    """
    if not request.claims:
        raise HTTPException(status_code=400, detail="At least one claim ID is required")

    # Find the claims across all cached topics
    found_claims = []
    for topic_id in get_all_topic_ids():
        cached = get_cached_topic(topic_id)
        if not cached:
            continue
        for c in cached["claims"]:
            if c["id"] in request.claims:
                found_claims.append(c)

    if not found_claims:
        raise HTTPException(status_code=404, detail="No matching claim IDs found. Submit and fetch claims first.")

    nodes = _build_synthesis(found_claims)

    return [SynthesisNode(**n) for n in nodes]


def _build_synthesis(found_claims: list[dict]) -> list[dict]:
    """Generate synthesis nodes directly from retrieved claims."""
    established = [c for c in found_claims if c.get("state") == "established"]
    debated = [c for c in found_claims if c.get("state") == "debated"]
    unknown = [c for c in found_claims if c.get("state") == "unknown"]

    nodes = []

    if debated:
        nodes.append({"id": "s1", "heading": "Core debate", "text": debated[0]["title"], "state": "debated"})
    if established:
        nodes.append({"id": f"s{len(nodes)+1}", "heading": "Support", "text": established[0]["title"], "state": "established"})
    if len(debated) > 1:
        nodes.append({"id": f"s{len(nodes)+1}", "heading": "Opposition", "text": debated[1]["title"], "state": "debated"})
    if unknown:
        nodes.append({"id": f"s{len(nodes)+1}", "heading": "Unknown", "text": unknown[0]["title"], "state": "unknown"})

    if not nodes:
        first = found_claims[0]
        nodes.append({"id": "s1", "heading": "Core finding", "text": first["title"], "state": first.get("state", "unknown")})

    return nodes
