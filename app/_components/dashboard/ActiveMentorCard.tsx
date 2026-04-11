'use client';

import React from 'react';
import Image from 'next/image';

interface MentorCardProps {
  id: string;
  name: string;
  company: string;
  title: string;
  industry: string;
  goal: string;
  sessionsCompleted: number;
  avgRating: number;
  nextSession?: {
    date: Date;
    time: string;
    duration: number;
  };
  lastMessage?: string;
  skills?: string[];
  isAvailable?: boolean;
  avatar?: string;
  onMessage?: () => void;
  onSchedule?: () => void;
  onViewSessions?: () => void;
  onViewProfile?: () => void;
}

export default function ActiveMentorCard({
  id,
  name,
  company,
  title,
  industry,
  goal,
  sessionsCompleted,
  avgRating,
  nextSession,
  lastMessage,
  skills = [],
  isAvailable = true,
  avatar,
  onMessage,
  onSchedule,
  onViewSessions,
  onViewProfile,
}: MentorCardProps) {
  const nextSessionText =
    nextSession && nextSession.date
      ? `${nextSession.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${nextSession.time} (${nextSession.duration} min)`
      : 'Schedule one now';

  return (
    <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
      {/* Header with name and availability */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {avatar ? <Image src={avatar} alt={name} width={40} height={40} className="rounded-full" /> : `${name.charAt(0)}${name.split(' ')[1]?.charAt(0) || ''}`}
            </div>
            <div>
              <h3 className="font-semibold text-text">{name}</h3>
              <p className="text-xs text-text-secondary">
                {company} • {title} • {industry}
              </p>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-text-secondary'}`}>
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-600' : 'bg-gray-400'}`}></span>
          {isAvailable ? 'Available' : 'Unavailable'}
        </div>
      </div>

      {/* Goal */}
      <div className="border-t border-border pt-3">
        <p className="text-xs text-text-secondary">Mentoring Goal</p>
        <p className="text-sm text-text italic mt-1">"{goal}"</p>
      </div>

      {/* Sessions and Rating */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-page rounded p-3">
          <p className="text-xs text-text-secondary">Sessions Completed</p>
          <p className="text-lg font-bold text-primary">{sessionsCompleted}</p>
        </div>
        <div className="bg-page rounded p-3">
          <p className="text-xs text-text-secondary">Avg Rating</p>
          <p className="text-lg font-bold">
            {avgRating}
            <span className="text-sm">⭐</span>
          </p>
        </div>
      </div>

      {/* Next Session or CTA */}
      <div className="bg-accent-50 rounded p-3">
        <p className="text-xs text-text-secondary">Next Session</p>
        <p className="text-sm text-text mt-1">{nextSessionText}</p>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-text-secondary">Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill) => (
              <span key={skill} className="inline-block bg-primary-50 text-primary text-xs px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Message */}
      {lastMessage && (
        <div className="bg-page rounded p-3 border-l-4 border-primary">
          <p className="text-xs text-text-secondary">Last Message</p>
          <p className="text-sm text-text mt-1 line-clamp-2">"{lastMessage}"</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
        {onMessage && (
          <button onClick={onMessage} className="px-3 py-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
            Send Message
          </button>
        )}
        {onSchedule && (
          <button onClick={onSchedule} className="px-3 py-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
            Schedule Session
          </button>
        )}
        {onViewSessions && (
          <button onClick={onViewSessions} className="px-3 py-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
            View Sessions
          </button>
        )}
        {onViewProfile && (
          <button onClick={onViewProfile} className="px-3 py-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
            View Profile
          </button>
        )}
      </div>
    </div>
  );
}
