interface FeatureCardProps {
  tag: string
  tagClass: string
  title: string
  body: string
  stat: string
}

export function FeatureCard({ tag, tagClass, title, body, stat }: FeatureCardProps) {
  return (
    <div className="card p-8 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-300 border-2 border-border hover:border-primary/20">
      <div className="flex items-start justify-between">
        <span className={`tag ${tagClass} text-[12px] font-semibold px-3 py-1.5`}>{tag}</span>
        <span className="font-body text-[12px] font-bold text-primary bg-primary/8 border border-primary/20 rounded-full px-3.5 py-1.5">
          {stat}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-display font-bold text-[20px] text-text tracking-tight mb-3 leading-tight">
          {title}
        </h3>
        <p className="font-body text-[15px] text-text-sub leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  )
}
