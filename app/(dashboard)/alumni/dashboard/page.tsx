import Link from 'next/link'
import { cookies } from 'next/headers'
import { StatCard,MenteeCard,SectionHeader  } from '@/app/_components/ui/_index';
import { incomingRequests, upcomingSessions, activeMentees } from '@/app/_types/dummy_data';

const stats = [
  { label: 'Active mentees',    value: '4',   sub: '+1 this month'     },
  { label: 'Sessions held',     value: '24',  sub: '3 this week'       },
  { label: 'Pending requests',  value: '3',   sub: 'Needs your review' },
  { label: 'Avg. rating',       value: '4.9★', sub: 'From 18 reviews'  },
]



const statusStyles = {
  PENDING:  { bg: 'bg-tag-yellow/15', text: 'text-[#7A5500]', dot: 'bg-tag-yellow' },
  ACCEPTED: { bg: 'bg-[#E8F5F0]',     text: 'text-[#0C5C3E]', dot: 'bg-[#0C5C3E]' },
  DECLINED: { bg: 'bg-red-50',        text: 'text-red-500',    dot: 'bg-red-400'   },
}



export default async function AlumniDashboardPage() {
  const cookieStore = await cookies()
  const token       = cookieStore.get('token')?.value ?? ''

  let firstName = 'there'
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
    firstName     = decoded.firstName ?? 'there'
  } catch { /* silent */ }

  return (
    <div className="px-8 py-7 max-w-300 mx-auto">

      {/* ── Page header ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[26px] text-text tracking-tight">
            My mentees
          </h1>
          <p className="font-body text-[14px] text-text-muted mt-1">
            Welcome back, {firstName} 👋
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {['All mentees', 'Technology', 'Finance', 'Consulting'].map((tab, i) => (
            <button
              key={tab}
              className={`
                h-8.5 px-4 rounded-full font-body text-[13px] font-medium
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

      {/* ── Stat cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Active mentee cards ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {activeMentees.map(m => (
          <MenteeCard key={m.id} m={m} />
        ))}
      </div>

      {/* ── Bottom row ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

        {/* Upcoming sessions table */}
        <div>
          <SectionHeader
            title="Upcoming sessions"
            href="/alumni/sessions"
            linkLabel="View all sessions"
          />

          <div className="card overflow-hidden">
            {/* Table head */}
            <div className="grid grid-cols-[1fr_160px_100px] px-5 py-2.5 border-b border-border">
              {['Session', 'Student', 'Duration'].map(h => (
                <span
                  key={h}
                  className={`font-body text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] ${h === 'Duration' ? 'text-right' : ''}`}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {upcomingSessions.map((s, i) => (
              <Link
                key={s.id}
                href={`/alumni/sessions/${s.id}`}
                className={`
                  grid grid-cols-[1fr_160px_100px] items-center px-5 py-3.5
                  hover:bg-page transition-colors
                  ${i < upcomingSessions.length - 1 ? 'border-b border-border' : ''}
                `}
              >
                <div>
                  <p className="font-body text-[13px] font-medium text-text leading-tight">
                    {s.title}
                  </p>
                  <p className="font-body text-[11px] text-text-muted mt-0.5">
                    {s.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-[10px] text-white shrink-0"
                    style={{ background: s.avatar }}
                  >
                    {s.initials}
                  </div>
                  <span className="font-body text-[12px] text-text-sub truncate">
                    {s.student}
                  </span>
                </div>

                <span className="font-body text-[12px] text-text-muted text-right">
                  {s.duration}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Incoming requests panel */}
        <div>
          <SectionHeader
            title="Incoming requests"
            href="/alumni/requests"
          />

          <div className="flex flex-col gap-3">
            {incomingRequests.map((r) => {
              const s = statusStyles[r.status]
              return (
                <div key={r.id} className="card p-4 flex flex-col gap-3">

                  {/* Student info */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[11px] text-white shrink-0"
                        style={{ background: r.avatar }}
                      >
                        {r.initials}
                      </div>
                      <div>
                        <p className="font-body text-[13px] font-semibold text-text leading-tight">
                          {r.student}
                        </p>
                        <p className="font-body text-[11px] text-text-muted">
                          {r.major}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 h-5 px-2 rounded-full text-[10px] font-semibold font-body shrink-0 ${s.bg} ${s.text}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                    </span>
                  </div>

                  {/* Goal */}
                  <p className="font-body text-[12px] text-text-muted leading-relaxed line-clamp-2">
                    {r.goal}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/alumni/requests/${r.id}`}
                      className="btn btn-primary h-[30px] px-4 text-[12px] flex-1"
                    >
                      Accept
                    </Link>
                    <Link
                      href={`/alumni/requests/${r.id}`}
                      className="btn btn-ghost h-[30px] px-4 text-[12px] flex-1"
                    >
                      Decline
                    </Link>
                  </div>

                  <p className="font-body text-[11px] text-text-muted">{r.date}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}