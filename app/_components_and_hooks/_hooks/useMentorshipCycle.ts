import { useEffect, useState } from 'react';

interface MentorshipCycleStatus {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'closed' | 'ended';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  progressPercent: number;
  totalMentors: number;
  activeMentorships: number;
  message: string;
}

export function useMentorshipCycle(): {
  cycle: MentorshipCycleStatus | null;
  loading: boolean;
  error: string | null;
} {
  const [cycle, setCycle] = useState<MentorshipCycleStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        const response = await fetch('/api/cycles/current');

        if (!response.ok) {
          throw new Error('Failed to fetch cycle');
        }

        const data = await response.json();

        if (data.success) {
          setCycle(data.data);
          setError(null);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setCycle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCycle();
  }, []);

  return { cycle, loading, error };
}
