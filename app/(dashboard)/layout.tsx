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
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  const name = `${user.firstName} ${user.lastName}`;
  const role = user.role === 'ALUMNI' ? 'MENTOR' : 'STUDENT';

  return (
    <div className="flex h-screen bg-page overflow-hidden">
      <DashboardSidebar role={role} name={name} initials={initials} />

      <main className="flex-1 ml-20 lg:ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}