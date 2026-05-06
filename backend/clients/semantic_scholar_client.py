"""
RSE — Semantic Scholar Client

Uses the Semantic Scholar Academic Graph API to search and retrieve papers.
Returns normalized paper objects for downstream processing.
"""

import httpx
from typing import Optional
from core.config import settings


_FIELDS = "title,authors,abstract,year,citationCount,externalIds,fieldsOfStudy"


async def search_papers(
    query: str,
    limit: int = 10,
) -> list[dict]:
    """
    Search Semantic Scholar for papers matching the query.

    Args:
        query: Search query string
        limit: Maximum number of papers to return

    Returns:
        List of normalized paper dicts:
        {title, authors, abstract, year, citation_count, paper_id, fields}
    """
    url = f"{settings.SEMANTIC_SCHOLAR_BASE_URL}/paper/search"
    params = {
        "query": query,
        "limit": limit,
        "fields": _FIELDS,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
        except (httpx.HTTPError, Exception):
            # Semantic Scholar can be rate-limited; return empty gracefully
            return []

    papers = []
    for item in data.get("data", []):
        normalized = _normalize(item)
        if normalized:
            papers.append(normalized)

    return papers


def _normalize(item: dict) -> Optional[dict]:
    """Convert a Semantic Scholar result into a clean, normalized dict."""
    if not item.get("title"):
        return None

    authors = item.get("authors") or []
    author_names = [a.get("name", "") for a in authors[:5]]

    return {
        "title": item["title"],
        "authors": author_names,
        "abstract": item.get("abstract") or "",
        "year": item.get("year"),
        "citation_count": item.get("citationCount", 0),
        "paper_id": item.get("paperId", ""),
        "url": f"https://www.semanticscholar.org/paper/{item.get('paperId')}" if item.get("paperId") else "",
        "fields": (item.get("fieldsOfStudy") or [])[:3],
    }


async def get_paper_by_id(paper_id: str) -> Optional[dict]:
    """Fetch a single paper by its Semantic Scholar paper ID."""
    url = f"{settings.SEMANTIC_SCHOLAR_BASE_URL}/paper/{paper_id}"
    params = {"fields": _FIELDS}

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return _normalize(response.json())
        except (httpx.HTTPError, Exception):
            return None
