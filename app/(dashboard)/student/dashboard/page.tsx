import Link from 'next/link'
import { cookies } from 'next/headers'


interface Mentor {
  id:       string
  name:     string
  role:     string
  company:  string
  industry: 'orange' | 'yellow' | 'purple' | 'green' | 'blue'
  label:    string
  initials: string
  avatar:   string
  progress: number
  sessions: number
  total:    number
}

interface Session {
  id:       string
  title:    string
  subtitle: string
  mentor:   string
  initials: string
  avatar:   string
  duration: string
}

interface Request {
  id:      string
  mentor:  string
  initials:string
  avatar:  string
  goal:    string
  status:  'PENDING' | 'ACCEPTED' | 'DECLINED'
  date:    string
}

// ── Mock data (replace with real fetch) ───────────────────────

const activeMentors: Mentor[] = [
  {
    id:       '1',
    name:     'Ama Owusu',
    role:     'Product Manager',
    company:  'Stanbic Bank',
    industry: 'green',
    label:    'Finance',
    initials: 'AO',
    avatar:   '#0C5C3E',
    progress: 60,
    sessions: 12,
    total:    20,
  },
  {
    id:       '2',
    name:     'Kofi Asante',
    role:     'Software Engineer',
    company:  'Google',
    industry: 'yellow',
    label:    'Technology',
    initials: 'KA',
    avatar:   '#185FA5',
    progress: 35,
    sessions: 7,
    total:    20,
  },
  {
    id:       '3',
    name:     'Abena Boateng',
    role:     'Strategy Consultant',
    company:  'McKinsey',
    industry: 'purple',
    label:    'Consulting',
    initials: 'AB',
    avatar:   '#9747FF',
    progress: 80,
    sessions: 16,
    total:    20,
  },
]

const nextSessions: Session[] = [
  {
    id:       's1',
    title:    'CV and Portfolio Review',
    subtitle: 'Career planning with Ama',
    mentor:   'Ama Owusu',
    initials: 'AO',
    avatar:   '#0C5C3E',
    duration: '40 min',
  },
  {
    id:       's2',
    title:    'System Design Fundamentals',
    subtitle: 'Technical mentoring with Kofi',
    mentor:   'Kofi Asante',
    initials: 'KA',
    avatar:   '#185FA5',
    duration: '1h 08 min',
  },
  {
    id:       's3',
    title:    'Case Interview Prep',
    subtitle: 'Consulting track with Abena',
    mentor:   'Abena Boateng',
    initials: 'AB',
    avatar:   '#9747FF',
    duration: '26 min',
  },
  {
    id:       's4',
    title:    'Salary Negotiation',
    subtitle: 'Career planning with Ama',
    mentor:   'Ama Owusu',
    initials: 'AO',
    avatar:   '#0C5C3E',
    duration: '23 min',
  },
]

const pendingRequests: Request[] = [
  {
    id:       'r1',
    mentor:   'Nii Armah',
    initials: 'NA',
    avatar:   '#854F0B',
    goal:     'Guidance on transitioning into data engineering',
    status:   'PENDING',
    date:     '2 days ago',
  },
  {
    id:       'r2',
    mentor:   'Efua Darko',
    initials: 'ED',
    avatar:   '#9747FF',
    goal:     'Breaking into product management after CS',
    status:   'ACCEPTED',
    date:     '5 days ago',
  },
]

// ── Helpers ───────────────────────────────────────────────────

const industryStyles: Record<string, { bg: string; text: string }> = {
  orange: { bg: 'bg-brand/10',        text: 'text-brand'         },
  yellow: { bg: 'bg-tag-yellow/15',   text: 'text-[#7A5500]'     },
  purple: { bg: 'bg-tag-purple/10',   text: 'text-tag-purple'    },
  green:  { bg: 'bg-[#E8F5F0]',       text: 'text-[#0C5C3E]'     },
  blue:   { bg: 'bg-[#EDF3FB]',       text: 'text-[#1A4A8B]'     },
}

const statusStyles = {
  PENDING:  { bg: 'bg-tag-yellow/15', text: 'text-[#7A5500]',  dot: 'bg-tag-yellow'  },
  ACCEPTED: { bg: 'bg-[#E8F5F0]',     text: 'text-[#0C5C3E]', dot: 'bg-[#0C5C3E]'   },
  DECLINED: { bg: 'bg-red-50',        text: 'text-red-500',    dot: 'bg-red-400'      },
}

// ── Sub-components ────────────────────────────────────────────

function SectionHeader({
  title,
  href,
  linkLabel = 'View all',
}: {
  title:      string
  href:       string
  linkLabel?: string
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display font-bold text-[18px] text-text tracking-tight">
        {title}
      </h2>
      <Link
        href={href}
        className="font-body text-[13px] font-medium text-brand hover:opacity-80 transition-opacity"
      >
        {linkLabel}
      </Link>
    </div>
  )
}

function MentorCard({ m }: { m: Mentor }) {
  const style = industryStyles[m.industry]
  return (
    <div className="card overflow-hidden flex flex-col">

      {/* Header */}
      <div className="h-[100px] bg-sidebar flex items-center justify-center relative">
        <span className={`absolute top-3 left-3 tag ${style.bg} ${style.text} border-0`}>
          {m.label}
        </span>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg text-white border-[3px] border-white/10"
          style={{ background: m.avatar }}
        >
          {m.initials}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="font-display font-bold text-[15px] text-text tracking-tight leading-tight">
            {m.name}
          </p>
          <p className="font-body text-[12px] text-text-muted mt-0.5">
            {m.role} · {m.company}
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="font-body text-[11px] text-text-muted">Progress</span>
            <span className="font-body text-[11px] font-semibold text-text-sub">
              {m.sessions}/{m.total} sessions
            </span>
          </div>
          <div className="h-[5px] bg-page rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: `${m.progress}%` }}
            />
          </div>
        </div>

        <Link
          href={`/student/mentors/${m.id}`}
          className="btn btn-primary w-full h-[34px] text-[13px] mt-auto"
        >
          Continue
        </Link>
      </div>
    </div>
  )
}


