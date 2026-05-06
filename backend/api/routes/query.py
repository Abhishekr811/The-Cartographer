"""
RSE — Query Route

POST /api/query
Accepts a research topic and returns structured knowledge state.
"""

from fastapi import APIRouter, HTTPException
from schemas.query_schema import QueryRequest, QueryResponse
from services import query_service

router = APIRouter()


@router.post("/query", response_model=QueryResponse)
async def submit_query(request: QueryRequest):
    """
    Process a research query and return structured state data.

    The pipeline:
    1. Fetch papers from arXiv / Semantic Scholar
    2. Extract atomic claims from paper text
    3. Detect relationships between claims
    4. Compute knowledge state (consensus, conflict, gaps)
    5. Return structured response
    """
    if not request.topic or not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic is required")

    try:
        result = await query_service.process_query(request.topic.strip())
        return result
    except RuntimeError as e:
        # Upstream sources can temporarily fail or rate-limit; surface a clean retryable error.
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Unexpected query processing error") from exc
