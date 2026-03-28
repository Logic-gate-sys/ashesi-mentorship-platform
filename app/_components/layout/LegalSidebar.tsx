'use client'

import Link from 'next/link'

interface LegalSidebarProps {
  backHref?: string
}

export default function LegalSidebar({ backHref = '/' }: LegalSidebarProps) {
  return (
    <aside className="w-[56px] h-screen bg-red-950 flex flex-col items-center py-5 shrink-0 fixed left-0 top-0 z-40">
      {/* Logo mark */}
      <button
        onClick={() => window.close()}
        className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
        title="Back to registration"
      >
        <span className="font-display font-extrabold text-white text-base leading-none">A</span>
      </button>
    </aside>
  )
}

