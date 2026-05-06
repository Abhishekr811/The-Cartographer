"""
RSE — Claims Route

GET /api/claims?topic_id=
Returns all claims for a given topic.
"""

from fastapi import APIRouter, Query, HTTPException
from services import claim_service

router = APIRouter()


@router.get("/claims")
async def get_claims(topic_id: str = Query(..., description="Topic ID from a previous query")):
    """
    Fetch all extracted claims for a given topic.

    Returns the full claim list including id, title, source, confidence, and state.
    """
    raw_claims = await claim_service.get_claims(topic_id)

    if not raw_claims:
        raise HTTPException(
            status_code=404,
            detail=f"No claims found for topic '{topic_id}'. Submit a query first.",
        )

    claims = [
        {
            "id": c["id"],
            "text": c["title"],
            "type": c["state"],
            "confidence": c.get("confidence", "low").lower(),
            "paper_id": c.get("paper_id", ""),
            "title": c.get("paper_title", ""),
            "abstract": c.get("paper_abstract", ""),
            "url": c.get("paper_url", "")
        }
        for c in raw_claims
    ]

    return claims
