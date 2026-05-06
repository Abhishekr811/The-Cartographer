from pydantic import BaseModel
from typing import List, Dict, Any

class ChatContext(BaseModel):
    claims: List[Dict[str, Any]]
    relations: List[Dict[str, Any]]
    papers: List[Dict[str, Any]]

class ChatRequest(BaseModel):
    question: str
    topic_id: str
    context: ChatContext

class ChatResponse(BaseModel):
    answer: str
    references: List[str]
