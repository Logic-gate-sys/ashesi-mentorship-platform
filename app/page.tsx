import Link from 'next/link'
import { Hero } from './_components/Hero'



const features = [
  {
    tag: 'Discovery',
    tagClass: 'tag-orange',
    title: 'Find mentors by major, industry or company',
    body: 'Search across hundreds of Ashesi alumni. Filter by graduation year, field of work, or the specific skills you want to develop.',
    stat: '500+ mentors',
  },
  {
    tag: 'Communication',
    tagClass: 'tag-purple',
    title: 'Real-time messaging built in',
    body: 'No external tools needed. Message your mentor, share resources, and stay aligned — all inside the portal.',
    stat: 'Instant chat',
  },
  {
    tag: 'Sessions',
    tagClass: 'tag-yellow',
    title: 'Schedule and track your sessions',
    body: 'Book time slots that work for both of you, set session goals, and log notes and action items after every meeting.',
    stat: '3,400+ sessions held',
  },
]

const steps = [
  {
    number: '01',
    role: 'student',
    title: 'Create your student profile',
    body: 'Tell us your major, career interests, and what kind of guidance you are looking for.',
  },
  {
    number: '02',
    role: 'student',
    title: 'Browse and request a mentor',
    body: 'Search alumni by industry or company. Send a personalised request with your goals.',
  },
  {
    number: '03',
    role: 'alumni',
    title: 'Alumni review and accept',
    body: 'Mentors review incoming requests and accept students that match their capacity and expertise.',
  },
  {
    number: '04',
    role: 'both',
    title: 'Meet, learn, and grow',
    body: 'Schedule sessions, exchange messages, and build a relationship that outlasts campus.',
  },
]

const mentors = [
  {
    name: 'Ama Owusu',
    role: 'Product Manager',
    company: 'Stanbic Bank',
    year: '2019',
    industry: 'Finance',
    tagClass: 'bg-[#E8F5F0] text-[#0C5C3E]',
    initials: 'AO',
    avatarBg: 'bg-[#0C5C3E]',
    sessions: 24,
    skills: ['Product Strategy', 'Fintech', 'Agile'],
  },
  {
    name: 'Kofi Asante',
    role: 'Software Engineer',
    company: 'Google',
    year: '2021',
    industry: 'Technology',
    tagClass: 'tag-yellow text-[#5A3E00]',
    initials: 'KA',
    avatarBg: 'bg-[#185FA5]',
    sessions: 18,
    skills: ['Backend', 'System Design', 'Go'],
  },
  {
    name: 'Abena Boateng',
    role: 'Strategy Consultant',
    company: 'McKinsey & Co.',
    year: '2018',
    industry: 'Consulting',
    tagClass: 'tag-purple text-white',
    initials: 'AB',
    avatarBg: 'bg-tag-purple',
    sessions: 31,
    skills: ['Strategy', 'Leadership', 'Analytics'],
  },
]

const testimonials = [
  {
    quote: 'My mentor helped me land my first software role at a fintech startup three months before graduation. I could not have done it without AshesiConnect.',
    name: 'Kwame Mensah',
    detail: 'CS 2024 · now at Zeepay',
    initials: 'KM',
    color: 'bg-brand',
  },
  {
    quote: 'Being a mentor has been one of the most fulfilling things I have done since graduating. Watching students grow is incredibly rewarding.',
    name: 'Efua Darko',
    detail: 'Business Admin 2017 · Senior PM at MTN',
    initials: 'ED',
    color: 'bg-tag-purple',
  },
  {
    quote: 'The structured request and session system means mentorship is actually consistent — not just occasional WhatsApp messages.',
    name: 'Nii Armah',
    detail: 'MIS 2022 · Data Analyst at Deloitte',
    initials: 'NA',
    color: 'bg-[#0C5C3E]',
  },
]

const industries = ['Technology', 'Finance', 'Consulting', 'Healthcare', 'Education', 'Engineering']


