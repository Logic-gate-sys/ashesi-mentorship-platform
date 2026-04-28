'use client';

import { useFetchApi } from "../shared/useMentorApi";
import { useEffect, useState } from "react";

export interface MentorSummary {
  id: string;
  firstName: string;
  lastName: string;
  graduationYear: string;
  company: string;
  bio: string;
  skills: string[];
}

interface QueryProps{
   page?: number, 
   limit?: number
}
export function useMentors({page, limit}: QueryProps) {
  const { authorizedFetch } = useFetchApi();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableMentors, setAvailableMentors] = useState<MentorSummary[]>([]);

  useEffect(()=>{
    const getAllMentors = async()=>{
        try{
         const query = new URLSearchParams({
          page: page?.toString()??"1",
          limit: limit?.toString()??"20"
         })
        const response = await authorizedFetch(`/api/mentors?${query.toString()}`);
        if(!response.ok){
            setIsLoading(false); 
            setError("Failed to fetch all mentors")
            return ; 
          }
         
         const body = await response.json(); 
         const mentors = Array.isArray(body?.data)
          ? body.data.map((mentor: any): MentorSummary => ({
              id: mentor?.mentorProfile?.id ?? mentor?.id,
              firstName: mentor?.firstName ?? "",
              lastName: mentor?.lastName ?? "",
              graduationYear: String(mentor?.mentorProfile?.graduationYear ?? ""),
              company: mentor?.mentorProfile?.company ?? "",
              bio: mentor?.mentorProfile?.bio ?? "",
              skills: Array.isArray(mentor?.mentorProfile?.skills) ? mentor.mentorProfile.skills : [],
            }))
          : [];
       setAvailableMentors(mentors)
        } catch(err){
         setError(err instanceof Error ? err.message : 'Failed to fetch all mentors');
          } finally {
          setIsLoading(false);
      } 
    }
    getAllMentors(); 
    //cleanup
    return ()=>{setAvailableMentors([])}
  }, [authorizedFetch, page, limit])
 
  
  return {availableMentors, isLoading, error}
   
}

