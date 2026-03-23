import type { ReactNode } from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-page font-body">

      <div className="hidden lg:flex w-[420px] shrink-0 bg-sidebar flex-col justify-between px-12 py-12 relative overflow-hidden">

        {/* Decorative rings */}
        <div className="absolute -top-28 -right-28 w-[360px] h-[360px] rounded-full border border-brand/10 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[280px] h-[280px] rounded-full bg-brand/8 blur-[60px] pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 bg-brand rounded-[10px] flex items-center justify-center shrink-0">
            <span className="font-display font-extrabold text-white text-base leading-none">A</span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-[16px] tracking-tight leading-none">
              AshesiConnect
            </p>
            <p className="font-body text-[10px] text-white/35 tracking-[0.08em] uppercase mt-0.5">
              Alumni Mentorship
            </p>
          </div>
        </Link>

        {/* Copy */}
        <div>
    

          <h2 className="font-display font-extrabold text-white text-[32px] leading-[1.15] tracking-tight mb-4">
            Your Ashesi network,<br />working for you
          </h2>

          <p className="font-body text-[14px] text-white/45 leading-relaxed">
            Connect with alumni who have taken the same courses,
            faced the same challenges, and succeeded in the roles
            you are aiming for.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { value: '500+', label: 'Mentors'   },
              { value: '94%',  label: 'Placement' },
              { value: '4.9★', label: 'Rating'    },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display font-bold text-[24px] text-brand tracking-tight leading-none">
                  {s.value}
                </p>
                <p className="font-body text-[12px] text-white/38 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="font-body text-[12px] text-white/25">
          © {new Date().getFullYear()} Ashesi University
        </p>
      </div>

      {/* ── RIGHT — form slot ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">

        {/* Mobile logo */}
        <div className="absolute top-5 left-5 flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 bg-brand rounded-[8px] flex items-center justify-center">
            <span className="font-display font-extrabold text-white text-sm leading-none">A</span>
          </div>
          <span className="font-display font-bold text-text text-[15px] tracking-tight">
            AshesiConnect
          </span>
        </div>

        {children}
      </div>
    </div>
  )
}