"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MessageSquare, CalendarClock, RefreshCw, GraduationCap, AlertCircle } from "lucide-react";
import { useMentorMentees } from "#comp-hooks/hooks/mentor";
import { useSocketContext } from "#libs-schemas/context/socket-context";

// ── Skeleton ───────────────────────────────────────────────────────────────

function Pulse({ w = "100%", h = "11px", rounded = "rounded-md", className = "" }: {
  w?: string; h?: string; rounded?: string; className?: string;
}) {
  return (
    <div className={`animate-pulse bg-gray-100 ${rounded} ${className}`} style={{ width: w, height: h }} />
  );
}

function SkeletonCard() {
  return (
    <div className="grid gap-4 rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-200" />
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5">
          <Pulse w="40%" h="14px" />
          <Pulse w="28%" h="11px" />
        </div>
        <div className="flex gap-2">
          <Pulse w="70px" h="22px" rounded="rounded-full" />
          <Pulse w="90px" h="22px" rounded="rounded-full" />
          <Pulse w="60px" h="22px" rounded="rounded-full" />
        </div>
        <Pulse w="85%" h="11px" />
      </div>
      <div className="flex gap-2 md:flex-col">
        <Pulse w="96px" h="34px" rounded="rounded-xl" />
        <Pulse w="96px" h="34px" rounded="rounded-xl" />
      </div>
    </div>
  );
}

// ── Empty states ───────────────────────────────────────────────────────────

function EmptyMentors() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#6A0A1D]/15 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF1F2]">
        <GraduationCap className="h-5 w-5 text-[#6C1221]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#241919]">No mentors yet</p>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-400">
          Once a mentor accepts your request they&apos;ll appear here. Browse available mentors to get started.
        </p>
      </div>
      <Link
        href="/mentees/requests"
        className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-[#6A0A1D] px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition"
      >
        Find a Mentor
      </Link>
    </div>
  );
}

function EmptySearch({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">No results for &ldquo;{query}&rdquo;</p>
        <p className="mt-0.5 text-xs text-gray-400">Try a different name, major, or focus area.</p>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MyMentorsPage() {
  const { mentees, count, isLoading, error, refresh } = useMentorMentees();
  const { socket, isOn } = useSocketContext();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!socket || !isOn) return;
    const onUpdate = () => void refresh();
    socket.on("notification", onUpdate);
    socket.on("request_updated", onUpdate);
    return () => {
      socket.off("notification", onUpdate);
      socket.off("request_updated", onUpdate);
    };
  }, [socket, isOn, refresh]);

  const filteredMentees = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return mentees;
    return mentees.filter((mentee) =>
      mentee.name.toLowerCase().includes(normalized) ||
      mentee.majorAndYear.toLowerCase().includes(normalized) ||
      mentee.focusAreas.some((area) => area.toLowerCase().includes(normalized))
    );
  }, [mentees, query]);

  const statusLine = isLoading
    ? "Loading mentors…"
    : query.trim()
    ? `${filteredMentees.length} result${filteredMentees.length === 1 ? "" : "s"} for "${query.trim()}"`
    : `${count} active mentor${count === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#241919]">My Mentors</h1>
          <p className="mt-0.5 text-sm text-gray-500">View your connected mentors and continue guidance from one place.</p>
        </div>
        <button
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#6A0A1D] hover:bg-[#FDF1F2] transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </section>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <section className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, major, or focus area…"
          className="w-full rounded-2xl border border-[#6A0A1D]/10 bg-[#FDF1F2] py-3 pl-11 pr-12 text-sm text-[#241919] placeholder:text-gray-400 outline-none focus:border-[#6A0A1D]/30 transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </section>

      {/* ── Status line ─────────────────────────────────────────────── */}
      <p className="text-xs text-gray-400">{statusLine}</p>

      {/* ── Error banner ────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── List ────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        {/* Loading skeletons */}
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Empty — no mentors at all */}
        {!isLoading && !mentees.length && <EmptyMentors />}

        {/* Empty — search filtered everything out */}
        {!isLoading && mentees.length > 0 && !filteredMentees.length && (
          <EmptySearch query={query} />
        )}

        {/* Cards */}
        {!isLoading && filteredMentees.map((mentee) => (
          <article
            key={mentee.id}
            className="grid gap-4 rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center"
          >
            {/* Avatar */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-gray-100">
              <Image src={mentee.avatarUrl} alt={mentee.name} fill unoptimized className="object-cover" />
            </div>

            {/* Body */}
            <div className="flex flex-col gap-2">
              <div>
                <h2 className="text-base font-semibold text-[#241919]">{mentee.name}</h2>
                <p className="text-sm text-gray-500">{mentee.majorAndYear}</p>
              </div>
              {mentee.focusAreas.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {mentee.focusAreas.map((area) => (
                    <span
                      key={`${mentee.id}-${area}`}
                      className="rounded-full bg-[#FDF1F2] px-2.5 py-0.5 text-xs font-semibold text-[#6A0A1D]"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
              {mentee.goalText && (
                <p className="text-sm leading-relaxed text-gray-500">{mentee.goalText}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 md:flex-col">
              <Link
                href="/mentees/messages"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#6A0A1D] px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Message
              </Link>
              <Link
                href="/mentees/meetings"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#6A0A1D]/20 px-4 py-2 text-xs font-semibold text-[#6A0A1D] hover:bg-[#FDF1F2] transition"
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Schedule
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}