"""
RSE — Relation Detector

Identifies relationships between claims from textual overlap and state pairs.
"""

import re


def _tokenize(text: str) -> set[str]:
    stop = {
        "the", "and", "for", "with", "from", "into", "that", "this", "are",
        "was", "were", "have", "has", "about", "among", "using", "between",
        "across", "in", "on", "of", "to", "a", "an", "by", "show", "shows",
    }
    words = re.findall(r"[a-z0-9]+", (text or "").lower())
    return {w for w in words if len(w) > 2 and w not in stop}


def _relation_type(a_state: str, b_state: str, overlap: int) -> str | None:
    if overlap < 2:
        return None
    states = {a_state, b_state}
    if "debated" in states and "established" in states:
        return "contradicts"
    if "unknown" in states:
        return "related_to"
    return "supports"


def _build_relations(claims: list[dict]) -> list[dict]:
    if len(claims) < 2:
        return []

    relations = []
    for i in range(len(claims)):
        for j in range(i + 1, len(claims)):
            a = claims[i]
            b = claims[j]
            overlap = len(_tokenize(a.get("title", "")) & _tokenize(b.get("title", "")))
            rel_type = _relation_type(a.get("state", "unknown"), b.get("state", "unknown"), overlap)
            if not rel_type:
                continue
            relations.append({
                "source": a["id"],
                "target": b["id"],
                "type": rel_type,
            })

    if not relations and len(claims) >= 2:
        relations.append({"source": claims[0]["id"], "target": claims[1]["id"], "type": "related_to"})

    return relations[:12]


# ── Public API ───────────────────────────────────────────────────────────────

async def detect_relations(claims: list[dict]) -> list[dict]:
    """
    Detect relationships between claims.

    Returns:
        list of { source, target, type } edges
    """
    print(f"   Relation detector: analyzing {len(claims)} claims...")
    result = _build_relations(claims)
    print(f"      Detected {len(result)} relationships")
    return result
