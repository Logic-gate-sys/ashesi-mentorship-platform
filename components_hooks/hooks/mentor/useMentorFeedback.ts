'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMentorApi } from './useMentorApi';

export interface MentorFeedbackItem {
  id: string;
  sessionId: string;
  rating: number;
  comment: string;
  topic: string;
  menteeName: string;
  menteeAvatar: string;
  createdAt: string;
}

export function useMentorFeedback() {
  const { authorizedFetch } = useMentorApi();
  const [feedback, setFeedback] = useState<MentorFeedbackItem[]>([]);
  const [metrics, setMetrics] = useState({
    totalMentees: 0,
    totalSessions: 0,
    completedSessions: 0,
    averageRating: 0,
    totalFeedback: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);

      const [feedbackResponse, dashboardResponse] = await Promise.all([
        authorizedFetch('/api/mentors/feedback'),
        authorizedFetch('/api/mentors/dashboard'),
      ]);

      if (!feedbackResponse.ok) {
        throw new Error(`Failed to load feedback (${feedbackResponse.status})`);
      }

      if (!dashboardResponse.ok) {
        throw new Error(`Failed to load dashboard metrics (${dashboardResponse.status})`);
      }

      const feedbackPayload = await feedbackResponse.json();
      const dashboardPayload = await dashboardResponse.json();

      const feedbackItems = Array.isArray(feedbackPayload?.data?.feedback) ? feedbackPayload.data.feedback : [];
      const dashboardMetrics = dashboardPayload?.data?.metrics;
      const feedbackStats = feedbackPayload?.data?.stats;

      const parsed: MentorFeedbackItem[] = feedbackItems.map((item: any) => ({
        id: item.id,
        sessionId: item.sessionId,
        rating: item.rating,
        comment: item.comment || 'No written feedback',
        topic: item.session?.topic || 'Mentorship Session',
        menteeName: item.session?.mentee?.user
          ? `${item.session.mentee.user.firstName} ${item.session.mentee.user.lastName}`
          : 'Unknown Mentee',
        menteeAvatar:
          item.session?.mentee?.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`,
        createdAt: item.createdAt,
      }));

      setFeedback(parsed);
      setMetrics({
        totalMentees: dashboardMetrics?.totalMentees || 0,
        totalSessions: dashboardMetrics?.totalSessions || 0,
        completedSessions: dashboardMetrics?.completedSessions || 0,
        averageRating: feedbackStats?.averageRating || 0,
        totalFeedback: feedbackStats?.totalFeedback || parsed.length,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feedback data');
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const topRatingCount = useMemo(
    () => feedback.filter((item) => item.rating >= 4).length,
    [feedback]
  );

  return {
    feedback,
    metrics,
    topRatingCount,
    isLoading,
    error,
    refresh,
  };
}
