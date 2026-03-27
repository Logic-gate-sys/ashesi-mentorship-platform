import type { ReactNode } from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[var(--color-background)] font-body">

      {/* ── SIDEBAR SECTION ──────────────────────────────────────── */}
      <div className="hidden lg:flex w-105 shrink-0 bg-primary flex-col justify-between px-12 py-12 relative overflow-hidden">

        {/* Decorative background elements */}
        <div className="absolute -top-28 -right-28 w-90 h-90 rounded-full border border-white/5 pointer-events-none opacity-30" />
        <div className="absolute -bottom-20 -left-20 w-70 h-70 rounded-full bg-accent blur-[80px] pointer-events-none opacity-20" />

        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center gap-3 w-fit hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-accent rounded-[10px] flex items-center justify-center shrink-0 shadow-lg">
            <span className="font-display font-extrabold text-white text-base leading-none">A</span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-base tracking-tight leading-tight">
              AshesiConnect
            </p>
            <p className="font-body text-[11px] text-white/50 tracking-[0.06em] uppercase mt-1">
              Alumni Network
            </p>
          </div>
        </Link>

        {/* MAIN COPY SECTION */}
        <div>
          <h2 className="font-display font-extrabold text-white text-[36px] leading-[1.1] tracking-tight mb-5">
            Your Ashesi network,<br />working for you
          </h2>

          <p className="font-body text-[15px] text-white/60 leading-relaxed mb-8">
            Connect with alumni mentors who have taken the same courses, faced the same challenges, and succeeded in the roles you're aiming for.
          </p>

          {/* Key Statistics */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: '500+', label: 'Mentors' },
              { value: '94%', label: 'Placement' },
              { value: '4.9★', label: 'Rating' },
            ].map(stat => (
              <div key={stat.label} className="border-l border-white/20 pl-4">
                <p className="font-display font-bold text-accent text-2xl tracking-tight leading-none mb-1">
                  {stat.value}
                </p>
                <p className="font-body text-xs text-white/50 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 pt-6">
          <p className="font-body text-[12px] text-white/40 mb-4">
            © {new Date().getFullYear()} Ashesi University
          </p>
          <p className="font-body text-[12px] text-white/50 leading-relaxed">
            Building ethical leaders for Africa, one mentor connection at a time.
          </p>
        </div>
      </div>

      {/* ── FORM SECTION ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto bg-gradient-to-b from-[var(--color-background)] to-white/50">

        {/* Mobile Header */}
        <div className="absolute top-5 left-5 lg:hidden flex items-center gap-2.5">
          <div className="w-9 h-9 bg-accent rounded-[8px] flex items-center justify-center shadow-md">
            <span className="font-display font-extrabold text-white text-sm leading-none">A</span>
          </div>
          <span className="font-display font-bold text-text-primary text-[16px] tracking-tight">
            AshesiConnect
          </span>
        </div>

        {children}
      </div>
    </div>
  )
}