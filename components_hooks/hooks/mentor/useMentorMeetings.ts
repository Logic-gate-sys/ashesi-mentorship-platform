'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMentorApi } from './useMentorApi';

export interface MentorSession {
  id: string;
  topic: string;
  status: 'SCHEDULED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  type: 'VIRTUAL' | 'IN_PERSON';
  scheduledAt: string;
  duration: number;
  meetingUrl: string | null;
  menteeName: string;
}

export interface MentorAvailabilitySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export function useMentorMeetings() {
  const { authorizedFetch } = useMentorApi();

  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<MentorAvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingSlot, setIsSubmittingSlot] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseSession = (session: any): MentorSession => ({
    id: session.id,
    topic: session.topic,
    status: session.status,
    type: session.type,
    scheduledAt: session.scheduledAt,
    duration: session.duration,
    meetingUrl: session.meetingUrl || null,
    menteeName: session.mentee?.user
      ? `${session.mentee.user.firstName} ${session.mentee.user.lastName}`
      : 'Unknown Mentee',
  });

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);

      const [sessionsResponse, availabilityResponse] = await Promise.all([
        authorizedFetch('/api/mentors/sessions'),
        authorizedFetch('/api/mentors/availability'),
      ]);

      if (!sessionsResponse.ok) {
        throw new Error(`Failed to load sessions (${sessionsResponse.status})`);
      }

      if (!availabilityResponse.ok) {
        throw new Error(`Failed to load availability (${availabilityResponse.status})`);
      }

      const sessionsPayload = await sessionsResponse.json();
      const availabilityPayload = await availabilityResponse.json();

      const sessionItems = Array.isArray(sessionsPayload?.data?.sessions) ? sessionsPayload.data.sessions : [];
      const availabilityItems = Array.isArray(availabilityPayload?.data?.availability)
        ? availabilityPayload.data.availability
        : [];

      setSessions(sessionItems.map(parseSession));
      setAvailabilitySlots(availabilityItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meetings data');
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addAvailabilitySlot = useCallback(
    async (slot: { dayOfWeek: string; startTime: string; endTime: string }) => {
      try {
        setIsSubmittingSlot(true);
        const response = await authorizedFetch('/api/mentors/availability', {
          method: 'POST',
          body: JSON.stringify(slot),
        });

        if (!response.ok) {
          throw new Error(`Failed to add slot (${response.status})`);
        }

        await refresh();
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add availability slot');
        return false;
      } finally {
        setIsSubmittingSlot(false);
      }
    },
    [authorizedFetch, refresh]
  );

  const deleteAvailabilitySlot = useCallback(
    async (slotId: string) => {
      const response = await authorizedFetch(`/api/mentors/availability/${slotId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete slot (${response.status})`);
      }

      await refresh();
    },
    [authorizedFetch, refresh]
  );

  const cancelSession = useCallback(
    async (sessionId: string, reason?: string) => {
      const response = await authorizedFetch(`/api/mentors/sessions/${sessionId}?action=cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason: reason || 'Cancelled by mentor' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel session (${response.status})`);
      }

      await refresh();
    },
    [authorizedFetch, refresh]
  );

  const completeSession = useCallback(
    async (sessionId: string) => {
      const response = await authorizedFetch(`/api/mentors/sessions/${sessionId}?action=complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to complete session (${response.status})`);
      }

      await refresh();
    },
    [authorizedFetch, refresh]
  );

  return {
    sessions,
    availabilitySlots,
    isLoading,
    isSubmittingSlot,
    error,
    refresh,
    addAvailabilitySlot,
    deleteAvailabilitySlot,
    cancelSession,
    completeSession,
  };
}
