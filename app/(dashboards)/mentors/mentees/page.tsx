"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MessageSquare, CalendarClock, RefreshCw, Wifi, WifiOff } from "lucide-react";
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

    const handleNotification = () => {
      void refresh();
    };
    const handleRequestUpdated = () => {
      void refresh();
    };

    socket.on("notification", handleNotification);
    socket.on("request_updated", handleRequestUpdated);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("request_updated", handleRequestUpdated);
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
      <section className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#241919] sm:text-3xl">My Mentees</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            Manage all accepted mentees and track your mentoring relationships.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-[#FDF1F2] text-[#6C1221]">
            {isOn ? (
              <>
                <Wifi className="h-4 w-4" />
                Realtime Connected
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                Realtime Off
              </>
            )}
          </div>

          <button
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#6A0A1D] hover:bg-[#FDF1F2]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {/* Search Section */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search mentees, major, or focus areas"
          className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-[#241919] placeholder-gray-500 outline-none focus:border-[#6A0A1D] focus:ring-2 focus:ring-[#6A0A1D]/20"
        />
      </div>

      {/* Mentees Count */}
      <section className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">
          {isLoading ? (
            "Loading your mentees..."
          ) : mentees.length === 0 ? (
            "No active mentees yet"
          ) : (
            <>
              <span className="font-semibold text-[#241919]">{filteredMentees.length}</span>
              {filteredMentees.length !== count && ` of ${count}`} active mentee{mentees.length === 1 ? "" : "s"}
            </>
          )}
        </p>
      </section>

      {/* Empty State */}
      {!isLoading && mentees.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF1F2]">
            <MessageSquare className="h-6 w-6 text-[#6A0A1D]" />
          </div>
          <h3 className="text-lg font-semibold text-[#241919]">No active mentees yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Accept mentorship requests to start building your mentee network.
          </p>
          <Link
            href="/mentors/requests"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6A0A1D] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            View Requests
          </Link>
        </div>
      ) : null}

      {/* Mentees List */}
      <section className="grid gap-4">
        {!isLoading && filteredMentees.length === 0 && mentees.length > 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
            No mentees matched your search. Try a different search term.
          </div>
        ) : null}

        {filteredMentees.map((mentee) => (
          <article
            key={mentee.id}
            className="group grid gap-4 rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm transition hover:shadow-md md:grid-cols-[auto_1fr_auto] md:items-center"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6A0A1D] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Link>
              <Link
                href="/mentors/meetings"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#6A0A1D]/20 px-4 py-2 text-xs font-semibold text-[#6A0A1D] transition hover:bg-[#FDF1F2]"
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
