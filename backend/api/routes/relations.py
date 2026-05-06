"""
RSE — Relations Route

GET /api/claims/relations?topic_id=
Returns the claim-to-claim relationship graph for a topic.
"""

from fastapi import APIRouter, Query, HTTPException
from services import relation_service

router = APIRouter()


@router.get("/claims/relations")
async def get_relations(topic_id: str = Query(..., description="Topic ID from a previous query")):
    """
    Fetch the relationship graph for a given topic.

    Returns a list of edges: { source, target, type }
    where type is one of: "supports", "contradicts", "related_to"
    """
    relations = await relation_service.get_relations(topic_id)

    if not relations:
        raise HTTPException(
            status_code=404,
            detail=f"No relations found for topic '{topic_id}'. Submit a query first.",
        )

    return relations
