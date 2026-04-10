'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DashboardContainer,
  ImpactMetrics,
  MessagesTab,
} from '@/app/_components/dashboard';
import { useMentorDashboardEnhanced } from '@/app/_hooks/useMentorDashboardEnhanced';
import { useMentorMetrics } from '@/app/_hooks/useMentorMetrics';

export default function MentorDashboard() {
  const { data, loading, error } = useMentorDashboardEnhanced();
  const { metrics } = useMentorMetrics();
  const [activeView, setActiveView] = useState('messages');
  const [isAvailable, setIsAvailable] = useState(true);

  if (loading) {
    return (
      <DashboardContainer>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-text-secondary">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardContainer>
    );
  }

  if (error || !data) {
    return (
      <DashboardContainer>
        <div className="rounded-lg border border-border bg-surface p-8 text-center">
          <p className="text-red-600 font-semibold">{error || 'Failed to load dashboard'}</p>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-text">
              Welcome back, {data.mentor.name.split(' ')[0]}! 🎓
            </h1>
            <p className="mt-2 text-text-secondary text-lg">
              You're an amazing mentor! You've impacted{' '}
              <span className="font-semibold text-primary">{data.metrics.activeMentees}</span> students
            </p>
          </div>

          {/* Availability Toggle */}
          <div className={`rounded-lg border-2 p-4 flex items-center justify-between ${isAvailable ? 'border-accent bg-accent bg-opacity-10' : 'border-border-light bg-page'}`}>
            <div className="flex items-center gap-3">
              <span className={`text-2xl ${isAvailable ? '🟢' : '🔴'}`}></span>
              <div>
                <p className="text-sm font-bold text-text">Your Availability</p>
                <p className={`text-xs ${isAvailable ? 'text-accent font-semibold' : 'text-text-secondary'}`}>
                  {isAvailable ? 'AVAILABLE FOR MENTORING' : 'NOT AVAILABLE'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-4 py-2 font-semibold rounded text-sm transition-colors ${
                isAvailable
                  ? 'bg-accent text-white hover:bg-accent-dark'
                  : 'bg-border text-text hover:bg-border-light'
              }`}
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Navigation Views */}
        <div className="flex gap-3 border-b border-border">
          <button
            onClick={() => setActiveView('messages')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeView === 'messages'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            💬 Messages
          </button>
          <button
            onClick={() => setActiveView('impact')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeView === 'impact'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            📊 Your Impact
          </button>
          <Link
            href="/mentor/messages"
            className="pb-3 px-4 font-semibold text-text-secondary hover:text-text transition-colors"
          >
            ➜ Full Messages
          </Link>
        </div>

        {/* Main Content Area */}
        {activeView === 'messages' && (
          <div className="h-[600px]">
            <MessagesTab
              userName={data.mentor?.name || 'Mentor'}
              userTitle="Your Dashboard"
              onSendMessage={(msg) => console.log('Message:', msg)}
            />
          </div>
        )}

        {activeView === 'impact' && (
          <div>
            <ImpactMetrics
              metrics={[
                { value: data.metrics.totalSessions || 12, label: 'Sessions Completed', trend: '+2 this month' },
                { value: `${data.metrics.avgRating || 4.8}/5`, label: 'Average Rating', trend: '+0.1 this month' },
                { value: data.metrics.activeMentees || 8, label: 'Mentees Helped', trend: '+1 new this month' },
              ]}
              showHeaderSection={true}
            />
          </div>
        )}

        {/* Quick Links Bottom */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/mentor/availability"
            className="bg-white border border-border rounded-lg p-4 hover:shadow-primary transition-shadow text-center"
          >
            <p className="text-2xl mb-2">⏰</p>
            <p className="font-semibold text-text">Edit Availability</p>
            <p className="text-xs text-text-secondary mt-1">Update your schedule</p>
          </Link>
          <Link
            href="/mentor/profile"
            className="bg-white border border-border rounded-lg p-4 hover:shadow-primary transition-shadow text-center"
          >
            <p className="text-2xl mb-2">👤</p>
            <p className="font-semibold text-text">Manage Profile</p>
            <p className="text-xs text-text-secondary mt-1">Update your information</p>
          </Link>
          <Link
            href="/mentor/messages"
            className="bg-primary border border-primary rounded-lg p-4 hover:bg-primary-dark transition-colors text-center text-white"
          >
            <p className="text-2xl mb-2">💬</p>
            <p className="font-semibold">View All Messages</p>
            <p className="text-xs text-white text-opacity-80 mt-1">Chat with mentees</p>
          </Link>
        </div>
      </div>
    </DashboardContainer>
  );
}
