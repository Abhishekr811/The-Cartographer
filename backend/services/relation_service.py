"""
RSE — Relation Service

Handles retrieval of claim-to-claim relationship graphs.
Relations are cached during query processing and served from memory.
"""

from services.query_service import get_cached_topic


async def get_relations(topic_id: str) -> list[dict]:
    """
    Retrieve the relationship graph for a given topic.

    Returns list of edges: { source, target, type }
    """
    cached = get_cached_topic(topic_id)
    if not cached:
        return []

    relations = cached["relations"]
    print(f"Relation service: retrieved {len(relations)} relations for topic {topic_id}")
    return relations
