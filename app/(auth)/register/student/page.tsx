'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Button } from '@/app/_components/ui/_index'
import { useAuth } from '@/app/_lib/context/auth-context'
import { studentRegisterSchema, validateStrongPassword } from '@/app/_schemas/auth.schema'
import { EyeIcon, CheckIcon, ErrorIcon } from '@/app/_components/ui/icons'

type StudentRegisterInput = z.infer<typeof studentRegisterSchema>

const MAJORS = [
  'Computer Science',
  'Management Information Systems',
  'Business Administration',
  'Electrical and Electronic Engineering',
  'Mechanical Engineering',
  'Mechatronics Engineering'
]

// ── Password Strength Indicator ────────────────────────────────────

interface PasswordRequirements {
  minLength: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
  specialChar: boolean
}

function PasswordStrengthIndicator({ password, requirements }: { password: string; requirements: PasswordRequirements }) {
  const met = Object.values(requirements).filter(Boolean).length
  const total = Object.values(requirements).length
  const strength = total === 0 ? 0 : Math.round((met / total) * 100)
  
  let strengthColor = 'var(--color-danger)'
  let strengthText = 'Weak'
  
  if (strength >= 80) {
    strengthColor = 'var(--color-success)'
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

// ── Step indicator ────────────────────────────────────────────

function Steps({ current, canProceed }: { current: 1 | 2; canProceed: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2] as const).map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center
            font-body text-[11px] font-bold transition-colors
            ${current >= step
              ? 'bg-primary text-white'
              : current === 1 && !canProceed
              ? 'bg-border text-text-muted cursor-not-allowed'
              : 'bg-border text-text-muted'}
          `}>
            {step}
          </div>
          <span className={`font-body text-[12px] font-medium hidden sm:block ${current >= step ? 'text-primary' : 'text-text-muted'}`}>
            {step === 1 ? 'Account' : 'Details'}
          </span>
          {i < 1 && (
            <div className={`w-8 h-px mx-1 ${current > step ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────

export default function StudentRegisterPage() {
  const { registerStudent, isLoading } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isDirty, touchedFields },
  } = useForm({
    resolver: zodResolver(studentRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
      year: 0,
      major: '',
    },
  })

  // Watch password field for real-time strength indicator
  const password = watch('password')
  const passwordStrength = useMemo(() => {
    if (!password) return { isValid: false, requirements: { minLength: false, uppercase: false, lowercase: false, number: false, specialChar: false } }
    return validateStrongPassword(password)
  }, [password])

  // Check if Step 1 is valid
  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const email = watch('email')
  
  const isStep1Valid = useMemo(() => {
    return (
      firstName?.trim().length > 0 &&
      lastName?.trim().length > 0 &&
      email?.includes('@ashesi.edu.gh') &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.email
    )
  }, [firstName, lastName, email, errors])

  // Validate current step before advancing
  const handleNext = async () => {
    const isValid = await trigger(['firstName', 'lastName', 'email'])
    if (isValid && isStep1Valid) {
      setStep(2)
    }
  }

  const onSubmit = async (data: StudentRegisterInput) => {
    setServerError(null)
    try {
      await registerStudent({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirm: data.confirm,
        year: data.year,
        major: data.major,
      })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Registration failed')
    }
  }

  return (
    <div className="w-full max-w-125">

      {/* ── PAGE HEADING ────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-[32px] text-primary tracking-tight leading-tight mb-2">
          Create your account
        </h1>
        <p className="font-body text-[15px] text-text-secondary">
          Join the Ashesi alumni mentorship network today
        </p>
      </div>

      {/* ── STEP INDICATOR ────────────────────────────────────── */}
      <Steps current={step} canProceed={isStep1Valid} />

      {/* ── ERROR MESSAGE ─────────────────────────────────────── */}
      {serverError && (
        <div className="mb-6 px-4 py-3 bg-[#FEE2E2] border border-[#FECACA] rounded-[10px] flex items-start gap-3">
          <div className="shrink-0 mt-0.5 w-5 h-5 text-danger">
            <ErrorIcon />
          </div>
          <p className="font-body text-[14px] text-danger font-medium">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ── STEP 1 — ACCOUNT INFORMATION ────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="label">First name</label>
                <Input
                  id="firstName"
                  placeholder="Kwame"
                  autoComplete="given-name"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="label">Last name</label>
                <Input
                  id="lastName"
                  placeholder="Mensah"
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">Ashesi email address</label>
              <Input
                id="email"
                type="email"
                placeholder="you@ashesi.edu.gh"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <p className="font-body text-[12px] text-text-tertiary mt-2">
                ✓ Must end with @ashesi.edu.gh
              </p>
            </div>

            {/* Step 1 validation status */}
            {isDirty && (
              <div className={`text-[13px] p-4 rounded-[10px] font-medium flex items-center gap-2 ${isStep1Valid 
                ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]' 
                : 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]'}`}>
                {isStep1Valid ? '✓ Ready to continue' : '→ Complete all fields'}
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={handleNext}
              disabled={!isStep1Valid}
            >
              Continue to details →
            </button>
          </div>
        )}

        {/* ── STEP 2 — ACADEMIC & SECURITY ────────────────– */}
        {step === 2 && (
          <div className="flex flex-col gap-6">

            {/* Major Selection */}
            <div>
              <label htmlFor="major" className="label">Major / Program</label>
              <select
                id="major"
                className={`
                  w-full h-[44px] bg-white border rounded-[10px]
                  font-body text-[15px] text-text-primary px-4
                  outline-none transition-all duration-150
                  ${errors.major
                    ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                    : 'border-border hover:border-border-strong focus:border-primary focus:shadow-[0_0_0_3px_rgba(127,29,29,0.10)]'
                  }
                `}
                {...register('major')}
              >
                <option value="">Select your major</option>
                {MAJORS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {errors.major && (
                <p className="font-body text-[12px] text-danger mt-2 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errors.major.message}
                </p>
              )}
            </div>

            {/* Year Group */}
            <div>
              <label htmlFor="year" className="label">Current year</label>
              <Input
                id="year"
                type="number"
                placeholder="1"
                error={errors.year?.message}
                {...register('year', { valueAsNumber: true })}
              />
              <p className="font-body text-[12px] text-text-tertiary mt-2">
                Enter 1, 2, 3, or 4
              </p>
            </div>

            {/* Password Section with Strength Indicator */}
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="label">Password</label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="text-text-tertiary hover:text-text-primary transition-colors"
                      tabIndex={-1}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  }
                  {...register('password')}
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <PasswordStrengthIndicator 
                  password={password}
                  requirements={passwordStrength.requirements}
                />
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="label">Confirm password</label>
              <Input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                error={errors.confirm?.message}
                right={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(p => !p)}
                    className="text-text-tertiary hover:text-text-primary transition-colors"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                }
                {...register('confirm')}
              />
            </div>

            {/* Terms & Conditions */}
            <p className="font-body text-[13px] text-text-secondary leading-relaxed bg-primary-50 p-4 rounded-[10px]">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="font-semibold text-primary hover:text-accent transition-colors duration-150">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-semibold text-primary hover:text-accent transition-colors duration-150">
                Privacy Policy
              </Link>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!passwordStrength.isValid || isLoading}
              >
                {isLoading ?  'Creating account...' : 'Create account'}
              </button>

              <button
                type="button"
                className="btn btn-ghost w-full"
                onClick={() => {
                  setStep(1)
                  setServerError(null)
                }}
                disabled={isLoading}
              >
                ← Back to account info
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Sign in link */}
      <p className="font-body text-center text-[13px] text-text-secondary mt-8">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-accent transition-colors duration-150"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}