"use client";

import { useEffect, useMemo, useState } from "react";
import { MegaphoneIcon, Wifi, WifiOff } from "lucide-react";
import { PendingRequestCard } from "#comp-hooks/cards/PendingRequestCard";
import { MentorshipGoalsCard } from "#comp-hooks/cards/MentorshipGoalCard";
import { UpdatesCard } from "#comp-hooks/cards/RecentUpdatesCard";
import { StatusRequestCard } from "#comp-hooks/cards/RequestStatusCard";
import {useMentorshipRequests,} from "#comp-hooks/hooks/mentor";
import { useSocketContext } from "#/libs_schemas/context/socket-context";
import { formatRelativeTime } from "#utils-types/utils/datatime";

type RequestActionState =
  | "idle"
  | "accepting"
  | "declining"
  | "accepted"
  | "declined";

const FALLBACK_AVATAR = "https://i.pravatar.cc/150?u=mentor-request";

export default function MentorRequestsPage() {
  const { requests, history, isLoading, error, refresh, acceptRequest, declineRequest } = useMentorshipRequests();
  const {isOn, socket} = useSocketContext();
  const [actionState, setActionState] = useState<Record<string, RequestActionState>>({});

  useEffect(() => {
    if (!isOn) {
      return;
    }
    socket?.on("notification", () => {
      void refresh();
    });
    socket?.on("request_updated", () => {
      void refresh();
    });

  }, [isOn,socket,refresh]);

  const recentUpdates = useMemo(() => {
    const pendingUpdates = requests.slice(0, 2).map((request) => ({
      id: `pending-${request.id}`,
      event: `Pending request from ${request.studentName}`,
      timestamp: request.createdAt
        ? formatRelativeTime(new Date(request.createdAt))
        : "just now",
    }));

    const historyUpdates = history.slice(0, 3).map((request) => ({
      id: `history-${request.id}`,
      event:
        request.status === "ACCEPTED"
          ? `Accepted ${request.studentName}`
          : `Declined ${request.studentName}`,
      timestamp: request.createdAt
        ? formatRelativeTime(new Date(request.createdAt))
        : "recently",
    }));

    return [...pendingUpdates, ...historyUpdates].slice(0, 4);
  }, [history, requests]);

  const metrics = useMemo(() => {
    const acceptedCount = history.filter((item) => item.status === "ACCEPTED").length;
    return [
      {
        label: "Pending",
        currentValue: requests.length,
      },
      {
        label: "Accepted",
        currentValue: acceptedCount,
        targetValue: acceptedCount + requests.length,
      },
    ];
  }, [history, requests]);

  const getState = (id: string) => actionState[id] || "idle";

  const markDone = (id: string, state: "accepted" | "declined") => {
    setActionState((prev) => ({ ...prev, [id]: state }));
    window.setTimeout(() => {
      setActionState((prev) => ({ ...prev, [id]: "idle" }));
    }, 1400);
  };

  const runAction = async (requestId: string, action: "accept" | "decline") => {
    setActionState((prev) => ({
      ...prev,
      [requestId]: action === "accept" ? "accepting" : "declining",
    }));

    const ok =
      action === "accept"
        ? await acceptRequest(requestId)
        : await declineRequest(requestId);

    if (ok) {
      markDone(requestId, action === "accept" ? "accepted" : "declined");
      return;
    }

    setActionState((prev) => ({ ...prev, [requestId]: "idle" }));
  };

  if (isLoading) {
    return <p className="py-10 text-sm text-gray-500">Loading mentorship requests...</p>;
  }

  return (
    <div className="text-accent flex flex-col items-start gap-5 pb-8">
      <section className="w-full flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Incoming Mentorship Requests</h1>
          <p className="text-gray-500">
            Review pending requests and track your most recent decisions.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-[#FDF1F2] text-[#6C1221]">
          {isOn ? (
            isOn ? (
              <>
                <Wifi className="h-4 w-4" />
                Realtime Connected
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                Realtime Reconnecting
              </>
            )
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              Realtime Off
            </>
          )}
        </div>
      </section>

      {error ? (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid w-full gap-6 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
        <main className="flex min-w-0 flex-col gap-5">
          <section className="flex flex-col gap-4">
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
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                No pending requests right now.
              </div>
            )}
          </section>

          <section className="mt-4 flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-[#241919]">Recent Decisions</h2>

            {history.length ? (
              history.slice(0, 6).map((item) => (
                <StatusRequestCard
                  key={item.id}
                  studentName={item.studentName}
                  majorAndYear={item.majorAndYear || "Program not specified"}
                  focusArea={item.goal || item.message || "Career guidance"}
                  status={item.status === "ACCEPTED" ? "CONNECTED" : "DECLINED"}
                  avatarUrl={item.studentAvatarUrl || FALLBACK_AVATAR}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No accepted or declined requests yet.</p>
            )}
          </section>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <UpdatesCard updates={recentUpdates} title="Request Activity" Icon={MegaphoneIcon} />
          <MentorshipGoalsCard metrics={metrics} title="Request Goals" />
        </aside>
      </section>
    </div>
  );
}
