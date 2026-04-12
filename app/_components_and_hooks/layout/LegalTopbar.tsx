'use client'

export default function LegalTopbar({ title, backHref = '/' }: { title: string; backHref?: string }) {
  return (
    <header className="h-[56px] bg-surface border-b border-border flex items-center px-6 gap-4 sticky top-0 z-30">
      {/* Back button and title */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => window.close()}
          className="text-text-muted hover:text-text transition-colors text-[12px] font-semibold cursor-pointer"
        >
          ← Back
        </button>
        <span className="font-display font-bold text-[14px] text-primary tracking-tight">
          AshesiConnect
        </span>
        <span className="text-border text-[12px] mx-0.5">›</span>
        <span className="font-body text-[12px] text-text-sub truncate">
          {title}
        </span>
      </div>
    </header>
  )
}
