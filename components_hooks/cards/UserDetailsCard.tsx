'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, GraduationCap, Mail, MapPin } from 'lucide-react';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  role: 'MENTOR' | 'MENTEE' | string;
};

type MentorProfile = {
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

type MenteeProfile = {
  yearGroup: number;
  major: string;
  interests: string[];
  bio: string | null;
  linkedin: string | null;
};

type Props = {
  user: User;
  mentorProfile?: MentorProfile | null;
  menteeProfile?: MenteeProfile | null;
  compact?: boolean;
};

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
}

function formatMonthYear(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
}

export default function UserDetailsCard({ user, mentorProfile, menteeProfile, compact = false }: Props) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = getInitials(user.firstName, user.lastName);
  const bio = mentorProfile?.bio ?? menteeProfile?.bio ?? '';
  const skills = mentorProfile?.skills ?? [];

  return (
    <article className={`flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-white ${compact ? 'p-4' : 'p-6'} shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-primary to-accent text-white">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt={fullName} width={64} height={64} className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold">{initials}</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-text-primary">{fullName}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                {mentorProfile ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-primary">Mentor</span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-primary">Mentee</span>
                )}
                {mentorProfile ? (
                  <span className="inline-flex items-center gap-1 text-sm text-text-secondary"><MapPin size={14} /> {mentorProfile.jobTitle} at {mentorProfile.company}</span>
                ) : menteeProfile ? (
                  <span className="inline-flex items-center gap-1 text-sm text-text-secondary"><GraduationCap size={14} /> {menteeProfile.major}</span>
                ) : null}
              </div>
            </div>

            <Link href={`/user-details/${user.id}`} className="ml-2 inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-text-secondary hover:bg-background">
              View
            </Link>
          </div>

          {bio ? <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-2">{bio}</p> : null}

          {skills && skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.slice(0, 3).map((s) => (
                <span key={s} className="max-w-36 truncate rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-primary">{s}</span>
              ))}
              {skills.length > 3 ? <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-text-secondary">+{skills.length - 3} more</span> : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className={`mt-4 flex items-center justify-between text-sm text-text-secondary ${compact ? 'pt-2' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2"><BookOpen size={14} /> <span>{mentorProfile ? mentorProfile.major : menteeProfile?.major ?? '—'}</span></div>
          <div className="flex items-center gap-2"><Mail size={14} /> <span className="truncate">{user.email}</span></div>
        </div>

        <div className="text-right">
          <div className="font-medium text-text-primary">{formatMonthYear(user.createdAt)}</div>
          <div className="text-xs text-text-secondary">Joined</div>
        </div>
      </div>
    </article>
  );
}
