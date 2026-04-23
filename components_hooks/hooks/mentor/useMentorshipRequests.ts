'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMentorApi } from './useMentorApi';

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
  history: MentorshipRequest[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<boolean>;
  declineRequest: (requestId: string) => Promise<boolean>;
}

export function useMentorshipRequests(): UseMentorshipRequestsReturn {
  const { authorizedFetch } = useMentorApi();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [history, setHistory] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseRequest = (req: any): MentorshipRequest => ({
    id: req.id,
    studentName: req.studentName,
    majorAndYear: req.majorAndYear,
    studentAvatarUrl: req.studentAvatarUrl,
    message: req.message || req.goal,
    goal: req.goal,
    status: req.status,
    createdAt: req.createdAt,
  });

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authorizedFetch('/api/mentors/requests');
      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.status}`);
      }

      const body = await response.json();
      const {data, count, filters} = body.data ; 
      const pendingRequests: MentorshipRequest[] = data.filter((dt: MentorshipRequest)=> dt.status ==='PENDING');
      const resolvedRequests: MentorshipRequest[] = data.filter((request: MentorshipRequest) => request.status !== 'PENDING')
      setRequests(pendingRequests);
      setHistory(resolvedRequests);

      setError(null);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } 
  }, [authorizedFetch]);

  
  useEffect(() => {
    refresh();
  }, [refresh]);

  const acceptRequest = async (requestId: string) => {
    try {
      const response = await authorizedFetch(`/api/mentors/requests/${requestId}?action=accept`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      await refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept request');
      return false;
    }
  };

  const declineRequest = async (requestId: string) => {
    try {
      const response = await authorizedFetch(`/api/mentors/requests/${requestId}?action=decline`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to decline request');
      }

      await refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline request');
      return false;
    }
  };

  return {
    requests,
    history,
    isLoading,
    error,
    refresh,
    acceptRequest,
    declineRequest,
  };
}
