"""
RSE — Claim Extractor

Transforms paper abstracts into structured atomic claims using deterministic
text heuristics so output always depends on the retrieved papers.
"""

import hashlib
import re


def _generate_topic_id(topic: str) -> str:
    """Create a deterministic topic ID from the topic string."""
    slug = topic.lower().strip()
    short_hash = hashlib.md5(slug.encode()).hexdigest()[:8]
    # Create a readable prefix
    words = re.findall(r"[a-z0-9]+", slug)[:3]
    prefix = "-".join(words)[:20] or "topic"
    return f"topic-{prefix}-{short_hash}"


def _topic_terms(topic: str) -> set[str]:
    stop = {
        "the", "and", "for", "with", "from", "into", "that", "this", "are",
        "was", "were", "have", "has", "about", "among", "using", "between",
        "across", "in", "on", "of", "to", "a", "an", "by",
    }
    words = re.findall(r"[a-z0-9]+", topic.lower())
    return {w for w in words if len(w) > 2 and w not in stop}


def _split_sentences(text: str) -> list[str]:
    clean = re.sub(r"\s+", " ", (text or "").strip())
    if not clean:
        return []
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", clean) if len(s.strip()) >= 40]


def _state_from_sentence(sentence: str) -> tuple[str, str]:
    s = sentence.lower()
    if any(k in s for k in ["may", "might", "preliminary", "unclear", "insufficient", "unknown"]):
        return "unknown", "Low"
    if any(k in s for k in ["however", "but", "conflict", "mixed", "inconsistent", "controvers"]):
        return "debated", "Moderate"
    return "established", "High"


def _extract_claims_from_papers(topic: str, papers: list[dict]) -> list[dict]:
    terms = _topic_terms(topic)
    scored: list[tuple[int, str, dict]] = []
    for paper in papers:
        abstract = paper.get("abstract") or ""
        for sentence in _split_sentences(abstract):
            words = set(re.findall(r"[a-z0-9]+", sentence.lower()))
            overlap = len(words & terms)
            if overlap > 0:
                scored.append((overlap, sentence, paper))

    scored.sort(key=lambda x: (-x[0], -len(x[1])))
    selected = []
    seen = set()
    for _, sentence, paper in scored:
        key = sentence.lower()
        if key in seen:
            continue
        seen.add(key)
        selected.append((sentence, paper))
        if len(selected) >= 9:
            break

    if len(selected) < 6:
        for paper in papers:
            abstract = paper.get("abstract") or ""
            for sentence in _split_sentences(abstract):
                key = sentence.lower()
                if key in seen:
                    continue
                seen.add(key)
                selected.append((sentence, paper))
                if len(selected) >= 6:
                    break
            if len(selected) >= 6:
                break

    claims = []
    for idx, (sentence, paper) in enumerate(selected):
        state, confidence = _state_from_sentence(sentence)
        title = sentence[:220].rstrip(".; ")
        claims.append(
            {
                "title": title,
                "source": paper.get("title", f"Retrieved abstract #{idx + 1}"),
                "confidence": confidence,
                "state": state,
                "paper_id": paper.get("paper_id", ""),
                "paper_title": paper.get("title", ""),
                "paper_abstract": paper.get("abstract", ""),
                "paper_url": paper.get("url", ""),
            }
        )
    return claims


# ── Public API ───────────────────────────────────────────────────────────────

async def extract_claims(topic: str, papers: list[dict] | None = None) -> tuple[str, list[dict]]:
    """
    Extract claims from a research topic.

    Returns:
        (topic_id, list_of_claims)
    """
    topic_id = _generate_topic_id(topic)
    print(f"   Claim extractor: processing '{topic}'")

    if not papers:
        raise RuntimeError("No papers available for claim extraction")

    claims = _extract_claims_from_papers(topic, papers)
    if not claims:
        raise RuntimeError("Unable to extract claims from fetched papers")
    print(f"      Extracted {len(claims)} claims from abstracts")

    # Assign unique IDs globally based on topic and claim index
    for i, claim in enumerate(claims):
        claim["id"] = f"{topic_id}-c{i + 1}"

    return topic_id, claims
