'use client';
import { formatRelativeTime } from '@/app/_utils_and_types/utils/datatime';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/ _libs_and_schemas/context/auth-context';

interface DashboardData {
  stats: Array<{ title: 'mentees' | 'sessions' | 'feedbacks'; statsNum: number }>;
  recentUpdates: Array<{ id: string; event: string; timestamp: string }>;
  pendingRequests: Array<{
    id: string;
    studentName: string;
    majorAndYear: string;
    studentAvatarUrl: string | null;
    message: string;
  }>;
  activeMentees: Array<{ id: string; name: string; title: string }>;
  scheduleEvents: Array<{ id: string; month: string; day: number; title: string; meetingUrl: string }>;
  isLoading: boolean;
  error: string | null;
}

export function useMentorDashboard(): DashboardData {
  const { user, getAccessToken, refreshAccessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardData['stats']>([]);
  const [recentUpdates, setRecentUpdates] = useState<DashboardData['recentUpdates']>([]);
  const [pendingRequests, setPendingRequests] = useState<DashboardData['pendingRequests']>([]);
  const [activeMentees, setActiveMentees] = useState<DashboardData['activeMentees']>([]);
  const [scheduleEvents, setScheduleEvents] = useState<DashboardData['scheduleEvents']>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const accessToken = getAccessToken();
        const response = await fetch('/api/mentors/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            const retryResponse = await fetch('/api/mentors/dashboard', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${newAccessToken}`,
              },
              credentials: 'include',
            });
            if (retryResponse.ok) {
              const { data } = await retryResponse.json();
              // Format stats
              setStats([
                { title: 'mentees', statsNum: data.metrics.totalMentees },
                { title: 'sessions', statsNum: data.metrics.totalSessions },
                { title: 'feedbacks', statsNum: data.metrics.completedSessions },
              ]);

              // Format pending requests
              if (data.pendingRequests && Array.isArray(data.pendingRequests)) {
                setPendingRequests(
                  data.pendingRequests.map((req: any) => ({
                    id: req.id,
                    studentName: req.studentName,
                    majorAndYear: req.majorAndYear,
                    studentAvatarUrl: req.studentAvatarUrl,
                    message: req.message || req.goal,
                  }))
                );
              }

              // Format active mentees
              if (data.activeMentees && Array.isArray(data.activeMentees)) {
                setActiveMentees(
                  data.activeMentees.map((mentee: any) => ({
                    id: mentee.id,
                    name: mentee.studentName,
                    title: mentee.goal ? mentee.goal.split(' ')[0].toUpperCase() : 'Mentee',
                  }))
                );
              }

              // Format schedule events
              if (data.upcomingSessions && Array.isArray(data.upcomingSessions)) {
                setScheduleEvents(
                  data.upcomingSessions.map((session: any) => ({
                    id: session.id,
                    month: new Date(session.scheduledAt).toLocaleString('en-US', { month: 'short' }).toUpperCase(),
                    day: new Date(session.scheduledAt).getDate(),
                    title: session.topic,
                    meetingUrl: session.meetingUrl || '',
                  }))
                );
              }

              // Format recent updates
              if (Array.isArray(data.recentActivities)) {
                setRecentUpdates(
                  data.recentActivities.map((activity: any) => ({
                    id: activity.id,
                    event: activity.event,
                    timestamp: activity.timestamp,
                  }))
                );
              } else if (data.pendingRequests && Array.isArray(data.pendingRequests)) {
                setRecentUpdates(
                  data.pendingRequests.map((req: any) => ({
                    id: `req-${req.id}`,
                    event: `New request from ${req.studentName}`,
                    timestamp: req.createdAt ? formatRelativeTime(new Date(req.createdAt)) : 'Recently',
                  }))
                );
              } else {
                setRecentUpdates([]);
              }

              setError(null);
              return;
            }
          }
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard: ${response.status}`);
        }

        const { data } = await response.json();

        // Format stats
        setStats([
          { title: 'mentees', statsNum: data.metrics.totalMentees },
          { title: 'sessions', statsNum: data.metrics.totalSessions },
          { title: 'feedbacks', statsNum: data.metrics.completedSessions },
        ]);

        // Format pending requests
        if (data.pendingRequests && Array.isArray(data.pendingRequests)) {
          setPendingRequests(
            data.pendingRequests.map((req: any) => ({
              id: req.id,
              studentName: req.studentName,
              majorAndYear: req.majorAndYear,
              studentAvatarUrl: req.studentAvatarUrl,
              message: req.message || req.goal,
            }))
          );
        }

        // Format active mentees
        if (data.activeMentees && Array.isArray(data.activeMentees)) {
          setActiveMentees(
            data.activeMentees.map((mentee: any) => ({
              id: mentee.id,
              name: mentee.studentName,
              title: mentee.goal ? mentee.goal.split(' ')[0].toUpperCase() : 'Mentee',
            }))
          );
        }

        // Format schedule events
        if (data.upcomingSessions && Array.isArray(data.upcomingSessions)) {
          setScheduleEvents(
            data.upcomingSessions.map((session: any) => ({
              id: session.id,
              month: new Date(session.scheduledAt).toLocaleString('en-US', { month: 'short' }).toUpperCase(),
              day: new Date(session.scheduledAt).getDate(),
              title: session.topic,
              meetingUrl: session.meetingUrl || '',
            }))
          );
        }

        // Format recent updates
        if (Array.isArray(data.recentActivities)) {
          setRecentUpdates(
            data.recentActivities.map((activity: any) => ({
              id: activity.id,
              event: activity.event,
              timestamp: activity.timestamp,
            }))
          );
        } else if (data.pendingRequests && Array.isArray(data.pendingRequests)) {
          setRecentUpdates(
            data.pendingRequests.map((req: any) => ({
              id: `req-${req.id}`,
              event: `New request from ${req.studentName}`,
              timestamp: req.createdAt ? formatRelativeTime(new Date(req.createdAt)) : 'Recently',
            }))
          );
        } else {
          setRecentUpdates([]);
        }
        setError(null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.id, getAccessToken, refreshAccessToken]);

  return {
    stats,
    recentUpdates,
    pendingRequests,
    activeMentees,
    scheduleEvents,
    isLoading,
    error,
  };
}

