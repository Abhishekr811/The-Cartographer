"""
RSE — Chat Route

POST /api/chat
Contextual chat regarding the current research state.
"""

from fastapi import APIRouter, HTTPException
from schemas.chat_schema import ChatRequest, ChatResponse
from services import chat_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a chat question based on the research state context.
    """
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question is required")

    try:
        result = await chat_service.process_chat(request)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
