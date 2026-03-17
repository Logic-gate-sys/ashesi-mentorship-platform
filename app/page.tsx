import Link from 'next/link'

const stats = [
  { value: '500+',   label: 'Alumni mentors'   },
  { value: '1,200+', label: 'Students guided'  },
  { value: '94%',    label: 'Career placement' },
  { value: '4.9★',   label: 'Average rating'   },
]

const steps = [
  {
    number: '01',
    title: 'Create your profile',
    body: 'Sign up as a student or alumni. Tell us your major, industry, and what you are looking for.',
  },
  {
    number: '02',
    title: 'Find your mentor',
    body: 'Browse alumni by industry, role, or graduation year. Filter by the exact skills you need.',
  },
  {
    number: '03',
    title: 'Send a request',
    body: 'Write a short goal and a personalised message. Your mentor gets notified instantly.',
  },
  {
    number: '04',
    title: 'Grow together',
    body: 'Schedule sessions, exchange messages, and build a lasting professional relationship.',
  },
]

const mentors = [
  {
    name: 'Ama Owusu',
    role: 'Product Manager',
    company: 'Stanbic Bank',
    year: '2019',
    industry: 'Finance',
    industryClass: 'bg-[#E8F5F0] text-[#0C5C3E]',
    initials: 'AO',
    avatarBg: 'bg-[#0C5C3E]',
  },
  {
    name: 'Kofi Asante',
    role: 'Software Engineer',
    company: 'Google',
    year: '2021',
    industry: 'Technology',
    industryClass: 'bg-[#EDF3FB] text-[#1A4A8B]',
    initials: 'KA',
    avatarBg: 'bg-ashesi-blue',
  },
  {
    name: 'Abena Boateng',
    role: 'Consultant',
    company: 'McKinsey',
    year: '2018',
    industry: 'Consulting',
    industryClass: 'bg-[#FDF3DC] text-[#7A5500]',
    initials: 'AB',
    avatarBg: 'bg-ashesi-maroon',
  },
]

const industries = [
  'Technology', 'Finance', 'Consulting',
  'Healthcare', 'Education', 'Engineering',
]

