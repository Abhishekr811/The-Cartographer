"""
RSE — Focus Route

GET /api/focus/{claim_id}
Returns deep reasoning and evidence for a specific claim.
"""

from fastapi import APIRouter, HTTPException
from services import focus_service

router = APIRouter()


@router.get("/focus/{claim_id}")
async def get_focus(claim_id: str):
    """
    Fetch deep reasoning data for a specific claim.

    Returns:
    - Supporting evidence (papers that back this claim)
    - Opposing evidence (papers that challenge it)
    - Context narrative explaining the core tension
    - Confidence assessment
    """
    result = await focus_service.get_focus(claim_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Claim '{claim_id}' not found. Submit a query first to populate claims.",
        )

    return result
