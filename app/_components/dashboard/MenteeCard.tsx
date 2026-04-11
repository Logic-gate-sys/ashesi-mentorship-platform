'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface MenteeCardProps {
  id: string;
  studentName: string;
  studentYear: string;
  studentMajor: string;
  goal: string;
  status: 'active' | 'paused' | 'ended';
  activeSince: Date;
  sessionsCompleted: number;
  avgRating: number;
  nextSession?: {
    date: Date;
    time: string;
    duration: number;
  };
  progress: string;
  onMessage?: () => void;
  onSchedule?: () => void;
  onViewProfile?: () => void;
}

export default function MenteeCard({
  id,
  studentName,
  studentYear,
  studentMajor,
  goal,
  status,
  activeSince,
  sessionsCompleted,
  avgRating,
  nextSession,
  progress,
  onMessage,
  onSchedule,
  onViewProfile,
}: MenteeCardProps) {
  const activeDuration = formatDistanceToNow(new Date(activeSince));
  const statusConfig = {
    active: { badge: 'Active', color: 'bg-green-50 text-green-700 border-green-200' },
    paused: { badge: 'Paused', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    ended: { badge: 'Ended', color: 'bg-gray-50 text-gray-700 border-gray-200' },
  };

  const config = statusConfig[status];

  const nextSessionText = nextSession
    ? `${nextSession.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${nextSession.time} (${nextSession.duration} min)`
    : 'Not scheduled yet';

  return (
    <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-text">
            👤 {studentName}
            <span className="text-sm font-normal text-text-secondary ml-2">
              ({studentYear}, {studentMajor})
            </span>
          </h3>
          <p className="text-xs text-text-secondary mt-1">Active {activeDuration}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded border ${config.color}`}>{config.badge}</span>
      </div>

      {/* Goal */}
      <div className="border-t border-border pt-3">
        <p className="text-xs text-text-secondary">Goal:</p>
        <p className="text-sm text-text italic mt-1">"{goal}"</p>
      </div>

      {/* Sessions and Rating Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-page rounded p-3">
          <p className="text-xs text-text-secondary">Sessions Completed</p>
          <p className="text-lg font-bold text-primary mt-1">{sessionsCompleted}</p>
        </div>
        <div className="bg-page rounded p-3">
          <p className="text-xs text-text-secondary">Avg Rating</p>
          <p className="text-lg font-bold mt-1">
            {avgRating}
            <span className="text-sm">⭐</span>
          </p>
        </div>
      </div>

      {/* Next Session */}
      <div className="bg-accent-50 rounded p-3">
        <p className="text-xs text-text-secondary">Next Session</p>
        <p className="text-sm text-text mt-1">{nextSessionText}</p>
      </div>

      {/* Progress Notes */}
      <div className="bg-page rounded p-3 border-l-4 border-primary">
        <p className="text-xs text-text-secondary">Progress:</p>
        <p className="text-sm text-text mt-1">"{progress}"</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
        {onMessage && (
          <button
            onClick={onMessage}
            className="px-3 py-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Send Message
          </button>
        )}
        {onSchedule && (
          <button
            onClick={onSchedule}
            className="px-3 py-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Schedule Session
          </button>
        )}
        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="px-3 py-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View Profile
          </button>
        )}
      </div>
    </div>
  );
}
