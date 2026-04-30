"use client";
import { useEffect, useMemo, useState } from "react";
import { MegaphoneIcon, Wifi, WifiOff } from "lucide-react";
import { PendingRequestCard } from "#comp-hooks/cards/PendingRequestCard";
import { MentorshipGoalsCard } from "#comp-hooks/cards/MentorshipGoalCard";
import { UpdatesCard } from "#comp-hooks/cards/RecentUpdatesCard";
import { StatusRequestCard } from "#comp-hooks/cards/RequestStatusCard";
import { useMentorshipRequests } from "#comp-hooks/hooks/mentor";
import { useSocketContext } from "#/libs_schemas/context/socket-context";
import { formatRelativeTime } from "#utils-types/utils/datatime";

type RequestActionState = "idle" | "accepting" | "declining" | "accepted" | "declined";

const FALLBACK_AVATAR = "https://i.pravatar.cc/150?u=mentor-request";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Loading mentorship requests…</p>
      </div>
    );
  }

  const acceptedCount = history.filter((i) => i.status === "ACCEPTED").length;
  const declinedCount = history.filter((i) => i.status === "DECLINED").length;

  // Reusable section badge
  const Badge = ({ count, className }: { count: number; className: string }) => (
    <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${className}`}>
      {count}
    </span>
  );

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── Page header ─────────────────────────────────────────────── */}
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

      {/* ── Error banner ────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Two-column layout ────────────────────────────────────────── */}
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
                <Badge count={requests.length} className="bg-[#6A0A1D] text-white shrink-0" />
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
                <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
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
                  <p className="text-xs text-gray-400 mt-0.5">Mentees you're currently working with.</p>
                </div>
                <Badge count={acceptedCount} className="bg-emerald-600 text-white shrink-0" />
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
                <Badge count={history.length} className="bg-gray-100 text-gray-600 shrink-0" />
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
    </div>
  );
}