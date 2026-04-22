'use client';

import { useEffect, useState } from 'react';

interface Mentee {
  id: string;
  name: string;
  major: string;
  year: number;
  avatar: string;
  focusAreas: string[];
  goalProgress: number;
  totalGoals: number;
}

interface UseMenteesReturn {
  mentees: Mentee[];
  isLoading: boolean;
  error: string | null;
}

export function useMentees(): UseMenteesReturn {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setIsLoading(true);
        // Get active mentees from dashboard or from requests endpoint
        const response = await fetch('/api/mentors/requests?status=ACCEPTED');
        if (!response.ok) throw new Error('Failed to fetch mentees');

        const { data } = await response.json();
        
        if (Array.isArray(data.requests)) {
          const formatted = data.requests.map((req: any) => ({
            id: req.mentee?.id || req.menteeId,
            name: req.studentName,
            major: req.majorAndYear?.split("'")[0] || 'Unknown',
            year: parseInt(req.majorAndYear?.split("'")[1] || '0') + 2000,
            avatar: req.studentAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.menteeId}`,
            focusAreas: [req.goal?.split(' ')[0] || 'Growth'],
            goalProgress: 1,
            totalGoals: 3,
          }));
          setMentees(formatted);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch mentees:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch mentees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentees();
  }, []);

  return {
    mentees,
    isLoading,
    error,
  };
}
