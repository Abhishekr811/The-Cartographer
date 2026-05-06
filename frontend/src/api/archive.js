/**
 * GET /api/archive
 * POST /api/archive
 * Fetch all archive entries or save a new one.
 */
const BASE_URL = "http://localhost:8000/api";

export async function fetchArchive() {
  const res = await fetch(`${BASE_URL}/archive`);
  if (!res.ok) throw new Error(`Archive fetch failed: ${res.status}`);
  return res.json();
}

export async function saveArchive(payload) {
  const res = await fetch(`${BASE_URL}/archive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Archive save failed: ${res.status}`);
  return res.json();
}