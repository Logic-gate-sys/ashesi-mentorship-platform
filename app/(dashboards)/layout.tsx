"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../libs_schemas/context/auth-context";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  HomeIcon,
  RequestIcon,
  MessagesIcon,
  MenteesIcon,
  MeetingsIcon,
  SettingsIcon,
  FeedbackIcon,
  ManageIcon,
  UsersIcon,
  ReportsIcon,
} from "#comp-hooks/ui/icons/DashboardNavIcons";
import { useRouter } from "next/navigation";
import { TopLeftProfile } from "#comp-hooks/ui/reusable-ui/DashboardTopStrip";
import { AshesiLogo } from "#comp-hooks/images/logo/app-logo";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};

const navLinks: Record<string, NavItem[]> = {
  mentor: [
    { label: "Home", icon: <HomeIcon />, link: "/mentors" },
    { label: "Requests", icon: <RequestIcon />, link: "/mentors/requests" },
    { label: "My Mentees", icon: <MenteesIcon />, link: "/mentors/mentees" },
    { label: "Messages", icon: <MessagesIcon />, link: "/mentors/messages" },
    { label: "Meetings", icon: <MeetingsIcon />, link: "/mentors/meetings" },
    { label: "Settings", icon: <SettingsIcon />, link: "/mentors/settings" },
    { label: "Feedbacks", icon: <FeedbackIcon />, link: "/mentors/feedbacks" },
  ],
  mentee: [
    { label: "Home", icon: <HomeIcon />, link: "/mentees" },
    { label: "Requests", icon: <RequestIcon />, link: "/mentees/requests" },
    { label: "My Mentor(s)", icon: <MenteesIcon />, link: "/mentees/mentors" },
    { label: "Messages", icon: <MessagesIcon />, link: "/mentees/messages" },
    { label: "Meetings", icon: <MeetingsIcon />, link: "/mentees/meetings" },
    { label: "Settings", icon: <SettingsIcon />, link: "/mentees/settings" },
    { label: "Feedbacks", icon: <FeedbackIcon />, link: "/mentees/feedbacks" },
  ],
  admin: [
    { label: "Home", icon: <HomeIcon />, link: "/admin" },
    { label: "Mentorship Management", icon: <ManageIcon />, link: "/admin/mentorships" },
    { label: "User Management", icon: <UsersIcon />, link: "/admin/users" },
    { label: "Reports", icon: <ReportsIcon />, link: "/admin/reports" },
    { label: "Messages", icon: <MessagesIcon />, link: "/admin/messages" },
    { label: "Mentorship Feedbacks", icon: <FeedbackIcon />, link: "/admin/feedbacks" },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth();
  const role = (user?.role as keyof typeof navLinks) ?? "mentor";
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) router.replace("/access-denied");
  }, [isInitialized, user, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F7] text-[#6A0A1D]">
        <p className="text-sm font-medium">Checking session...</p>
      </div>
    );
  }

  if (!user) return null;

  const links: NavItem[] =
    role && navLinks[role.toLowerCase()] ? navLinks[role.toLowerCase()] : [];

  return (
    <div className="min-h-dvh bg-[#923D41] text-[#f7f0f0] flex flex-col md:flex-row md:h-dvh md:overflow-hidden">

      {/* ── Mobile header (hidden on md+) ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#923D41] border-b border-white/10 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <AshesiLogo className="h-9 w-auto shrink-0" />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#F2DEDE] transition-colors hover:bg-[#4A0A0A]"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <div className="mt-3 rounded-2xl bg-[#923D41] shadow-2xl ring-1 ring-white/10 overflow-hidden">
            {/* User identity row */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/50 text-xs font-bold uppercase text-[#923D41]">
                {user?.firstName[0] ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#F2DEDE]">
                  {user.firstName ?? "User"}
                </p>
                <p className="truncate text-xs capitalize text-[#F2DEDE]/70">{role ?? "—"}</p>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 px-3 py-3">
              {links.map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[#F2DEDE] transition-colors hover:bg-[#4A0A0A]"
                >
                  <span className="shrink-0 opacity-80">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Bottom actions */}
            <div className="grid grid-cols-2 gap-2 border-t border-white/10 px-3 py-3">
              <Link
                href="/mentors/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-center text-sm font-medium text-[#F2DEDE] transition-colors hover:bg-[#4A0A0A]"
              >
                Settings
              </Link>
              <button
                className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-[#F2DEDE] transition-colors hover:bg-[#4A0A0A]"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/login";
                }}
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Desktop / tablet sidebar (md+) ────────────────────────────── */}
      <nav className="hidden md:flex md:flex-col md:shrink-0 md:w-64 lg:w-72 md:h-dvh md:bg-[#923D41] md:rounded-r-[60px] lg:rounded-r-[80px] md:shadow-xl md:overflow-hidden">
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <AshesiLogo className="h-32 w-auto" />
          <hr className="mt-4 border-white/20" />
        </div>

        {/* Nav links — scrollable if content overflows */}
        <ul className="flex flex-col gap-1 flex-1 overflow-y-auto px-4 py-2 scrollbar-none">
          {links.map((item) => (
            <li key={item.label}>
              <Link
                href={item.link}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[#F2DEDE] opacity-80 transition-all duration-150 hover:bg-[#4A0A0A] hover:opacity-100 focus:bg-[#4A0A0A] active:bg-[#4A0A0A]"
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate text-lg font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* User identity — pinned to bottom */}
        {user && (
          <div className="shrink-0 px-4 pb-6 pt-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-[#F2DEDE]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/50 text-xs font-bold uppercase backdrop-blur-sm">
                {user?.firstName[0] ?? "U"}
              </div>
              <div className="min-w-0 text-sm leading-tight">
                <p className="truncate font-semibold text-[#F2DEDE]">
                  {user.firstName ?? "User"}
                </p>
                <p className="truncate text-xs capitalize text-[#F2DEDE]/60">{role ?? "—"}</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Main content area ──────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 bg-[#FFF8F7] md:h-dvh md:rounded-l-[60px] lg:rounded-l-[80px] md:shadow-2xl md:overflow-hidden">
        <div className="h-full w-full overflow-y-auto bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-12 lg:py-8">
          {/* Sticky profile strip */}
          <section className="sticky top-0 z-10 mb-4 rounded-2xl bg-white/80 px-2 py-2 backdrop-blur-md sm:px-0">
            <TopLeftProfile
              firstName={user?.firstName ?? ""}
              lastName={user?.lastName ?? ""}
              profession={user?.profession ?? ""}
              avatarUrl={user?.avatarUrl ?? ""}
            />
          </section>

          <div className="min-w-0 pb-6">{children}</div>
        </div>
      </main>
    </div>
  );
}