/**
 * GET /api/claims/relations?topic_id=
 * Fetch claim-to-claim relationship graph for a topic.
 */
const BASE_URL = "http://localhost:8000/api";

export async function fetchRelations(topicId) {
  const res = await fetch(`${BASE_URL}/claims/relations?topic_id=${topicId}`);
  if (res.status === 404) {
    throw new Error("404: Session expired or not found.");
  }
  if (!res.ok) throw new Error(`Relations fetch failed: ${res.status}`);
  return res.json();
}