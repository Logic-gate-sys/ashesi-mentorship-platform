import { useEffect, useState } from 'react';

interface MetricItem {
  value: string | number;
  label: string;
}

interface UseMentorMetricsResult {
  metrics: MetricItem[] | null;
  loading: boolean;
  error: string | null;
}

export function useMentorMetrics(): UseMentorMetricsResult {
  const [metrics, setMetrics] = useState<MetricItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/mentor/metrics');
        
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const data = await response.json();
        
        if (data.success) {
          setMetrics(data.data);
          setError(null);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}
