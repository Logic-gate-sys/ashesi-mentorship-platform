"use client";
import { useFetchApi } from "../shared/useMentorApi";
import { useCallback, useRef, useState } from "react";

export function useMentorshipCycle() {
  const { authorizedFetch } = useFetchApi();
  const [isLoading, setIsLoading] = useState(false); // Start false
  const [error, setError] = useState<string | null>(null);
  const cycleRef = useRef<any>(null);

  const getCurrentCycle = useCallback(async () => {
    if (cycleRef.current) return cycleRef.current;
    setIsLoading(true);
    try {
      const response = await authorizedFetch("/api/cycle", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch cycle details");

      const body = await response.json();
      cycleRef.current = body.data;
      return body.data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false); // Set to false when done
    }
  }, [authorizedFetch]);

  return { getCurrentCycle, error, isLoading };
}
