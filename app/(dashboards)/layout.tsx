"use client";
import React from "react";
import { useAuth } from "../ _libs_and_schemas/context/auth-context";
import Link from "next/link";
import { HomeIcon, RequestIcon,MessagesIcon,MenteesIcon, MeetingsIcon,SettingsIcon,FeedbackIcon, 
  ManageIcon, UsersIcon, ReportsIcon
} from "../_components_and_hooks/ui/icons/DashboardNavIcons";
import AshesiLog from '@/comp&hooks/images/ashesi_logo.svg'
import Image from "next/image";


type NavItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};

const navLinks: Record<string, NavItem[]> = {
  mentor: [
    { label: "Home",                 icon: <HomeIcon />,     link: "/mentors" },
    { label: "Mentorship Requests",  icon: <RequestIcon />,  link: "/mentors/requests" },
    { label: "My Mentees",           icon: <MenteesIcon />,  link: "/mentors/mentees" },
    { label: "Messages",             icon: <MessagesIcon />, link: "/mentors/messages" },
    { label: "Meetings",             icon: <MeetingsIcon />, link: "/mentors/meetings" },
    { label: "Profile Settings",     icon: <SettingsIcon />, link: "/mentors/settings" },
    { label: "Feedbacks",            icon: <FeedbackIcon />, link: "/mentors/feedbacks" },
  ],
  mentee: [
    { label: "Home",                 icon: <HomeIcon />,     link: "/mentees" },
    { label: "Mentorship Requests",  icon: <RequestIcon />,  link: "/mentees/requests" },
    { label: "My Mentor(s)",         icon: <MenteesIcon />,  link: "/mentees/mentors" },
    { label: "Messages",             icon: <MessagesIcon />, link: "/mentees/messages" },
    { label: "Meetings",             icon: <MeetingsIcon />, link: "/mentees/meetings" },
    { label: "Profile Settings",     icon: <SettingsIcon />, link: "/mentees/settings" },
    { label: "Feedbacks",            icon: <FeedbackIcon />, link: "/mentees/feedbacks" },
  ],
  admin: [
    { label: "Home",                  icon: <HomeIcon />,     link: "/admin" },
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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1fr_6fr] bg-[#923D41] backdrop-blur-3xl
            shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.15)]
            filter-[url('#noise')] text-[#F2DEDE]">

      {/* ── Sidebar Navigation ── */}
      <nav className="p-6 flex flex-col gap-8 ">
        {/* Brand */}
        <div className="py-4">
          <Image src={AshesiLog} height={40} width={200} alt="ashesi-logo" className="text-[#6A0A1D]"/>
        </div>
        {/* Dynamic role-based nav links */}
        <ul className="flex flex-col gap-1 font-medium">
          {(
            links.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.link}
                  className="flex items-center gap-3  text-[#F2DEDE] px-3 py-2.5 rounded-xl
                             opacity-75 hover:opacity-100 hover:bg-[#4A0A0A] active:bg-[#4A0A0A] focus:bg-[#4A0A0A]
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
          <div className="mt-auto flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-[#F2DEDE]">
            <div className="h-8 w-8 rounded-full bg-white/50 backdrop-blur-3xl flex items-center justify-center text-xs font-bold uppercase">
              {user?.firstName[0] ?? "U"}
            </div>
            <div className="text-sm leading-tight">
              <p className="font-semibold truncate max-w-30 text-[#F2DEDE]">{user.firstName ?? "User"}</p>
              <p className="opacity-60 capitalize text-[#F2DEDE]">{role ?? "—"}</p>
            </div>
          </div>
        )}
      </nav>

      <main className="bg-[#FFF8F7] md:rounded-l-[70px] shadow-2xl overflow-hidden p-2 ">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-100">
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