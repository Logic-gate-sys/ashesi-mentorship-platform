'use client';

import { useCallback, useEffect, useState } from 'react';
import { useFetchApi } from '../shared/useMentorApi';
import { createMentorshipRequestSchema } from '#libs-schemas/schemas/request.schema';
import {z} from 'zod'

interface MentorshipRequest {
  id: string;
  studentName: string;
  majorAndYear: string;
  studentAvatarUrl: string | null;
  message: string;
  goal: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
}

interface UseMentorshipRequestsReturn {
  requests: MentorshipRequest[];
  history: MentorshipRequest[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  sendRequest: (data: any)=> Promise<boolean>; 
  acceptRequest: (requestId: string) => Promise<boolean>;
  declineRequest: (requestId: string) => Promise<boolean>;
}

export function useMentorshipRequests(): UseMentorshipRequestsReturn {
  const { authorizedFetch } = useFetchApi();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [history, setHistory] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authorizedFetch('/api/mentors/requests');
      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.status}`);
      }

      const body = await response.json();
      const {data, count, filters} = body.data ; 
      const pendingRequests: MentorshipRequest[] = data.filter((dt: MentorshipRequest)=> dt.status ==='PENDING');
      const resolvedRequests: MentorshipRequest[] = data.filter((request: MentorshipRequest) => request.status !== 'PENDING')
      setRequests(pendingRequests);
      setHistory(resolvedRequests);

      setError(null);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } 
  }, [authorizedFetch]);


  useEffect(() => {
    refresh();
  }, [refresh]);

  const sendRequest = async(data: Partial<z.infer<typeof createMentorshipRequestSchema>>):Promise<boolean> => {
    try{
      const response = await authorizedFetch('/api/mentees/requests', {
        method: 'POST',
        body: data
      });
      if(!response.ok){
        throw new Error('Failed to send reqeust')
      }
      //if request succeds
      const body = await response.json();
      if(body.data) return true;
      return false;
    }catch(err){
      setError(err instanceof Error ? err.message : 'Failed to send request to mentor');
      return false;
    }
     
  }

  const acceptRequest = async (requestId: string) => {
    try {
      const response = await authorizedFetch(`/api/mentors/requests/${requestId}?action=accept`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      await refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept request');
      return false;
    }
  };

  const declineRequest = async (requestId: string) => {
    try {
      const response = await authorizedFetch(`/api/mentors/requests/${requestId}?action=decline`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to decline request');
      }

      await refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline request');
      return false;
    }
  };
  //return
  return { requests, history, isLoading, error, refresh, acceptRequest, declineRequest , sendRequest};
}