export default function HomePage() {
  return (
    <div className="font-body bg-page min-h-screen">

      <nav className="bg-surface border-b border-border h-15 flex items-center justify-between px-10 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand rounded-btn flex items-center justify-center shrink-0">
            <span className="font-display font-extrabold text-white text-base leading-none">A</span>
          </div>
          <div>
            <span className="font-display font-bold text-[16px] text-text tracking-tight leading-none">
              AshesiConnect
            </span>
            <span className="block font-body text-[10px] text-text-muted tracking-widest uppercase leading-none mt-0.5">
              Alumni Mentorship
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-text-sub">
          <a href="#how-it-works" className="hover:text-text transition-colors">How it works</a>
          <a href="#mentors" className="hover:text-text transition-colors">Mentors</a>
          <a href="#for-alumni" className="hover:text-text transition-colors">For alumni</a>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost h-[36px] px-4 text-[13px]">
            Log in
          </Link>
          <Link href="/register/student" className="btn btn-primary h-[36px] px-4 text-[13px]">
            Get started
          </Link>
        </div>
      </nav>

     <Hero/>

      <section className="bg-surface px-10 py-4 border-b border-border">
        <div className="max-w-[960px] mx-auto flex items-center gap-2.5 flex-wrap">
          <span className="font-body text-[11px] font-bold text-text-muted uppercase tracking-[0.08em] mr-2">
            Alumni working in
          </span>
          {industries.map(ind => (
            <span key={ind} className="tag bg-page border border-border text-text-sub text-[12px]">
              {ind}
            </span>
          ))}
        </div>
      </section>

      <section className="px-10 py-24 bg-page">
        <div className="max-w-[960px] mx-auto">
          <div className="mb-14">
            <span className="font-body text-[12px] font-bold text-brand uppercase tracking-[0.08em]">
              Everything you need
            </span>
            <h2 className="font-display font-bold text-[34px] text-text tracking-tight mt-2">
              One platform. The full mentorship journey.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="card p-7 flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <span className={`tag ${f.tagClass}`}>{f.tag}</span>
                  <span className="font-body text-[11px] font-semibold text-text-muted bg-page border border-border rounded-full px-3 py-1">
                    {f.stat}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-[17px] text-text tracking-tight mb-2">
                    {f.title}
                  </h3>
                  <p className="font-body text-[13px] text-text-sub leading-relaxed">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-10 py-24 bg-surface">
        <div className="max-w-[960px] mx-auto">
          <div className="mb-14">
            <span className="font-body text-[12px] font-bold text-brand uppercase tracking-[0.08em]">
              How it works
            </span>
            <h2 className="font-display font-bold text-[34px] text-text tracking-tight mt-2">
              From sign-up to your first session
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map(step => (
              <div key={step.number} className="card p-6 relative">
                {/* Step number badge */}
                <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center font-display font-extrabold text-[12px] mb-5
                  ${step.role === 'student' ? 'bg-brand/10 text-brand border border-brand/20' : ''}
                  ${step.role === 'alumni'  ? 'bg-tag-purple/10 text-tag-purple border border-tag-purple/20' : ''}
                  ${step.role === 'both'    ? 'bg-tag-yellow/20 text-[#7A5500] border border-tag-yellow/30' : ''}
                `}>
                  {step.number}
                </div>
                <h3 className="font-display font-bold text-[15px] text-text tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-[12px] text-text-sub leading-relaxed">
                  {step.body}
                </p>
                {/* Role pill */}
                <div className={`absolute top-5 right-5 h-5 px-2 rounded-full text-[10px] font-semibold font-body flex items-center
                  ${step.role === 'student' ? 'bg-brand/10 text-brand' : ''}
                  ${step.role === 'alumni'  ? 'bg-tag-purple/10 text-tag-purple' : ''}
                  ${step.role === 'both'    ? 'bg-tag-yellow/15 text-[#7A5500]' : ''}
                `}>
                  {step.role === 'both' ? 'both' : step.role}
                </div>
              </div>
            ))}
          </div>

          {/* Inline sign-up prompt */}
          <div className="mt-10 p-6 bg-page rounded-[14px] border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-display font-bold text-[16px] text-text tracking-tight">Ready to start?</p>
              <p className="font-body text-[13px] text-text-muted mt-0.5">Choose your path and create your account in under 2 minutes.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/register/student" className="btn btn-primary h-[38px] px-5 text-[13px]">
                Join as student
              </Link>
              <Link href="/register/alumni" className="btn btn-ghost h-[38px] px-5 text-[13px]">
                Join as alumni
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="mentors" className="px-10 py-24 bg-page">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="font-body text-[12px] font-bold text-brand uppercase tracking-[0.08em]">
                Featured mentors
              </span>
              <h2 className="font-display font-bold text-[34px] text-text tracking-tight mt-2">
                Learn from people who know your path
              </h2>
            </div>
            <Link href="/register/student" className="btn btn-ghost h-[36px] px-4 text-[13px]">
              Browse all mentors →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mentors.map(m => (
              <div key={m.name} className="card overflow-hidden">
                {/* Card header */}
                <div className="h-[110px] bg-sidebar flex items-center justify-center relative">
                  <span className={`tag absolute top-3 left-3 ${m.tagClass}`}>
                    {m.industry}
                  </span>
                  <div className={`w-14 h-14 rounded-full ${m.avatarBg} flex items-center justify-center font-display font-bold text-xl text-white border-[3px] border-white/10`}>
                    {m.initials}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <p className="font-display font-bold text-[16px] text-text tracking-tight">{m.name}</p>
                  <p className="font-body text-[13px] text-text-sub mt-0.5">{m.role} · {m.company}</p>
                  <p className="font-body text-[12px] text-text-muted mt-0.5">Class of {m.year}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {m.skills.map(s => (
                      <span key={s} className="h-[22px] px-2.5 rounded-full bg-page border border-border font-body text-[11px] font-medium text-text-sub inline-flex items-center">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-[11px] text-text-muted">Sessions held</span>
                      <span className="font-body text-[11px] font-semibold text-text-sub">{m.sessions}</span>
                    </div>
                    <div className="h-[5px] bg-page rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-brand rounded-full"
                        style={{ width: `${Math.min((m.sessions / 40) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <Link href="/register/student" className="btn btn-primary w-full mt-4 h-[36px] text-[13px]">
                    Connect
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="for-alumni" className="px-10 py-24 bg-sidebar relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full border border-tag-purple/12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-tag-purple/8 blur-[60px] pointer-events-none" />

        <div className="max-w-[960px] mx-auto relative grid lg:grid-cols-2 gap-16 items-center">
          <div>

            <h2 className="font-display font-extrabold text-white text-[36px] leading-[1.15] tracking-tight mb-5">
              Give back to the community that shaped you
            </h2>
            <p className="font-body text-[15px] text-white/45 leading-relaxed mb-8">
              You don&apos;t need a tonne of time. Even two sessions a month can change
              a student&apos;s trajectory. Share your journey, help someone avoid your
              early mistakes, and stay connected to Ashesi.
            </p>

            <div className="flex flex-col gap-3 mb-10">
              {[
                'Set your own availability — no pressure',
                'Accept only the students you can genuinely help',
                'Built-in scheduling and messaging — zero admin',
                'Track your impact with session and feedback summaries',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-tag-purple/40 border border-tag-purple/30 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#9747FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-body text-[13px] text-white/60">{item}</span>
                </div>
              ))}
            </div>

            <Link href="auth/register/alumni" className="btn h-11.5 px-7 text-[14px] bg-blend-color-burn text-white hover:opacity-88 transition-opacity shadow-[0_4px_20px_rgba(151,71,255,0.35)]">
              Become a mentor today →
            </Link>
          </div>

          {/* Stats panel */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '2hrs',   label: 'Average time commitment per month', color: 'bg-brand/10 border-brand/20' },
              { value: '92%',    label: 'Of mentors say it is personally rewarding', color: 'bg-tag-purple/10 border-tag-purple/20' },
              { value: '3 min',  label: 'To set up your mentor profile', color: 'bg-tag-yellow/10 border-tag-yellow/20' },
              { value: '100%',   label: 'Free — no cost to mentors or students', color: 'bg-[#0C5C3E]/20 border-[#0C5C3E]/30' },
            ].map(s => (
              <div key={s.label} className={`card p-5 bg-dark-card border ${s.color}`}>
                <div className="font-display font-bold text-[28px] text-white tracking-tight">{s.value}</div>
                <div className="font-body text-[12px] text-white/45 mt-1 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 py-24 bg-surface">
        <div className="max-w-[960px] mx-auto">
          <div className="mb-14 text-center">
            <span className="font-body text-[12px] font-bold text-brand uppercase tracking-[0.08em]">
              Stories
            </span>
            <h2 className="font-display font-bold text-[34px] text-text tracking-tight mt-2">
              What the community says
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div key={t.name} className="card p-6 flex flex-col gap-5">
                {/* Quote mark */}
                <div className="font-display text-[40px] text-brand leading-none -mb-2">"</div>
                <p className="font-body text-[13px] text-text-sub leading-relaxed flex-1">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center font-display font-bold text-[13px] text-white shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-body text-[13px] font-semibold text-text">{t.name}</p>
                    <p className="font-body text-[11px] text-text-muted">{t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 py-24 bg-sidebar relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full border border-brand/10 pointer-events-none" />
        <div className="absolute top-0 right-20 w-[300px] h-[300px] rounded-full bg-brand/12 blur-[60px] pointer-events-none" />

        <div className="max-w-[640px] mx-auto text-center relative">
          <h2 className="font-display font-extrabold text-white text-[clamp(28px,5vw,48px)] tracking-[-0.03em] leading-[1.15] mb-5">
            Your future self will thank you for starting today
          </h2>
          <p className="font-body text-[16px] text-white/45 leading-relaxed mb-10">
            Whether you are a student looking for direction or an alumni ready to give back —
            AshesiConnect is where it happens.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register/student"
              className="btn btn-primary h-[50px] px-9 text-[15px] shadow-[0_4px_24px_rgba(255,107,43,0.42)]"
            >
              Sign up as a student
            </Link>
            <Link
              href="/register/alumni"
              className="btn h-[50px] px-9 text-[15px] bg-white/8 border border-white/16 text-white hover:bg-white/14 transition-colors"
            >
              Join as alumni
            </Link>
          </div>
          <p className="font-body text-[12px] text-white/25 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-white/50 hover:text-white/80 transition-colors underline">
              Log in
            </Link>
          </p>
        </div>
      </section>

      <footer className="bg-surface border-t border-border px-10 py-7 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand rounded-[8px] flex items-center justify-center">
            <span className="font-display font-extrabold text-white text-[12px]">A</span>
          </div>
          <span className="font-display font-bold text-[14px] text-text">AshesiConnect</span>
        </div>
        <div className="flex items-center gap-6 text-[12px] text-text-muted font-body">
          <a href="#how-it-works" className="hover:text-text transition-colors">How it works</a>
          <a href="#mentors" className="hover:text-text transition-colors">Mentors</a>
          <a href="#for-alumni" className="hover:text-text transition-colors">For alumni</a>
          <Link href="/login" className="hover:text-text transition-colors">Log in</Link>
        </div>
        <p className="font-body text-[12px] text-text-muted">
          © {new Date().getFullYear()} Ashesi University Alumni Mentorship Portal
        </p>
      </footer>

    </div>
  )
}