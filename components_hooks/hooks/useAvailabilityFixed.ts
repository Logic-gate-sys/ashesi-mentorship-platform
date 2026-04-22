'use client';

import { useEffect, useState } from 'react';

interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface UseAvailabilityReturn {
  slots: AvailabilitySlot[];
  isLoading: boolean;
  error: string | null;
  addSlot: (dayOfWeek: string, startTime: string, endTime: string) => Promise<void>;
  deleteSlot: (slotId: string) => Promise<void>;
  updateSlot: (slotId: string, dayOfWeek: string, startTime: string, endTime: string) => Promise<void>;
}

export function useAvailability(): UseAvailabilityReturn {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/mentors/availability');
        if (!response.ok) throw new Error('Failed to fetch availability');

        const { data } = await response.json();
        
        if (Array.isArray(data.availability)) {
          setSlots(data.availability);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch availability:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch availability');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const addSlot = async (dayOfWeek: string, startTime: string, endTime: string) => {
    try {
      const response = await fetch('/api/mentors/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),
      });
      if (!response.ok) throw new Error('Failed to add slot');

      const { data } = await response.json();
      setSlots(prev => [...prev, data]);
    } catch (err) {
      console.error('Failed to add slot:', err);
      setError(err instanceof Error ? err.message : 'Failed to add slot');
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      const response = await fetch(`/api/mentors/availability/${slotId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete slot');

      setSlots(prev => prev.filter(s => s.id !== slotId));
    } catch (err) {
      console.error('Failed to delete slot:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete slot');
    }
  };

  const updateSlot = async (slotId: string, dayOfWeek: string, startTime: string, endTime: string) => {
    try {
      const response = await fetch(`/api/mentors/availability/${slotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),
      });
      if (!response.ok) throw new Error('Failed to update slot');

      const { data } = await response.json();
      setSlots(prev => prev.map(s => s.id === slotId ? data : s));
    } catch (err) {
      console.error('Failed to update slot:', err);
      setError(err instanceof Error ? err.message : 'Failed to update slot');
    }
  };

  return {slots,isLoading,error,addSlot,deleteSlot,updateSlot};
}
