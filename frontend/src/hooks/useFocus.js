import { useState, useCallback } from "react";
import { fetchFocus } from "../api/focus.js";

export function useFocus() {
  const [focusedClaim, setFocusedClaim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFocus = useCallback(async (claimId) => {
    console.log(`🔍 Loading focus for claim: ${claimId}`);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFocus(claimId);
      console.log(`✓ Focus data retrieved:`, data);
      setFocusedClaim(data);
      return data;
    } catch (err) {
      console.error(`✗ Focus load failed: ${err.message}`);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const closeFocus = useCallback(() => {
    console.log(`🔄 Closing focus mode`);
    setFocusedClaim(null);
  }, []);

  return { focusedClaim, loading, error, loadFocus, closeFocus };
}