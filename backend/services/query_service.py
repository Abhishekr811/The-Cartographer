"""
RSE — Query Service

Orchestrates the full query processing pipeline:
Topic → Papers → Claims → Relations → State → Response
"""

import asyncio

from processors.claim_extractor import extract_claims
from processors.relation_detector import detect_relations
from processors.state_builder import build_state
from clients import arxiv_client, semantic_scholar_client
from schemas.query_schema import (
    QueryResponse,
    SummaryMetric,
    ClaimBrief,
    PaperBrief,
    StructuredSummary
)

# ── In-memory cache ──────────────────────────────────────────────────────────
# Stores processed results keyed by topic_id for downstream endpoints.

_topic_cache: dict[str, dict] = {}


def get_cached_topic(topic_id: str) -> dict | None:
    """Retrieve a cached topic result."""
    return _topic_cache.get(topic_id)


def get_all_topic_ids() -> list[str]:
    """List all cached topic IDs."""
    return list(_topic_cache.keys())


# ── Pipeline ─────────────────────────────────────────────────────────────────

async def process_query(topic: str) -> QueryResponse:
    """
    Full query processing pipeline.

    1. Fetch papers from external APIs (if LLM mode)
    2. Extract claims from paper abstracts
    3. Detect relationships between claims
    4. Build knowledge state
    5. Cache results and return structured response
    """
    print(f"\n{'='*80}")
    print(f"Processing topic: {topic}")
    print(f"{'='*80}")

    abstracts = []
    all_papers = []

    # Step 1: Fetch papers for this topic from external APIs.
    try:
        arxiv_papers = await asyncio.wait_for(
            arxiv_client.search_papers(topic, max_results=8),
            timeout=15,
        )
    except asyncio.TimeoutError:
        print(f"   arXiv timed out for topic: {topic}")
        arxiv_papers = []
    all_papers.extend(arxiv_papers)
    abstracts.extend(p["abstract"] for p in arxiv_papers if p.get("abstract"))
    print(f"   arXiv fetched: {len(arxiv_papers)}")

    try:
        ss_papers = await asyncio.wait_for(
            semantic_scholar_client.search_papers(topic, limit=5),
            timeout=8,
        )
    except asyncio.TimeoutError:
        print(f"   Semantic Scholar timed out for topic: {topic}")
        ss_papers = []
    all_papers.extend(ss_papers)
    abstracts.extend(p["abstract"] for p in ss_papers if p.get("abstract"))
    print(f"   Semantic Scholar fetched: {len(ss_papers)}")

    print(f"Papers fetched: {len(all_papers)}")
    if not all_papers:
        raise RuntimeError("No papers could be fetched for this topic")

    # Step 2: Extract claims
    print("Extracting claims...")
    topic_id, claims = await extract_claims(topic, all_papers)
    print(f"   Topic ID: {topic_id}")
    print(f"Claims generated: {len(claims)}")
    for c in claims[:3]:
        print(f"     - [{c['state']}] {c['title'][:60]}...")

    # Step 3: Detect relationships
    print("Detecting claim relationships...")
    relations = await detect_relations(claims)
    print(f"Relations generated: {len(relations)}")
    for r in relations[:3]:
        print(f"     - {r['source']} -> {r['target']} ({r['type']})")

    # Step 4: Build state
    print("Building knowledge state...")
    state = build_state(topic, claims, relations)
    print(f"   Summary metrics: {state['summaryMetrics']}")

    # Step 5: Cache everything for downstream endpoints
    _topic_cache[topic_id] = {
        "topic": topic,
        "topic_id": topic_id,
        "claims": claims,
        "relations": relations,
        "state": state,
        "papers": all_papers,
    }
    print(f"Cached results for topic: {topic_id}")

    # Step 6: Build response
    response = QueryResponse(
        topicId=topic_id,
        summaryMetrics=[SummaryMetric(**m) for m in state["summaryMetrics"]],
        stateCards=state["stateCards"],
        claims=[
            ClaimBrief(
                id=c["id"],
                text=c["title"],
                type=c["state"],
                confidence=c["confidence"].lower() if c.get("confidence") else "low",
                paper_id=c.get("paper_id", ""),
                title=c.get("paper_title", ""),
                abstract=c.get("paper_abstract", ""),
                url=c.get("paper_url", "")
            )
            for c in claims[:5]  # Return top 5 in the query response
        ],
        structuredSummary=StructuredSummary(**state["structuredSummary"]),
        papers=[
            PaperBrief(
                paper_id=p.get("paper_id", ""),
                title=p.get("title", ""),
                abstract=p.get("abstract", ""),
                url=p.get("url", "")
            )
            for p in all_papers
        ]
    )
    
    print(f"{'='*80}\n")
    return response
