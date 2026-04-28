'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '#/libs_schemas/context/auth-context';
import { useFetchApi } from '../shared/useMentorApi';

export interface MenteeFeedback {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  mentorName: string;
  mentorAvatar: string;
  topic: string;
}

export interface FeedbackMetrics {
  totalSessions: number;
  averageRating: number;
  totalFeedbackGiven: number;
  totalFeedback?: number;
}

export function useMenteeFeedback() {
  const { user } = useAuth();
  const { authorizedFetch } = useFetchApi();

  const [feedback, setFeedback] = useState<MenteeFeedback[]>([]);
  const [metrics, setMetrics] = useState<FeedbackMetrics>({
    totalSessions: 0,
    averageRating: 0,
    totalFeedbackGiven: 0,
  });
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

      const response = await authorizedFetch('/api/mentees/feedback');
      if (!response.ok) {
        throw new Error(`Failed to load feedback (${response.status})`);
      }

      const payload = await response.json();
      const data = payload?.data;

      setFeedback(Array.isArray(data?.feedback) ? data.feedback : []);
      setMetrics(data?.metrics || {
        totalSessions: 0,
        averageRating: 0,
        totalFeedbackGiven: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  }, [user, authorizedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    feedback,
    metrics,
    isLoading,
    error,
    refresh,
  };
}
