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

  return (
    <div className="card p-7 hover:shadow-md transition-shadow">
      <h3 className="font-display font-bold text-[17px] text-text tracking-tight mb-3 leading-tight">
        {title}
      </h3>
      
      <p className="font-body text-[14px] text-text-sub leading-relaxed">
        {body}
      </p>
    </div>
  )
}
