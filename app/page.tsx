import Link from 'next/link'
import { Hero } from './_components/Hero'
import { CheckmarkIcon } from '@/app/_components/ui/icons'



const features = [
  {
    tag: 'Discovery',
    tagClass: 'tag-accent',
    title: 'Find mentors by major, industry or company',
    body: 'Search across hundreds of Ashesi alumni. Filter by graduation year, field of work, or the specific skills you want to develop.',
    stat: '500+ mentors',
  },
  {
    tag: 'Communication',
    tagClass: 'tag-primary',
    title: 'Real-time messaging built in',
    body: 'No external tools needed. Message your mentor, share resources, and stay aligned — all inside the portal.',
    stat: 'Instant chat',
  },
  {
    tag: 'Sessions',
    tagClass: 'tag-warning',
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
    tagClass: 'tag-primary',
    initials: 'AO',
    avatarBg: 'bg-primary',
    sessions: 24,
    skills: ['Product Strategy', 'Fintech', 'Agile'],
  },
  {
    name: 'Kofi Asante',
    role: 'Software Engineer',
    company: 'Google',
    year: '2021',
    industry: 'Technology',
    tagClass: 'tag-accent',
    initials: 'KA',
    avatarBg: 'bg-accent',
    sessions: 18,
    skills: ['Backend', 'System Design', 'Go'],
  },
  {
    name: 'Abena Boateng',
    role: 'Strategy Consultant',
    company: 'McKinsey & Co.',
    year: '2018',
    industry: 'Consulting',
    tagClass: 'tag-primary',
    initials: 'AB',
    avatarBg: 'bg-primary-light',
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
    color: 'bg-primary',
  },
  {
    quote: 'Being a mentor has been one of the most fulfilling things I have done since graduating. Watching students grow is incredibly rewarding.',
    name: 'Efua Darko',
    detail: 'Business Admin 2017 · Senior PM at MTN',
    initials: 'ED',
    color: 'bg-primary-light',
  },
  {
    quote: 'The structured request and session system means mentorship is actually consistent — not just occasional WhatsApp messages.',
    name: 'Nii Armah',
    detail: 'MIS 2022 · Data Analyst at Deloitte',
    initials: 'NA',
    color: 'bg-accent',
  },
]

const industries = ['Technology', 'Finance', 'Consulting', 'Healthcare', 'Education', 'Engineering']


