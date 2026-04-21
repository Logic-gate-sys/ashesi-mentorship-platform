'use client';

import { useEffect, useState } from 'react';

interface Feedback {
  id: string;
  sessionId: string;
  rating: number;
  comment: string;
}

interface FeedbackStats {
  totalMentees: number;
  totalHours: number;
  averageRating: number;
  outcomes: number;
}

interface UseFeedbacksReturn {
  feedbacks: Feedback[];
  stats: FeedbackStats;
  isLoading: boolean;
  error: string | null;
}

export function useFeedbacks(): UseFeedbacksReturn {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({
    totalMentees: 0,
    totalHours: 0,
    averageRating: 0,
    outcomes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/mentors/feedback');
        if (!response.ok) throw new Error('Failed to fetch feedbacks');

        const { data } = await response.json();
        
        if (Array.isArray(data.feedback)) {
          setFeedbacks(
            data.feedback.map((f: any) => ({
              id: f.id,
              sessionId: f.sessionId,
              rating: f.rating,
              comment: f.comment,
            }))
          );
        }

        if (data.stats) {
          setStats({
            totalMentees: data.stats.totalMentees || 0,
            totalHours: data.stats.totalHours || 0,
            averageRating: data.stats.averageRating || 0,
            outcomes: data.stats.outcomes || 0,
          });
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch feedbacks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return {
    feedbacks,
    stats,
    isLoading,
    error,
  };
}
