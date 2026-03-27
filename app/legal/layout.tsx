'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import LegalSidebar from '@/app/_components/layout/LegalSidebar'
import LegalTopbar from '@/app/_components/layout/LegalTopbar'

export default function LegalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const title = pathname.includes('privacy') ? 'Privacy Policy' : 'Terms of Service'

  return (
    <div className="flex h-screen bg-page overflow-hidden font-body">
      <LegalSidebar backHref="/register/student" />

      {/* Offset for fixed sidebar */}
      <div className="flex flex-col flex-1 ml-14 overflow-hidden">
        <LegalTopbar title={title} backHref="/register/student" />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto scrollbar-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
