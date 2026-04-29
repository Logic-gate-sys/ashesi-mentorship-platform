"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Check,
  Clock,
  Loader2,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { useMentorMeetings } from "#comp-hooks/hooks/mentor";
import { useSocketContext } from "#/libs_schemas/context/socket-context";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

type SessionActionState = "idle" | "completing" | "cancelling" | "done";

function formatDay(day: string) {
  return day.slice(0, 1) + day.slice(1).toLowerCase();
}

function formatDateTime(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MentorMeetingsPage() {
  const {
    sessions,
    availabilitySlots,
    isLoading,
    isSubmittingSlot,
    error,
    refresh,
    addAvailabilitySlot,
    deleteAvailabilitySlot,
    cancelSession,
    completeSession,
  } = useMentorMeetings();

  const { socket, isOn } = useSocketContext();

  const [newSlot, setNewSlot] = useState({
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "10:00",
  });

  const [slotSaved, setSlotSaved] = useState(false);
  const [slotDeletingId, setSlotDeletingId] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<Record<string, SessionActionState>>({});

  useEffect(() => {
    if (!socket || !isOn) {
      return;
    }

    const handleNotification = () => {
      void refresh();
    };
    const handleSession = () => {
      void refresh();
    };
    const handleAvailability = () => {
      void refresh();
    };

    socket.on("notification", handleNotification);
    socket.on("session_updated", handleSession);
    socket.on("availability_updated", handleAvailability);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("session_updated", handleSession);
      socket.off("availability_updated", handleAvailability);
    };
  }, [socket, isOn, refresh]);

  const upcomingSessions = useMemo(() => {
    return sessions.filter((session) => session.status === "SCHEDULED" || session.status === "RESCHEDULED");
  }, [sessions]);

  const pastSessions = useMemo(() => {
    return sessions.filter((session) => session.status === "COMPLETED" || session.status === "CANCELLED");
  }, [sessions]);

  const submitSlot = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newSlot.startTime >= newSlot.endTime) {
      return;
    }

    const ok = await addAvailabilitySlot(newSlot);
    if (!ok) {
      return;
    }

    setSlotSaved(true);
    window.setTimeout(() => setSlotSaved(false), 1100);
  };

  const runSessionAction = async (sessionId: string, action: "complete" | "cancel") => {
    setSessionState((prev) => ({
      ...prev,
      [sessionId]: action === "complete" ? "completing" : "cancelling",
    }));

    try {
      if (action === "complete") {
        await completeSession(sessionId);
      } else {
        await cancelSession(sessionId);
      }

      setSessionState((prev) => ({ ...prev, [sessionId]: "done" }));
      window.setTimeout(() => {
        setSessionState((prev) => ({ ...prev, [sessionId]: "idle" }));
      }, 1000);
    } catch {
      setSessionState((prev) => ({ ...prev, [sessionId]: "idle" }));
    }
  };

  const removeSlot = async (slotId: string) => {
    setSlotDeletingId(slotId);

    try {
      await deleteAvailabilitySlot(slotId);
    } finally {
      setSlotDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <section>
        <h1 className="text-2xl font-bold text-[#241919]">Meetings and Availability</h1>
        <p className="text-gray-500">Set availability slots and keep session status up to date.</p>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={submitSlot}
          className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-[#241919]">Create Availability Slot</h2>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Day
              <select
                value={newSlot.dayOfWeek}
                onChange={(event) =>
                  setNewSlot((prev) => ({ ...prev, dayOfWeek: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {formatDay(day)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Start Time
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(event) =>
                  setNewSlot((prev) => ({ ...prev, startTime: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-600">
              End Time
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(event) =>
                  setNewSlot((prev) => ({ ...prev, endTime: event.target.value }))
                }
                className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#6A0A1D]/30"
              />
            </label>
          </div>

          {newSlot.startTime >= newSlot.endTime ? (
            <p className="mt-3 text-xs text-red-600">End time must be after start time.</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmittingSlot || newSlot.startTime >= newSlot.endTime}
            className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              slotSaved
                ? "bg-[#1B5E20]"
                : "bg-[#6A0A1D] hover:brightness-110"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {isSubmittingSlot ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isSubmittingSlot ? "Saving..." : slotSaved ? "Saved" : "Add Slot"}
          </button>
        </form>

        <div className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#241919]">Current Availability</h2>
            <button
              onClick={() => void refresh()}
              className="text-sm font-medium text-[#6A0A1D] hover:underline"
            >
              Refresh
            </button>
          </div>

          {isLoading ? <p className="text-sm text-gray-500">Loading availability...</p> : null}

          {!isLoading && !availabilitySlots.length ? (
            <p className="text-sm text-gray-500">No availability slots yet.</p>
          ) : null}

          <div className="space-y-2">
            {availabilitySlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-2xl bg-[#FDF1F2] px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-[#241919]">{formatDay(slot.dayOfWeek)}</p>
                  <p className="text-xs text-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>

                <button
                  onClick={() => void removeSlot(slot.id)}
                  disabled={slotDeletingId === slot.id}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 disabled:opacity-60"
                >
                  {slotDeletingId === slot.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-[#6A0A1D]" />
            <h2 className="text-lg font-semibold text-[#241919]">Upcoming Sessions</h2>
          </div>

          {isLoading ? <p className="text-sm text-gray-500">Loading sessions...</p> : null}

          {!isLoading && !upcomingSessions.length ? (
            <p className="text-sm text-gray-500">No upcoming sessions scheduled.</p>
          ) : null}

          <div className="space-y-3">
            {upcomingSessions.map((session) => {
              const state = sessionState[session.id] || "idle";
              const isBusy = state === "completing" || state === "cancelling";

              return (
                <article key={session.id} className="rounded-2xl border border-gray-100 p-3">
                  <p className="text-sm font-semibold text-[#241919]">{session.topic}</p>
                  <p className="text-xs text-gray-500">{session.menteeName}</p>
                  <p className="mt-1 text-xs text-gray-600">{formatDateTime(session.scheduledAt)}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {session.meetingUrl ? (
                      <Link
                        href={session.meetingUrl}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#6A0A1D] px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        <Video className="h-3.5 w-3.5" />
                        Join
                      </Link>
                    ) : null}

                    <button
                      onClick={() => void runSessionAction(session.id, "complete")}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1 rounded-lg border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-700 disabled:opacity-60"
                    >
                      {state === "completing" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : state === "done" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      Complete
                    </button>

                    <button
                      onClick={() => void runSessionAction(session.id, "cancel")}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-60"
                    >
                      {state === "cancelling" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                      Cancel
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-[#6A0A1D]/10 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-[#241919]">Recent Session Outcomes</h2>

          {!pastSessions.length ? (
            <p className="text-sm text-gray-500">No completed or cancelled sessions yet.</p>
          ) : null}

          <div className="space-y-2">
            {pastSessions.slice(0, 8).map((session) => (
              <article
                key={session.id}
                className="flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-[#241919]">{session.topic}</p>
                  <p className="text-xs text-gray-500">{session.menteeName}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                    session.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {session.status}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