export default async function StudentDashboardPage() {
  const cookieStore = await cookies()
  const token       = cookieStore.get('token')?.value ?? ''

  // Decode first name for greeting
  let firstName = 'there'
  try {
    const payload  = token.split('.')[1]
    const decoded  = JSON.parse(Buffer.from(payload, 'base64url').toString())
    firstName      = decoded.firstName ?? 'there'
  } catch { /* silent */ }

  return (
    <div className="px-8 py-7 max-w-[1200px] mx-auto">

      {/* ── Page header ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[26px] text-text tracking-tight">
            My mentors
          </h1>
          <p className="font-body text-[14px] text-text-muted mt-1">
            Welcome back, {firstName} 👋
          </p>
        </div>

        {/* Filter tabs — All / Finance / Technology / Consulting */}
        <div className="flex items-center gap-2 flex-wrap">
          {['All mentors', 'Finance', 'Technology', 'Consulting'].map((tab, i) => (
            <button
              key={tab}
              className={`
                h-[34px] px-4 rounded-full font-body text-[13px] font-medium
                border transition-colors duration-150
                ${i === 0
                  ? 'bg-brand text-white border-brand shadow-[0_2px_8px_rgba(255,107,43,0.28)]'
                  : 'bg-surface text-text-sub border-border hover:border-brand hover:text-brand'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Active mentor cards ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {activeMentors.map(m => (
          <MentorCard key={m.id} m={m} />
        ))}
      </div>

      {/* ── Bottom row ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

        {/* Next sessions table */}
        <div>
          <SectionHeader
            title="My next sessions"
            href="/student/sessions"
            linkLabel="View all sessions"
          />

          <div className="card overflow-hidden">
            {/* Table head */}
            <div className="grid grid-cols-[1fr_160px_80px] px-5 py-2.5 border-b border-border">
              <span className="font-body text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
                Session
              </span>
              <span className="font-body text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
                Mentor
              </span>
              <span className="font-body text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] text-right">
                Duration
              </span>
            </div>

            {/* Rows */}
            {nextSessions.map((s, i) => (
              <Link
                key={s.id}
                href={`/student/sessions/${s.id}`}
                className={`
                  grid grid-cols-[1fr_160px_80px] items-center px-5 py-3.5
                  hover:bg-page transition-colors
                  ${i < nextSessions.length - 1 ? 'border-b border-border' : ''}
                `}
              >
                {/* Title + subtitle */}
                <div>
                  <p className="font-body text-[13px] font-medium text-text leading-tight">
                    {s.title}
                  </p>
                  <p className="font-body text-[11px] text-text-muted mt-0.5">
                    {s.subtitle}
                  </p>
                </div>

                {/* Mentor */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-[10px] text-white shrink-0"
                    style={{ background: s.avatar }}
                  >
                    {s.initials}
                  </div>
                  <span className="font-body text-[12px] text-text-sub truncate">
                    {s.mentor}
                  </span>
                </div>

                {/* Duration */}
                <span className="font-body text-[12px] text-text-muted text-right">
                  {s.duration}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Pending requests + suggestion */}
        <div className="flex flex-col gap-5">

          {/* Requests */}
          <div>
            <SectionHeader
              title="My requests"
              href="/student/requests"
            />

            <div className="flex flex-col gap-3">
              {pendingRequests.map(r => {
                const s = statusStyles[r.status]
                return (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[11px] text-white shrink-0 mt-0.5"
                        style={{ background: r.avatar }}
                      >
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-body text-[13px] font-semibold text-text">
                            {r.mentor}
                          </p>
                          <span className={`inline-flex items-center gap-1.5 h-5 px-2 rounded-full text-[10px] font-semibold font-body ${s.bg} ${s.text}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <p className="font-body text-[12px] text-text-muted mt-1 leading-snug truncate">
                          {r.goal}
                        </p>
                        <p className="font-body text-[11px] text-text-muted mt-1">
                          {r.date}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Suggested mentor card — matches Learnify "new course" card */}
          <div className="rounded-[14px] bg-sidebar p-5 flex flex-col gap-4">
            <p className="font-body text-[11px] font-semibold text-white/40 uppercase tracking-[0.08em]">
              Mentor matching your interests
            </p>

            <div>
              <span className="tag bg-tag-yellow/15 text-[#7A5500] border-0 mb-3 inline-flex">
                Technology
              </span>
              <p className="font-display font-bold text-[16px] text-white tracking-tight leading-snug">
                Kwesi Annan · Data Engineer at Microsoft
              </p>
              <p className="font-body text-[12px] text-white/45 mt-1">
                Class of 2020 · MIS · Specialises in cloud and data pipelines
              </p>
            </div>

            {/* Stacked avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['#0C5C3E', '#185FA5', '#9747FF'].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-sidebar flex items-center justify-center font-display font-bold text-[10px] text-white"
                    style={{ background: c }}
                  >
                    {['AO', 'KA', 'AB'][i]}
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full border-2 border-sidebar bg-white/10 flex items-center justify-center font-body text-[10px] text-white/60">
                  +10
                </div>
              </div>
              <span className="font-body text-[12px] text-white/45">
                already connected
              </span>
            </div>

            <Link
              href="/student/mentors"
              className="btn btn-primary w-full h-[38px] text-[13px]"
            >
              More details
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}