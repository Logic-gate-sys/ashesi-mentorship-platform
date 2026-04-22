'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMentorApi } from './useMentorApi';

export interface MentorMentee {
  id: string;
  name: string;
  majorAndYear: string;
  avatarUrl: string;
  focusAreas: string[];
  goalText: string;
}

export function useMentorMentees() {
  const { authorizedFetch } = useMentorApi();
  const [mentees, setMentees] = useState<MentorMentee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRequestToMentee = useCallback((req: any): MentorMentee => {
    const goalText = req.goal || req.message || 'Career growth';
    const focusAreas = goalText
      .split(/[,.]/)
      .map((item: string) => item.trim())
      .filter(Boolean)
      .slice(0, 3);

    return {
      id: req.id,
      name: req.studentName || 'Unknown Student',
      majorAndYear: req.majorAndYear || 'Unknown Program',
      avatarUrl: req.studentAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.id}`,
      focusAreas: focusAreas.length ? focusAreas : ['Career planning'],
      goalText,
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authorizedFetch('/api/mentors/requests?status=ACCEPTED');
      if (!response.ok) {
        throw new Error(`Failed to load mentees (${response.status})`);
      }

      const payload = await response.json();
      const items = Array.isArray(payload?.data?.requests) ? payload.data.requests : [];
      setMentees(items.map(mapRequestToMentee));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mentees');
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch, mapRequestToMentee]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const count = useMemo(() => mentees.length, [mentees.length]);

  return {
    mentees,
    count,
    isLoading,
    error,
    refresh,
  };
}
