import Image from 'next/image'
import Link from 'next/link'

interface MentorCardProps {
  name: string
  role: string
  company: string
  year: string
  industry: string
  avatar?: string
  tagClass?: string
  initials: string
  avatarBg: string
  sessions: number
  skills: string[]
}

export function MentorCard({
  name,
  role,
  company,
  year,
  industry,
  avatar,
  initials,
  avatarBg,
  sessions,
  skills,
}: MentorCardProps) {
  const firstName = name.split(' ')[0]
  const topSkills = skills.slice(0, 2)
  
  return (
    <div className="card h-full flex flex-col hover:shadow-xl transition-all duration-300 group border border-border hover:border-accent/30 overflow-hidden">
      {/* Minimal header bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary-light to-accent" />
      
      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Avatar + Header */}
        <div className="flex items-start gap-3 mb-5">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover shrink-0 shadow-md border-2 border-border"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full ${avatarBg} flex items-center justify-center font-display font-bold text-[18px] text-white shrink-0 shadow-md group-hover:shadow-lg transition-shadow`}>
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-[16px] text-text leading-tight">{name}</h3>
            <p className="font-body text-[13px] text-text-sub font-medium mt-0.5 line-clamp-2 leading-snug">{role}</p>
          </div>
        </div>

        {/* Company & Year - Horizontal */}
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border text-[12px]">
          <span className="font-medium text-text-sub">{company}</span>
          <span className="text-text-muted">•</span>
          <span className="font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded">'{year.slice(-2)}</span>
        </div>

        {/* Skills - Top 2 inline */}
        <div className="mb-5 flex flex-wrap gap-2">
          {topSkills.map(s => (
            <span
              key={s}
              className="text-[12px] font-semibold text-primary-light bg-primary/12 px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Session metric */}
        <div className="mt-auto pt-4 border-t border-border/50">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[20px] font-bold text-primary">{sessions}</span>
            <span className="font-body text-[11px] text-text-muted font-semibold uppercase tracking-wide">sessions</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 pt-3">
        <Link
          href="/register/student"
          className="w-full h-[38px] flex items-center justify-center text-[13px] font-semibold text-white bg-primary hover:bg-primary-dark transition-all rounded-md group-hover:shadow-md"
        >
          Connect
        </Link>
      </div>
    </div>
  )
}
