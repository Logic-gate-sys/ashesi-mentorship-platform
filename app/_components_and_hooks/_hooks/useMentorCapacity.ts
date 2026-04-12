import { useEffect, useState } from 'react';

interface CapacityData {
  activeMentees: number;
  maxCapacity: number;
  recommendedCapacity: {
    min: number;
    max: number;
  };
  canAcceptMore: boolean;
  capacityStatus: 'ideal' | 'good' | 'full' | 'over_capacity';
  message: string;
}

export function useMentorCapacity(): {
  capacity: CapacityData | null;
  loading: boolean;
  error: string | null;
} {
  const [capacity, setCapacity] = useState<CapacityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        const response = await fetch('/api/mentor/capacity');

        if (!response.ok) {
          throw new Error('Failed to fetch capacity');
        }

        const data = await response.json();

        if (data.success) {
          setCapacity(data.data);
          setError(null);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setCapacity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCapacity();
  }, []);

  return { capacity, loading, error };
}
