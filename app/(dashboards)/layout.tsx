"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../libs_schemas/context/auth-context";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronLeft, ChevronRight, LogOut, Settings } from "lucide-react";
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
import { TopLeftProfile } from "#comp-hooks/ui/reusable-ui/DashboardTopStrip";
import { AshesiLogo } from "#comp-hooks/images/logo/app-logo";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};

const navLinks: Record<string, NavItem[]> = {
  mentor: [
    { label: "Home",       icon: <HomeIcon />,     link: "/mentors" },
    { label: "Requests",   icon: <RequestIcon />,  link: "/mentors/requests" },
    { label: "My Mentees", icon: <MenteesIcon />,  link: "/mentors/mentees" },
    { label: "Messages",   icon: <MessagesIcon />, link: "/mentors/messages" },
    { label: "Meetings",   icon: <MeetingsIcon />, link: "/mentors/meetings" },
    { label: "Settings",   icon: <SettingsIcon />, link: "/mentors/settings" },
    { label: "Feedbacks",  icon: <FeedbackIcon />, link: "/mentors/feedbacks" },
  ],
  mentee: [
    { label: "Home",         icon: <HomeIcon />,     link: "/mentees" },
    { label: "Requests",     icon: <RequestIcon />,  link: "/mentees/requests" },
    { label: "My Mentor(s)", icon: <MenteesIcon />,  link: "/mentees/mentors" },
    { label: "Messages",     icon: <MessagesIcon />, link: "/mentees/messages" },
    { label: "Meetings",     icon: <MeetingsIcon />, link: "/mentees/meetings" },
    { label: "Settings",     icon: <SettingsIcon />, link: "/mentees/settings" },
    { label: "Feedbacks",    icon: <FeedbackIcon />, link: "/mentees/feedbacks" },
  ],
  admin: [
    { label: "Home",                   icon: <HomeIcon />,     link: "/admin" },
    { label: "Mentorship Management",  icon: <ManageIcon />,   link: "/admin/mentorships" },
    { label: "User Management",        icon: <UsersIcon />,    link: "/admin/users" },
    { label: "Reports",                icon: <ReportsIcon />,  link: "/admin/reports" },
    { label: "Messages",               icon: <MessagesIcon />, link: "/admin/messages" },
    { label: "Feedbacks",              icon: <FeedbackIcon />, link: "/admin/feedbacks" },
  ],
};

async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}

// ── Initials avatar ────────────────────────────────────────────────────────

function InitialsAvatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-white/50 text-xs font-bold uppercase text-[#923D41] backdrop-blur-sm ${className}`}>
      {name?.[0] ?? "U"}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth();
  const role = (user?.role as keyof typeof navLinks) ?? "mentor";
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) router.replace("/access-denied");
  }, [isInitialized, user, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8F7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#923D41] border-t-transparent" />
          <p className="text-sm font-medium text-[#6A0A1D]">Checking session…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const links: NavItem[] = navLinks[role.toLowerCase()] ?? [];

  // Active link helper — exact match for root routes, prefix match for nested
  const isActive = (link: string) =>
    link.split("/").length <= 2
      ? pathname === link
      : pathname.startsWith(link);

  const settingsLink = `/${role.toLowerCase()}/settings`;

  return (
    <div className="flex min-h-dvh flex-col bg-[#923D41] text-[#f7f0f0] md:h-dvh md:flex-row md:overflow-hidden">

      {/* ── Mobile header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#923D41] px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <AshesiLogo className="h-9 w-auto shrink-0" />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#F2DEDE] transition-colors hover:bg-[#4A0A0A]"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="mt-3 overflow-hidden rounded-2xl bg-[#7a3337] shadow-2xl ring-1 ring-white/10">
            {/* User row */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <InitialsAvatar name={user.firstName} className="h-9 w-9 shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#F2DEDE]">{user.firstName}</p>
                <p className="truncate text-xs capitalize text-[#F2DEDE]/70">{role}</p>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-0.5 px-3 py-3">
              {links.map((item) => {
                const active = isActive(item.link);
                return (
                  <Link
                    key={item.label}
                    href={item.link}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-white/20 text-white"
                        : "text-[#F2DEDE] hover:bg-[#4A0A0A]"
                    }`}
                  >
                    <span className="shrink-0 opacity-90">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="grid grid-cols-2 gap-2 border-t border-white/10 px-3 py-3">
              <Link
                href={settingsLink}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-[#F2DEDE] transition-colors hover:bg-[#4A0A0A]"
              >
                <Settings size={14} />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-[#F2DEDE] transition-colors hover:bg-[#4A0A0A]"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <nav
        className={`hidden md:flex md:h-dvh md:shrink-0 md:flex-col md:overflow-hidden md:rounded-r-[60px] md:bg-[#923D41] md:shadow-xl md:transition-all md:duration-300 lg:rounded-r-[80px] ${
          isSidebarExpanded ? "md:w-64 lg:w-72" : "md:w-[72px]"
        }`}
        aria-label="Sidebar navigation"
      >
        {/* Logo + toggle */}
        <div className={`flex shrink-0 items-center pb-4 pt-6 ${isSidebarExpanded ? "justify-between px-6" : "justify-center px-3"}`}>
          {isSidebarExpanded && <AshesiLogo className="h-28 w-auto" />}
          <button
            onClick={() => setIsSidebarExpanded((v) => !v)}
            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            className="shrink-0 rounded-lg p-2 text-[#F2DEDE] transition-colors hover:bg-[#4A0A0A]"
          >
            {isSidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {isSidebarExpanded && <hr className="mx-4 mb-2 border-white/20" />}

        {/* Nav links */}
        <ul className="scrollbar-none flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
          {links.map((item) => {
            const active = isActive(item.link);
            return (
              <li key={item.label}>
                <Link
                  href={item.link}
                  title={!isSidebarExpanded ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-[#F2DEDE] opacity-80 hover:bg-[#4A0A0A] hover:opacity-100"
                  } ${!isSidebarExpanded ? "justify-center" : ""}`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {isSidebarExpanded && (
                    <span className="truncate text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User identity + logout — pinned bottom */}
        <div className="shrink-0 px-4 pb-6 pt-3">
          {isSidebarExpanded ? (
            <div className="rounded-xl bg-white/10 px-3 py-2.5">
              <div className="flex items-center gap-3 text-[#F2DEDE]">
                <InitialsAvatar name={user.firstName} className="h-9 w-9 shrink-0" />
                <div className="min-w-0 flex-1 text-sm leading-tight">
                  <p className="truncate font-semibold">{user.firstName}</p>
                  <p className="truncate text-xs capitalize text-[#F2DEDE]/60">{role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  aria-label="Log out"
                  className="shrink-0 rounded-lg p-1.5 text-[#F2DEDE]/60 transition-colors hover:bg-white/10 hover:text-[#F2DEDE]"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
              className="flex w-full items-center justify-center rounded-xl p-2.5 text-[#F2DEDE]/60 transition-colors hover:bg-[#4A0A0A] hover:text-[#F2DEDE]"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </nav>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="min-w-0 flex-1 bg-[#FFF8F7] md:h-dvh md:overflow-hidden md:rounded-l-[60px] md:shadow-2xl lg:rounded-l-[80px]">
        <div className="h-full w-full overflow-y-auto bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-12 lg:py-8">
          {/* Sticky profile strip */}
          <section className="sticky top-0 z-10 mb-4 rounded-2xl bg-white/80 px-2 py-2 backdrop-blur-md sm:px-0">
            <TopLeftProfile
              firstName={user.firstName ?? ""}
              lastName={user.lastName ?? ""}
              profession={user.profession ?? ""}
              avatarUrl={user.avatarUrl ?? ""}
            />
          </section>
          <div className="min-w-0 pb-6">{children}</div>
        </div>
      </main>
    </div>
  );
}