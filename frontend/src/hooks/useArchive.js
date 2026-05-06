import { useState, useCallback } from "react";
import { fetchArchive, saveArchive as saveArchiveApi } from "../api/archive.js";

export function useArchive() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadArchive = useCallback(async () => {
    console.log(`📚 Loading archive...`);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArchive();
      console.log(`✓ Archive loaded with ${data.length} entries`);
      setEntries(data);
    } catch (err) {
      console.error(`✗ Archive load failed: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = useCallback(async (payload) => {
    console.log(`💾 Saving archive entry:`, payload);
    try {
      const saved = await saveArchiveApi(payload);
      console.log(`✓ Entry saved:`, saved);
      setEntries((prev) => [saved, ...prev]);
      return saved;
    } catch (err) {
      console.error(`✗ Archive save failed: ${err.message}`);
      setError(err.message);
      return null;
    }
  }, []);

  return { entries, loading, error, loadArchive, addEntry };
}