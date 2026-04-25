"use client";
import { useEffect, useMemo, useState } from "react";
import { QuickInfoCard } from "#comp-hooks/ui/reusable-ui/CickableStatCard";
import { useAuth } from "#/libs_schemas/context/auth-context";
import { User, Clock, MailIcon, type LucideIcon, MegaphoneIcon } from "lucide-react";
import Link from "next/link";
import { PendingRequestCard, MentorAvailabilityCard, ActiveMCard, UpdatesCard, UpcomingEventsCard } from "#comp-hooks/cards";
import { useMenteeDashboard } from "#comp-hooks/hooks/mentee/useMenteeDashboard";
const statsIcons: LucideIcon[] = [User, MailIcon, Clock];
import { useSocket } from "#comp-hooks/hooks/socket/useSocket";


export default function MentorHomePage() {
  const { user , getAccessToken} = useAuth();
  const { stats, recentUpdates, pendingRequests, activeMentors, scheduleEvents, isLoading, error } = useMenteeDashboard();

  const [actionState, setActionState] = useState<Record<string, 'idle' | 'accepting' | 'declining' | 'accepted' | 'declined'>>({});
  
  // token and socket
  const token = getAccessToken();
  const socket = useSocket("/request", token??"");
  
  useEffect(()=>{
    // if no socket just return 
    if(!socket) return ; 
    //listen to the incomming request event 

  }, [token, socket])

  
  const requestState = useMemo(() => {
    return (id: string) => actionState[id] || 'idle';
  }, [actionState]);

  const markDone = (id: string, state: 'accepted' | 'declined') => {
    setActionState((prev) => ({ ...prev, [id]: state }));
    window.setTimeout(() => {
      setActionState((prev) => ({ ...prev, [id]: 'idle' }));
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div id="mentor-dash-home" className="text-accent flex flex-col items-start gap-4">
      <section id="welcome-sec" className="w-full flex flex-col items-start justify-center">
        <h1 className="text-3xl font-bold tracking-tight text-accent">
          Welcome Back, {user?.firstName}!
        </h1>
        <p className="text-gray-500 font-medium">
          You've got your foot in the door, use it wisely!
        </p>
      </section>

      <section id="stats" className="w-full flex md:flex-row gap-4 p-2">
        {stats?.map((itm, idx) => (
          <QuickInfoCard key={idx} title={itm.title} statsNum={itm.statsNum} Icon={statsIcons[idx]} />
        ))}
      </section>

      <section id="request-events" className="md:mt-6 w-full md:grid md:grid-cols-[2.5fr_1fr] gap-4">
        <div id="main-area">
          <h1 className="text-2xl font-bold">Mentorship Requests:</h1>
          <section id="pending-reqs" className="w-full h-fit flex flex-col gap-4 overflow-y-auto">
            <p className="ml-auto">
              <Link href="/mentors/requests">View All Requests</Link>
            </p>
            {pendingRequests?.length ? (
              pendingRequests.slice(0, 3).map((req, idx) => (
                (() => {
                  const state = requestState(req.id);
                  return (
                <PendingRequestCard
                  key={idx}
                  id={req.id}
                  studentName={req.studentName}
                  studentAvatarUrl={req.studentAvatarUrl || 'https://i.pravatar.cc/150?u=student'}
                  majorAndYear={req.majorAndYear}
                  message={req.message}
                 
                />
                  );
                })()
              ))
            ) : (
              <p className="text-sm text-gray-500">No pending requests right now.</p>
            )}
          </section>

          <section id="active-m" className="mt-8">
            <h1 className="text-2xl">Active Mentors</h1>
            <div id="mentee-list" className="w-full grid grid-cols-3 gap-2">
              {activeMentors?.length ? (
                activeMentors.map((m, idx) => (
                  <ActiveMCard
                    key={idx}
                    mName={m.name}
                    mTitle={m.title}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">No active mentees yet.</p>
              )}
            </div>
          </section>
        </div>

        <div id="side-area" className="w-full flex flex-col gap-3">
          <UpdatesCard updates={recentUpdates} title="Updates" Icon={MegaphoneIcon} />
          <UpcomingEventsCard events={scheduleEvents} />
        </div>
      </section>
    </div>
  );
}
