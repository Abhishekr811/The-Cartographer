import { useState, useCallback } from "react";
import { fetchClaims } from "../api/claims.js";

export function useClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadClaims = useCallback(async (topicId) => {
    console.log(`📋 Loading claims for topic: ${topicId}`);

    setLoading(true);
    setError(null);
    setClaims([]);
    try {
      const data = await fetchClaims(topicId);
      console.log(`✓ Fetched ${data.length} claims from API`);
      setClaims(data);
    } catch (err) {
      console.error(`✗ Claims fetch failed: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    console.log(`🔄 Resetting claims`);
    setClaims([]);
  }, []);

  return { claims, loading, error, loadClaims, reset };
}