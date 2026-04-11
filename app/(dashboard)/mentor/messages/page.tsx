'use client';

import React, { useState } from 'react';
import { DashboardContainer } from '@/app/_components/dashboard';
import MessagesTab from '@/app/_components/dashboard/MessagesTab';

interface Mentor {
  id: string;
  name: string;
  title: string;
  avatar?: string;
}

const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Alex O.',
    title: 'Product Manager at Microsoft',
    avatar: undefined,
  },
  {
    id: '2',
    name: 'Sarah M.',
    title: 'Senior Engineer at Google',
    avatar: undefined,
  },
  {
    id: '3',
    name: 'James R.',
    title: 'Founder of TechStart',
    avatar: undefined,
  },
];

export default function MessagesDashboard() {
  const [selectedMentorId, setSelectedMentorId] = useState('1');
  const selectedMentor = mockMentors.find((m) => m.id === selectedMentorId) || mockMentors[0];

  const handleSendMessage = (message: string) => {
    console.log('Message sent:', message);
    // TODO: Connect to real messaging service
  };

  return (
    <DashboardContainer>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Mentors List Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-page">
            <h3 className="font-semibold text-text">Messages</h3>
          </div>
          <div className="overflow-y-auto flex-1">
            {mockMentors.map((mentor) => (
              <button
                key={mentor.id}
                onClick={() => setSelectedMentorId(mentor.id)}
                className={`w-full px-4 py-3 border-b border-border text-left transition-colors hover:bg-page ${
                  selectedMentorId === mentor.id ? 'bg-impact-bg' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-text truncate">{mentor.name}</p>
                    <p className="text-xs text-text-secondary truncate">{mentor.title}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Messages Area */}
        <div className="lg:col-span-3">
          <MessagesTab
            userName={selectedMentor.name}
            userTitle={selectedMentor.title}
            userAvatar={selectedMentor.avatar}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </DashboardContainer>
  );
}
