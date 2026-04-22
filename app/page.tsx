import Link from 'next/link'
import { Hero } from '#comp-hooks/Hero'
import { CheckmarkIcon } from '#comp-hooks/ui/icons/'
import { FeatureCard, StepCard, MentorCard, StatCard, TestimonialCard } from '#comp-hooks/cards'
import { StepCardProps } from '#utils-types/types/types'

const features = [
  {
    tag: 'Discovery',
    tagClass: 'bg-accent/10 text-accent',
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

const steps: StepCardProps[] = [
  {
    number: '01',
    role: 'mentee',
    title: 'Create your student profile',
    body: 'Tell us your major, career interests, and what kind of guidance you are looking for.',
  },
  {
    number: '02',
    role: 'mentee',
    title: 'Browse and request a mentor',
    body: 'Search alumni by industry or company. Send a personalised request with your goals.',
  },
  {
    number: '03',
    role: 'mentor',
    title: 'Alumni review and accept',
    body: 'Mentors review incoming requests and accept students that match their capacity and expertise.',
  },
  {
    number: '04',
    role: 'admin',
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
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmaOwusu',
    sessions: 24,
    skills: ['Product Strategy', 'Fintech', 'Agile'],
  },
  {
    name: 'Kofi Asante',
    role: 'Software Engineer',
    company: 'Google',
    year: '2021',
    industry: 'Technology',
    tagClass: 'bg-accent/10 text-accent',
    initials: 'KA',
    avatarBg: 'bg-accent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KofiAsante',
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
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AbenaBoateng',
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
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          <a href="#mentors" className="hover:text-primary transition-colors">Our mentors</a>
          <a href="#for-alumni" className="hover:text-primary transition-colors">For alumni</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="btn btn-ghost h-[38px] px-5 text-[14px] font-semibold">
            Log in
          </Link>
          <Link href="/register/mentee" className="btn btn-primary h-[38px] px-6 text-[14px] font-semibold">
            Get started
          </Link>
        </div>
      </nav>

     <Hero/>

      <section className="bg-white px-10 py-6 border-b border-border">
        <div className="max-w-250 mx-auto flex items-center gap-3.5 flex-wrap">
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
        <div className="max-w-250 mx-auto">
          <div className="mb-16">
            <span className="font-body text-[13px] font-bold text-primary uppercase tracking-[0.12em]">
              Core features
            </span>
            <h2 className="font-display font-bold text-[48px] text-text tracking-tight mt-3 leading-tight">
              Everything to fuel meaningful mentorship
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-10 py-28 bg-white">
        <div className="max-w-250 mx-auto">
          <div className="mb-16">
            <span className="font-body text-[13px] font-bold text-primary uppercase tracking-[0.12em]">
              Getting started
            </span>
            <h2 className="font-display font-bold text-[48px] text-text tracking-tight mt-3 leading-tight">
              Four simple steps to connect
            </h2>
          </div>

          {/* Steps with connecting arrows */}
          <div className="relative w-full">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {steps.map((step, idx) => (
                <div key={step.number} className={`relative ${idx === 0 ? 'lg:pl-3' : ''}`}>
                  <StepCard {...step} />
                  {/* Arrow to next step - visible on desktop only */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-8 top-1/3 items-center justify-center w-6 h-8">
                      <svg width="32" height="8" viewBox="0 0 32 8" className="absolute">
                        <defs>
                          <marker id="triangleright" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#7F1D1D" />
                          </marker>
                        </defs>
                        <line x1="0" y1="4" x2="28" y2="4" stroke="#7F1D1D" strokeWidth="2.5" markerEnd="url(#triangleright)" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inline sign-up prompt */}
          <div className="mt-14 p-8 bg-primary rounded-[16px] border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div>
              <p className="font-display font-bold text-[20px] text-white tracking-tight">Ready to get started?</p>
              <p className="font-body text-[15px] text-white/70 mt-1">Create your account and start your journey in just 2 minutes</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/register/mentee" className="btn bg-white text-primary hover:bg-white/90 h-[42px] px-6 text-[14px] font-semibold rounded-[10px]">
                Join as student
              </Link>
              <Link href="/register/mentor" className="btn bg-white/15 border border-white/30 text-white hover:bg-white/25 h-[42px] px-6 text-[14px] font-semibold rounded-[10px]">
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
              <span className="font-body text-[13px] font-bold text-primary uppercase tracking-[0.12em]">
                Featured mentors
              </span>
              <h2 className="font-display font-bold text-[48px] text-text tracking-tight mt-3 leading-tight">
                Learn from Ashesi alumni who've made it
              </h2>
            </div>
            <Link href="/register/mentee" className="btn btn-ghost h-[42px] px-5 text-[14px] font-semibold whitespace-nowrap">
              View all mentors →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map(m => (
              <MentorCard key={m.name} {...m} />
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

            <Link href="/register/mentor" className="btn bg-white text-primary hover:bg-white/95 h-[48px] px-8 text-[15px] font-bold rounded-[12px] shadow-xl inline-flex items-center gap-2">
              Start mentoring today →
            </Link>
          </div>

          {/* Stats panel */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: '2 hrs',   label: 'Avg. time per month', color: 'from-accent to-accent/80' },
              { value: '92%',    label: 'Find it deeply rewarding', color: 'from-info to-info/50' },
              { value: '2 min',  label: 'Quick profile setup', color: 'from-primary-light to-primary-light/80' },
              { value: '100%',   label: 'Completely free', color: 'from-info to-info/80' },
            ].map(s => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 py-28 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-16 text-center">
            <span className="font-body text-[13px] font-bold text-primary uppercase tracking-[0.12em]">
              Impact stories
            </span>
            <h2 className="font-display font-bold text-[48px] text-text tracking-tight mt-3 leading-tight">
              The difference a mentor makes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 py-32 bg-primary relative overflow-hidden">
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
              href="/register/mentee"
              className="btn bg-white text-primary hover:bg-white/95 h-[52px] px-10 text-[16px] font-bold rounded-[12px] shadow-xl"
            >
              Sign up as student
            </Link>
            <Link
              href="/register/mentor"
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
          <div className="w-8 h-8 bg-primary rounded-[10px] flex items-center justify-center shadow-md">
            <span className="font-display font-extrabold text-white text-[13px]">A</span>
          </div>
          <span className="font-display font-bold text-[16px] text-primary">AshesiConnect</span>
        </div>
        <div className="flex items-center gap-8 text-[13px] text-text-sub font-body">
          <a href="#how-it-works" className="hover:text-primary transition-colors font-medium">How it works</a>
          <a href="#mentors" className="hover:text-primary transition-colors font-medium">Our mentors</a>
          <a href="#for-alumni" className="hover:text-primary transition-colors font-medium">For alumni</a>
          <Link href="/login" className="hover:text-primary transition-colors font-medium">Log in</Link>
        </div>
        <p className="font-body text-[13px] text-text-muted">
          © {new Date().getFullYear()} Ashesi University Mentorship Network
        </p>
      </footer>

    </div>
  )
}