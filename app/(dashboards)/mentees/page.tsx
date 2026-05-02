"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Clock, MailIcon, MegaphoneIcon, User, type LucideIcon, InboxIcon, AlertCircle } from "lucide-react";
import { QuickInfoCard } from "#comp-hooks/ui/reusable-ui/CickableStatCard";
import { PendingRequestCard, UpdatesCard, UpcomingEventsCard } from "#comp-hooks/cards";
import { useAuth } from "#libs-schemas/context/auth-context";
import { useMenteeDashboard } from "#comp-hooks/hooks/mentee/useMenteeDashboard";
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
      <div className="mb-3 flex items-center justify-between">
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
    </div>
  );
}

function SkeletonSidebar() {
  return (
    <>
      <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm">
        <Pulse w="90px" h="13px" className="mb-3" />
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

// ── Page ───────────────────────────────────────────────────────────────────

export default function MenteeHomePage() {
  const { user } = useAuth();
  const { stats, recentUpdates, pendingRequests, scheduleEvents, isLoading, error, refresh } =
    useMenteeDashboard();
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => void refresh();
    socket.on("notification", handleRefresh);
    socket.on("request_updated", handleRefresh);
    return () => {
      socket.off("notification", handleRefresh);
      socket.off("request_updated", handleRefresh);
    };
  }, [socket, refresh]);

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pb-8">
        {/* Welcome shimmer */}
        <section className="flex flex-col gap-2">
          <Pulse w="280px" h="28px" rounded="rounded-lg" />
          <Pulse w="340px" h="13px" />
        </section>

        {/* Stat cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </section>

        {/* Main + sidebar */}
        <section className="grid gap-6 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Pulse w="180px" h="20px" rounded="rounded-lg" />
              <Pulse w="56px" h="13px" />
            </div>
            <SkeletonRequestCard />
            <SkeletonRequestCard />
            <SkeletonRequestCard />
          </div>
          <div className="flex flex-col gap-4">
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
        <button
          onClick={() => void refresh()}
          className="mt-1 rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-[#6A0A1D] hover:bg-[#FDF1F2] transition"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Page ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* ── Welcome ───────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-[#241919]">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-500">
          Track your mentorship journey, review updates, and keep your sessions moving.
        </p>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
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

      {/* ── Main + sidebar ────────────────────────────────────────────── */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        {/* Left — pending requests */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#241919]">Pending Requests</h2>
            <Link
              href="/mentees/requests"
              className="text-xs font-semibold text-[#6A0A1D] hover:underline"
            >
              View all
            </Link>
          </div>

          {pendingRequests.length ? (
            <div className="flex flex-col gap-3">
              {pendingRequests.slice(0, 3).map((request) => (
                <PendingRequestCard
                  key={request.id}
                  id={request.id}
                  studentName={request.studentName}
                  studentAvatarUrl={request.studentAvatarUrl ?? ""}
                  majorAndYear={request.majorAndYear}
                  message={request.message}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF1F2]">
                <InboxIcon className="h-4 w-4 text-[#6C1221]" />
              </div>
              <p className="text-sm font-medium text-gray-500">No pending requests</p>
              <p className="text-xs text-gray-400">
                Browse mentors and send a request to get started.
              </p>
              <Link
                href="/mentees/explore"
                className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-[#6A0A1D] px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition"
              >
                Find a Mentor
              </Link>
            </div>
          )}
        </div>

        {/* Right — sidebar */}
        <div className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-4 xl:self-start">
          <UpdatesCard updates={recentUpdates} title="Updates" Icon={MegaphoneIcon} />
          <UpcomingEventsCard events={scheduleEvents} />
        </div>
      </section>
    </div>
  );
}