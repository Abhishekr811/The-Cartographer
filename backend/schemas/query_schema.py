from pydantic import BaseModel
from typing import List

class QueryRequest(BaseModel):
    topic: str

class PaperBrief(BaseModel):
    paper_id: str
    title: str
    abstract: str
    url: str

class StructuredSummary(BaseModel):
    key_points: List[str]
    main_conflicts: List[str]
    confidence: str

class SummaryMetric(BaseModel):
    label: str
    value: str
    tone: str

class StateCardItem(BaseModel):
    id: str
    text: str

class DebatedStateCardItem(BaseModel):
    id: str
    positionA: str
    positionB: str
    coreTension: str

class StateCards(BaseModel):
    established: List[StateCardItem]
    debated: List[DebatedStateCardItem]
    unknown: List[StateCardItem]

class ClaimBrief(BaseModel):
    id: str
    text: str
    type: str  # "established | debated | unknown"
    confidence: str  # "high | medium | low"
    paper_id: str = ""
    title: str = ""
    abstract: str = ""
    url: str = ""

class QueryResponse(BaseModel):
    topicId: str
    summaryMetrics: List[SummaryMetric]
    stateCards: StateCards
    claims: List[ClaimBrief]
    structuredSummary: StructuredSummary
    papers: List[PaperBrief]
