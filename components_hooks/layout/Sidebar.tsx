'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  DashboardIcon,
  MentorsIcon,
  SessionsIcon,
  MessagesIcon,
  RequestsIcon,
  MenteesIcon,
  ScheduleIcon,
  SettingsIcon,
} from '#comp-hooks/ui/icons'

type NavItem = {
  id:    string
  label: string
  href:  string
  iconKey: 'dashboard' | 'mentors' | 'sessions' | 'requests' | 'messages' | 'mentees' | 'schedule'
  badge?: number
}

const getIcon = (key: NavItem['iconKey']) => {
  const icons = {
    dashboard: <DashboardIcon />,
    mentors: <MentorsIcon />,
    sessions: <SessionsIcon />,
    requests: <RequestsIcon />,
    messages: <MessagesIcon />,
    mentees: <MenteesIcon />,
    schedule: <ScheduleIcon />,
  }
  return icons[key]
}

const studentNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/student/dashboard', iconKey: 'dashboard' },
  { id: 'mentors',   label: 'Mentors',   href: '/student/mentors',   iconKey: 'mentors' },
  { id: 'sessions',  label: 'Sessions',  href: '/student/sessions',  iconKey: 'sessions' },
  { id: 'requests',  label: 'Requests',  href: '/student/requests',  iconKey: 'requests' },
  { id: 'messages',  label: 'Messages',  href: '/messages',          iconKey: 'messages' },
]

const alumniNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/alumni/dashboard', iconKey: 'dashboard' },
  { id: 'mentees',   label: 'Mentees',   href: '/alumni/mentees',   iconKey: 'mentees' },
  { id: 'sessions',  label: 'Sessions',  href: '/alumni/sessions',  iconKey: 'sessions' },
  { id: 'requests',  label: 'Requests',  href: '/alumni/requests',  iconKey: 'requests' },
  { id: 'messages',  label: 'Messages',  href: '/messages',         iconKey: 'messages' },
  { id: 'schedule',  label: 'Schedule',  href: '/alumni/schedule',  iconKey: 'schedule' },
]

interface SidebarProps {
  role:     'STUDENT' | 'ALUMNI'
  initials: string
  badges?:  Partial<Record<string, number>>
}

// ── Component ─────────────────────────────────────────────────

export default function Sidebar({ role, initials, badges = {} }: SidebarProps) {
  const pathname = usePathname()
  const nav      = role === 'STUDENT' ? studentNav : alumniNav

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="w-[56px] h-screen bg-red-950 flex flex-col items-center py-5 shrink-0 fixed left-0 top-0 z-40">

      {/* Logo mark */}
      <Link
        href={role === 'STUDENT' ? '/student/dashboard' : '/alumni/dashboard'}
        className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center mb-6 shrink-0 hover:opacity-90 transition-opacity"
      >
        <span className="font-display font-extrabold text-white text-base leading-none">A</span>
      </Link>

      {/* Main nav */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2">
        {nav.map(item => {
          const active      = isActive(item.href)
          const badgeCount  = badges[item.id]

          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className={`
                relative w-full h-10 rounded-[10px] flex items-center justify-center
                transition-colors duration-150
                ${active
                  ? 'bg-white/12 text-white'
                  : 'text-white/40 hover:bg-white/7 hover:text-white/70'}
              `}
            >
              {/* Active left bar */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
              )}

              {getIcon(item.iconKey)}

              {/* Badge */}
              {badgeCount && badgeCount > 0 ? (
                <div className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-primary rounded-full flex items-center justify-center px-[3px]">
                  <span className="font-body text-[9px] font-bold text-white leading-none">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                </div>
              ) : null}
            </Link>
          )
        })}
      </nav>

      {/* Bottom — settings + logout + avatar */}
      <div className="flex flex-col items-center gap-1 w-full px-2">

        <Link
          href="/settings"
          title="Settings"
          className="w-full h-10 rounded-[10px] flex items-center justify-center text-white/35 hover:bg-white/7 hover:text-white/60 transition-colors"
        >
          <SettingsIcon />
        </Link>

        <button
          title="Log out"
          className="w-full h-10 rounded-[10px] flex items-center justify-center text-white/35 hover:bg-white/7 hover:text-white/60 transition-colors"
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' })
            window.location.href = '/login'
          }}
        >
          {/* Logout icon using custom SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-3 cursor-pointer hover:opacity-90 transition-opacity shrink-0">
          <span className="font-display font-bold text-white text-[11px] leading-none">
            {initials}
          </span>
        </div>
      </div>
    </aside>
  )
}