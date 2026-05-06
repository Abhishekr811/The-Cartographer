import { useState, useCallback, useRef } from "react";
import { fetchQueryState } from "../api/query.js";

function validateQueryResponse(data) {
  if (!data.topicId || !data.stateCards) {
    throw new Error("Invalid API response");
  }
}

export function useQuery() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const activeControllerRef = useRef(null);

  const submitQuery = useCallback(async (topic) => {
    console.log(`📝 Submitting query: "${topic}"`);
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
    }
    const controller = new AbortController();
    activeControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setState(null);
    try {
      const data = await fetchQueryState(topic, { signal: controller.signal });
      console.log(`✓ Received response with topic ID: ${data.topicId}`);
      console.log(`  - Summary metrics:`, data.summaryMetrics);
      console.log(`  - State cards:`, data.stateCards);
      validateQueryResponse(data);
      localStorage.setItem('rse_latest_topic_id', data.topicId);
      setState(data);
      console.log(`✓ State updated with new data`);
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      console.error(`✗ Query failed: ${err.message}`);
      setError(err.message);
    } finally {
      if (activeControllerRef.current === controller) {
        setLoading(false);
        activeControllerRef.current = null;
      }
    }
  }, []);

  const reset = useCallback(() => {
    console.log(`🔄 Resetting query state`);
    setState(null);
    setError(null);
  }, []);

  return { state, loading, error, submitQuery, reset };
}