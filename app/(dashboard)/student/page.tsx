'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DashboardContainer,
  FindMentor,
  MessagesTab,
  ImpactMetrics,
} from '@/app/_components/dashboard';
import { useStudentDashboard } from '@/app/_hooks/useStudentDashboard';

export default function StudentDashboard() {
  const { data, loading, error } = useStudentDashboard();
  const [activeView, setActiveView] = useState('find-mentor');

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
        <div>
          <h1 className="text-4xl font-bold text-text">
            Welcome back, {data.student.name.split(' ')[0]}! 👋
          </h1>
          <p className="mt-2 text-text-secondary text-lg">
            {data.cycle.name} • Year {data.student.year} • {data.student.major}
          </p>
        </div>

        {/* Navigation Views */}
        <div className="flex gap-3 border-b border-border flex-wrap">
          <button
            onClick={() => setActiveView('find-mentor')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeView === 'find-mentor'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            🔍 Find a Mentor
          </button>
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
            onClick={() => setActiveView('progress')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeView === 'progress'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            📊 My Progress
          </button>
        </div>

        {/* Main Content Area */}
        {activeView === 'find-mentor' && (
          <FindMentor />
        )}

        {activeView === 'messages' && (
          <div className="h-[600px]">
            <MessagesTab
              userName="Your Mentors"
              userTitle="Stay connected with your mentoring network"
              onSendMessage={(msg) => console.log('Message:', msg)}
            />
          </div>
        )}

        {activeView === 'progress' && (
          <div>
            <ImpactMetrics
              metrics={[
                { value: data.stats.completedCount || 0, label: 'Sessions Completed', trend: '+1 this month' },
                { value: `${data.stats.avgRating || 0}/5`, label: 'Average Rating', trend: 'Keep it up!' },
                { value: data.stats.mentorsCount || 0, label: 'Active Mentors', trend: 'Your network' },
              ]}
              showHeaderSection={true}
            />
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-impact-bg border border-border rounded-lg p-4">
            <p className="text-sm text-text-secondary">Pending Requests</p>
            <p className="text-3xl font-bold text-primary mt-2">{data.requests?.pending?.length || 0}</p>
          </div>
          <div className="bg-impact-bg border border-border rounded-lg p-4">
            <p className="text-sm text-text-secondary">Active Mentors</p>
            <p className="text-3xl font-bold text-primary mt-2">{data.stats?.mentorsCount || 0}</p>
          </div>
          <div className="bg-impact-bg border border-border rounded-lg p-4">
            <p className="text-sm text-text-secondary">Upcoming Sessions</p>
            <p className="text-3xl font-bold text-primary mt-2">{data.stats?.upcomingCount || 0}</p>
          </div>
          <div className="bg-impact-bg border border-border rounded-lg p-4">
            <p className="text-sm text-text-secondary">Sessions Completed</p>
            <p className="text-3xl font-bold text-primary mt-2">{data.stats?.completedCount || 0}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/student/find-mentor"
            className="bg-primary border border-primary rounded-lg p-4 hover:bg-primary-dark transition-colors text-center text-white"
          >
            <p className="text-2xl mb-2">🔍</p>
            <p className="font-semibold">Find a Mentor</p>
            <p className="text-xs text-white text-opacity-80 mt-1">Browse and connect</p>
          </Link>
          <Link
            href="/student/messages"
            className="bg-white border border-border rounded-lg p-4 hover:shadow-primary transition-shadow text-center"
          >
            <p className="text-2xl mb-2">💬</p>
            <p className="font-semibold text-text">Messages</p>
            <p className="text-xs text-text-secondary mt-1">Chat with mentors</p>
          </Link>
          <Link
            href="/student/mentorships"
            className="bg-white border border-border rounded-lg p-4 hover:shadow-primary transition-shadow text-center"
          >
            <p className="text-2xl mb-2">👥</p>
            <p className="font-semibold text-text">My Mentorships</p>
            <p className="text-xs text-text-secondary mt-1">Active connections</p>
          </Link>
        </div>
      </div>
    </DashboardContainer>
  );
}
