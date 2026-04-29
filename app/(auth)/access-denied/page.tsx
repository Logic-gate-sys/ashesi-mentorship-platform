'use client';

import Link from 'next/link';
import { ArrowRight, ShieldAlert, LogIn, UserPlus, Lock } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-4xl border border-[#6A0A1D]/10 bg-white p-6 shadow-[0_24px_80px_rgba(106,10,29,0.10)] sm:p-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#FDF1F2] px-4 py-2 text-sm font-semibold text-[#6A0A1D]">
          <ShieldAlert className="h-4 w-4" />
          Protected area
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-[#181821] sm:text-4xl" style={{ fontFamily: "'Bree Serif', serif" }}>
            You need to sign in to access this page
          </h1>
          <p className="max-w-xl text-base leading-7 text-gray-600 sm:text-lg" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            The dashboard you tried to open is reserved for authenticated users only. If you recently signed out,
            your session may have expired, or you may simply need to create an account before continuing.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-[#FAFAFA] p-4">
            <Lock className="mb-3 h-5 w-5 text-[#923D41]" />
            <h2 className="text-sm font-semibold text-[#241919]">Why this happened</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              We could not verify an active session for your account, so the protected dashboard was blocked.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-[#FAFAFA] p-4">
            <LogIn className="mb-3 h-5 w-5 text-[#923D41]" />
            <h2 className="text-sm font-semibold text-[#241919]">Already have an account?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Sign in again to restore access and continue from where you left off.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-[#FAFAFA] p-4">
            <UserPlus className="mb-3 h-5 w-5 text-[#923D41]" />
            <h2 className="text-sm font-semibold text-[#241919]">New here?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Create an account to join the mentorship platform and get access to the dashboard.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#923D41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7B1427]"
          >
            <LogIn className="h-4 w-4" />
            Go to login
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#923D41]/20 bg-[#FDF1F2] px-5 py-3 text-sm font-semibold text-[#6A0A1D] transition hover:border-[#923D41]/30 hover:bg-[#F9E4E7]"
          >
            <UserPlus className="h-4 w-4" />
            Create an account
          </Link>
        </div>

        <p className="mt-6 text-sm leading-6 text-gray-500">
          If you expected to have access already, double-check that you are using the correct email address or ask the
          platform administrator to confirm your account status.
        </p>
      </div>
    </div>
  );
}
