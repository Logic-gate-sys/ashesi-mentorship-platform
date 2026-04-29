'use client';

import { useCallback, useEffect, useState } from 'react';
import { useFetchApi } from './useMentorApi';

export type UserDetailsResponse = {
  user: {
    id: string;
    email: string;
    role: 'MENTOR' | 'MENTEE' | 'ADMIN';
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    createdAt: string;
  };
  mentorProfile: null | {
    id: string;
    graduationYear: number;
    major: string;
    company: string;
    jobTitle: string;
    industry: string;
    bio: string | null;
    linkedin: string | null;
    skills: string[];
    isAvailable: boolean;
    maxMentees: number;
  };
  menteeProfile: null | {
    id: string;
    yearGroup: number;
    major: string;
    interests: string[];
    bio: string | null;
    linkedin: string | null;
  };
};

export function useUserDetails(userId: string) {
  const { authorizedFetch } = useFetchApi();
  const [data, setData] = useState<UserDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await authorizedFetch(`/api/users/${userId}`);
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || `Failed to load user details (${response.status})`);
      }

      const payload = await response.json();
      setData(payload?.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch, userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
}