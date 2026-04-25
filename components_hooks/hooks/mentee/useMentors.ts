'use client';
import { useFetchApi } from "../shared/useMentorApi";
import { MentorProfile , User} from "#/prisma/generated/prisma/client";
import {  useEffect, useState } from "react";

interface MentorType{
    mentor: {
    id: string,
    firstName: string,
    lastName:string,
    graduationYear: string,
    company: string,
    bio: string,
    skills?: string[],
    },
    availableMentors: any[]; 
}

interface QueryProps{
   page?: number, 
   limit?: number
}
export function useMentors({page, limit}: QueryProps) {
  const { authorizedFetch } = useFetchApi();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableMentors, setAvailableMentors] = useState<MentorType['mentor'] | null>();

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
        console.log('RESPONSE -->>   ', body.data)
         const{data}= body;
         const mentors: MentorType['mentor'][] = data.map((mnt: any)=>({
            id: mnt?.mentorProfile?.id,
            firstName: mnt.firstName,
            lastName: mnt.lastName,
            graduationYear: mnt?.mentorProfile?.graduationYear,
            company: mnt.mnt?.mentorProfile?.company,
            bio: mnt.mnt?.mentorProfile?.bio,
            skills: mnt.mnt?.mentorProfile?.skills
         }))
       // update state
       setAvailableMentors(mentors)
        } catch(err){
         setError(err.message);
          } finally {
          setIsLoading(false);
      } 
    }
    getAllMentors(); 
    //cleanup
    return ()=>{setAvailableMentors(null)}
  }, [authorizedFetch, page, limit])
 
  
  return {availableMentors, isLoading, error}
   
}

