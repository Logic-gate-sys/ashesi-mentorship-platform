'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/app/_components/ui/Input'
import { Button } from '@/app/_components/ui/Button'

// ── Schema ────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear()

const studentRegisterSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(64).trim(),
  lastName:  z.string().min(2, 'Last name must be at least 2 characters').max(64).trim(),
  email:     z
    .string()
    .email('Invalid email address')
    .regex(/@ashesi\.edu\.gh$/i, 'Must be an @ashesi.edu.gh email'),
  yearGroup: z.coerce
    .number({ invalid_type_error: 'Enter a valid year' })
    .int()
    .min(2002, 'Year group cannot be before 2002')
    .max(CURRENT_YEAR + 4, 'Year group is too far ahead'),
  major:    z.string().min(2, 'Select your major').max(100),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path:    ['confirm'],
})

type StudentRegisterInput = z.infer<typeof studentRegisterSchema>

const MAJORS = [
  'Computer Science',
  'Management Information Systems',
  'Business Administration',
  'Electrical and Electronic Engineering',
  'Mechanical Engineering',
  'Mechatronics Engineering'
]


function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

// ── Step indicator ────────────────────────────────────────────

function Steps({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2] as const).map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center
            font-body text-[11px] font-bold transition-colors
            ${current >= step
              ? 'bg-brand text-white'
              : 'bg-border text-text-muted'}
          `}>
            {step}
          </div>
          <span className={`font-body text-[12px] font-medium hidden sm:block ${current >= step ? 'text-text-sub' : 'text-text-muted'}`}>
            {step === 1 ? 'Account' : 'Details'}
          </span>
          {i < 1 && (
            <div className={`w-8 h-px mx-1 ${current > step ? 'bg-brand' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────

export default function StudentRegisterPage() {
  const router = useRouter()
  const [step,         setStep]         = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [serverError,  setServerError]  = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegisterInput>({
    resolver: zodResolver(studentRegisterSchema),
    mode:     'onTouched',
  })

  // Validate step 1 fields before advancing
  const handleNext = async () => {
    const valid = await trigger(['firstName', 'lastName', 'email'])
    if (valid) setStep(2)
  }

  const onSubmit = async (data: StudentRegisterInput) => {
    setServerError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...data, role: 'STUDENT' }),
      })

      const json = await res.json()

      if (!res.ok) {
        setServerError(json.message ?? 'Something went wrong. Please try again.')
        return
      }

      router.push('/student/dashboard')
    } catch {
      setServerError('Network error. Please check your connection.')
    }
  }

  return (
    <div className="w-full max-w-[400px]">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-[28px] text-text tracking-tight leading-tight">
          Create your account
        </h1>
        <p className="font-body text-[14px] text-text-muted mt-1.5">
          Find an Ashesi alumni mentor today
        </p>
      </div>

      {/* Step indicator */}
      <Steps current={step} />

      {/* Server error */}
      {serverError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px] flex items-start gap-2.5">
          <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="font-body text-[13px] text-red-600">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ── STEP 1 — identity ───────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="firstName"
                label="First name"
                placeholder="Kwame"
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                id="lastName"
                label="Last name"
                placeholder="Mensah"
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              id="email"
              type="email"
              label="Ashesi email"
              placeholder="you@ashesi.edu.gh"
              autoComplete="email"
              hint="Must be your @ashesi.edu.gh address"
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="button"
              variant="primary"
              size="lg"
              full
              onClick={handleNext}
            >
              Continue →
            </Button>
          </div>
        )}

        {/* ── STEP 2 — details + password ─────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">

            {/* Major */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="major"
                className="font-body text-[13px] font-semibold text-text"
              >
                Major
              </label>
              <select
                id="major"
                className={`
                  w-full h-[44px] bg-surface border rounded-[8px]
                  font-body text-[14px] text-text px-4
                  outline-none transition-all duration-150 appearance-none
                  ${errors.major
                    ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                    : 'border-border hover:border-[#c0bfbf] focus:border-brand focus:shadow-[0_0_0_3px_rgba(255,107,43,0.15)]'
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
                <p className="font-body text-[12px] text-red-500 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errors.major.message}
                </p>
              )}
            </div>

            <Input
              id="yearGroup"
              type="number"
              label="Year group"
              placeholder={String(CURRENT_YEAR)}
              hint="The year you started at Ashesi"
              error={errors.yearGroup?.message}
              {...register('yearGroup')}
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              right={
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="hover:text-text transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              }
              {...register('password')}
            />

            <Input
              id="confirm"
              type={showConfirm ? 'text' : 'password'}
              label="Confirm password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirm?.message}
              right={
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  className="hover:text-text transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              }
              {...register('confirm')}
            />

            {/* Terms */}
            <p className="font-body text-[12px] text-text-muted leading-relaxed">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-brand hover:opacity-80 transition-opacity font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand hover:opacity-80 transition-opacity font-medium">
                Privacy Policy
              </Link>.
            </p>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                full
                loading={isSubmitting}
              >
                Create account
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="lg"
                full
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Sign in link */}
      <p className="font-body text-center text-[13px] text-text-muted mt-8">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-brand hover:opacity-80 transition-opacity"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}