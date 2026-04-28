"use client";
import { useEffect, useMemo, useState } from "react";
import { QuickInfoCard } from "#comp-hooks/ui/reusable-ui/CickableStatCard";
import { useAuth } from "#/libs_schemas/context/auth-context";
import { User, Clock, MailIcon, type LucideIcon, MegaphoneIcon } from "lucide-react";
import Link from "next/link";
import { PendingRequestCard, MentorAvailabilityCard, ActiveMCard, UpdatesCard, UpcomingEventsCard } from "#comp-hooks/cards";
import { useMentorDashboard, useMentorshipRequests } from "#comp-hooks/hooks/mentor";
const statsIcons: LucideIcon[] = [User, MailIcon, Clock];
import { useSocket } from "#comp-hooks/hooks/socket/useSocket";


export default function MentorHomePage() {
  const { user , getAccessToken} = useAuth();
  const { stats, recentUpdates, pendingRequests, activeMentees, scheduleEvents, isLoading, error } = useMentorDashboard();
  const { acceptRequest, declineRequest, } = useMentorshipRequests();
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

  const handleAccept = async (id: string) => {
    setActionState((prev) => ({ ...prev, [id]: 'accepting' }));
    await acceptRequest(id);
    markDone(id, 'accepted');
  };

  const handleDecline = async (id: string) => {
    setActionState((prev) => ({ ...prev, [id]: 'declining' }));
    await declineRequest(id);
    markDone(id, 'declined');
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
          Ready to guide the next generation of scholars!
        </p>
      </section>

      <section id="stats" className="grid w-full gap-4 p-2 sm:grid-cols-2 xl:grid-cols-3">
        {stats?.map((itm, idx) => (
          <QuickInfoCard key={idx} title={itm.title} statsNum={itm.statsNum} Icon={statsIcons[idx]} />
        ))}
      </section>

      <section id="request-events" className="mt-2 grid w-full gap-6 xl:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)]">
        <div id="main-area" className="flex min-w-0 flex-col gap-4">
          <h1 className="text-2xl font-bold">Mentorship Requests:</h1>
          <section id="pending-reqs" className="flex flex-col gap-4">
            <p className="ml-auto text-sm font-semibold text-[#6A0A1D] hover:underline">
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
                  isAccepting={state === 'accepting'}
                  isDeclining={state === 'declining'}
                  isAccepted={state === 'accepted'}
                  isDeclined={state === 'declined'}
                  onAccept={() => handleAccept(req.id)}
                  onDecline={() => handleDecline(req.id)}
                />
                  );
                })()
              ))
            ) : (
              <p className="text-sm text-gray-500">No pending requests right now.</p>
            )}
          </section>

          <section id="active-m" className="mt-8 flex flex-col gap-4">
            <h1 className="text-2xl">Active Mentees</h1>
            <div id="mentee-list" className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeMentees?.length ? (
                activeMentees.map((m, idx) => (
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

        <div id="side-area" className="flex min-w-0 flex-col gap-3">
          <UpdatesCard updates={recentUpdates} title="Updates" Icon={MegaphoneIcon} />
          <UpcomingEventsCard events={scheduleEvents} />
          <MentorAvailabilityCard />
        </div>
      </section>
    </div>
  );
}
