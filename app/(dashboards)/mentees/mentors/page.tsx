"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MessageSquare, CalendarClock, RefreshCw } from "lucide-react";
import { useMentorMentees } from "#comp-hooks/hooks/mentor";
import { useSocketContext } from "#/libs_schemas/context/socket-context";

export default function MentorMenteesPage() {
  const { mentees, count, isLoading, error, refresh } = useMentorMentees();
  const { socket, isOn } = useSocketContext();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!socket || !isOn) {
      return;
    }

    socket.on("notification", () => {
      void refresh();
    });
    socket.on("request_updated", () => {
      void refresh();
    });

    return () => {
      socket.off("notification", () => void refresh());
      socket.off("request_updated", () => void refresh());
    };
  }, [socket, isOn, refresh]);

  const filteredMentees = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return mentees;
    }

    return mentees.filter((mentee) => {
      return (
        mentee.name.toLowerCase().includes(normalized) ||
        mentee.majorAndYear.toLowerCase().includes(normalized) ||
        mentee.focusAreas.some((area) => area.toLowerCase().includes(normalized))
      );
    });
  }, [mentees, query]);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#241919]">My Mentees</h1>
          <p className="text-gray-500">Manage all accepted mentees and continue guidance from one place.</p>
        </div>

        <button
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#6A0A1D] hover:bg-[#FDF1F2]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </section>

      <section className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search mentees, major, or focus areas"
          className="w-full rounded-2xl border border-[#6A0A1D]/10 bg-[#FDF1F2] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#6A0A1D]/30"
        />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {isLoading ? "Loading mentees..." : `Showing ${filteredMentees.length} of ${count} active mentees`}
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-4">
        {!isLoading && !filteredMentees.length ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
            No mentees matched your search yet.
          </div>
        ) : null}

        {filteredMentees.map((mentee) => (
          <article
            key={mentee.id}
            className="grid gap-4 rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-100">
              <Image src={mentee.avatarUrl} alt={mentee.name} fill className="object-cover" />
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <h2 className="text-lg font-semibold text-[#241919]">{mentee.name}</h2>
                <p className="text-sm text-gray-500">{mentee.majorAndYear}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {mentee.focusAreas.map((area) => (
                  <span
                    key={`${mentee.id}-${area}`}
                    className="rounded-full bg-[#FDF1F2] px-2.5 py-1 text-xs font-semibold text-[#6A0A1D]"
                  >
                    {area}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-600">{mentee.goalText}</p>
            </div>

            <div className="flex gap-2 md:flex-col">
              <Link
                href="/mentors/messages"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6A0A1D] px-4 py-2 text-xs font-semibold text-white hover:brightness-110"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Link>
              <Link
                href="/mentors/meetings"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#6A0A1D]/20 px-4 py-2 text-xs font-semibold text-[#6A0A1D] hover:bg-[#FDF1F2]"
              >
                <CalendarClock className="h-4 w-4" />
                Schedule
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
