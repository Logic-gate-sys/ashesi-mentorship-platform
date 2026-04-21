'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/ _libs_and_schemas/context/auth-context';

interface MentorshipRequest {
  id: string;
  studentName: string;
  majorAndYear: string;
  studentAvatarUrl: string | null;
  message: string;
  goal: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
}

interface UseMentorshipRequestsReturn {
  requests: MentorshipRequest[];
  isLoading: boolean;
  error: string | null;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
}

export function useMentorshipRequests(): UseMentorshipRequestsReturn {
  const { getAccessToken, refreshAccessToken } = useAuth();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async (status?: string) => {
    try {
      setIsLoading(true);
      const url = new URL('/api/mentors/requests', window.location.origin);
      if (status) url.searchParams.set('status', status);

      const accessToken = getAccessToken();
      const response = await fetch(url.toString(), {
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          const retryResponse = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            credentials: 'include',
          });
          if (retryResponse.ok) {
            const { data } = await retryResponse.json();
            if (Array.isArray(data.requests)) {
              setRequests(
                data.requests.map((req: any) => ({
                  id: req.id,
                  studentName: req.studentName,
                  majorAndYear: req.majorAndYear,
                  studentAvatarUrl: req.studentAvatarUrl,
                  message: req.message || req.goal,
                  goal: req.goal,
                  status: req.status,
                  createdAt: req.createdAt,
                }))
              );
            }
            setError(null);
            return;
          }
        }
      }
      if (!response.ok) throw new Error(`Failed to fetch requests: ${response.status}`);

      const { data } = await response.json();
      
      if (Array.isArray(data.requests)) {
        setRequests(
          data.requests.map((req: any) => ({
            id: req.id,
            studentName: req.studentName,
            majorAndYear: req.majorAndYear,
            studentAvatarUrl: req.studentAvatarUrl,
            message: req.message || req.goal,
            goal: req.goal,
            status: req.status,
            createdAt: req.createdAt,
          }))
        );
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests('PENDING');
  }, [getAccessToken, refreshAccessToken]);

  const acceptRequest = async (requestId: string) => {
    try {
      const accessToken = getAccessToken();
      const response = await fetch(`/api/mentors/requests/${requestId}?action=accept`, {
        method: 'POST',
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: 'include',
      });
      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          const retryResponse = await fetch(`/api/mentors/requests/${requestId}?action=accept`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${newAccessToken}` },
            credentials: 'include',
          });
          if (!retryResponse.ok) throw new Error('Failed to accept request');
        }
      }
      if (!response.ok) throw new Error('Failed to accept request');
      
      // Refresh the list
      await fetchRequests('PENDING');
    } catch (err) {
      console.error('Failed to accept request:', err);
      setError(err instanceof Error ? err.message : 'Failed to accept request');
    }
  };

  const declineRequest = async (requestId: string) => {
    try {
      const accessToken = getAccessToken();
      const response = await fetch(`/api/mentors/requests/${requestId}?action=decline`, {
        method: 'POST',
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: 'include',
      });
      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          const retryResponse = await fetch(`/api/mentors/requests/${requestId}?action=decline`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${newAccessToken}` },
            credentials: 'include',
          });
          if (!retryResponse.ok) throw new Error('Failed to decline request');
        }
      }
      if (!response.ok) throw new Error('Failed to decline request');
      
      // Refresh the list
      await fetchRequests('PENDING');
    } catch (err) {
      console.error('Failed to decline request:', err);
      setError(err instanceof Error ? err.message : 'Failed to decline request');
    }
  };

  return {
    requests,
    isLoading,
    error,
    acceptRequest,
    declineRequest,
  };
}
