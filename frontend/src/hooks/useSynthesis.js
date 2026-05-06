import { useState, useCallback } from "react";
import { generateSynthesis as generateSynthesisApi } from "../api/synthesis.js";

export function useSynthesis() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (claimIds) => {
    console.log(`🧬 Generating synthesis for claims:`, claimIds);
    setLoading(true);
    setError(null);
    try {
      const data = await generateSynthesisApi(claimIds);
      console.log(`✓ Synthesis generated with ${data.length} nodes`);
      setNodes(data);
      return data;
    } catch (err) {
      console.error(`✗ Synthesis failed: ${err.message}`);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const reset = useCallback(() => {
    console.log(`🔄 Resetting synthesis`);
    setNodes([]);
  }, []);

  return { nodes, loading, error, generate, reset };
}