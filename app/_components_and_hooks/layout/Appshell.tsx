import Sidebar from './Sidebar'
import Topbar  from './Topbar'
import type { ReactNode } from 'react'

interface AppShellProps {
  children:      ReactNode
  role:          'STUDENT' | 'ALUMNI'
  name:          string
  initials:      string
  notifications?: number
  badges?:       Partial<Record<string, number>>
}

export default function AppShell({
  children,
  role,
  name,
  initials,
  notifications = 0,
  badges        = {},
}: AppShellProps) {
  return (
    <div className="flex h-screen bg-page overflow-hidden font-body">

      <Sidebar
        role={role}
        initials={initials}
        badges={badges}
      />

      {/* Offset for fixed sidebar */}
      <div className="flex flex-col flex-1 ml-[56px] overflow-hidden">

        <Topbar
          name={name}
          initials={initials}
          role={role}
          notifications={notifications}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto scrollbar-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}