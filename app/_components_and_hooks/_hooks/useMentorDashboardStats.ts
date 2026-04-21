import { useCallback, useEffect, useState, useMemo } from "react";
import type{ MenteeProfile, User, Message,MentorshipRequest,Session } from "@/prisma/generated/prisma/client";
import { setupDevBundler } from "next/dist/server/lib/router-utils/setup-dev-bundler";
import { formatRelativeTime } from "@/app/_utils_and_types/utils/datatime";
import { title } from "process";


type StatItem = {
  title: "mentees"|"sessions"|"feedbacks",
  statsNum: number,
}

type Mentee={
  id: number,
  name: string,
  title:string
}

type Request = {
  id: number,
  studentName: string,
  majorAndYear: string,
  studentAvatarUrl:string,
  message: string
}

type Updates={
  id: number,
  event: string,
  timestamp: string
}

type Event = {
  id: number,
  month: string,
  day: number,
  title: string,
  meetingUrl: string,
}
interface useMentorDashboardStatsReturns{
  stats: StatItem[];
  recentUpdates: Updates[];
  pendingRequests: Request[];
  activeMentees: Mentee[];
  scheduleEvents: Event[]
}

export function useMentorDashboardStats({role, id}:{role: User['role'], id:User['id']}): useMentorDashboardStatsReturns{
      const [stats, setStats] = useState<StatItem[]>([]);
      const [recentUpdates, setRecentUpdates] = useState<Updates[]>([]);
      const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
      const [activeMentees, setActiveMentees] = useState<Mentee[]>([]);
      const [scheduleEvents, setScheduleEvents] = useState<Event[]>([]); 
      const [output, setOutput] = useState<{status: 'error'|'success', info:string}>(); 


     useEffect(()=>{
       const fetchAll = async(id: User['id'])=>{
        if(!id){
          console.log("No id present")
          return ; 
        }
        try{
          const res = await fetch(`/api/mentors/${id}`);
          if(!res.ok){
            setOutput({status:'error', info:`status: ${res.status}`})
            return; 
          }
          setOutput({status:'success', info:'Request successful'});
          const data = await res.json();
          const {mentees, sessions, feedbacks,messages, requests} = data ;


          const messageUpdates: Updates[] = messages?.filter((msg:Message,)=> msg.viewed !==true).map((mg:Message,)=>{
            return {id:mg.id, event:`New message sent from: ${mg.body.slice(0, 15)}`, timestamp:formatRelativeTime(mg.createdAt)}
          });
          const requestsUpdates: Updates[] = requests?.filter((req:MentorshipRequest,)=> req.status ==='PENDING').map((rq:MentorshipRequest,)=>{
            return {id:rq.id, event:`New request ${rq.message.slice(0, 15)}`, timestamp:formatRelativeTime(rq.createdAt)}
          });

          const mMentees: Mentee[] = mentees.map((mnt: User&MenteeProfile)=>{
            return {
              id: mnt.id,
              name: `${mnt.firstName} ${mnt.lastName}`,
              title:"Student"
            }
          })

          const pendingRequests: Request[] = requests?.filter((req:MentorshipRequest,)=> req.status ==='PENDING').map((rq:MentorshipRequest,)=>{
           const mentee  = mentees.filter((mnt: MenteeProfile)=> mnt.id === rq.menteeId);
            return {
              id:rq.id, 
              studentName:mentee.firstName, 
              majorAndYear:`${mentee.major} ${mentee.yearGroup}`, 
              studentAvatarUrl:`${mentee.avatarUrl}`, 
              message: rq.message
            }
          });

          const events: Event[] = sessions.filter((ss: Session)=> ss.status ==='SCHEDULED').map((ses: Session)=>{
            return {
              id:ses.id,
              title: ses.topic,
              meetingUrl: ses.meetingUrl,
              month: new Date(ses.scheduledAt).toLocaleString("en-US", {month:"short"}).toUpperCase(),
              day: new Date(ses.scheduledAt).getDate()
            }
          })

          //set recent updates 
          setRecentUpdates([...messageUpdates, ...requestsUpdates]);
          //set pending requests
          setPendingRequests([...pendingRequests]);
          //set active mentees
          setActiveMentees([...mentees]);
          //set secheduled events 
          setScheduleEvents([...events])
          setStats([
          {title:"mentees", statsNum: mentees}, 
          {title:"sessions",statsNum:sessions},
          {title:"feedbacks", statsNum:feedbacks}
        ])

        //set updates 
        setRecentUpdates(prev =>[...prev, messages, requests])
        return ; 
        }catch(err){
          throw new Error('Failed to fetch stats')
            }
        }

       fetchAll(id); 
       // cleanup
      
     }, [id, role]);

    console.log(scheduleEvents)
      // return details
      return {stats, recentUpdates, pendingRequests, activeMentees, scheduleEvents}
}




