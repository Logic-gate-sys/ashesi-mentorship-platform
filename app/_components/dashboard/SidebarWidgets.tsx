'use client';

import React from 'react';

interface CycleProgressWidgetProps {
  weeksLeft: number;
  goals: Array<{
    id: string;
    label: string;
    status: 'completed' | 'in-progress' | 'pending';
  }>;
}

export function CycleProgressWidget({ weeksLeft, goals }: CycleProgressWidgetProps) {
  const statusIcons = {
    completed: '✅',
    'in-progress': '⏳',
    pending: '⬜',
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
      <h3 className="font-bold text-text">CYCLE PROGRESS</h3>

      <div className="space-y-3">
        <p className="text-sm text-text-secondary">
          {weeksLeft} {weeksLeft === 1 ? 'week' : 'weeks'} left <span className="text-lg">⏳</span>
        </p>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary">YOUR GOALS</p>
          <ul className="space-y-1">
            {goals.map((goal) => (
              <li key={goal.id} className="flex items-center gap-2 text-xs text-text">
                <span>{statusIcons[goal.status]}</span>
                <span>{goal.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface Message {
  id: string;
  senderName: string;
  preview: string;
  unread: number;
  timestamp: Date;
}

interface MessagesWidgetProps {
  messages: Message[];
  onViewAll?: () => void;
}

export function MessagesWidget({ messages, onViewAll }: MessagesWidgetProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
      <h3 className="font-bold text-text">💬 MESSAGES</h3>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {messages.length > 0 ? (
          messages.slice(0, 3).map((msg) => (
            <div key={msg.id} className="bg-page rounded p-3 text-xs space-y-1 cursor-pointer hover:bg-page-hover transition-colors">
              <p className="font-semibold text-text">{msg.senderName}</p>
              <p className="text-text-secondary line-clamp-2">"{msg.preview}"</p>
              {msg.unread > 0 && <p className="text-accent font-semibold">({msg.unread} new)</p>}
            </div>
          ))
        ) : (
          <p className="text-xs text-text-secondary">No messages yet</p>
        )}
      </div>

      {onViewAll && (
        <button onClick={onViewAll} className="w-full py-2 text-xs font-semibold text-primary hover:text-primary-dark transition-colors border-t border-border pt-3">
          View All Messages
        </button>
      )}
    </div>
  );
}

interface SuggestedMentor {
  id: string;
  name: string;
  company: string;
  skills: string;
  matchReason: string;
  onRequest?: () => void;
  onViewProfile?: () => void;
}

interface SuggestedMentorsWidgetProps {
  mentors: SuggestedMentor[];
}

export function SuggestedMentorsWidget({ mentors }: SuggestedMentorsWidgetProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
      <h3 className="font-bold text-text">🔥 SUGGESTED</h3>

      <div className="space-y-3">
        {mentors.length > 0 ? (
          mentors.slice(0, 2).map((mentor) => (
            <div key={mentor.id} className="bg-page rounded p-3 space-y-2 text-xs">
              <p className="font-semibold text-text">👤 {mentor.name}</p>
              <p className="text-text-secondary">{mentor.company}</p>
              <p className="text-text-secondary">{mentor.skills}</p>
              <p className="text-accent italic">{mentor.matchReason}</p>
              <div className="flex gap-2 pt-2">
                {mentor.onRequest && (
                  <button
                    onClick={mentor.onRequest}
                    className="flex-1 px-2 py-1 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-dark transition-colors"
                  >
                    Request
                  </button>
                )}
                {mentor.onViewProfile && (
                  <button
                    onClick={mentor.onViewProfile}
                    className="flex-1 px-2 py-1 text-xs font-semibold text-primary border border-primary rounded hover:bg-primary-50 transition-colors"
                  >
                    Profile
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-text-secondary">No suggestions yet</p>
        )}
      </div>
    </div>
  );
}
