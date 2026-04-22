interface StatCardProps {
  value: string
  label: string
  color: string
}

export function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div className={`card p-6 bg-gradient-to-br ${color} border border-white/10 shadow-lg`}>
      <div className="font-display font-bold text-[36px] text-white tracking-tight leading-none">{value}</div>
      <div className="font-body text-[13px] text-white/70 mt-2 leading-snug font-medium">{label}</div>
    </div>
  )
}
