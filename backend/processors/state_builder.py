"""
RSE — State Builder

Computes knowledge state from claims and relationships:
- consensus level
- conflict intensity
- gap identification
- state triad (established / debated / unknown)
- debate block (support vs opposition)
"""


def build_state(topic: str, claims: list[dict], relations: list[dict]) -> dict:
    """
    Compute the complete knowledge state from processed claims and relations.

    Returns a dict with:
        - summaryMetrics: [{label, value, tone}]
        - stateCards: [{id, title, state, description, claims}]
        - debateData: {title, support, opposition}
    """
    established = [c for c in claims if c.get("state") == "established"]
    debated = [c for c in claims if c.get("state") == "debated"]
    unknown = [c for c in claims if c.get("state") == "unknown"]

    # ── Summary metrics ──────────────────────────────────────────────────

    # Consensus: ratio of established claims to total
    total = max(len(claims), 1)
    consensus_ratio = len(established) / total

    if consensus_ratio >= 0.6:
        consensus = ("High", "established")
    elif consensus_ratio >= 0.3:
        consensus = ("Moderate", "debated")
    else:
        consensus = ("Low", "unknown")

    # Conflict: ratio of contradictions to total relations
    contradictions = sum(1 for r in relations if r.get("type") == "contradicts")
    total_relations = max(len(relations), 1)
    conflict_ratio = contradictions / total_relations

    if conflict_ratio >= 0.5:
        conflict = ("High", "debated")
    elif conflict_ratio >= 0.2:
        conflict = ("Moderate", "debated")
    else:
        conflict = ("Low", "established")

    # Gaps: ratio of unknown claims
    gap_ratio = len(unknown) / total

    if gap_ratio >= 0.4:
        gaps = ("Significant", "unknown")
    elif gap_ratio >= 0.2:
        gaps = ("Emerging", "established")
    else:
        gaps = ("Minimal", "established")

    summary_metrics = [
        {"label": "Consensus", "value": consensus[0].lower(), "tone": consensus[1]},
        {"label": "Conflict", "value": conflict[0].lower(), "tone": conflict[1]},
        {"label": "Gaps", "value": gaps[0].lower(), "tone": gaps[1]},
    ]

    structured_summary = {
        "key_points": [c.get("title", "") for c in established[:3]],
        "main_conflicts": [c.get("title", "") for c in debated[:3]],
        "confidence": consensus[0]
    }

    # ── State cards ──────────────────────────────────────────────────────
    
    established_cards = [{"id": c["id"], "text": c["title"]} for c in established]
    unknown_cards = [{"id": c["id"], "text": c["title"]} for c in unknown]
    
    debated_cards = []
    for c in debated:
        debated_cards.append({
            "id": c["id"],
            "positionA": f"Within '{topic}', supporting evidence suggests: {c['title']}",
            "positionB": f"Within '{topic}', opposing evidence challenges: {c['title']}",
            "coreTension": c["title"]
        })

    state_cards = {
        "established": established_cards,
        "debated": debated_cards,
        "unknown": unknown_cards
    }

    return {
        "summaryMetrics": summary_metrics,
        "stateCards": state_cards,
        "structuredSummary": structured_summary,
    }


# ── Description generators ──────────────────────────────────────────────────

def _describe_established(claims: list[dict]) -> str:
    if not claims:
        return "No findings have reached stable consensus in the current evidence base."
    if len(claims) >= 4:
        return "Findings repeatedly supported across high-quality sources with stable reproducibility."
    return f"{len(claims)} findings show consistent support across multiple independent sources."


def _describe_debated(claims: list[dict]) -> str:
    if not claims:
        return "No active debates detected in the current evidence base."
    if len(claims) >= 3:
        return "Evidence conflict remains active. Source quality is strong but interpretations diverge."
    return f"{len(claims)} findings show active disagreement between research groups."


def _describe_unknown(claims: list[dict]) -> str:
    if not claims:
        return "Current literature appears to address key questions without major blind spots."
    if len(claims) >= 3:
        return "Current literature has meaningful blind spots where direct evidence is still missing."
    return f"{len(claims)} areas lack sufficient evidence for classification."


def _truncate_topic(topic: str) -> str:
    """Clean up topic for debate block title."""
    topic = topic.strip().rstrip(".")
    if len(topic) > 100:
        return topic[:97] + "..."
    return topic
