'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatRelativeTime } from '#utils-types/utils/datatime';
import { useMentorApi } from './useMentorApi';

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
  refresh: () => Promise<void>;
}

export function useMentorDashboard(): DashboardData {
  const { authorizedFetch } = useMentorApi();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardData['stats']>([]);
  const [recentUpdates, setRecentUpdates] = useState<DashboardData['recentUpdates']>([]);
  const [pendingRequests, setPendingRequests] = useState<DashboardData['pendingRequests']>([]);
  const [activeMentees, setActiveMentees] = useState<DashboardData['activeMentees']>([]);
  const [scheduleEvents, setScheduleEvents] = useState<DashboardData['scheduleEvents']>([]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authorizedFetch('/api/mentors/dashboard');
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard: ${response.status}`);
      }

      const payload = await response.json();
      const data = payload?.data;

      setStats([
        { title: 'mentees', statsNum: data?.metrics?.totalMentees || 0 },
        { title: 'sessions', statsNum: data?.metrics?.totalSessions || 0 },
        { title: 'feedbacks', statsNum: data?.metrics?.completedSessions || 0 },
      ]);

      const pending = Array.isArray(data?.pendingRequests) ? data.pendingRequests : [];
      setPendingRequests(
        pending.map((req: any) => ({
          id: req.id,
          studentName: req.studentName,
          majorAndYear: req.majorAndYear,
          studentAvatarUrl: req.studentAvatarUrl,
          message: req.message || req.goal,
        }))
      );

      const active = Array.isArray(data?.activeMentees) ? data.activeMentees : [];
      setActiveMentees(
        active.map((mentee: any) => ({
          id: mentee.id,
          name: mentee.studentName,
          title: mentee.goal ? mentee.goal.split(' ')[0].toUpperCase() : 'Mentee',
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
    activeMentees,
    scheduleEvents,
    isLoading,
    error,
    refresh,
  };
}

