'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface PendingRequestCardProps {
  id: string;
  studentName: string;
  studentYear: string;
  studentMajor: string;
  goal: string;
  message: string;
  priority: 'HIGH' | 'STANDARD' | 'LOW';
  majorMatch: boolean;
  skillsMatch: string[];
  interests: string;
  requestedAt: Date;
  onAccept?: () => void;
  onDecline?: () => void;
  onViewProfile?: () => void;
}

const priorityConfig = {
  HIGH: { label: '[HIGH PRIORITY]', color: 'border-red-200 bg-red-50', textColor: 'text-red-700' },
  STANDARD: { label: '[STANDARD]', color: 'border-yellow-200 bg-yellow-50', textColor: 'text-yellow-700' },
  LOW: { label: '[LOW PRIORITY]', color: 'border-gray-200 bg-gray-50', textColor: 'text-gray-700' },
};

export default function PendingRequestCard({
  id,
  studentName,
  studentYear,
  studentMajor,
  goal,
  message,
  priority,
  majorMatch,
  skillsMatch,
  interests,
  requestedAt,
  onAccept,
  onDecline,
  onViewProfile,
}: PendingRequestCardProps) {
  const config = priorityConfig[priority];
  const timeAgo = formatDistanceToNow(new Date(requestedAt), { addSuffix: true });

  return (
    <div className={`rounded-lg border-2 p-6 space-y-4 ${config.color}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className={`text-sm font-bold ${config.textColor}`}>{config.label}</h3>
          <p className="text-xs text-text-secondary mt-1">Requested: {timeAgo}</p>
        </div>
      </div>

      {/* Student Info */}
      <div className="border-t border-current border-opacity-20 pt-3">
        <p className="text-sm font-semibold text-text">
          👤 {studentName} <span className="font-normal text-text-secondary">({studentYear}, {studentMajor})</span>
        </p>
      </div>

      {/* Goal */}
      <div>
        <p className="text-xs text-text-secondary">Goal:</p>
        <p className="text-sm text-text italic mt-1">"{goal}"</p>
      </div>

      {/* Message */}
      <div className="bg-white bg-opacity-60 rounded p-3">
        <p className="text-xs text-text-secondary">Message:</p>
        <p className="text-sm text-text mt-1">"{message}"</p>
      </div>

      {/* Academic Alignment */}
      <div className="space-y-2 bg-white bg-opacity-40 rounded p-3">
        <p className="text-xs font-semibold text-text-secondary">ACADEMIC ALIGNMENT</p>
        <div className="space-y-1 text-xs text-text">
          <p>
            <span>{majorMatch ? '✅' : '⚠'}</span> Major Match: {majorMatch ? '✅ (Both same major)' : '(Different major)'}
          </p>
          <p>
            <span>🎯</span> Skills Match: {skillsMatch.length > 0 ? skillsMatch.join(', ') : 'Varies'}
          </p>
          <p>
            <span>💡</span> Interests: {interests}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-current border-opacity-20">
        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="px-3 py-1.5 text-xs font-semibold text-primary border border-primary rounded hover:bg-primary-50 transition-colors flex-1"
          >
            View Profile
          </button>
        )}
        {onAccept && (
          <button
            onClick={onAccept}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700 transition-colors flex-1"
          >
            Accept
          </button>
        )}
        {onDecline && (
          <button
            onClick={onDecline}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors flex-1"
          >
            Decline
          </button>
        )}
      </div>
    </div>
  );
}
