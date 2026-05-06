"""
RSE — arXiv Client

Uses the `arxiv` Python package to search and retrieve research papers.
Returns normalized paper objects for downstream processing.
"""

import arxiv
import asyncio
from typing import Optional


async def search_papers(
    query: str,
    max_results: int = 10,
    sort_by: str = "relevance",
) -> list[dict]:
    """
    Search arXiv for papers matching the query.

    Args:
        query: Search query string (topic)
        max_results: Maximum number of papers to return
        sort_by: "relevance" or "submittedDate"

    Returns:
        List of normalized paper dicts:
        {title, authors, abstract, published, arxiv_id, url, categories}
    """
    sort_criterion = (
        arxiv.SortCriterion.Relevance
        if sort_by == "relevance"
        else arxiv.SortCriterion.SubmittedDate
    )

    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=sort_criterion,
    )

    # Run the synchronous arxiv client in a thread pool to keep async
    loop = asyncio.get_event_loop()
    try:
        results = await loop.run_in_executor(
            None,
            lambda: list(search.results()),
        )
    except Exception as exc:  # noqa: BLE001
        print(f"arXiv search failed for query '{query}': {exc}")
        return []

    papers = []
    for result in results:
        papers.append(_normalize(result))

    return papers


def _normalize(result) -> dict:
    """Convert an arxiv.Result into a clean, normalized dict."""
    return {
        "title": result.title,
        "authors": [a.name for a in result.authors[:5]],  # cap at 5 authors
        "abstract": result.summary,
        "published": result.published.strftime("%Y-%m-%d") if result.published else None,
        "arxiv_id": result.entry_id.split("/")[-1] if result.entry_id else None,
        "paper_id": result.entry_id.split("/")[-1] if result.entry_id else "",
        "url": result.entry_id,
        "categories": result.categories[:3] if result.categories else [],
    }


async def get_paper_by_id(arxiv_id: str) -> Optional[dict]:
    """Fetch a single paper by its arXiv ID."""
    search = arxiv.Search(id_list=[arxiv_id])

    loop = asyncio.get_event_loop()
    results = await loop.run_in_executor(
        None,
        lambda: list(search.results()),
    )

    if results:
        return _normalize(results[0])
    return None
