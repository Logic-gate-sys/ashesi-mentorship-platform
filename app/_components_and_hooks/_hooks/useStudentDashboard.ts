'use client';

import { useState, useEffect } from 'react';

export interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    email: string;
    year: string;
    major: string;
  };
  cycle: {
    id: string;
    name: string;
    status: string;
    weeksRemaining: number;
  };
  requests: {
    pending: Array<{
      id: string;
      mentorName: string;
      mentorTitle: string;
      company: string;
      goal: string;
      industry: string;
      createdAt: Date;
      status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    }>;
    accepted: Array<{
      id: string;
      mentorName: string;
      mentorTitle: string;
      company: string;
      goal: string;
      industry: string;
      createdAt: Date;
      status: 'ACCEPTED';
    }>;
    declined: Array<{
      id: string;
      mentorName: string;
      mentorTitle: string;
      company: string;
      goal: string;
      industry: string;
      createdAt: Date;
      status: 'DECLINED';
    }>;
  };
  activeMentors: Array<{
    id: string;
    name: string;
    company: string;
    title: string;
    industry: string;
    goal: string;
    sessionsCompleted: number;
    avgRating: number;
    skills: string[];
    isAvailable: boolean;
    lastMessage?: string;
    nextSession?: {
      date: Date;
      time: string;
      duration: number;
    };
  }>;
  upcomingSessions: Array<{
    id: string;
    date: Date;
    time: string;
    topic?: string;
    mentorName: string;
    mentorCompany: string;
    duration: number;
    meetingUrl?: string;
    meetingPlatform: 'zoom' | 'teams' | 'discord' | 'in-person';
  }>;
  completedSessions: Array<{
    id: string;
    date: Date;
    topic: string;
    mentorName: string;
    mentorCompany: string;
    rating: number;
    feedback: string;
    duration: number;
  }>;
  stats: {
    requestsCount: number;
    mentorsCount: number;
    upcomingCount: number;
    completedCount: number;
    avgRating: number;
  };
}

export function useStudentDashboard() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/student/dashboard', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const dashboardData = await response.json();

      // Transform dates
      const transformedData: StudentDashboardData = {
        ...dashboardData,
        requests: {
          ...dashboardData.requests,
          pending: dashboardData.requests.pending?.map((req: any) => ({
            ...req,
            createdAt: new Date(req.createdAt),
          })) || [],
          accepted: dashboardData.requests.accepted?.map((req: any) => ({
            ...req,
            createdAt: new Date(req.createdAt),
          })) || [],
          declined: dashboardData.requests.declined?.map((req: any) => ({
            ...req,
            createdAt: new Date(req.createdAt),
          })) || [],
        },
        upcomingSessions: dashboardData.upcomingSessions?.map((session: any) => ({
          ...session,
          date: new Date(session.date),
        })) || [],
        completedSessions: dashboardData.completedSessions?.map((session: any) => ({
          ...session,
          date: new Date(session.date),
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
