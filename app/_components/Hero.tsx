import Link  from 'next/link'; 

const stats = [
  { value: '500+',   label: 'Alumni mentors'        },
  { value: '1,200+', label: 'Students connected'    },
  { value: '94%',    label: 'Career success rate'   },
  { value: '4.9★',   label: 'Average mentor rating' },
]

export function Hero(){
    return (
         <section className="bg-sidebar px-10 pt-24 pb-20 relative overflow-hidden">
        {/* Rings */}
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full border border-brand/12 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-85 h-85 rounded-full border border-brand/7 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[380px] h-[380px] rounded-full bg-brand/10 blur-[70px] pointer-events-none" />

        <div className="max-w-[820px] mx-auto text-center relative">

       

          <h1 className="font-display font-extrabold text-white leading-[1.1] tracking-[-0.03em] text-[clamp(38px,6vw,68px)] mb-6">
            The mentorship platform<br />
            <span className="text-brand">built for Ashesi</span>
          </h1>

          <p className="font-body text-[17px] text-white/50 leading-relaxed max-w-[560px] mx-auto mb-10">
            Students get career guidance from alumni who walked the same halls,
            took the same courses, and succeeded in the roles you are aiming for.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/register/student"
              className="btn btn-primary h-[50px] px-8 text-[15px] shadow-[0_4px_24px_rgba(255,107,43,0.42)] w-full sm:w-auto"
            >
              I&apos;m a student — find a mentor →
            </Link>
            <Link
              href="/register/alumni"
              className="btn h-[50px] px-8 text-[15px] bg-white/8 border border-white/16 text-white hover:bg-white/14 transition-colors w-full sm:w-auto"
            >
              I&apos;m alumni — become a mentor
            </Link>
          </div>

          {/* Trust note */}
          <p className="font-body text-[12px] text-white/30 mt-5">
            Free for all Ashesi students and alumni · @ashesi.edu.gh email required
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-14 border-t border-white/8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display font-bold text-[30px] text-brand tracking-tight">{s.value}</div>
                <div className="font-body text-[12px] text-white/38 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
}