import { SVGProps } from 'react'

interface CheckIconProps extends SVGProps<SVGSVGElement> {
  checked?: boolean
}

export function CheckIcon({ checked = false, ...props }: CheckIconProps) {
  if (checked) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    )
  }

  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}
