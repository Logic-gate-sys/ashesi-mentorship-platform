"use client";
import React from 'react';
import Image from 'next/image';
import { BookOpen, Calendar, GraduationCap, Heart, Mail, Sparkles, Target } from 'lucide-react';

type MenteeViewProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
  };
  menteeProfile: {
    yearGroup: number;
    major: string;
    interests: string[];
    bio: string | null;
    linkedin: string | null;
  };
};

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
}

function formatMonthYear(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
}

export function MenteeView({ user, menteeProfile }: MenteeViewProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-[#8B3A3A] text-3xl font-bold text-white shadow-sm">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={fullName} fill className="object-cover" />
              ) : (
                <span>{getInitials(user.firstName, user.lastName)}</span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
              <p className="mt-1 flex items-center justify-center gap-2 font-semibold text-[#8B3A3A] md:justify-start">
                <GraduationCap size={18} /> {menteeProfile.major} • Class of {menteeProfile.yearGroup}
              </p>
              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-500 md:justify-start">
                <Sparkles size={14} /> Learner profile
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Target className="text-[#8B3A3A]" size={22} /> About Me
          </h2>
          <p className="leading-relaxed text-gray-600">
            {menteeProfile.bio || 'No biography has been shared yet.'}
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Heart className="text-[#8B3A3A]" size={22} /> Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {menteeProfile.interests.length ? (
              menteeProfile.interests.map((interest) => (
                <span key={interest} className="rounded-md border border-gray-200 bg-[#FAFAFA] px-3 py-1 text-xs font-bold uppercase text-gray-700">
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">No interests listed yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-1">
        <div className="sticky top-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-900">Profile Snapshot</h3>

          <div className="mb-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-gray-500"><BookOpen size={14} /> Major</span>
              <span className="font-medium text-gray-900">{menteeProfile.major}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-gray-500"><Calendar size={14} /> Year Group</span>
              <span className="font-medium text-gray-900">{menteeProfile.yearGroup}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-gray-500"><Mail size={14} /> Contact</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-gray-500"><Sparkles size={14} /> Joined</span>
              <span className="font-medium text-gray-900">{formatMonthYear(user.createdAt)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-[#FAF8F8] p-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-900">LinkedIn</p>
            <p className="mt-1 break-all">{menteeProfile.linkedin || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}