"""
RSE — Focus Service

Provides a deep reasoning view for a specific claim using topic-specific claims
and relations cached from the query pipeline.
"""

from services.query_service import get_cached_topic, get_all_topic_ids


def _build_focus_data(claim: dict, all_claims: list[dict], relations: list[dict], topic: str) -> dict:
    supports = []
    opposes = []
    by_id = {c["id"]: c for c in all_claims}

    for edge in relations:
        if edge.get("target") != claim["id"]:
            continue
        related = by_id.get(edge.get("source"))
        if not related:
            continue
        item = {
            "title": related["title"],
            "source": related.get("source", "Retrieved abstract"),
            "confidence": related.get("confidence", "Moderate"),
        }
        if edge.get("type") == "contradicts":
            opposes.append(item)
        else:
            supports.append(item)

    if not supports:
        supports = [
            {
                "title": c["title"],
                "source": c.get("source", "Retrieved abstract"),
                "confidence": c.get("confidence", "Moderate"),
            }
            for c in all_claims
            if c["id"] != claim["id"] and c.get("state") == claim.get("state")
        ][:2]

    if not opposes:
        opposes = [
            {
                "title": c["title"],
                "source": c.get("source", "Retrieved abstract"),
                "confidence": c.get("confidence", "Moderate"),
            }
            for c in all_claims
            if c["id"] != claim["id"] and c.get("state") != claim.get("state")
        ][:2]

    context = (
        f"Within the topic '{topic}', this claim is evaluated against related evidence "
        f"from {len(all_claims)} extracted claims and {len(relations)} detected relations."
    )

    return {
        "context": context,
        "support": supports[:3],
        "opposition": opposes[:3],
    }


# ── Public API ───────────────────────────────────────────────────────────────

async def get_focus(claim_id: str) -> dict | None:
    """
    Get deep reasoning data for a specific claim.

    Searches all cached topics for the claim, then generates or retrieves
    the focus analysis.

    Returns:
        FocusResponse-shaped dict, or None if claim not found
    """
    print(f"Focus service: retrieving claim {claim_id}")
    
    # Find the claim across all cached topics
    claim = None
    all_claims = []
    relations = []
    topic = ""

    for topic_id in get_all_topic_ids():
        cached = get_cached_topic(topic_id)
        if not cached:
            continue
        for c in cached["claims"]:
            if c["id"] == claim_id:
                claim = c
                all_claims = cached["claims"]
                relations = cached.get("relations", [])
                topic = cached.get("topic", "")
                break
        if claim:
            print(f"   Found in topic: {topic_id}")
            break

    if not claim:
        print("   Claim not found in cache")
        return None

    focus_data = _build_focus_data(claim, all_claims, relations, topic)
    print("   Focus built from cached query data")

    return {
        "id": claim["id"],
        "title": claim["title"],
        "source": claim["source"],
        "state": claim["state"],
        "confidence": claim["confidence"],
        "context": focus_data["context"],
        "support": focus_data["support"],
        "opposition": focus_data["opposition"],
    }
