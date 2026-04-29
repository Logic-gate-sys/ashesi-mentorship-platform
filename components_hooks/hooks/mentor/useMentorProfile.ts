'use client';

import { useCallback, useEffect, useState } from 'react';
import { useFetchApi } from '../shared/useMentorApi';

export interface MentorProfileData {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  mentorProfile: {
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
}

type MentorProfileUpdatePayload = {
  user?: Partial<MentorProfileData['user']>;
  mentorProfile?: Partial<MentorProfileData['mentorProfile']>;
};

export function useMentorProfile() {
  const { authorizedFetch } = useFetchApi();
  const [profile, setProfile] = useState<MentorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authorizedFetch('/api/mentors/profile');
      if (!response.ok) {
        throw new Error(`Failed to fetch profile (${response.status})`);
      }

      const payload = await response.json();
      setProfile(payload.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveProfile = useCallback(
    async (updates: MentorProfileUpdatePayload) => {
      try {
        setIsSaving(true);
        setSaveSuccess(false);

        const response = await authorizedFetch('/api/mentors/profile', {
          method: 'PATCH',
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || `Failed to save profile (${response.status})`);
        }

        const payload = await response.json();
        setProfile(payload.data);
        setError(null);
        setSaveSuccess(true);

        window.setTimeout(() => setSaveSuccess(false), 1500);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save profile');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [authorizedFetch]
  );

  return {
    profile,
    isLoading,
    isSaving,
    saveSuccess,
    error,
    refresh,
    saveProfile,
  };
}
