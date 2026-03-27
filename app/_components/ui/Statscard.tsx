export default  function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub:   string
}) {
  return (
    <div className="card p-5 flex flex-col gap-2">
      <p className="font-body text-[12px] font-semibold text-text-muted uppercase tracking-[0.07em]">
        {label}
      </p>
      <p className="font-display font-bold text-[28px] text-text tracking-tight leading-none">
        {value}
      </p>
      <p className="font-body text-[12px] text-text-muted">{sub}</p>
    </div>
  )
}