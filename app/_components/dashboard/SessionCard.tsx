'use client';

import React from 'react';

interface SessionCardProps {
  id: string;
  date: Date;
  time: string;
  topic?: string;
  mentorName: string;
  mentorCompany: string;
  duration: number;
  meetingUrl?: string;
  meetingPlatform?: 'zoom' | 'teams' | 'discord' | 'in-person';
  status?: 'today' | 'tomorrow' | 'upcoming';
  onJoin?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}

const platformColors = {
  zoom: 'bg-blue-50 text-blue-700 border-blue-200',
  teams: 'bg-purple-50 text-purple-700 border-purple-200',
  discord: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'in-person': 'bg-green-50 text-green-700 border-green-200',
};

const platformLabels = {
  zoom: '📹 Zoom',
  teams: '👥 Microsoft Teams',
  discord: '🎮 Discord',
  'in-person': '📍 In-person',
};

export default function SessionCard({
  id,
  date,
  time,
  topic,
  mentorName,
  mentorCompany,
  duration,
  meetingUrl,
  meetingPlatform = 'zoom',
  status = 'upcoming',
  onJoin,
  onReschedule,
  onCancel,
}: SessionCardProps) {
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const statusConfig = {
    today: { label: 'TODAY', color: 'bg-red-50 text-red-700' },
    tomorrow: { label: 'TOMORROW', color: 'bg-amber-50 text-amber-700' },
    upcoming: { label: 'UPCOMING', color: 'bg-blue-50 text-blue-700' },
  };

  const statusStyle = statusConfig[status];

  return (
    <div className="rounded-lg border border-border bg-surface p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Date and Time Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-text">{time}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${statusStyle.color}`}>{statusStyle.label}</span>
          </div>
          <p className="text-text-secondary text-sm">{dateStr}</p>
        </div>
      </div>

      {/* Topic */}
      {topic && (
        <div className="border-t border-border pt-3">
          <p className="text-xs text-text-secondary">Topic</p>
          <p className="text-sm text-text mt-1">"{topic}"</p>
        </div>
      )}

      {/* Mentor and Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-page rounded p-3">
          <p className="text-xs text-text-secondary">Mentor</p>
          <p className="text-sm font-semibold text-text mt-1">{mentorName}</p>
          <p className="text-xs text-text-secondary">{mentorCompany}</p>
        </div>
        <div className="bg-page rounded p-3">
          <p className="text-xs text-text-secondary">Duration</p>
          <p className="text-lg font-bold text-primary mt-1">{duration}m</p>
        </div>
      </div>

      {/* Meeting Info */}
      {meetingUrl && (
        <div className={`rounded p-3 border ${platformColors[meetingPlatform]}`}>
          <p className="text-xs font-semibold mb-1">{platformLabels[meetingPlatform]}</p>
          <p className="text-xs break-all truncate">{meetingUrl}</p>
        </div>
      )}

      {!meetingUrl && meetingPlatform === 'in-person' && (
        <div className={`rounded p-3 border ${platformColors[meetingPlatform]}`}>
          <p className="text-sm font-semibold">In-person at Ashesi grounds</p>
        </div>
      )}

      {!meetingUrl && meetingPlatform !== 'in-person' && (
        <div className="rounded p-3 bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-700">Meeting URL to be shared soon</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
        {onJoin && meetingUrl && (
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-dark transition-colors flex-1 text-center"
          >
            Join Call
          </a>
        )}
        {onReschedule && (
          <button
            onClick={onReschedule}
            className="px-3 py-1.5 border border-border text-text-secondary text-xs font-semibold rounded hover:bg-page transition-colors flex-1"
          >
            Reschedule
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-semibold rounded hover:bg-red-50 transition-colors flex-1"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
