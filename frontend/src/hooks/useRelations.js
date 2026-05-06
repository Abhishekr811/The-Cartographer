import { useState, useCallback } from "react";
import { fetchRelations } from "../api/relations.js";

export function useRelations() {
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRelations = useCallback(async (topicId) => {
    console.log(`🔗 Loading relations for topic: ${topicId}`);

    setLoading(true);
    setError(null);
    try {
      const data = await fetchRelations(topicId);
      console.log(`✓ Fetched ${data.length} relations from API`);
      setRelations(data);
    } catch (err) {
      console.error(`✗ Relations fetch failed: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    console.log(`🔄 Resetting relations`);
    setRelations([]);
  }, []);

  return { relations, loading, error, loadRelations, reset };
}