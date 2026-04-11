'use client';

import React from 'react';

interface SessionCalendarProps {
  sessions: Array<{
    id: string;
    studentName: string;
    menteeInitials?: string;
    topic?: string;
    scheduledAt: Date;
    duration: number;
    status: 'scheduled' | 'in-progress' | 'completed';
    meetingUrl?: string;
    onJoin?: (sessionId: string) => void;
    onEnd?: (sessionId: string) => void;
    onReschedule?: (sessionId: string) => void;
  }>;
  view?: 'week' | 'day';
}

export default function SessionCalendar({ sessions, view = 'week' }: SessionCalendarProps) {
  const statusConfig = {
    scheduled: { label: '⏳ UPCOMING', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    'in-progress': { label: '🔴 IN PROGRESS', color: 'bg-red-50 text-red-700 border-red-200' },
    completed: { label: '✅ COMPLETED', color: 'bg-green-50 text-green-700 border-green-200' },
  };

  // Group sessions by date
  const sessionsByDate = sessions.reduce(
    (acc, session) => {
      const dateKey = new Date(session.scheduledAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(session);
      return acc;
    },
    {} as Record<string, typeof sessions>
  );

  return (
    <div className="space-y-6">
      {Object.entries(sessionsByDate).map(([dateKey, daySessions]) => (
        <div key={dateKey} className="space-y-3">
          <h3 className="text-sm font-bold text-text-secondary">{dateKey}</h3>

          {daySessions.map((session) => {
            const config = statusConfig[session.status];
            const timeStr = new Date(session.scheduledAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={session.id} className={`rounded-lg border-2 p-4 space-y-2 ${config.color}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{timeStr}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded">{config.label}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    {session.duration}
                    <span className="text-xs ml-1">min</span>
                  </span>
                </div>

                <div className="space-y-1">
                  {session.topic && <p className="text-sm font-semibold">"{session.topic}"</p>}
                  <p className="text-xs text-text">
                    <span className="font-semibold">{session.studentName}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-current border-opacity-20">
                  {session.status === 'scheduled' && session.meetingUrl && (
                    <>
                      <a
                        href={session.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-dark transition-colors flex-1 text-center"
                      >
                        Join Call
                      </a>
                      {session.onReschedule && (
                        <button
                          onClick={() => session.onReschedule?.(session.id)}
                          className="px-2 py-1 text-xs font-semibold text-text-secondary border border-current border-opacity-30 rounded hover:bg-white hover:bg-opacity-50 transition-colors flex-1"
                        >
                          Reschedule
                        </button>
                      )}
                    </>
                  )}
                  {session.status === 'in-progress' && (
                    <>
                      {session.meetingUrl && (
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-dark transition-colors flex-1 text-center"
                        >
                          Join Call
                        </a>
                      )}
                      {session.onEnd && (
                        <button
                          onClick={() => session.onEnd?.(session.id)}
                          className="px-2 py-1 text-xs font-semibold text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors flex-1"
                        >
                          End Session
                        </button>
                      )}
                    </>
                  )}
                  {session.status === 'completed' && (
                    <button className="px-2 py-1 text-xs font-semibold text-green-600 border border-green-300 rounded opacity-50 cursor-default flex-1">
                      Session Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {sessions.length === 0 && (
        <div className="rounded-lg border border-border bg-page p-8 text-center">
          <p className="text-text-secondary text-sm">No sessions scheduled yet.</p>
        </div>
      )}
    </div>
  );
}
