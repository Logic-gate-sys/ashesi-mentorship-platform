'use client';
import { MentorshipRequest , RequestStatus} from '#/prisma/generated/prisma/client';
import { useCallback, useEffect, useState } from 'react';
import { formatRelativeTime } from '#utils-types/utils/datatime';
import { useFetchApi } from '#comp-hooks/hooks/shared/useMentorApi';

interface DashboardData {
  stats: Array<{ title: 'mentors' | 'sessions' | 'feedbacks';  statsNum: number }>;
  recentUpdates: Array<{ id: string; event: string; timestamp: string }>;
  pendingRequests: Array<{
    id: string;
    studentName: string;
    majorAndYear: string;
    studentAvatarUrl: string | null;
    message: string;
  }>;
  requestHistory: Array<{
    id: string;
    studentName: string;
    goal: string;
    majorAndYear: string;
    studentAvatarUrl: string | null;
    message: string;
    status: RequestStatus; 
  }>;
  activeMentors: Array<{ id: string; name: string; title: string }>;
  scheduleEvents: Array<{ id: string; month: string; day: number; title: string; meetingUrl: string }>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useMenteeDashboard(): DashboardData {
  const { authorizedFetch } = useFetchApi();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardData['stats']>([]);
  const [recentUpdates, setRecentUpdates] = useState<DashboardData['recentUpdates']>([]);
  const [scheduleEvents, setScheduleEvents] = useState<DashboardData['scheduleEvents']>([]);
  const [activeMentors, setActiveMentors] = useState<DashboardData['activeMentors']>([]);
  const [pendingRequests, setPendingRequests] = useState<DashboardData['pendingRequests']>([])
    const [requestHistory, setRequestHistory] = useState<DashboardData['requestHistory']>([])

  

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authorizedFetch('/api/mentees/dashboard');
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard: ${response.status}`);
      }
      const payload = await response.json();
      const data = payload?.data;
      setStats([
        { title: 'mentors', statsNum: data?.metrics?.totalMentors || 0 },
        { title: 'sessions', statsNum: data?.metrics?.totalSessions || 0 },
        { title: 'feedbacks', statsNum: data?.metrics?.completedSessions || 0 },
      ]);


      const pending = Array.isArray(data?.pendingRequests) ? data.pendingRequests : [];
      setPendingRequests(
        pending.map((req: any) => ({
          id: req.id,
          mentorName: req.mentorName,
          graduationYear: req.graduationYear,
          mentorAvatarUrl: req.mentorAvatarUrl,
          message: req.message,
          goal: req.goal
        }))
      );
      //  past request 
      const history = Array.isArray(data?.requestHistory) ? data.requestHistory : [];
      setRequestHistory(
        pending.map((req: any) => ({
          id: req.id,
          mentorName: req.mentorName,
          gaol: req.goal,
          graduationYear: req.graduationYear,
          mentorAvatarUrl: req.mentorAvatarUrl,
          message: req.message,
          goal: req.goal,
          status: req.status
        }))
      );

      const active = Array.isArray(data?.activeMentors) ? data.activeMentors : [];
      setActiveMentors(
        active.map((mentor: any) => ({
          id: mentor.id,
          name: mentor.mentorName,
          title: mentor.goal ? mentor.goal.split(' ')[0].toUpperCase() : 'Mentor',
        }))
      );

      const upcoming = Array.isArray(data?.upcomingSessions) ? data.upcomingSessions : [];
      setScheduleEvents(
        upcoming.map((session: any) => ({
          id: session.id,
          month: new Date(session.scheduledAt).toLocaleString('en-US', { month: 'short' }).toUpperCase(),
          day: new Date(session.scheduledAt).getDate(),
          title: session.topic,
          meetingUrl: session.meetingUrl || '',
        }))
      );

      if (Array.isArray(data?.recentActivities)) {
        setRecentUpdates(
          data.recentActivities.map((activity: any) => ({
            id: activity.id,
            event: activity.event,
            timestamp: activity.timestamp,
          }))
        );
      } else {
        setRecentUpdates(
          pending.map((req: any) => ({
            id: `req-${req.id}`,
            event: `New request from ${req.studentName}`,
            timestamp: req.createdAt ? formatRelativeTime(new Date(req.createdAt)) : 'Recently',
          }))
        );
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    stats,
    recentUpdates,
    pendingRequests,
    requestHistory,
    activeMentors,
    scheduleEvents,
    isLoading,
    error,
    refresh,
  };
}

