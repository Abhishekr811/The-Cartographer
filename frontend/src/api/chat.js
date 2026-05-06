const BASE_URL = "http://localhost:8000/api";

export async function submitChatMessage(question, topicId, context) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, topic_id: topicId, context }),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const payload = await res.json();
      detail = payload?.detail ? ` - ${payload.detail}` : "";
    } catch {
      // Ignore parse errors.
    }
    throw new Error(`Chat failed: ${res.status}${detail}`);
  }
  return res.json();
}
