"""
RSE — Claim Service

Handles claim retrieval for a given topic.
Claims are cached during query processing and served from memory.
"""

from services.query_service import get_cached_topic


async def get_claims(topic_id: str) -> list[dict]:
    """
    Retrieve all claims for a given topic.

    Returns the full claim list (not the truncated one from the query response).
    """
    cached = get_cached_topic(topic_id)
    if not cached:
        return []

    claims = cached["claims"]
    print(f"Claim service: retrieved {len(claims)} claims for topic {topic_id}")
    return claims
