"use client";
import React from "react";
import { useAuth } from "../ _libs_and_schemas/context/auth-context";
import Link from "next/link";
import { HomeIcon, RequestIcon,MessagesIcon,MenteesIcon, MeetingsIcon,SettingsIcon,FeedbackIcon, 
  ManageIcon, UsersIcon, ReportsIcon
} from "../_components_and_hooks/ui/icons/DashboardNavIcons";

// ─── Icon Components ────────────────────────────────────────────────────────


type NavItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};

const navLinks: Record<string, NavItem[]> = {
  mentor: [
    { label: "Home",                 icon: <HomeIcon />,     link: "/mentor/home" },
    { label: "Mentorship Requests",  icon: <RequestIcon />,  link: "/mentor/requests" },
    { label: "My Mentees",           icon: <MenteesIcon />,  link: "/mentor/mentees" },
    { label: "Messages",             icon: <MessagesIcon />, link: "/mentor/messages" },
    { label: "Meetings",             icon: <MeetingsIcon />, link: "/mentor/meetings" },
    { label: "Profile Settings",     icon: <SettingsIcon />, link: "/mentor/settings" },
    { label: "Feedbacks",            icon: <FeedbackIcon />, link: "/mentor/feedbacks" },
  ],
  mentee: [
    { label: "Home",                 icon: <HomeIcon />,     link: "/mentee/home" },
    { label: "Mentorship Requests",  icon: <RequestIcon />,  link: "/mentee/requests" },
    { label: "My Mentor(s)",         icon: <MenteesIcon />,  link: "/mentee/mentors" },
    { label: "Messages",             icon: <MessagesIcon />, link: "/mentee/messages" },
    { label: "Meetings",             icon: <MeetingsIcon />, link: "/mentee/meetings" },
    { label: "Profile Settings",     icon: <SettingsIcon />, link: "/mentee/settings" },
    { label: "Feedbacks",            icon: <FeedbackIcon />, link: "/mentee/feedbacks" },
  ],
  admin: [
    { label: "Home",                  icon: <HomeIcon />,     link: "/admin/home" },
    { label: "Mentorship Management", icon: <ManageIcon />,   link: "/admin/mentorships" },
    { label: "User Management",       icon: <UsersIcon />,    link: "/admin/users" },
    { label: "Reports",               icon: <ReportsIcon />,  link: "/admin/reports" },
    { label: "Messages",              icon: <MessagesIcon />, link: "/admin/messages" },
    { label: "Mentorship Feedbacks",  icon: <FeedbackIcon />, link: "/admin/feedbacks" },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const role = user?.role as keyof typeof navLinks | "mentor";
  

  // Fall back to empty array if role is unrecognised or undefined
  const links: NavItem[] = (role && navLinks[role.toLowerCase()]) ? navLinks[role.toLowerCase()] : [];

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1fr_6fr] bg-[#923D41]">

      {/* ── Sidebar Navigation ── */}
      <nav className="p-6 flex flex-col gap-8 text-white">
        {/* Brand */}
        <div className="py-4">
          <h1 className="text-xl font-bold tracking-tight">MENTOR</h1>
          <h1 className="text-2xl font-black text-white/90">DASHBOARD</h1>
        </div>
links
        {/* Dynamic role-based nav links */}
        <ul className="flex flex-col gap-1 font-medium">
          {(
            links.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.link}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                             opacity-75 hover:opacity-100 hover:bg-white/10
                             transition-all duration-150 cursor-pointer"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))
          )}
        </ul>

        {/* User badge at bottom */}
        {user && (
          <div className="mt-auto flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10">
            <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold uppercase">
              {user?.firstName[0] ?? "U"}
            </div>
            <div className="text-sm leading-tight">
              <p className="font-semibold truncate max-w-[120px]">{user.firstName ?? "User"}</p>
              <p className="opacity-60 capitalize">{role ?? "—"}</p>
            </div>
          </div>
        )}
      </nav>

      {/* ── Main Content Area ── */}
      <main className="bg-[#FFF8F7] md:rounded-l-[80px] shadow-2xl overflow-hidden p-8">
        <div className="max-w-5xl mx-auto">
          {children || (
            <div className="space-y-6">
              <header className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">
                  Welcome back, {user?.firstName ?? "there"} 👋
                </h2>
                <div className="h-12 w-12 rounded-full bg-[#923D41]/20 flex items-center justify-center font-bold text-[#923D41] uppercase">
                  {user?.firstName?.[0] ?? "U"}
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  Left Child Content (Full Height)
                </div>
                <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  Right Child Content (Full Height)
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}