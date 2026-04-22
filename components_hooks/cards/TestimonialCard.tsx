interface TestimonialCardProps {
  quote: string
  name: string
  detail: string
  initials: string
  color: string
}

export function TestimonialCard({ quote, name, detail, initials, color }: TestimonialCardProps) {
  return (
    <div className="card p-7 flex flex-col gap-5 hover:shadow-lg transition-shadow border border-border hover:border-primary/20 group">
      {/* Quote mark */}
      <div className="font-display text-[52px] text-primary/20 leading-none -mb-3 group-hover:text-primary-light/30 transition-colors">
        "
      </div>
      
      <p className="font-body text-[15px] text-text-sub leading-relaxed flex-1">
        {quote}
      </p>
      
      <div className="flex items-center gap-3 pt-5 border-t border-border">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center font-display font-bold text-[14px] text-white shrink-0`}>
          {initials}
        </div>
        <div>
          <p className="font-body text-[14px] font-semibold text-text">{name}</p>
          <p className="font-body text-[12px] text-text-muted">{detail}</p>
        </div>
      </div>
    </div>
  )
}
