import { CheckIcon } from "../icons/CheckIcon"

interface PasswordRequirements {
  minLength: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
  specialChar: boolean
}

export function PasswordStrengthIndicator({ password, requirements }: { password: string; requirements: PasswordRequirements }) {
  const met = Object.values(requirements).filter(Boolean).length
  const total = Object.values(requirements).length
  const strength = total === 0 ? 0 : Math.round((met / total) * 100)
  
  let strengthColor = 'var(--color-danger)'
  let strengthText = 'Weak'
  
  if (strength >= 80) {
    strengthColor = 'var(--color-primary-light)'
    strengthText = 'Strong'
  } else if (strength >= 60) {
    strengthColor = 'var(--color-warning)'
    strengthText = 'Fair'
  }

  return (
    <div className="space-y-3 p-4 bg-surface rounded-lg border border-border">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ backgroundColor: strengthColor, width: `${strength}%` }}
          />
        </div>
        <span className="text-[12px] font-semibold text-text-muted whitespace-nowrap">
          {strengthText}
        </span>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[12px]">
          <CheckIcon checked={requirements.minLength} />
          <span className={requirements.minLength ? 'text-text-primary' : 'text-text-muted'}>
            At least 8 characters
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <CheckIcon checked={requirements.uppercase} />
          <span className={requirements.uppercase ? 'text-text-primary' : 'text-text-muted'}>
            One uppercase letter (A-Z)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <CheckIcon checked={requirements.lowercase} />
          <span className={requirements.lowercase ? 'text-text-primary' : 'text-text-muted'}>
            One lowercase letter (a-z)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <CheckIcon checked={requirements.number} />
          <span className={requirements.number ? 'text-text-primary' : 'text-text-muted'}>
            One number (0-9)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <CheckIcon checked={requirements.specialChar} />
          <span className={requirements.specialChar ? 'text-text-primary' : 'text-text-muted'}>
            One special character (!@#$%^&*-_=+)
          </span>
        </div>
      </div>
    </div>
  )
}

