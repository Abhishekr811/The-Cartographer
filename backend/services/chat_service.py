"""
RSE — Chat Service

Processes contextual questions based on the active query state.
In a real system, this would construct a prompt with the claims, relations, and papers,
and query an LLM. Here we simulate grounded answers based on the provided context.
"""
import re
from schemas.chat_schema import ChatRequest, ChatResponse

async def process_chat(request: ChatRequest) -> dict:
    question = request.question.lower()
    claims = request.context.claims
    relations = request.context.relations
    papers = request.context.papers
    
    answer = ""
    references = set()
    
    if "debate" in question or "contradict" in question:
        debated_claims = [c for c in claims if c.get("type") == "debated" or c.get("state") == "debated"]
        if debated_claims:
            answer = f"Our analysis of {len(papers)} papers revealed {len(debated_claims)} active debates. For instance, '{debated_claims[0]['title'][:50]}...' shows significant conflict in the literature."
            for c in debated_claims:
                if c.get("paper_id"):
                    references.add(c["paper_id"])
        else:
            answer = f"Across the {len(papers)} papers examined, we didn't find explicit contradictions. The findings appear to be relatively consistent."
            
    elif "support" in question or "agree" in question:
        established_claims = [c for c in claims if c.get("type") == "established" or c.get("state") == "established"]
        if established_claims:
            answer = f"There is a strong consensus on {len(established_claims)} key claims. Papers like '{papers[0]['title'][:50]}...' provide foundational support for these findings."
            for c in established_claims:
                if c.get("paper_id"):
                    references.add(c["paper_id"])
        else:
            answer = "The current research state doesn't show firm consensus yet; most claims are still categorized as debated or preliminary."
            
    elif "summarize" in question or "paper" in question:
        answer = f"We have retrieved {len(papers)} papers on this topic, resulting in {len(claims)} extracted claims. The knowledge graph maps {len(relations)} specific relationships (support/contradiction) between these findings."
        for p in papers[:3]:
            if p.get("paper_id"):
                references.add(p["paper_id"])
                
    else:
        # Context-aware default
        answer = f"Regarding your question: we've identified {len(claims)} claims across {len(papers)} papers. You can see how these are linked in the relation graph, which currently shows {len(relations)} detected connections."
        if papers:
            references.add(papers[0].get("paper_id", ""))

    return {"answer": answer, "references": [r for r in references if r]}
