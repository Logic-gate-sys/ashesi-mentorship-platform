'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '#/libs_schemas/context/auth-context';
import { useFetchApi } from '../shared/useMentorApi';

export interface MenteeProfileData {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  menteeProfile: {
    id: string;
    yearGroup: string;
    major: string;
    interests: string[];
    bio: string | null;
    linkedin: string | null;
  };
}

type SaveMenteeProfileInput = {
  user?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
  };
  menteeProfile?: {
    yearGroup?: string;
    major?: string;
    interests?: string[];
    bio?: string | null;
    linkedin?: string | null;
  };
};

export function useMenteeProfile() {
  const { user } = useAuth();
  const { authorizedFetch } = useFetchApi();

  const [profile, setProfile] = useState<MenteeProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await authorizedFetch('/api/mentees/profile');
      if (!response.ok) {
        throw new Error(`Failed to load profile (${response.status})`);
      }

      const payload = await response.json();
      setProfile(payload?.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [user, authorizedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveProfile = useCallback(
    async (updates: SaveMenteeProfileInput) => {
      try {
        setIsSaving(true);
        setSaveSuccess(false);
        setError(null);

        const response = await authorizedFetch('/api/mentees/profile', {
          method: 'PATCH',
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error(`Failed to save profile (${response.status})`);
        }

        const payload = await response.json();
        setProfile(payload?.data || null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save profile';
        setError(message);
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
