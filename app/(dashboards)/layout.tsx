"use client";
import React, { useEffect } from "react";
import { useAuth } from "../../libs_schemas/context/auth-context";
import Link from "next/link";
import { HomeIcon, RequestIcon,MessagesIcon,MenteesIcon, MeetingsIcon,SettingsIcon,FeedbackIcon, 
ManageIcon, UsersIcon, ReportsIcon
} from "#comp-hooks/ui/icons/DashboardNavIcons";
// import AshesiLog from '#comp-hooks/images/ashesi_logo.svg'
import { useRouter } from "next/navigation";
// import Image from "next/image";
import { TopLeftProfile } from "#comp-hooks/ui/reusable-ui/DashboardTopStrip";
import {AshesiLogo} from '#comp-hooks/images/logo/app-logo'


type NavItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};

const navLinks: Record<string, NavItem[]> = {
  mentor: [
    { label: "Home",      icon: <HomeIcon />,     link: "/mentors" },
    { label: "Requests",  icon: <RequestIcon />,  link: "/mentors/requests" },
    { label: "My Mentees",icon: <MenteesIcon />,  link: "/mentors/mentees" },
    { label: "Messages",  icon: <MessagesIcon />, link: "/mentors/messages" },
    { label: "Meetings",  icon: <MeetingsIcon />, link: "/mentors/meetings" },
    { label: "Settings",  icon: <SettingsIcon />, link: "/mentors/settings" },
    { label: "Feedbacks", icon: <FeedbackIcon />, link: "/mentors/feedbacks" },
  ],
  mentee: [
    { label: "Home",        icon: <HomeIcon />,     link: "/mentees" },
    { label: "Requests",    icon: <RequestIcon />,  link: "/mentees/requests" },
    { label: "My Mentor(s)",icon: <MenteesIcon />,  link: "/mentees/mentors" },
    { label: "Messages",    icon: <MessagesIcon />, link: "/mentees/messages" },
    { label: "Meetings",    icon: <MeetingsIcon />, link: "/mentees/meetings" },
    { label: "Settings",    icon: <SettingsIcon />, link: "/mentees/settings" },
    { label: "Feedbacks",   icon: <FeedbackIcon />, link: "/mentees/feedbacks" },
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
  const { user, isInitialized } = useAuth();
  const role = user?.role as keyof typeof navLinks | "mentor";
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (!user) {
      router.replace('/access-denied');
    }
  }, [isInitialized, user, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F7] text-[#6A0A1D]">
        <p className="text-sm font-medium">Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  // Fall back to empty array if role is unrecognised or undefined
  const links: NavItem[] = (role && navLinks[role.toLowerCase()]) ? navLinks[role.toLowerCase()] : [];

  return (
    <div className="min-h-dvh bg-[#923D41] text-[#f7f0f0] flex flex-col md:flex-row lg:items-stretch">
      <nav className="w-full border-b border-white/10 bg-[#923D41] px-4 py-2 sm:px-6 lg:sticky lg:top-0 lg:h-dvh lg:w-72.5  lg:px-6">
        <div className="flex flex-col gap-2 lg:h-full">
          <div className="flex items-center justify-between  lg:block lg:py-4">
            <AshesiLogo className="w-full h-[60%] md:mb-4"/>
            <hr className="text-[#F2DEDE] md:w-full h-2"/>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm lg:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-xs font-bold uppercase">
                  {user?.firstName[0] ?? "U"}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#F2DEDE]">{user.firstName ?? "User"}</p>
                  <p className="truncate text-xs capitalize text-[#F2DEDE]/70">{role ?? "—"}</p>
                </div>
              </div>
          </div>

          <ul className="grid grid-cols-1 gap-2 text-sm font-medium sm:grid-cols-2 lg:flex lg:flex-col">
            {links.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.link}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-[#F2DEDE] opacity-80 transition-all duration-150 hover:bg-[#4A0A0A] hover:opacity-100 focus:bg-[#4A0A0A] active:bg-[#4A0A0A]"
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <div className="mt-auto hidden items-center gap-3 rounded-xl bg-white/10 px-3 py-2 text-[#F2DEDE] lg:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-xs font-bold uppercase backdrop-blur-3xl">
                {user?.firstName[0] ?? "U"}
              </div>
              <div className="min-w-0 text-sm leading-tight">
                <p className="max-w-30 truncate font-semibold text-[#F2DEDE]">{user.firstName ?? "User"}</p>
                <p className="truncate capitalize text-[#F2DEDE]/60">{role ?? "—"}</p>
              </div>
            </div>
          ) : null}
        </div>
      </nav>

      <main className="min-w-0 flex-1 bg-[#FFF8F7] lg:rounded-l-[120px] lg:shadow-2xl">
        <div className="mx-auto min-h-dvh w-full overflow-y-auto bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-12 lg:py-8">
          <section className="sticky top-0 z-10 mb-4 rounded-2xl bg-white/80 px-2 py-2 backdrop-blur-3xl sm:px-0">
            <TopLeftProfile
              firstName={user?.firstName ?? ""}
              lastName={user?.lastName ?? ""}
              profession={user?.profession ?? ""}
              avatarUrl={user?.avatarUrl ?? ""}
            />
          </section>
          <div className="min-w-0 pb-4">{children}</div>
        </div>
      </main>
    </div>
  );
}