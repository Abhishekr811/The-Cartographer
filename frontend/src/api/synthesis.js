/**
 * POST /api/synthesis
 * Generate a synthesis graph from selected claim IDs.
 */
const BASE_URL = "http://localhost:8000/api";

export async function generateSynthesis(claimIds) {
  const res = await fetch(`${BASE_URL}/synthesis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ claims: claimIds }),
  });
  if (!res.ok) throw new Error(`Synthesis failed: ${res.status}`);
  return res.json();
}