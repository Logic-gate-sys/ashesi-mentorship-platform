import { useEffect, useState } from 'react';

interface PendingRequest {
  id: string;
  name: string;
  role: string;
  program: string;
  initials: string;
  status: 'pending';
  lastInteraction: string;
}

interface UsePendingRequestsResult {
  requests: PendingRequest[];
  loading: boolean;
  error: string | null;
  acceptRequest: (requestId: string) => Promise<{ success: boolean; error?: string }>;
  declineRequest: (requestId: string) => void;
}

export function usePendingRequests(): UsePendingRequestsResult {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/mentor/requests');

        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }

        const data = await response.json();

        if (data.success) {
          setRequests(data.data);
          setError(null);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const acceptRequest = async (requestId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/mentor/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Return error message without removing from list
        return {
          success: false,
          error: data.error,
        };
      }

      // Only remove from pending requests on success
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to accept request';
      return {
        success: false,
        error: errorMsg,
      };
    }
  };

  const declineRequest = (requestId: string) => {
    // TODO: Call API to decline request
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  return { requests, loading, error, acceptRequest, declineRequest };
}
