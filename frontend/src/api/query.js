/**
 * POST /api/query
 * Submit a research query and receive structured state data.
 */
const BASE_URL = "http://localhost:8000/api";

export async function fetchQueryState(topic, options = {}) {
  const res = await fetch(`${BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
    signal: options.signal,
  });
  if (!res.ok) {
    let detail = "";
    try {
      const payload = await res.json();
      detail = payload?.detail ? ` - ${payload.detail}` : "";
    } catch {
      // Ignore parse errors and fall back to status-only message.
    }
    throw new Error(`Query failed: ${res.status}${detail}`);
  }
  return res.json();
}