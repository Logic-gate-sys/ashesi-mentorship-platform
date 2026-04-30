"use client";
import { useEffect, useMemo, useState } from "react";
import { MegaphoneIcon, Wifi, WifiOff, InboxIcon } from "lucide-react";
import { PendingRequestCard } from "#comp-hooks/cards/PendingRequestCard";
import { MentorshipGoalsCard } from "#comp-hooks/cards/MentorshipGoalCard";
import { UpdatesCard } from "#comp-hooks/cards/RecentUpdatesCard";
import { StatusRequestCard } from "#comp-hooks/cards/RequestStatusCard";
import { useMentorshipRequests } from "#comp-hooks/hooks/mentor";
import { useSocketContext } from "#/libs_schemas/context/socket-context";
import { formatRelativeTime } from "#utils-types/utils/datatime";

type RequestActionState = "idle" | "accepting" | "declining" | "accepted" | "declined";

const FALLBACK_AVATAR = "https://i.pravatar.cc/150?u=mentor-request";

// ── Skeleton helpers ────────────────────────────────────────────────────────

function SkeletonLine({ w = "100%", h = "12px", className = "" }: { w?: string; h?: string; className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-100 ${className}`}
      style={{ width: w, height: h }}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
      {/* Avatar */}
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200" />
      {/* Lines */}
      <div className="flex flex-1 flex-col gap-2 pt-0.5">
        <SkeletonLine w="55%" h="11px" />
        <SkeletonLine w="35%" h="10px" />
        <SkeletonLine w="80%" h="10px" />
      </div>
      {/* Button stubs */}
      <div className="flex shrink-0 flex-col gap-1.5">
        <div className="h-7 w-16 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-7 w-16 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

function SkeletonSection({ title, cards = 2 }: { title: string; cards?: number }) {
  return (
    <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <SkeletonLine w="130px" h="14px" />
          <SkeletonLine w="180px" h="10px" />
        </div>
        <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

function SkeletonAside() {
  return (
    <>
      <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm sm:p-5">
        <SkeletonLine w="120px" h="13px" className="mb-3" />
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
              <SkeletonLine w={`${60 + i * 10}%`} h="10px" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm sm:p-5">
        <SkeletonLine w="110px" h="13px" className="mb-3" />
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <SkeletonLine w="70%" h="10px" />
              <div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Empty state (no requests, no history) ───────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#6A0A1D]/20 bg-white px-6 py-16 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF1F2]">
        <InboxIcon className="h-5 w-5 text-[#6C1221]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#241919]">No mentorship requests yet</p>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-400">
          When students send you a mentorship request it will appear here. Check back soon!
        </p>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function MentorRequestsPage() {
  const { requests, history, isLoading, error, refresh, acceptRequest, declineRequest } = useMentorshipRequests();
  const { isOn, socket } = useSocketContext();
  const [actionState, setActionState] = useState<Record<string, RequestActionState>>({});

  useEffect(() => {
    if (!isOn) return;
    socket?.on("notification", () => void refresh());
    socket?.on("request_updated", () => void refresh());
  }, [isOn, socket, refresh]);

  const recentUpdates = useMemo(() => {
    const pendingUpdates = requests.slice(0, 2).map((r) => ({
      id: `pending-${r.id}`,
      event: `Pending request from ${r.studentName}`,
      timestamp: r.createdAt ? formatRelativeTime(new Date(r.createdAt)) : "just now",
    }));
    const historyUpdates = history.slice(0, 3).map((r) => ({
      id: `history-${r.id}`,
      event: r.status === "ACCEPTED" ? `Accepted ${r.studentName}` : `Declined ${r.studentName}`,
      timestamp: r.createdAt ? formatRelativeTime(new Date(r.createdAt)) : "recently",
    }));
    return [...pendingUpdates, ...historyUpdates].slice(0, 4);
  }, [history, requests]);

  const metrics = useMemo(() => {
    const acceptedCount = history.filter((i) => i.status === "ACCEPTED").length;
    return [
      { label: "Pending", currentValue: requests.length },
      { label: "Accepted", currentValue: acceptedCount, targetValue: acceptedCount + requests.length },
    ];
  }, [history, requests]);

  const getState = (id: string) => actionState[id] ?? "idle";

  const markDone = (id: string, state: "accepted" | "declined") => {
    setActionState((prev) => ({ ...prev, [id]: state }));
    window.setTimeout(() => setActionState((prev) => ({ ...prev, [id]: "idle" })), 1400);
  };

  const runAction = async (requestId: string, action: "accept" | "decline") => {
    setActionState((prev) => ({ ...prev, [requestId]: action === "accept" ? "accepting" : "declining" }));
    const ok = action === "accept" ? await acceptRequest(requestId) : await declineRequest(requestId);
    if (ok) { markDone(requestId, action === "accept" ? "accepted" : "declined"); return; }
    setActionState((prev) => ({ ...prev, [requestId]: "idle" }));
  };

  const acceptedCount = history.filter((i) => i.status === "ACCEPTED").length;
  const hasAnything = requests.length > 0 || history.length > 0;

  // ── Header (always visible) ────────────────────────────────────────────
  const header = (
    <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-[#241919] sm:text-3xl">Mentorship Requests</h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
          Manage incoming requests, view accepted mentees, and track your history.
        </p>
      </div>
      <div className={`self-start inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        isOn ? "bg-emerald-50 text-emerald-700" : "bg-[#FDF1F2] text-[#6C1221]"
      }`}>
        {isOn ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
        {isOn ? "Live" : "Offline"}
      </div>
    </section>
  );

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        {header}
        <section className="grid gap-5 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-5">
            <SkeletonSection title="Pending Requests" cards={2} />
            <SkeletonSection title="Request History" cards={3} />
          </div>
          <aside className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-4 xl:self-start">
            <SkeletonAside />
          </aside>
        </section>
      </div>
    );
  }

  // ── Full page ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 pb-10">
      {header}

      {/* Error banner */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty state — nothing at all */}
      {!hasAnything && <EmptyState />}

      {/* Two-column layout — only shown when there's data */}
      {hasAnything && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
          {/* Left column */}
          <div className="flex min-w-0 flex-col gap-5">

            {/* Pending Requests */}
            <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[#241919]">Pending Requests</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Review and respond to new requests.</p>
                </div>
                {requests.length > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold bg-[#6A0A1D] text-white shrink-0">
                    {requests.length}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {requests.length ? (
                  requests.map((request) => {
                    const state = getState(request.id);
                    return (
                      <PendingRequestCard
                        key={request.id}
                        id={request.id}
                        studentName={request.studentName}
                        studentAvatarUrl={request.studentAvatarUrl || FALLBACK_AVATAR}
                        majorAndYear={request.majorAndYear}
                        message={request.message}
                        isAccepting={state === "accepting"}
                        isDeclining={state === "declining"}
                        isAccepted={state === "accepted"}
                        isDeclined={state === "declined"}
                        onAccept={() => void runAction(request.id, "accept")}
                        onDecline={() => void runAction(request.id, "decline")}
                      />
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center">
                    <p className="text-sm font-medium text-gray-500">No pending requests</p>
                    <p className="text-xs text-gray-400 mt-1">New requests will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Mentees */}
            {acceptedCount > 0 && (
              <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-[#241919]">Active Mentees</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Mentees you&apos;re currently working with.</p>
                  </div>
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold bg-emerald-600 text-white shrink-0">
                    {acceptedCount}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {history
                    .filter((i) => i.status === "ACCEPTED")
                    .map((item) => (
                      <StatusRequestCard
                        key={item.id}
                        studentName={item.studentName}
                        majorAndYear={item.majorAndYear || "Program not specified"}
                        focusArea={item.goal || item.message || "Career guidance"}
                        status="CONNECTED"
                        avatarUrl={item.studentAvatarUrl || FALLBACK_AVATAR}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Request History */}
            <div className="rounded-2xl border border-[#6A0A1D]/10 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[#241919]">Request History</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Your past responses and decisions.</p>
                </div>
                {history.length > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 shrink-0">
                    {history.length}
                  </span>
                )}
              </div>
              {history.length ? (
                <div className="flex flex-col gap-3">
                  {history.slice(0, 10).map((item) => (
                    <StatusRequestCard
                      key={item.id}
                      studentName={item.studentName}
                      majorAndYear={item.majorAndYear || "Program not specified"}
                      focusArea={item.goal || item.message || "Career guidance"}
                      status={item.status === "ACCEPTED" ? "CONNECTED" : "DECLINED"}
                      avatarUrl={item.studentAvatarUrl || FALLBACK_AVATAR}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-4 text-center">No history yet.</p>
              )}
            </div>
          </div>

          {/* Right aside */}
          <aside className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-4 xl:self-start">
            <UpdatesCard updates={recentUpdates} title="Request Activity" Icon={MegaphoneIcon} />
            <MentorshipGoalsCard metrics={metrics} title="Request Summary" />
          </aside>
        </section>
      )}
    </div>
  );
}