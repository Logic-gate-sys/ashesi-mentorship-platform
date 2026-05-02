"use client";

import { useEffect, useMemo, useState } from "react";
import { QuickInfoCard } from "#comp-hooks/ui/reusable-ui/CickableStatCard";
import { useAuth } from "#libs-schemas/context/auth-context";
import { User, Clock, MailIcon, type LucideIcon, MegaphoneIcon, Users, InboxIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  PendingRequestCard,
  MentorAvailabilityCard,
  ActiveMCard,
  UpdatesCard,
  UpcomingEventsCard,
} from "#comp-hooks/cards";
import { useMentorDashboard, useMentorshipRequests } from "#comp-hooks/hooks/mentor";
import { useSocketContext } from "#libs-schemas/context/socket-context";

const statsIcons: LucideIcon[] = [User, MailIcon, Clock];

// ── Skeleton primitives ────────────────────────────────────────────────────

function Pulse({ w = "100%", h = "11px", rounded = "rounded-md", className = "" }: {
  w?: string; h?: string; rounded?: string; className?: string;
}) {
  return (
    <div className={`animate-pulse bg-gray-100 ${rounded} ${className}`} style={{ width: w, height: h }} />
  );
}

function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <Pulse w="55%" h="13px" />
        <div className="h-8 w-8 animate-pulse rounded-xl bg-gray-100" />
      </div>
      <Pulse w="35%" h="22px" />
    </div>
  );
}

function SkeletonRequestCard() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-1 flex-col gap-2 pt-0.5">
        <Pulse w="45%" h="12px" />
        <Pulse w="30%" h="10px" />
        <Pulse w="80%" h="10px" />
      </div>
      <div className="flex shrink-0 flex-col gap-1.5">
        <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

function SkeletonMenteeCard() {
  return (
    <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Pulse w="55%" h="12px" />
          <Pulse w="40%" h="10px" />
        </div>
      </div>
    </div>
  );
}

function SkeletonSidebar() {
  return (
    <>
      <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm">
        <Pulse w="100px" h="13px" className="mb-3" />
        <div className="flex flex-col gap-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
              <Pulse w={`${55 + i * 10}%`} h="10px" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm">
        <Pulse w="120px" h="13px" className="mb-3" />
        <div className="flex flex-col gap-2">
          {[0, 1].map((i) => <Pulse key={i} w="100%" h="44px" rounded="rounded-xl" />)}
        </div>
      </div>
    </>
  );
}

// ── Empty states ───────────────────────────────────────────────────────────

function EmptyRequests() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF1F2]">
        <InboxIcon className="h-4 w-4 text-[#6C1221]" />
      </div>
      <p className="text-sm font-medium text-gray-500">No pending requests</p>
      <p className="text-xs text-gray-400">New requests from students will appear here.</p>
    </div>
  );
}

