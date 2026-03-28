'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface DashboardSidebarProps {
  role: 'STUDENT' | 'MENTOR';
  name: string;
  initials: string;
  onNavigate?: () => void;
}

export default function DashboardSidebar({
  role,
  name,
  initials,
  onNavigate,
}: DashboardSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Navigation items based on role
  const navItems: NavItem[] =
    role === 'MENTOR'
      ? [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/mentor',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"
                />
              </svg>
            ),
          },
          {
            id: 'mentees',
            label: 'Mentees',
            href: '/mentor/mentees',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 00-20 0v2h2v-2z"
                />
              </svg>
            ),
          },
          {
            id: 'requests',
            label: 'Requests',
            href: '/mentor/requests',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0120 15.573V11a6 6 0 10-12 0v4.573c0 .554-.212 1.081-.595 1.422L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            ),
            badge: 3,
          },
          {
            id: 'sessions',
            label: 'Sessions',
            href: '/mentor/sessions',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            ),
          },
          {
            id: 'messages',
            label: 'Messages',
            href: '/mentor/messages',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            ),
            badge: 2,
          },
        ]
      : [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/student',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"
                />
              </svg>
            ),
          },
          {
            id: 'mentors',
            label: 'Find Mentor',
            href: '/student/find-mentor',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H9"
                />
              </svg>
            ),
          },
          {
            id: 'mentorships',
            label: 'Mentorships',
            href: '/student/mentorships',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            ),
          },
          {
            id: 'sessions',
            label: 'Sessions',
            href: '/student/sessions',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            ),
          },
          {
            id: 'messages',
            label: 'Messages',
            href: '/student/messages',
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            ),
          },
        ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavClick = () => {
    setIsExpanded(false);
    onNavigate?.();
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-primary transition-all duration-300 z-40 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header with logo and toggle */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-primary-dark">
        <div className={`font-bold text-xl text-white transition-opacity duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}>
          AC
        </div>
        <button
          onClick={handleToggle}
          className="p-2 hover:bg-primary-dark rounded-lg transition-colors"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg
            className={`w-5 h-5 text-white transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto scrollbar-hidden">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={handleNavClick}
            className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group ${
              isActive(item.href)
                ? 'bg-primary-light text-white'
                : 'text-primary-light hover:bg-primary-dark'
            }`}
            title={!isExpanded ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span
              className={`text-sm font-semibold whitespace-nowrap transition-opacity duration-300 ${
                isExpanded ? 'opacity-100' : 'opacity-0 w-0'
              }`}
            >
              {item.label}
            </span>
            {item.badge && (
              <span
                className={`ml-auto flex-shrink-0 px-2 py-1 text-xs font-bold bg-accent text-white rounded-full transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0 w-0'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User profile section */}
      <div className="border-t border-primary-dark p-4">
        <Link
          href="/profile"
          onClick={handleNavClick}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-dark transition-colors group"
          title={!isExpanded ? name : undefined}
        >
          <div className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
            {initials}
          </div>
          <div
            className={`flex-1 transition-opacity duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0 w-0'
            }`}
          >
            <p className="text-sm font-semibold text-white truncate">
              {name}
            </p>
            <p className="text-xs text-primary-light uppercase tracking-wide">
              {role === 'MENTOR' ? 'Mentor' : 'Student'}
            </p>
          </div>
        </Link>

        {/* Logout button */}
        <button
          onClick={() => {
            onNavigate?.();
            // TODO: Implement logout
            console.log('Logout');
          }}
          className={`w-full flex items-center gap-3 px-3 py-3 text-primary-light rounded-lg hover:bg-primary-dark transition-colors mt-2 ${
            !isExpanded ? 'justify-center' : ''
          }`}
          title={!isExpanded ? 'Logout' : undefined}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span
            className={`text-sm font-semibold transition-opacity duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0 w-0'
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
