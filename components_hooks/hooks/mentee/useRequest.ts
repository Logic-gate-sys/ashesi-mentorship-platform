'use client';
import { useFetchApi } from '../shared/useMentorApi';
import { createMentorshipRequestSchema } from '#libs-schemas/schemas/request.schema';
import {z} from 'zod'
import { useState } from 'react';

interface UseMentorshipRequestsReturn {
  isLoading: boolean;
  error: string | null;
  sendRequest: (data:any )=> Promise<object>; 
  cancelRequest: (id: string, action?: 'cancel'|'remind')=>Promise<object>
}

export function useMenteeRequests(): UseMentorshipRequestsReturn {
  const { authorizedFetch } = useFetchApi();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

 const sendRequest = async(data: Partial<z.infer<typeof createMentorshipRequestSchema>>):Promise<object> => {
    try{
      const response = await authorizedFetch('/api/mentees/requests', {
        method: 'POST',
        body:JSON.stringify(data)
      });
      if(!response.ok){
        setIsLoading(false);
        throw new Error('Failed to send reqeust')
      }
      //if request succeds
      const body = await response.json();
      if(body.data) return {};
      return body.data
    }catch(err){
      setError(err instanceof Error ? err.message : 'Failed to send request to mentor');
      return {};
    }finally{
        setIsLoading(false); 
    }
     
  }

  const cancelRequest = async(requestId: string, action:'cancel'|'remind'='cancel'):Promise<object> => {
    try{
      const response = await authorizedFetch(`/api/mentees/requests/${requestId}?action=${action}`, {
        method: 'POST',
      });
      if(!response.ok){
        setIsLoading(false);
        throw new Error('Failed to send reqeust')
      }
      //if request succeds
      const body = await response.json();
      if(body.data) return {};
      return body.data;
    }catch(err){
      setError(err instanceof Error ? err.message : 'Failed to send request to mentor');
      return {};
    }finally{
        setIsLoading(false); 
    }
     
  }


 
  //return
  return {sendRequest,error,isLoading, cancelRequest };
}










 