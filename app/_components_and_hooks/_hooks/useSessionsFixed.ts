'use client';

import { useEffect, useState } from 'react';

interface Session {
  id: string;
  mentee: string;
  menteeId: string;
  date: string;
  time: string;
  topic: string;
  type: 'VIRTUAL' | 'IN_PERSON';
  duration: number;
  meetingUrl: string | null;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  scheduledAt: string;
}

interface UseSessionsReturn {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  joinSession: (sessionId: string) => void;
  cancelSession: (sessionId: string) => Promise<void>;
  rescheduleSession: (sessionId: string, newDate: Date) => Promise<void>;
}

export function useSessions(): UseSessionsReturn {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/mentors/sessions');
        if (!response.ok) throw new Error('Failed to fetch sessions');

        const { data } = await response.json();
        
        if (Array.isArray(data.sessions)) {
          setSessions(
            data.sessions.map((session: any) => ({
              id: session.id,
              mentee: session.mentee || 'Unknown',
              menteeId: session.menteeId,
              date: new Date(session.scheduledAt).toLocaleDateString(),
              time: new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              topic: session.topic,
              type: session.type,
              duration: session.duration,
              meetingUrl: session.meetingUrl,
              status: session.status,
              scheduledAt: session.scheduledAt,
            }))
          );
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const joinSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session?.meetingUrl) {
      window.open(session.meetingUrl, '_blank');
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/mentors/sessions/${sessionId}?action=cancel`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to cancel session');
      
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Failed to cancel session:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel session');
    }
  };

  const rescheduleSession = async (sessionId: string, newDate: Date) => {
    try {
      const response = await fetch(`/api/mentors/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: newDate.toISOString() }),
      });
      if (!response.ok) throw new Error('Failed to reschedule session');
      
      // Refresh sessions
      const refreshResponse = await fetch('/api/mentors/sessions');
      const { data } = await refreshResponse.json();
      if (Array.isArray(data.sessions)) {
        setSessions(
          data.sessions.map((session: any) => ({
            id: session.id,
            mentee: session.mentee || 'Unknown',
            menteeId: session.menteeId,
            date: new Date(session.scheduledAt).toLocaleDateString(),
            time: new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            topic: session.topic,
            type: session.type,
            duration: session.duration,
            meetingUrl: session.meetingUrl,
            status: session.status,
            scheduledAt: session.scheduledAt,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to reschedule session:', err);
      setError(err instanceof Error ? err.message : 'Failed to reschedule session');
    }
  };

  return {
    sessions,
    isLoading,
    error,
    joinSession,
    cancelSession,
    rescheduleSession,
  };
}
