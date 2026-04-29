"use client";
import Image from 'next/image';
import { Award, BookOpen, CheckCircle2, Globe, Mail, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

type MentorViewProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
  };
  mentorProfile: {
    graduationYear: number;
    major: string;
    company: string;
    jobTitle: string;
    industry: string;
    bio: string | null;
    linkedin: string | null;
    skills: string[];
    isAvailable: boolean;
    maxMentees: number;
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

export function MentorView({ user, mentorProfile }: MentorViewProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-[#8B3A3A] text-4xl font-bold text-white">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={fullName} fill className="object-cover" />
              ) : (
                <span>{getInitials(user.firstName, user.lastName)}</span>
              )}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
              <p className="mt-1 flex items-center justify-center gap-2 text-gray-500 md:justify-start">
                <MapPin size={16} />
                {mentorProfile.jobTitle} at {mentorProfile.company}
              </p>
              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-500 md:justify-start">
                <Sparkles size={14} />
                {mentorProfile.major} • Class of {mentorProfile.graduationYear}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {mentorProfile.skills.length ? (
                  mentorProfile.skills.map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    No listed skills
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
              <BookOpen className="text-[#8B3A3A]" size={20} /> Professional Bio
            </h2>
            <p className="leading-relaxed text-gray-600">
              {mentorProfile.bio || 'No biography has been shared yet.'}
            </p>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
              <Award className="text-[#8B3A3A]" size={20} /> Mentorship Areas
            </h2>
            <ul className="grid grid-cols-1 gap-3 text-gray-600 md:grid-cols-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#8B3A3A]" /> {mentorProfile.major}</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#8B3A3A]" /> {mentorProfile.industry}</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#8B3A3A]" /> {mentorProfile.jobTitle}</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#8B3A3A]" /> Capacity for {mentorProfile.maxMentees} mentee{mentorProfile.maxMentees === 1 ? '' : 's'}</li>
            </ul>
          </section>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-1">
        <div className="sticky top-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-900">Mentorship Status</h3>

          <div className="mb-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-500"><ShieldAlert size={14} /> Availability</span>
              <span className={`font-medium ${mentorProfile.isAvailable ? 'text-green-700' : 'text-gray-900'}`}>
                {mentorProfile.isAvailable ? 'Open to mentorship' : 'Closed to mentorship'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-500"><Globe size={14} /> Contact</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-500"><Mail size={14} /> Joined</span>
              <span className="font-medium text-gray-900">{formatMonthYear(user.createdAt)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-[#FAF8F8] p-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-900">LinkedIn</p>
            <p className="mt-1 break-all">{mentorProfile.linkedin || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}