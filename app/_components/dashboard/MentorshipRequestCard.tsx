'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface RequestCardProps {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  mentorName: string;
  mentorTitle: string;
  company: string;
  goal: string;
  industry: string;
  major: string;
  createdAt: Date;
  onMessage?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onSchedule?: () => void;
  onViewSessions?: () => void;
  onRequestAnother?: () => void;
  onArchive?: () => void;
}

const statusConfig = {
  PENDING: { label: '📌 PENDING', color: 'text-accent', bgColor: 'bg-accent-50' },
  ACCEPTED: { label: '✅ ACCEPTED', color: 'text-green-600', bgColor: 'bg-green-50' },
  DECLINED: { label: '❌ DECLINED', color: 'text-red-600', bgColor: 'bg-red-50' },
};

export default function MentorshipRequestCard({
  id,
  status,
  mentorName,
  mentorTitle,
  company,
  goal,
  industry,
  major,
  createdAt,
  onMessage,
  onAccept,
  onDecline,
  onSchedule,
  onViewSessions,
  onRequestAnother,
  onArchive,
}: RequestCardProps) {
  const config = statusConfig[status];
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const getActionButtons = () => {
    switch (status) {
      case 'PENDING':
        return (
          <>
            {onMessage && (
              <button
                onClick={onMessage}
                className="px-3 py-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Message
              </button>
            )}
            {onAccept && (
              <button
                onClick={onAccept}
                className="px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Accept
              </button>
            )}
            {onDecline && (
              <button
                onClick={onDecline}
                className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Decline
              </button>
            )}
          </>
        );
      case 'ACCEPTED':
        return (
          <>
            {onMessage && (
              <button
                onClick={onMessage}
                className="px-3 py-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Message
              </button>
            )}
            {onSchedule && (
              <button
                onClick={onSchedule}
                className="px-3 py-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Schedule Session
              </button>
            )}
            {onViewSessions && (
              <button
                onClick={onViewSessions}
                className="px-3 py-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                View Sessions
              </button>
            )}
          </>
        );
      case 'DECLINED':
        return (
          <>
            {onRequestAnother && (
              <button
                onClick={onRequestAnother}
                className="px-3 py-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Request Another
              </button>
            )}
            {onArchive && (
              <button
                onClick={onArchive}
                className="px-3 py-1 text-sm font-medium text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Archive
              </button>
            )}
          </>
        );
    }
  };

  return (
    <div className={`rounded-lg border border-border ${config.bgColor} p-6 space-y-3`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`inline-block text-sm font-bold ${config.color}`}>{config.label}</span>
            <span className="text-text-secondary text-xs">Req #{id.slice(0, 6).toUpperCase()}</span>
          </div>
          <p className="text-text-secondary text-xs mt-1">{timeAgo}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        <div>
          <p className="text-text font-semibold">
            {mentorName} <span className="font-normal text-text-secondary">({company}, {mentorTitle})</span>
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-sm">
            Goal: <span className="text-text italic">"{goal}"</span>
          </p>
        </div>

        <p className="text-text-secondary text-xs">
          {industry} • Major: {major}
        </p>

        {status === 'PENDING' && <p className="text-text-secondary text-sm">Status: Awaiting response...</p>}
        {status === 'ACCEPTED' && <p className="text-text-secondary text-sm">Status: Active since {timeAgo}</p>}
        {status === 'DECLINED' && <p className="text-text-secondary text-sm">Status: Mentor unavailable</p>}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">{getActionButtons()}</div>
    </div>
  );
}
