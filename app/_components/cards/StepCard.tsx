export interface StepCardProps {
  number: string
  title: string
  body: string
  role: 'student' | 'alumni' | 'both'
}

export function StepCard({ number, title, body, role }: StepCardProps) {
  const badgeStyles = {
    student: 'bg-primary-light/10 text-primary-light border-primary-light/30',
    alumni: 'bg-tag-purple/10 text-tag-purple border-tag-purple/30',
    both: 'bg-primary/10 text-primary border-primary/30',
  }

  const rolePillStyles = {
    student: 'bg-primary-light/10 text-primary-light',
    alumni: 'bg-tag-purple/10 text-tag-purple',
    both: 'bg-primary/10 text-primary',
  }

  return (
    <div className="card p-7 relative hover:shadow-md transition-shadow">
      {/* Step number badge */}
      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center font-display font-extrabold text-[16px] mb-6 border-2 ${badgeStyles[role]}`}>
        {number}
      </div>
      
      <h3 className="font-display font-bold text-[17px] text-text tracking-tight mb-3 leading-tight">
        {title}
      </h3>
      
      <p className="font-body text-[14px] text-text-sub leading-relaxed">
        {body}
      </p>
      
      {/* Role pill */}
      <div className={`absolute top-6 right-6 h-6 px-3 rounded-full text-[11px] font-bold font-body flex items-center uppercase tracking-wider ${rolePillStyles[role]}`}>
        {role}
      </div>
    </div>
  )
}
