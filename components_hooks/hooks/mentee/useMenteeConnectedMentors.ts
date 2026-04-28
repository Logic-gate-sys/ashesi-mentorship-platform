'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '#/libs_schemas/context/auth-context';
import { useFetchApi } from '../shared/useMentorApi';

export interface ConnectedMentor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  company: string;
  jobTitle: string;
  industry: string;
  bio: string;
  skills: string[];
}

export function useMenteeConnectedMentors() {
  const { user } = useAuth();
  const { authorizedFetch } = useFetchApi();

  const [mentors, setMentors] = useState<ConnectedMentor[]>([]);
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

      const response = await authorizedFetch('/api/mentees/mentors');
      if (!response.ok) {
        throw new Error(`Failed to load mentors (${response.status})`);
      }

      const payload = await response.json();
      const data = payload?.data;

      setMentors(Array.isArray(data?.mentors) ? data.mentors : []);
      setCount(data?.count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mentors');
    } finally {
      setIsLoading(false);
    }
  }, [user, authorizedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    mentors,
    count,
    isLoading,
    error,
    refresh,
  };
}
