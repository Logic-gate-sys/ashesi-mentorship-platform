'use client';

import React, { useState } from 'react';
import {
  DashboardContainer,
  DashboardSection,
  ImpactMetrics,
  RelationshipCard,
  SessionsList,
  QuickActions,
} from '@/app/_components/dashboard';
import { useMentorMetrics } from '@/app/_hooks/useMentorMetrics';
import { usePendingRequests } from '@/app/_hooks/usePendingRequests';
import { useMentorCapacity } from '@/app/_hooks/useMentorCapacity';
import { useMentorshipCycle } from '@/app/_hooks/useMentorshipCycle';
import { mockActiveMentees, mockUpcomingSessions, } from './mock-data';

export default function MentorDashboard() {
  const { metrics, loading: metricsLoading, error: metricsError } = useMentorMetrics();
  const { 
    requests: pendingRequests, 
    loading: requestsLoading,
    error: requestsError,
    acceptRequest,
    declineRequest,
  } = usePendingRequests();
  const { capacity } = useMentorCapacity();
  const { cycle } = useMentorshipCycle();
  const [activeMentees, setActiveMentees] = useState(mockActiveMentees);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  const handleAcceptRequest = async (requestId: string) => {
    setAcceptError(null);
    const result = await acceptRequest(requestId);
    
    if (!result.success) {
      setAcceptError(result.error || 'Failed to accept request');
      return;
    }

    // Move from pending to active on success
    const accepted = pendingRequests.find((r) => r.id === requestId);
    if (accepted) {
      setActiveMentees([...activeMentees, { ...accepted, status: 'active' }]);
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    declineRequest(requestId);
  };

  const actions = [
    {
      id: 'availability',
      label: 'Edit Availability',
      variant: 'secondary' as const,
      onClick: () => console.log('Edit availability'),
    },
    {
      id: 'profile',
      label: 'Manage Profile',
      variant: 'secondary' as const,
      onClick: () => console.log('Manage profile'),
    },
  ];

  return (
    <DashboardContainer>
      {/* Mentorship Cycle Status */}
      {cycle && (
        <DashboardSection title="Current Mentorship Cycle" compact>
          <div className={`rounded-lg border-2 p-6 ${
            cycle.status === 'active'
              ? 'border-accent bg-purple-50'
              : cycle.status === 'ended'
              ? 'border-gray-300 bg-gray-50'
              : 'border-blue-300 bg-blue-50'
          }`}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${
                    cycle.status === 'active' ? 'text-accent' :
                    cycle.status === 'ended' ? 'text-gray-600' :
                    'text-blue-600'
                  }`}>
                    {cycle.name}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    cycle.status === 'active' ? 'text-accent opacity-75' :
                    cycle.status === 'ended' ? 'text-gray-500' :
                    'text-blue-600 opacity-75'
                  }`}>
                    {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                  cycle.status === 'active'
                    ? 'bg-accent text-white'
                    : cycle.status === 'ended'
                    ? 'bg-gray-300 text-gray-700'
                    : 'bg-blue-300 text-blue-700'
                }`}>
                  {cycle.status === 'active' ? 'Active' : cycle.status === 'ended' ? 'Ended' : 'Starting Soon'}
                </div>
              </div>

              {/* Progress Bar */}
              {cycle.status === 'active' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{cycle.daysRemaining} days remaining</span>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-full h-3 overflow-hidden border border-accent">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${cycle.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    {cycle.progressPercent}% complete
                  </p>
                </div>
              )}

              {/* Cycle Stats */}
              <div className="pt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Active Mentors</p>
                  <p className={`text-xl font-bold ${
                    cycle.status === 'active' ? 'text-accent' : 'text-gray-600'
                  }`}>
                    {cycle.totalMentors}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Mentorships</p>
                  <p className={`text-xl font-bold ${
                    cycle.status === 'active' ? 'text-accent' : 'text-gray-600'
                  }`}>
                    {cycle.activeMentorships}
                  </p>
                </div>
              </div>

              {cycle.status === 'ended' && (
                <div className="pt-3 border-t border-gray-300 text-sm text-gray-600">
                  <p className="font-semibold text-gray-700">This cycle has ended.</p>
                  <p className="mt-1">You can sign up for the next mentorship cycle when it launches.</p>
                </div>
              )}
            </div>
          </div>
        </DashboardSection>
      )}
      {/* Mentor Capacity Status */}
      {capacity && (
        <DashboardSection title="Your Mentoring Capacity" compact>
          <div className={`rounded-lg border-2 p-6 ${
            capacity.capacityStatus === 'ideal'
              ? 'border-accent bg-purple-50'
              : capacity.capacityStatus === 'good'
              ? 'border-primary bg-primary-light opacity-10'
              : 'border-red-300 bg-red-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  capacity.capacityStatus === 'ideal' ? 'text-accent' :
                  capacity.capacityStatus === 'good' ? 'text-primary' :
                  'text-red-600'
                }`}>
                  Current Capacity: <span className="text-xl font-bold">{capacity.activeMentees}/{capacity.maxCapacity}</span>
                </p>
                <p className={`text-xs mt-2 ${
                  capacity.capacityStatus === 'ideal' ? 'text-accent opacity-75' :
                  capacity.capacityStatus === 'good' ? 'text-primary opacity-75' :
                  'text-red-600 opacity-75'
                }`}>
                  Recommended: {capacity.recommendedCapacity.min}-{capacity.recommendedCapacity.max} mentees (3-6 months)
                </p>
                <p className={`text-sm mt-2 ${
                  capacity.capacityStatus === 'ideal' ? 'text-accent' :
                  capacity.capacityStatus === 'good' ? 'text-primary' :
                  'text-red-600 font-semibold'
                }`}>
                  {capacity.message}
                </p>
              </div>
              
              {/* Capacity Progress Bar */}
              <div className="ml-6 w-32">
                <div className="bg-white bg-opacity-50 rounded-full h-3 overflow-hidden border border-gray-300">
                  <div
                    className={`h-full transition-all duration-300 ${
                      capacity.capacityStatus === 'ideal'
                        ? 'bg-accent'
                        : capacity.capacityStatus === 'good'
                        ? 'bg-primary'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(capacity.activeMentees / capacity.maxCapacity) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center font-medium">
                  {Math.round((capacity.activeMentees / capacity.maxCapacity) * 100)}% Full
                </p>
              </div>
            </div>
          </div>
        </DashboardSection>
      )}

      {/* Capacity Error Alert */}
      {acceptError && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-red-700 text-sm font-medium">
            <span className="font-bold">Unable to Accept:</span> {acceptError}
          </p>
        </div>
      )}
      {/* Impact Metrics Section */}
      <DashboardSection title="Your Impact" subtitle="Track your mentorship metrics">
        {metricsLoading ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-gray-600 text-sm">Loading metrics...</p>
          </div>
        ) : metricsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600 text-sm">Failed to load metrics: {metricsError}</p>
          </div>
        ) : metrics ? (
          <ImpactMetrics metrics={metrics} />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-gray-600 text-sm">No metrics available</p>
          </div>
        )}
      </DashboardSection>

      {/* Quick Actions Section */}
      <DashboardSection title="Quick Actions" compact>
        <QuickActions actions={actions} />
      </DashboardSection>

      {/* Pending Requests Section */}
      <DashboardSection
        title="Pending Requests"
        subtitle={`${pendingRequests.length} student${pendingRequests.length !== 1 ? 's' : ''} waiting for your response`}
      >
        {requestsLoading ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-gray-600 text-sm">Loading requests...</p>
          </div>
        ) : requestsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600 text-sm">Failed to load requests: {requestsError}</p>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-gray-600 text-sm">No pending requests. Great job keeping up!</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:gap-6">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 lg:gap-4 lg:p-5">
                <RelationshipCard
                  {...request}
                  onMessage={() => console.log(`Message mentee ${request.id}`)}
                  onSchedule={() => handleAcceptRequest(request.id)}
                />
                <div className="flex gap-2 border-t border-gray-100 pt-3 lg:gap-3">
                  <button
                    onClick={() => handleDeclineRequest(request.id)}
                    className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-700 text-sm hover:bg-gray-50 transition-colors lg:px-4 lg:py-2"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={!capacity?.canAcceptMore}
                    className={`flex-1 rounded px-3 py-1.5 font-medium text-sm transition-colors lg:px-4 lg:py-2 ${
                      capacity?.canAcceptMore
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    title={!capacity?.canAcceptMore ? 'You have reached maximum mentee capacity' : ''}
                  >
                    {capacity?.canAcceptMore ? 'Accept' : 'Capacity Full'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>

      {/* Active Mentees Section */}
      <DashboardSection
        title="Active Mentees"
        subtitle={`You are currently mentoring ${activeMentees.length} student${activeMentees.length !== 1 ? 's' : ''}`}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          {activeMentees.map((mentee) => (
            <RelationshipCard
              key={mentee.id}
              {...mentee}
              onMessage={() => console.log(`Message ${mentee.id}`)}
              onSchedule={() => console.log(`Schedule with ${mentee.id}`)}
            />
          ))}
        </div>
      </DashboardSection>

      {/* Upcoming Sessions Section */}
      <DashboardSection
        title="Upcoming Sessions"
        subtitle={`You have ${mockUpcomingSessions.length} session${mockUpcomingSessions.length !== 1 ? 's' : ''} scheduled`}
      >
        <SessionsList
          sessions={mockUpcomingSessions}
          onJoinSession={(sessionId) => console.log(`Join session ${sessionId}`)}
        />
      </DashboardSection>
    </DashboardContainer>
  );
}