function EmptyMentees() {
  return (
    <div className="col-span-full flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF1F2]">
        <Users className="h-4 w-4 text-[#6C1221]" />
      </div>
      <p className="text-sm font-medium text-gray-500">No active mentees yet</p>
      <p className="text-xs text-gray-400">Accepted requests will show up here.</p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MentorHomePage() {
  const { user } = useAuth();
  const { stats, recentUpdates, pendingRequests, activeMentees, scheduleEvents, isLoading, error } =
    useMentorDashboard();
  const { acceptRequest, declineRequest } = useMentorshipRequests();
  const { socket } = useSocketContext();

  const [actionState, setActionState] = useState<
    Record<string, "idle" | "accepting" | "declining" | "accepted" | "declined">
  >({});

  useEffect(() => {
    if (!socket) return;
    // Socket event listeners can be added here if needed
  }, [socket]);

  const requestState = useMemo(
    () => (id: string) => actionState[id] ?? "idle",
    [actionState]
  );

  const markDone = (id: string, state: "accepted" | "declined") => {
    setActionState((prev) => ({ ...prev, [id]: state }));
    window.setTimeout(() => setActionState((prev) => ({ ...prev, [id]: "idle" })), 1500);
  };

  const handleAccept = async (id: string) => {
    setActionState((prev) => ({ ...prev, [id]: "accepting" }));
    await acceptRequest(id);
    markDone(id, "accepted");
  };

  const handleDecline = async (id: string) => {
    setActionState((prev) => ({ ...prev, [id]: "declining" }));
    await declineRequest(id);
    markDone(id, "declined");
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-start gap-4">
        {/* Welcome shimmer */}
        <section className="w-full flex flex-col gap-2">
          <Pulse w="260px" h="28px" rounded="rounded-lg" />
          <Pulse w="200px" h="13px" />
        </section>

        {/* Stat cards */}
        <section className="grid w-full gap-4 p-2 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </section>

        {/* Main + sidebar */}
        <section className="mt-2 grid w-full gap-6 xl:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <Pulse w="180px" h="20px" rounded="rounded-lg" />
            <SkeletonRequestCard />
            <SkeletonRequestCard />
            <div className="mt-6 flex flex-col gap-4">
              <Pulse w="140px" h="18px" rounded="rounded-lg" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <SkeletonMenteeCard />
                <SkeletonMenteeCard />
                <SkeletonMenteeCard />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <SkeletonSidebar />
          </div>
        </section>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#241919]">Something went wrong</p>
          <p className="mt-0.5 text-xs text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // ── Page ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-start gap-4">
      {/* ── Welcome ───────────────────────────────────────────────────── */}
      <section className="w-full flex flex-col items-start">
        <h1 className="text-3xl font-bold tracking-tight text-[#241919]">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-0.5">
          Ready to guide the next generation of scholars.
        </p>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="grid w-full gap-4 p-2 sm:grid-cols-2 xl:grid-cols-3">
        {stats?.map((itm, idx) => (
          <QuickInfoCard key={idx} title={itm.title} statsNum={itm.statsNum} Icon={statsIcons[idx]} />
        ))}
      </section>

      {/* ── Main + sidebar ────────────────────────────────────────────── */}
      <section className="mt-2 grid w-full gap-6 xl:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)]">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-6">

          {/* Pending requests */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#241919]">Mentorship Requests</h2>
              <Link
                href="/mentors/requests"
                className="text-xs font-semibold text-[#6A0A1D] hover:underline"
              >
                View all
              </Link>
            </div>
            {pendingRequests?.length ? (
              <div className="flex flex-col gap-3">
                {pendingRequests.slice(0, 3).map((req) => {
                  const state = requestState(req.id);
                  return (
                    <PendingRequestCard
                      key={req.id}
                      id={req.id}
                      studentName={req.studentName}
                      studentAvatarUrl={req.studentAvatarUrl || "https://i.pravatar.cc/150?u=student"}
                      majorAndYear={req.majorAndYear}
                      message={req.message}
                      isAccepting={state === "accepting"}
                      isDeclining={state === "declining"}
                      isAccepted={state === "accepted"}
                      isDeclined={state === "declined"}
                      onAccept={() => void handleAccept(req.id)}
                      onDecline={() => void handleDecline(req.id)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyRequests />
            )}
          </div>

          {/* Active mentees */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#241919]">Active Mentees</h2>
              {activeMentees?.length ? (
                <Link
                  href="/mentors/mentees"
                  className="text-xs font-semibold text-[#6A0A1D] hover:underline"
                >
                  View all
                </Link>
              ) : null}
            </div>
            <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeMentees?.length ? (
                activeMentees.map((m, idx) => (
                  <ActiveMCard key={idx} mName={m.name} mTitle={m.title} />
                ))
              ) : (
                <EmptyMentees />
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex min-w-0 flex-col gap-3 xl:sticky xl:top-4 xl:self-start">
          <UpdatesCard updates={recentUpdates} title="Updates" Icon={MegaphoneIcon} />
          <UpcomingEventsCard events={scheduleEvents} />
          <MentorAvailabilityCard />
        </div>
      </section>
    </div>
  );
}