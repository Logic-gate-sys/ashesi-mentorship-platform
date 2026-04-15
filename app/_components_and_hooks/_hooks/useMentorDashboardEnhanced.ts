'use client';

import { useEffect, useState } from 'react';

export interface MentorDashboardData {
  mentor: {
    id: string;
    name: string;
    email: string;
    jobTitle: string;
    company: string;
    bio?: string;
    skills: string[];
  };
  cycle: {
    id: string;
    name: string;
    status: string;
  };
  availability: {
    isAvailable: boolean;
    maxMentees: number;
  };
  metrics: {
    activeMentees: number;
    totalSessions: number;
    totalHours: number;
    avgRating: number;
    pendingRequests: number;
  };
  pendingRequests: Array<{
    id: string;
    studentId: string;
    studentName: string;
    studentYear: string;
    studentMajor: string;
    goal: string;
    message: string;
    priority: 'HIGH' | 'STANDARD' | 'LOW';
    majorMatch: boolean;
    skillsMatch: string[];
    interests: string;
    requestedAt: Date;
  }>;
  activeMentees: Array<{
    id: string;
    studentId: string;
    studentName: string;
    studentYear: string;
    studentMajor: string;
    goal: string;
    activeSince: Date;
    sessionsCompleted: number;
    avgRating: number;
    nextSession?: {
      date: Date;
      time: string;
      duration: number;
    };
    progress: string;
  }>;
  upcomingSessions: Array<{
    id: string;
    studentName: string;
    topic?: string;
    scheduledAt: Date;
    duration: number;
    status: 'scheduled' | 'in-progress' | 'completed';
  }>;
}

export function useMentorDashboardEnhanced() {
  const [data, setData] = useState<MentorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentor/dashboard', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const dashboardData = await response.json();

      // Transform dates
      const transformedData: MentorDashboardData = {
        ...dashboardData,
        pendingRequests: dashboardData.pendingRequests?.map((req: any) => ({
          ...req,
          requestedAt: new Date(req.requestedAt),
        })) || [],
        activeMentees: dashboardData.activeMentees?.map((mentee: any) => ({
          ...mentee,
          activeSince: new Date(mentee.activeSince),
          nextSession: mentee.nextSession
            ? { ...mentee.nextSession, date: new Date(mentee.nextSession.date) }
            : undefined,
        })) || [],
        upcomingSessions: dashboardData.upcomingSessions?.map((session: any) => ({
          ...session,
          scheduledAt: new Date(session.scheduledAt),
        })) || [],
      };

      setData(transformedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchDashboardData };
}