export default function HomePage() {
  return (
    <div className="font-body bg-background min-h-screen">

      <nav className="bg-white border-b border-border h-15 flex items-center justify-between px-10 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-[8px] flex items-center justify-center shrink-0">
            <span className="font-display font-extrabold text-white text-base leading-none">A</span>
          </div>
          <div>
            <span className="font-display font-bold text-[16px] text-primary tracking-tight leading-none">
              AshesiConnect
            </span>
            <span className="block font-body text-[10px] text-text-muted tracking-widest uppercase leading-none mt-0.5">
              Alumni Mentorship
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-text">
          <a href="#how-it-works" className="hover:text-brand transition-colors">How it works</a>
          <a href="#mentors" className="hover:text-brand transition-colors">Our mentors</a>
          <a href="#for-alumni" className="hover:text-brand transition-colors">For alumni</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="btn btn-ghost h-[38px] px-5 text-[14px] font-semibold">
            Log in
          </Link>
          <Link href="/register/student" className="btn btn-primary h-[38px] px-6 text-[14px] font-semibold">
            Get started
          </Link>
        </div>
      </nav>

     <Hero/>

      <section className="bg-white px-10 py-6 border-b border-border">
        <div className="max-w-[1000px] mx-auto flex items-center gap-3.5 flex-wrap">
          <span className="font-body text-[12px] font-bold text-text-sub uppercase tracking-[0.1em] mr-3 whitespace-nowrap">
            Industries we serve
          </span>
          {industries.map(ind => (
            <span key={ind} className="tag bg-accent/5 border border-accent/20 text-accent text-[13px] font-medium px-3.5 py-1.5">
              {ind}
            </span>
          ))}
        </div>
      </section>

      <section className="px-10 py-28 bg-background">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-16">
            <span className="font-body text-[13px] font-bold text-brand uppercase tracking-[0.12em]">
              Core features
            </span>
            <h2 className="font-display font-bold text-[48px] text-text tracking-tight mt-3 leading-tight">
              Everything to fuel meaningful mentorship
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card p-8 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-300 border-2 border-border hover:border-brand/20">
                <div className="flex items-start justify-between">
                  <span className={`tag ${f.tagClass} text-[12px] font-semibold px-3 py-1.5`}>{f.tag}</span>
                  <span className="font-body text-[12px] font-bold text-brand bg-brand/8 border border-brand/20 rounded-full px-3.5 py-1.5">
                    {f.stat}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-[20px] text-text tracking-tight mb-3 leading-tight">
                    {f.title}
                  </h3>
                  <p className="font-body text-[15px] text-text-sub leading-relaxed">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-10 py-28 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-16">
            <span className="font-body text-[13px] font-bold text-brand uppercase tracking-[0.12em]">
              Getting started
            </span>
            <h2 className="font-display font-bold text-[48px] text-text tracking-tight mt-3 leading-tight">
              Four simple steps to connect
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={step.number} className="card p-7 relative hover:shadow-md transition-shadow">
                {/* Step number badge */}
                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center font-display font-extrabold text-[16px] mb-6 border-2
                  ${step.role === 'student' ? 'bg-brand/10 text-brand border-brand/30' : ''}
                  ${step.role === 'alumni'  ? 'bg-tag-purple/10 text-tag-purple border-tag-purple/30' : ''}
                  ${step.role === 'both'    ? 'bg-accent/10 text-accent border-accent/30' : ''}
                `}>
                  {step.number}
                </div>
                <h3 className="font-display font-bold text-[17px] text-text tracking-tight mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="font-body text-[14px] text-text-sub leading-relaxed">
                  {step.body}
                </p>
                {/* Role pill */}
                <div className={`absolute top-6 right-6 h-6 px-3 rounded-full text-[11px] font-bold font-body flex items-center uppercase tracking-wider
                  ${step.role === 'student' ? 'bg-brand/10 text-brand' : ''}
                  ${step.role === 'alumni'  ? 'bg-tag-purple/10 text-tag-purple' : ''}
                  ${step.role === 'both'    ? 'bg-accent/10 text-accent' : ''}
                `}>
                  {step.role}
                </div>
              </div>
            ))}
          </div>

          {/* Inline sign-up prompt */}
          <div className="mt-14 p-8 bg-brand rounded-[16px] border border-brand/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div>
              <p className="font-display font-bold text-[20px] text-white tracking-tight">Ready to get started?</p>
              <p className="font-body text-[15px] text-white/70 mt-1">Create your account and start your journey in just 2 minutes</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/register/student" className="btn bg-white text-brand hover:bg-white/90 h-[42px] px-6 text-[14px] font-semibold rounded-[10px]">
                Join as student
              </Link>
              <Link href="/register/alumni" className="btn bg-white/15 border border-white/30 text-white hover:bg-white/25 h-[42px] px-6 text-[14px] font-semibold rounded-[10px]">
                Join as alumni
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="mentors" className="px-10 py-28 bg-background">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <span className="font-body text-[13px] font-bold text-brand uppercase tracking-[0.12em]">
                Featured mentors
              </span>
              <h2 className="font-display font-bold text-[48px] text-text tracking-tight mt-3 leading-tight">
                Learn from Ashesi alumni who've made it
              </h2>
            </div>
            <Link href="/register/student" className="btn btn-ghost h-[42px] px-5 text-[14px] font-semibold whitespace-nowrap">
              View all mentors →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map(m => (
              <div key={m.name} className="card overflow-hidden hover:shadow-lg transition-all duration-300 group border border-border hover:border-brand/20">
                {/* Card header */}
                <div className="h-[130px] bg-gradient-to-br from-brand/90 to-brand flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundImage: 'radial-gradient(circle at 25% 75%, rgba(255,107,43,0.3), transparent)' }} />
                  <span className={`tag absolute top-4 left-4 ${m.tagClass} font-semibold text-[12px] px-3 py-1.5`}>
                    {m.industry}
                  </span>
                  <div className={`w-16 h-16 rounded-full ${m.avatarBg} flex items-center justify-center font-display font-bold text-2xl text-white border-4 border-white/20 shadow-lg`}>
                    {m.initials}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <p className="font-display font-bold text-[18px] text-text tracking-tight">{m.name}</p>
                  <p className="font-body text-[14px] text-text-sub mt-1 font-medium">{m.role}</p>
                  <p className="font-body text-[13px] text-text-muted mt-0.5">{m.company} • Class of {m.year}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {m.skills.map(s => (
                      <span key={s} className="px-3 py-1.5 rounded-full bg-brand/8 border border-brand/20 font-body text-[12px] font-medium text-brand inline-flex items-center">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex justify-between mb-2">
                      <span className="font-body text-[12px] font-semibold text-text">Sessions hosted</span>
                      <span className="font-body text-[13px] font-bold text-brand">{m.sessions}</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand to-accent rounded-full"
                        style={{ width: `${Math.min((m.sessions / 40) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <Link href="/register/student" className="btn btn-primary w-full mt-6 h-[40px] text-[14px] font-semibold rounded-[10px]">
                    Connect with {m.name.split(' ')[0]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="for-alumni" className="px-10 py-24 bg-primary relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full border border-accent/12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/8 blur-[60px] pointer-events-none" />

        <div className="max-w-[960px] mx-auto relative grid lg:grid-cols-2 gap-16 items-center">
          <div>

            <h2 className="font-display font-extrabold text-white text-[48px] leading-[1.15] tracking-tight mb-6">
              Give back to the next generation
            </h2>
            <p className="font-body text-[18px] text-white/60 leading-relaxed mb-10">
              Share your wins and your lessons. Even two meaningful conversations a month can reshape a student's future. Help someone find their path and stay connected to the Ashesi mission.
            </p>

            <div className="flex flex-col gap-4 mb-12">
              {[
                'Control your own schedule — mentor on your terms',
                'Connect with students aligned to your expertise',
                'All tools built in — scheduling, messaging, feedback',
                'See the impact — track growth and learnings',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0 text-white">
                    <CheckmarkIcon />
                  </div>
                  <span className="font-body text-[16px] text-white/75 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/register/alumni" className="btn bg-white text-brand hover:bg-white/95 h-[48px] px-8 text-[15px] font-bold rounded-[12px] shadow-xl inline-flex items-center gap-2">
              Start mentoring today →
            </Link>
          </div>

          {/* Stats panel */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: '2 hrs',   label: 'Avg. time per month', color: 'from-accent to-accent/80' },
              { value: '92%',    label: 'Find it deeply rewarding', color: 'from-tag-purple to-tag-purple/80' },
              { value: '2 min',  label: 'Quick profile setup', color: 'from-success to-success/80' },
              { value: '100%',   label: 'Completely free', color: 'from-info to-info/80' },
            ].map(s => (
              <div key={s.label} className={`card p-6 bg-gradient-to-br ${s.color} border border-white/10 shadow-lg`}>
                <div className="font-display font-bold text-[36px] text-white tracking-tight leading-none">{s.value}</div>
                <div className="font-body text-[13px] text-white/70 mt-2 leading-snug font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 py-28 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-16 text-center">
            <span className="font-body text-[13px] font-bold text-brand uppercase tracking-[0.12em]">
              Impact stories
            </span>
            <h2 className="font-display font-bold text-[48px] text-text tracking-tight mt-3 leading-tight">
              The difference a mentor makes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card p-7 flex flex-col gap-5 hover:shadow-lg transition-shadow border border-border hover:border-accent/20 group">
                {/* Quote mark */}
                <div className="font-display text-[52px] text-brand/20 leading-none -mb-3 group-hover:text-accent/30 transition-colors">"</div>
                <p className="font-body text-[15px] text-text-sub leading-relaxed flex-1">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-display font-bold text-[14px] text-white shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-body text-[14px] font-semibold text-text">{t.name}</p>
                    <p className="font-body text-[12px] text-text-muted">{t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 py-32 bg-brand relative overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full border border-accent/15 pointer-events-none" />
        <div className="absolute top-10 right-10 w-[350px] h-[350px] rounded-full bg-accent/15 blur-[80px] pointer-events-none" />

        <div className="max-w-[700px] mx-auto text-center relative">
          <h2 className="font-display font-extrabold text-white text-[clamp(36px,7vw,56px)] tracking-tight leading-[1.1] mb-6">
            Your journey starts now
          </h2>
          <p className="font-body text-[18px] text-white/60 leading-relaxed mb-12">
            Whether you\'re seeking mentorship as a student or ready to give back as an alumnus, find your place in the Ashesi community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register/student"
              className="btn bg-white text-brand hover:bg-white/95 h-[52px] px-10 text-[16px] font-bold rounded-[12px] shadow-xl"
            >
              Sign up as student
            </Link>
            <Link
              href="/register/alumni"
              className="btn h-[52px] px-10 text-[16px] font-bold bg-white/12 border-2 border-white/30 text-white hover:bg-white/20 transition-colors rounded-[12px]"
            >
              Become a mentor
            </Link>
          </div>
          <p className="font-body text-[14px] text-white/40 mt-8">
            Already a member?{' '}
            <Link href="/login" className="text-white/70 hover:text-white transition-colors font-medium underline">
              Log in here
            </Link>
          </p>
        </div>
      </section>

      <footer className="bg-white border-t border-border px-10 py-10 flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand rounded-[10px] flex items-center justify-center shadow-md">
            <span className="font-display font-extrabold text-white text-[13px]">A</span>
          </div>
          <span className="font-display font-bold text-[16px] text-brand">AshesiConnect</span>
        </div>
        <div className="flex items-center gap-8 text-[13px] text-text-sub font-body">
          <a href="#how-it-works" className="hover:text-brand transition-colors font-medium">How it works</a>
          <a href="#mentors" className="hover:text-brand transition-colors font-medium">Our mentors</a>
          <a href="#for-alumni" className="hover:text-brand transition-colors font-medium">For alumni</a>
          <Link href="/login" className="hover:text-brand transition-colors font-medium">Log in</Link>
        </div>
        <p className="font-body text-[13px] text-text-muted">
          © {new Date().getFullYear()} Ashesi University Mentorship Network
        </p>
      </footer>

    </div>
  )
}