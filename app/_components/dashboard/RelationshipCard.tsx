'use client';

import React from 'react';
import Image from 'next/image';
import StatusBadge, { StatusType } from './StatusBadge';

interface RelationshipCardProps {
  id: string;
  name: string;
  role: string;
  program: string;
  avatar?: string;
  initials: string;
  status: StatusType;
  lastInteraction?: string;
  onMessage?: () => void;
  onSchedule?: () => void;
}

export default function RelationshipCard({
  id,
  name,
  role,
  program,
  avatar,
  initials,
  status,
  lastInteraction,
  onMessage,
  onSchedule,
}: RelationshipCardProps) {
  return (
    <div className="flexflex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="flex items-start justify-between">
        <div className="flex gap-3 lg:gap-4">
          {/* Avatar */}
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-primary lg:h-12 lg:w-12">
            {avatar ? (
              <Image src={avatar} alt={name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-center font-bold text-white">
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base lg:text-lg">{name}</h3>
            <p className="text-gray-600 text-xs lg:text-sm">{role}</p>
            <p className="text-gray-500 text-xs lg:text-sm">{program}</p>
          </div>
        </div>

        {/* Status Badge */}
        <StatusBadge status={status} size="sm" />
      </div>

      {/* Last Interaction Info */}
      {lastInteraction && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-gray-500 text-xs">Last interaction: {lastInteraction}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3 lg:gap-3">
        {onMessage && (
          <button
            onClick={onMessage}
            className="flex-1 rounded border border-primary bg-white px-3 py-1.5 font-medium text-primary text-sm hover:bg-primary hover:text-white transition-colors lg:px-4 lg:py-2"
          >
            Message
          </button>
        )}
        {onSchedule && (
          <button
            onClick={onSchedule}
            className="flex-1 rounded bg-primary px-3 py-1.5 font-medium text-white text-sm hover:bg-primary-dark transition-colors lg:px-4 lg:py-2"
          >
            Schedule
          </button>
        )}
      </div>
    </div>
  );
}
