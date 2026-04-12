'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchIcon, BellIcon } from '@/app/_components/ui/icons'

const routeLabels: Record<string, string> = {
  student:   'Student',
  alumni:    'Alumni',
  dashboard: 'Dashboard',
  mentors:   'Mentors',
  mentees:   'Mentees',
  sessions:  'Sessions',
  requests:  'Requests',
  messages:  'Messages',
  schedule:  'Schedule',
  settings:  'Settings',
  profile:   'Profile',
}

function useBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return segments.map((seg, i) => ({
    label: routeLabels[seg] ?? seg.replace(/-/g, ' '),
    href:  '/' + segments.slice(0, i + 1).join('/'),
    last:  i === segments.length - 1,
  }))
}


interface TopbarProps {
  name:         string
  initials:     string
  role:         'STUDENT' | 'ALUMNI'
  notifications?: number
}

// ── Component ─────────────────────────────────────────────────

export default function Topbar({
  name,
  initials,
  role,
  notifications = 0,
}: TopbarProps) {
  const breadcrumbs          = useBreadcrumbs()
  const [query, setQuery]    = useState('')

  const handle = name.toLowerCase().replace(/\s+/g, '_').slice(0, 12)

  return (
    <header className="h-[56px] bg-surface border-b border-border flex items-center px-6 gap-4 sticky top-0 z-30">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
        <span className="font-body text-[12px] text-text-muted shrink-0">
          Welcome to
        </span>
        <Link
          href="/"
          className="font-display font-bold text-[14px] text-primary tracking-tight shrink-0 hover:opacity-80 transition-opacity"
        >
          AshesiConnect
        </Link>

        {breadcrumbs.length > 0 && (
          <>
            <span className="text-border text-[12px] shrink-0 mx-0.5">›</span>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
                {crumb.last ? (
                  <span className="font-body text-[12px] text-text-sub truncate">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="font-body text-[12px] text-text-muted hover:text-text-sub transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!crumb.last && (
                  <span className="text-border text-[12px] shrink-0">›</span>
                )}
              </span>
            ))}
          </>
        )}
      </nav>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <div className="absolute left-3 text-text-muted pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search"
          className="h-[34px] w-[200px] bg-page border border-border rounded-[8px] pl-9 pr-4 font-body text-[13px] text-text placeholder:text-text-muted outline-none transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_3px_rgba(127,29,29,0.15)] focus:w-[260px]"
        />
        {/* Orange search button — matches Learnify exactly */}
        {query.length > 0 && (
          <button className="absolute right-1.5 w-6 h-6 bg-primary rounded-[6px] flex items-center justify-center hover:bg-primary-light transition-colors">
            <SearchIcon />
          </button>
        )}
      </div>

      {/* Bell */}
      <button className="relative w-9 h-9 rounded-[10px] flex items-center justify-center text-text-muted hover:bg-page hover:text-text transition-colors shrink-0">
        <BellIcon />
        {notifications > 0 && (
          <div className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-primary rounded-full border-2 border-surface" />
        )}
      </button>

      {/* User pill */}
      <Link
        href="/profile"
        className="flex items-center gap-2 rounded-[10px] px-2 py-1 hover:bg-page transition-colors shrink-0"
      >
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-white text-[11px] leading-none">
            {initials}
          </span>
        </div>
        <div className="hidden sm:block text-right">
          <p className="font-body text-[12px] font-semibold text-text leading-none">{name}</p>
          <p className="font-body text-[10px] text-text-muted leading-none mt-0.5">@{handle}</p>
        </div>
      </Link>
    </header>
  )
}