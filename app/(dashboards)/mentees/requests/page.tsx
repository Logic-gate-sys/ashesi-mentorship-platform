"use client";

import { useEffect, useMemo, useState } from "react";
import { MegaphoneIcon, Search, Wifi, WifiOff } from "lucide-react";
import { PendingRequestCard } from "#comp-hooks/cards/PendingRequestCard";
import { UpdatesCard } from "#comp-hooks/cards/RecentUpdatesCard";
import { StatusRequestCard } from "#comp-hooks/cards/RequestStatusCard";
import { MentorDetailCard } from "#comp-hooks/cards/MentorDetails";
import { useMenteeDashboard } from "#/components_hooks/hooks/mentee/useMenteeDashboard";
import { useMentors } from "#/components_hooks/hooks/mentee/useMentors";
import { useSocketContext } from "#/libs_schemas/context/socket-context";

export default function MenteeRequestPage() {
  const { pendingRequests, requestHistory, recentUpdates, refresh } = useMenteeDashboard();
  const { availableMentors, isLoading: mentorsLoading, error: mentorsError } = useMentors({ page: 1, limit: 20 });
  const socketContext = useSocketContext();
  const socket = socketContext?.socket ?? null;
  const isConnected = socket != null;

  const [filter, setFilter] = useState("");

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

  const normalizedFilter = filter.trim().toLowerCase();
  const filteredMentors = useMemo(() => {
    if (!normalizedFilter) {
      return availableMentors;
    }

    return availableMentors.filter((mentor) => {
      const fullName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
      const company = mentor.company.toLowerCase();
      const bio = mentor.bio.toLowerCase();
      const skills = mentor.skills.some((skill) => skill.toLowerCase().includes(normalizedFilter));

      return fullName.includes(normalizedFilter) || company.includes(normalizedFilter) || bio.includes(normalizedFilter) || skills;
    });
  }, [availableMentors, normalizedFilter]);

  return (
    <div className="flex flex-col  gap-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#241919] sm:text-3xl">Mentors</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Browse available mentors, review your request history, and send a new request when you are ready.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#FDF1F2] px-3 py-1.5 text-xs font-semibold text-[#6C1221]">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4" />
              Realtime Connected
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              Realtime Offline
            </>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,3.8fr)_minmax(0,1fr)]">
        <main className="flex min-w-0 flex-col gap-6">
          <section className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-[#241919]">Sent Requests</h2>
                <p className="text-sm text-gray-500">Requests you have already sent to mentors.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {pendingRequests.length ? (
                pendingRequests.map((request) => (
                  <PendingRequestCard
                    key={request.id}
                    id={request.id}
                    studentName={request.studentName}
                    studentAvatarUrl={request.studentAvatarUrl ?? ""}
                    majorAndYear={request.majorAndYear}
                    message={request.message}
                    showActions={false}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                  No sent requests yet. Browse mentors below to send your first request.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#241919]">Available Mentors</h2>
                <p className="text-sm text-gray-500">Search by name, company, skills, or bio.</p>
              </div>

              <label className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  placeholder="Search mentors"
                  className="w-full text-gray-800 rounded-full border border-gray-200 bg-[#FAF8F8] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#923D41] focus:ring-2 focus:ring-[#923D41]/10"
                />
              </label>
            </div>

            {mentorsError ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {mentorsError}
              </div>
            ) : null}

            {mentorsLoading ? (
              <p className="text-sm text-gray-500">Loading mentors...</p>
            ) : null}

            {!mentorsLoading && !filteredMentors.length ? (
              <p className="text-sm text-gray-500">No mentors match your search right now.</p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMentors.map((mentor) => (
                <MentorDetailCard key={mentor.id} {...mentor} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-xl font-semibold text-[#241919]">Recent Decisions</h2>

            {requestHistory.length ? (
              <div className="grid gap-3">
                {requestHistory.slice(0, 6).map((item) => (
                  <StatusRequestCard
                    key={item.id}
                    studentName={item.studentName}
                    majorAndYear={item.majorAndYear}
                    focusArea={item.goal || item.message || "Career guidance"}
                    status={item.status === "ACCEPTED" ? "CONNECTED" : "DECLINED"}
                    avatarUrl={item.studentAvatarUrl ?? undefined}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Decisions on mentor requests will appear here.</p>
            )}
          </section>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <UpdatesCard updates={recentUpdates} title="Request Activity" Icon={MegaphoneIcon} />
        </aside>
      </section>
    </div>
  );
}
