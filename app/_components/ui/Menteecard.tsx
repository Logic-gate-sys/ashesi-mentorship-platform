import Link from "next/link"
import { Mentee } from "@/app/_types/types"

// Refined tag styles with subtle borders for a crisper look
const tagStyles: Record<string, { bg: string; text: string; border: string }> = {
  orange: { bg: 'bg-orange-300',   text: 'text-orange-700',  border: 'border-orange-200' },
  yellow: { bg: 'bg-yellow-500',   text: 'text-yellow-700',  border: 'border-yellow-200' },
  purple: { bg: 'bg-purple-500',   text: 'text-purple-700',  border: 'border-purple-200' },
  green:  { bg: 'bg-emerald-500',  text: 'text-emerald-700', border: 'border-emerald-200' },
  blue:   { bg: 'bg-blue-500',     text: 'text-blue-700',    border: 'border-blue-200' },
}

// Fallback style just in case a tag string doesn't match
const defaultTagStyle = { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-200' }

export default function MenteeCard({ m }: { m: Mentee }) {
  const style = tagStyles[m.tag] || defaultTagStyle

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      
      {/* Header / Cover Area */}
      <div className={`h-20 w-full bg-slate-100 relative ${style.bg}` }>
  
      </div>

      {/* Body */}
      <div className="flex flex-col px-5 pb-5 pt-0 flex-1">
        
        {/* Overlapping Avatar */}
        <div 
          className="relative -mt-8 mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white font-display text-xl font-bold text-white shadow-sm"
          style={{ backgroundColor: m.avatar }}
        >
          {m.initials}
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold leading-tight text-gray-900">
            {m.name}
          </h3>
          <p className="font-body text-sm text-gray-500 mt-0.5">
            {m.major}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mt-auto mb-5 rounded-lg bg-gray-50 p-3 border border-gray-100">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-body text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mentorship Progress
            </span>
            <span className="font-body text-xs font-semibold text-gray-700">
              {m.sessions} / {m.total}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-red-900 transition-all duration-500 ease-out"
              style={{ width: `${m.progress}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/alumni/mentees/${m.id}`}
          className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}