import { useState } from 'react';

interface AlumniCycleAvailability {
  cycleId: string;
  alumniId: string;
  isAvailable: boolean;
  availableSince: string;
  maxMentees: number;
}

interface UpdateResult {
  success: boolean;
  error?: string;
  message?: string;
}

export function useAlumniAvailability(cycleId: string): {
  availability: AlumniCycleAvailability | null;
  loading: boolean;
  error: string | null;
  toggleAvailability: (isAvailable: boolean, maxMentees?: number) => Promise<UpdateResult>;
} {
  const [availability, setAvailability] = useState<AlumniCycleAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`/api/alumni/cycles/${cycleId}/availability`);

      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }

      const data = await response.json();

      if (data.success) {
        setAvailability(data.data);
        setError(null);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (
    isAvailable: boolean,
    maxMentees = 2
  ): Promise<UpdateResult> => {
    try {
      const response = await fetch(
        `/api/alumni/cycles/${cycleId}/availability`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isAvailable, maxMentees: isAvailable ? maxMentees : 0 }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error,
        };
      }

      // Update local state
      setAvailability(data.data);

      return {
        success: true,
        message: data.message,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      return {
        success: false,
        error: errorMsg,
      };
    }
  };

  // Fetch on mount
  useState(() => {
    fetchAvailability();
  });

  return { availability, loading, error, toggleAvailability };
}
