'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '#/libs_schemas/context/auth-context';
import { useFetchApi } from '../shared/useMentorApi';

export interface ConnectedMentee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  yearGroup: string;
  major: string;
  bio: string;
  linkedin: string;
  interests: string[];
}

export function useMentorConnectedMentees() {
  const { user } = useAuth();
  const { authorizedFetch } = useFetchApi();

  const [mentees, setMentees] = useState<ConnectedMentee[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await authorizedFetch('/api/mentors/mentees');
      if (!response.ok) {
        throw new Error(`Failed to load mentees (${response.status})`);
      }

      const payload = await response.json();
      const data = payload?.data;

      setMentees(Array.isArray(data?.mentees) ? data.mentees : []);
      setCount(data?.count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mentees');
    } finally {
      setIsLoading(false);
    }
  }, [user, authorizedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    mentees,
    count,
    isLoading,
    error,
    refresh,
  };
}
