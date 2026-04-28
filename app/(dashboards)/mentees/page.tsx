"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Clock, MailIcon, MegaphoneIcon, User, type LucideIcon } from "lucide-react";
import { QuickInfoCard } from "#comp-hooks/ui/reusable-ui/CickableStatCard";
import { PendingRequestCard, UpdatesCard, UpcomingEventsCard } from "#comp-hooks/cards";
import { useAuth } from "#/libs_schemas/context/auth-context";
import { useMenteeDashboard } from "#comp-hooks/hooks/mentee/useMenteeDashboard";
import { useSocketContextSafe } from "#/libs_schemas/context/socket-context";

const statsIcons: LucideIcon[] = [User, MailIcon, Clock];

export default function MenteeHomePage() {
  const { user } = useAuth();
  const { stats, recentUpdates, pendingRequests, scheduleEvents, isLoading, error, refresh } = useMenteeDashboard();
  const socketContext = useSocketContextSafe();
  const socket = socketContext?.socket ?? null;

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleRefresh = () => {
      void refresh();
    };

    socket.on("notification", handleRefresh);
    socket.on("request_updated", handleRefresh);

    return () => {
      socket.off("notification", handleRefresh);
      socket.off("request_updated", handleRefresh);
    };
  }, [socket, refresh]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#241919]">Welcome Back, {user?.firstName}!</h1>
        <p className="max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Track your mentorship journey, review updates, and keep your sessions moving.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item, index) => (
          <QuickInfoCard
            key={`${item.title}-${index}`}
            title={item.title}
            statsNum={item.statsNum}
            Icon={statsIcons[index % statsIcons.length]}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#241919]">Pending Requests</h2>
            <Link href="/mentees/requests" className="text-sm font-semibold text-[#6A0A1D] hover:underline">
              View all
            </Link>
          </div>

          <section className="flex flex-col gap-4">
            {pendingRequests.length ? (
              pendingRequests.slice(0, 3).map((request) => (
                <PendingRequestCard
                  key={request.id}
                  id={request.id}
                  studentName={request.studentName}
                  studentAvatarUrl={request.studentAvatarUrl ?? ""}
                  majorAndYear={request.majorAndYear}
                  message={request.message}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                No pending requests right now.
              </div>
            )}
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <UpdatesCard updates={recentUpdates} title="Updates" Icon={MegaphoneIcon} />
          <UpcomingEventsCard events={scheduleEvents} />
        </div>
      </section>
    </div>
  );
}
