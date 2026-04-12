'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/ _libs_and_schemas/context/auth-context';

interface Mentor {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  company: string;
  bio?: string;
  skills: string[];
  isAvailable: boolean;
}

interface Metrics {
  totalMentees: number;
  totalSessions: number;
  avgRating: number;
  pendingRequests: number;
}

interface PendingRequest {
  id: string;
  studentId: string;
  studentName: string;
  goal: string;
  message?: string;
  status: string;
}

interface ActiveMentee {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  goal: string;
  status: 'active';
}

interface UpcomingSession {
  id: string;
  mentee: string;
  date: string;
  time: string;
  topic?: string;
  scheduledAt: string;
  duration: number;
  meetingUrl?: string;
}

interface DashboardData {
  mentor: Mentor;
  metrics: Metrics;
  pendingRequests: PendingRequest[];
  activeMentees: ActiveMentee[];
  upcomingSessions: UpcomingSession[];
}

export function useMentorDashboardData() {
  const { user, getAccessToken, refreshAccessToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user?.role !== 'ALUMNI') {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        let accessToken = getAccessToken();
        let response = await fetch('/api/mentor/dashboard', {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
          credentials: 'include',
        });

        // If 401, try to refresh token and retry
        if (response.status === 401 && accessToken) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            response = await fetch('/api/mentor/dashboard', {
              headers: { Authorization: `Bearer ${newAccessToken}` },
              credentials: 'include',
            });
          }
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }

        const dashboardData = await response.json();
        
        // Transform sessions to match SessionsList component expectations
        const transformedSessions = dashboardData.upcomingSessions.map((session: any) => {
          const scheduledDate = new Date(session.scheduledAt);
          return {
            ...session,
            mentee: session.studentName,
            date: scheduledDate.toLocaleDateString(),
            time: scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });

        setData({
          ...dashboardData,
          upcomingSessions: transformedSessions,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role, getAccessToken, refreshAccessToken]);

  return { data, loading, error };
}
