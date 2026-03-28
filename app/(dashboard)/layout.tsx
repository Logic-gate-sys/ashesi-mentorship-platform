'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/app/_components/dashboard';
import { useAuth } from '@/app/_lib/context/auth-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (!isLoading && user && user.role !== 'ALUMNI') {
      const redirectUrl = user.role === 'STUDENT' ? '/student/dashboard' : '/';
      router.push(redirectUrl);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'ALUMNI') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar role="MENTOR" name={name} initials={initials} />

      <main className="flex-1 ml-20 lg:ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}