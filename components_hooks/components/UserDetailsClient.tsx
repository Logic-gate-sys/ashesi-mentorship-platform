'use client';

import Link from 'next/link';
import { useUserDetails } from '#comp-hooks/hooks/shared/useUserDetails';
import { MentorView } from './MentorView';
import { MenteeView } from './MenteeView';

type UserDetailsClientProps = {
  userId: string;
};

export function UserDetailsClient({ userId }: UserDetailsClientProps) {
  const { data, isLoading, error } = useUserDetails(userId);

  if (isLoading) {
    return <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">Loading profile...</div>;
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        <div className="flex flex-col gap-3">
          <p>{error || 'Profile not found.'}</p>
          <Link href="/" className="font-semibold text-[#6A0A1D] hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return data.user.role === 'MENTOR' && data.mentorProfile ? (
    <MentorView user={data.user} mentorProfile={data.mentorProfile} />
  ) : data.user.role === 'MENTEE' && data.menteeProfile ? (
    <MenteeView user={data.user} menteeProfile={data.menteeProfile} />
  ) : (
    <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
      No profile data available.
    </div>
  );
}