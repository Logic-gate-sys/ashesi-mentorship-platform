'use client';

import React from 'react';

export interface Session {
  id: string;
  mentee: string;
  date: string;
  time: string;
  topic?: string;
  notes?: string;
}

interface SessionsListProps {
  sessions: Session[];
  emptyMessage?: string;
  onJoinSession?: (sessionId: string) => void;
}

export default function SessionsList({ 
  sessions, 
  emptyMessage = 'No upcoming sessions',
  onJoinSession 
}: SessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-page p-6 text-center">
        <p className="text-text-secondary text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 lg:space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="flex items-start justify-between rounded-lg border border-border bg-surface p-4 lg:p-5"
        >
          <div className="flex-1">
            <h4 className="font-semibold text-text text-sm lg:text-base">{session.mentee}</h4>
            <p className="mt-1 text-text-secondary text-xs lg:text-sm">
              {session.date} • {session.time}
            </p>
            {session.topic && (
              <p className="mt-2 text-text-secondary text-xs lg:text-sm">
                <span className="font-medium">Topic:</span> {session.topic}
              </p>
            )}
            {session.notes && (
              <p className="mt-1 text-text-secondary text-xs lg:text-sm">
                <span className="font-medium">Notes:</span> {session.notes}
              </p>
            )}
          </div>

          {onJoinSession && (
            <button
              onClick={() => onJoinSession(session.id)}
              className="ml-2 flex-shrink-0 rounded bg-primary px-3 py-1.5 font-medium text-white text-xs hover:bg-primary-dark transition-colors lg:px-4 lg:py-2 lg:text-sm"
            >
              Join
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
