/**
 * GET /api/focus/:claimId
 * Fetch deep reasoning and evidence for a specific claim.
 */
const BASE_URL = "http://localhost:8000/api";

export async function fetchFocus(claimId) {
  const res = await fetch(`${BASE_URL}/focus/${claimId}`);
  if (!res.ok) throw new Error(`Focus fetch failed: ${res.status}`);
  return res.json();
}