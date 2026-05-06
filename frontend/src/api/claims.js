/**
 * GET /api/claims?topic_id=
 * Fetch all claims for a given topic.
 */
const BASE_URL = "http://localhost:8000/api";

export async function fetchClaims(topicId) {
  const res = await fetch(`${BASE_URL}/claims?topic_id=${topicId}`);
  if (res.status === 404) {
    throw new Error("404: Session expired or not found. Please submit your search again.");
  }
  if (!res.ok) throw new Error(`Claims fetch failed: ${res.status}`);
  return res.json();
}