export default function HomePage() {
  return (
    <div className="font-body bg-[#4e0308] min-h-screen">

      <nav className="bg-white border-b border-ashesi-warm-biege h-15 flex items-center justify-between px-10 sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-ashesi-maroon rounded-btn flex items-center justify-center">
            <span className="font-display font-extrabold text-ashesi-golden text-base">A</span>
          </div>
          <div>
            <span className="font-display font-bold text-base text-ashesi-maroon tracking-tight leading-none">
              AshesiConnect
            </span>
            <span className="block font-body text-[10px] text-ashesi-warm-cool tracking-widest uppercase leading-none mt-0.5">
              Alumni Mentorship
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="btn btn-ghost h-[38px] px-[18px] text-sm"
          >
            Log in
          </Link>
          <Link
            href="/(auth)/register/student"
            className="btn btn-primary h-[38px] px-[18px] text-sm"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="bg-ashesi-black px-10 pt-24 pb-20 relative overflow-hidden">

        {/* Decorative rings */}
        <div className="absolute -top-36 -right-36 w-125 h-125 rounded-full border border-ashesi-golden/15 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-[320px] h-80 rounded-full border border-ashesi-golden/8 pointer-events-none" />
        {/* Maroon glow */}
        <div className="absolute -bottom-20 -left-20 w-90 h-90 rounded-full bg-ashesi-maroon/20 blur-[60px] pointer-events-none" />

        <div className="max-w-195 mx-auto text-center relative">

          <h1 className="font-display">
            Your career starts with <br />
            <span className="text-ashesi-golden">the right mentor</span>
          </h1>

          <p className="font-body text-[18px] text-white/50 leading-relaxed max-w-[560px] mx-auto mb-11">
            Connect with Ashesi alumni who have walked your path, faced your
            challenges, and built successful careers in your field of interest.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/(auth)/register/student"
              className="btn btn-primary h-[50px] px-8 text-[15px] shadow-[0_4px_20px_rgba(139,26,46,0.40)]"
            >
              Find a mentor <span className="text-lg">→</span>
            </Link>
            <Link
              href="/(auth)/register/alumni"
              className="btn btn-dark h-[50px] px-8 text-[15px]"
            >
              Become a mentor
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-16 flex-wrap">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display font-bold text-[30px] text-ashesi-golden tracking-tight">
                  {s.value}
                </div>
                <div className="font-body text-[13px] text-white/40 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-10 py-[18px] border-b border-ashesi-warm-biege">
        <div className="max-w-[960px] mx-auto flex items-center gap-2.5 flex-wrap">
          <span className="font-body text-[11px] font-bold text-ashesi-warm-cool uppercase tracking-[0.08em] mr-1.5">
            Industries
          </span>
          {industries.map(ind => (
            <span
              key={ind}
              className="h-7 px-3.5 rounded-[6px] bg-ashesi-warm-white border border-ashesi-warm-biege text-[12px] font-medium text-text-secondary font-body inline-flex items-center"
            >
              {ind}
            </span>
          ))}
        </div>
      </section>

      <section className="px-10 py-24 bg-ashesi-warm-white">
        <div className="max-w-[960px] mx-auto">

          <div className="mb-14">
            <span className="font-body text-[12px] font-bold text-ashesi-maroon uppercase tracking-[0.08em]">
              How it works
            </span>
            <h2 className="font-display font-bold text-[36px] text-text-primary tracking-tight leading-tight mt-2.5">
              Mentorship made simple
            </h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {steps.map(step => (
              <div key={step.number} className="card p-7">
                {/* Gold number badge */}
                <div className="w-9 h-9 rounded-[10px] bg-ashesi-golden/10 border border-ashesi-golden/25 flex items-center justify-center font-display font-extrabold text-[13px] text-[#8A6800] mb-[18px]">
                  {step.number}
                </div>
                <h3 className="font-display font-bold text-[17px] text-text-primary tracking-tight mb-2.5">
                  {step.title}
                </h3>
                <p className="font-body text-[13px] text-text-secondary leading-[1.65]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 py-24 bg-white">
        <div className="max-w-240 mx-auto">

          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="font-body text-[12px] font-bold text-ashesi-maroon uppercase tracking-[0.08em]">
                Featured mentors
              </span>
              <h2 className="font-display font-bold text-[36px] text-text-primary tracking-tight leading-tight mt-2.5">
                Learn from the best
              </h2>
            </div>
            <Link
              href="/(auth)/register/student"
              className="btn btn-ghost h-9.5 px-4.5 text-[13px]"
            >
              View all mentors →
            </Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {mentors.map(m => (
              <div key={m.name} className="card p-0 overflow-hidden">

                {/* Card header */}
                <div className="h-[110px] bg-ashesi-black flex items-center justify-center relative">
                  {/* Industry tag */}
                  <span className={`absolute top-3 left-3 h-6 px-2.5 rounded-[6px] text-[11px] font-semibold font-body tracking-[0.02em] inline-flex items-center ${m.industryClass}`}>
                    {m.industry}
                  </span>
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-full ${m.avatarBg} flex items-center justify-center font-display font-bold text-xl text-white border-[3px] border-white/10`}>
                    {m.initials}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-[18px] pt-4">
                  <p className="font-display font-bold text-[16px] text-text-primary tracking-tight">
                    {m.name}
                  </p>
                  <p className="font-body text-[13px] text-text-secondary mt-0.5">
                    {m.role} · {m.company}
                  </p>
                  <p className="font-body text-[12px] text-text-muted mt-0.5">
                    Class of {m.year}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3.5">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-[11px] text-text-muted">Sessions held</span>
                      <span className="font-body text-[11px] font-semibold text-text-secondary">12 / 20</span>
                    </div>
                    <div className="h-[5px] bg-ashesi-warm-biege rounded-full overflow-hidden">
                      <div className="h-full w-[60%] bg-ashesi-maroon rounded-full" />
                    </div>
                  </div>

                  <Link
                    href="/(auth)/register/student"
                    className="btn btn-primary w-full mt-4 h-9 text-[13px] shadow-[0_2px_8px_rgba(139,26,46,0.25)]"
                  >
                    Connect
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ashesi-black px-10 py-24 relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full border border-ashesi-golden/10 pointer-events-none" />
        <div className="absolute -top-20 right-20 w-[280px] h-[280px] rounded-full bg-ashesi-maroon/25 blur-[50px] pointer-events-none" />

        <div className="max-w-[640px] mx-auto text-center relative">
          <h2 className="">
            Ready to shape your future?
          </h2>
          <p className="font-body text-[16px] text-white/45 leading-relaxed mb-10">
            Join hundreds of Ashesi students already getting career guidance
            from alumni who understand exactly where you are.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/(auth)/register/student"
              className="btn btn-primary h-[50px] px-8 text-[15px] shadow-[0_4px_20px_rgba(139,26,46,0.40)]"
            >
              Sign up as a student
            </Link>
            <Link
              href="/(auth)/register/alumni"
              className="btn btn-dark h-[50px] px-8 text-[15px]"
            >
              Join as alumni
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-ashesi-warm-biege px-10 py-7 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-ashesi-maroon rounded-[8px] flex items-center justify-center">
            <span className="font-display font-extrabold text-ashesi-golden text-[12px]">A</span>
          </div>
          <span className="font-display font-bold text-[14px] text-ashesi-maroon">
            AshesiConnect
          </span>
        </div>
        <p className="font-body text-[12px] text-text-muted">
          © {new Date().getFullYear()} Ashesi University Alumni Mentorship Portal
        </p>
      </footer>

    </div>
  )
}