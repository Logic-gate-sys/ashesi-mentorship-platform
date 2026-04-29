import Link from 'next/link'

export default  function SectionHeader({
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
        className="font-body text-[13px] font-medium text-primary hover:opacity-80 transition-opacity"
      >
        {linkLabel}
      </Link>
    </div>
  )
}