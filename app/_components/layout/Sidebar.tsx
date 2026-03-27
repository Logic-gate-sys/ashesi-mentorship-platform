'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

// ── Icons ─────────────────────────────────────────────────────

const Icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  mentors: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  sessions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  messages: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  requests: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="18" x2="12" y2="12"/>
      <line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  ),
  mentees: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  schedule: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
}

type NavItem = {
  id:    string
  label: string
  href:  string
  icon:  React.ReactNode
  badge?: number
}

const studentNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/student/dashboard', icon: Icons.dashboard  },
  { id: 'mentors',   label: 'Mentors',   href: '/student/mentors',   icon: Icons.mentors   },
  { id: 'sessions',  label: 'Sessions',  href: '/student/sessions',  icon: Icons.sessions  },
  { id: 'requests',  label: 'Requests',  href: '/student/requests',  icon: Icons.requests  },
  { id: 'messages',  label: 'Messages',  href: '/messages',          icon: Icons.messages  },
]

const alumniNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/alumni/dashboard', icon: Icons.dashboard },
  { id: 'mentees',   label: 'Mentees',   href: '/alumni/mentees',   icon: Icons.mentees   },
  { id: 'sessions',  label: 'Sessions',  href: '/alumni/sessions',  icon: Icons.sessions  },
  { id: 'requests',  label: 'Requests',  href: '/alumni/requests',  icon: Icons.requests  },
  { id: 'messages',  label: 'Messages',  href: '/messages',         icon: Icons.messages  },
  { id: 'schedule',  label: 'Schedule',  href: '/alumni/schedule',  icon: Icons.schedule  },
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
        className="w-9 h-9 bg-brand rounded-[10px] flex items-center justify-center mb-6 shrink-0 hover:opacity-90 transition-opacity"
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
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand rounded-r-full" />
              )}

              {item.icon}

              {/* Badge */}
              {badgeCount && badgeCount > 0 ? (
                <div className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-brand rounded-full flex items-center justify-center px-[3px]">
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
          {Icons.settings}
        </Link>

        <button
          title="Log out"
          className="w-full h-10 rounded-[10px] flex items-center justify-center text-white/35 hover:bg-white/7 hover:text-white/60 transition-colors"
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' })
            window.location.href = '/login'
          }}
        >
          {Icons.logout}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center mt-3 cursor-pointer hover:opacity-90 transition-opacity shrink-0">
          <span className="font-display font-bold text-white text-[11px] leading-none">
            {initials}
          </span>
        </div>
      </div>
    </aside>
  )
}