"""Quick endpoint test script."""
import httpx

BASE = "http://localhost:8000"

# 1. Query
print("=== POST /api/query ===")
r = httpx.post(f"{BASE}/api/query", json={"topic": "rapamycin longevity"})
print(f"Status: {r.status_code}")
d = r.json()
topic_id = d["topicId"]
print(f"topicId: {topic_id}")
print(f"claims in response: {len(d['claims'])}")
print(f"stateCards (established): {[c['text'] for c in d['stateCards'].get('established', [])]}")
print(f"summaryMetrics: {[(m['label'], m['value']) for m in d['summaryMetrics']]}")
print()

# 2. Claims
print("=== GET /api/claims ===")
r2 = httpx.get(f"{BASE}/api/claims", params={"topic_id": topic_id})
print(f"Status: {r2.status_code}")
claims = r2.json()
print(f"Total claims: {len(claims)}")
for c in claims:
    print(f"  [{c['id']}] {c['type']}: {c['text'][:50]}")
print()

# 3. Relations
print("=== GET /api/claims/relations ===")
r3 = httpx.get(f"{BASE}/api/claims/relations", params={"topic_id": topic_id})
print(f"Status: {r3.status_code}")
rels = r3.json()
print(f"Total relations: {len(rels)}")
for rel in rels:
    print(f"  {rel['source']} --{rel['type']}--> {rel['target']}")
print()

# 4. Focus
print(f"=== GET /api/focus/{claims[0]['id']} ===")
r4 = httpx.get(f"{BASE}/api/focus/{claims[0]['id']}")
print(f"Status: {r4.status_code}")
focus = r4.json()
print(f"Title: {focus['title'][:50]}")
print(f"State: {focus['state']}, Confidence: {focus['confidence']}")
print(f"Context: {focus['context'][:80]}...")
print(f"Support: {len(focus['support'])} items")
print(f"Opposition: {len(focus['opposition'])} items")
print()

# 5. Archive
print("=== GET /api/archive ===")
r5 = httpx.get(f"{BASE}/api/archive")
print(f"Status: {r5.status_code}")
archive = r5.json()
print(f"Total entries: {len(archive)}")
for entry in archive:
    print(f"  [{entry['id']}] {entry['state']}: {entry['title'][:50]}")
print()

# 6. Synthesis
print("=== POST /api/synthesis ===")
r6 = httpx.post(f"{BASE}/api/synthesis", json={"claims": ["c1", "c2", "c3"]})
print(f"Status: {r6.status_code}")
nodes = r6.json()
print(f"Total nodes: {len(nodes)}")
for node in nodes:
    print(f"  [{node['id']}] {node['heading']}: {node['text'][:50]}")
print()

print("=== ALL ENDPOINTS PASSED ===")
