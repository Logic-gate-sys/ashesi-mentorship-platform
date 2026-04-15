'use client'

import { useState, useMemo, useEffect } from 'react'
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

const SUGGESTED_INTERESTS = [
  'Software Development',
  'Data Science',
  'Machine Learning',
  'Product Management',
  'Fintech',
  'Mobile Development',
  'Web Development',
  'Cloud Computing',
  'Cybersecurity',
  'Artificial Intelligence',
  'Blockchain',
  'Consulting',
  'Entrepreneurship',
  'Leadership',
  'Finance',
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

// ── Step Indicator ────────────────────────────────────────────────────

function StepIndicator({ current, totalSteps }: { current: number; totalSteps: number }) {
  const steps = ['Personal', 'Profile', 'Security', 'Interests', 'Connect', 'Legal']
  
  return (
    <div className="mb-10">
      {/* Step progress bar */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isActive = stepNum === current
          const isCompleted = stepNum < current
          
          return (
            <div key={stepNum} className="flex items-center flex-1">
              {/* Step circle */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                font-body text-[12px] font-bold transition-all duration-200
                shrink-0
                ${isActive 
                  ? 'bg-brand text-white shadow-lg scale-110' 
                  : isCompleted 
                  ? 'bg-red-800 text-white' 
                  : 'bg-border text-text-muted'
                }
              `}>
                {isCompleted ? '✓' : stepNum}
              </div>
              
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 transition-colors duration-200 ${isCompleted ? 'bg-red-950' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
      </div>
      
      {/* Step labels */}
      <div className="flex justify-between text-[12px] font-medium text-text-muted">
        {steps.map((label, i) => (
          <span 
            key={i} 
            className={current === i + 1 ? 'text-brand font-semibold' : ''}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────

export default function StudentRegisterPage() {
  const { registerStudent, isLoading } = useAuth()
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [termsAutoChecked, setTermsAutoChecked] = useState(false)
  const [privacyAutoChecked, setPrivacyAutoChecked] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(studentRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      major: '',
      year: 1,
      password: '',
      confirm: '',
      interests: [],
      bio: '',
      linkedin: '',
    },
  })

  // Watch all fields
  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const email = watch('email')
  const major = watch('major')
  const year = watch('year')
  const password = watch('password')
  const confirm = watch('confirm')
  const interests = watch('interests')
  const bio = watch('bio')
  const linkedin = watch('linkedin')

  // Auto-check legal docs on step 6 if already scrolled to bottom
  useEffect(() => {
    if (step === 6) {
      const termsScrolled = typeof window !== 'undefined' && localStorage.getItem('terms_scrolled_to_bottom')
      const privacyScrolled = typeof window !== 'undefined' && localStorage.getItem('privacy_scrolled_to_bottom')
      
      if (termsScrolled) {
        setAcceptedTerms(true)
        setTermsAutoChecked(true)
      }
      if (privacyScrolled) {
        setAcceptedPrivacy(true)
        setPrivacyAutoChecked(true)
      }
    }
  }, [step])

  // Password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { isValid: false, requirements: { minLength: false, uppercase: false, lowercase: false, number: false, specialChar: false } }
    return validateStrongPassword(password)
  }, [password])

  // Step 1 validation
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

  // Step 2 validation
  const isStep2Valid = useMemo(() => {
    return major?.length > 0 && year && !errors.major && !errors.year
  }, [major, year, errors])

  // Step 3 validation
  const isStep3Valid = passwordStrength.isValid && password === confirm && !errors.password && !errors.confirm

  // Step 4 validation
  const isStep4Valid = interests && interests.length > 0 && !errors.interests

  // Step 5 validation (bio and linkedin - both optional)
  const isStep5Valid = true

  // Step 6 validation (terms and privacy)
  const isStep6Valid = acceptedTerms && acceptedPrivacy

  // Add interest
  const addInterest = (interest: string) => {
    const trimmed = interest.trim()
    if (trimmed && !interests.includes(trimmed) && interests.length < 10) {
      setValue('interests', [...interests, trimmed])
      setInterestInput('')
    }
  }

  // Remove interest
  const removeInterest = (index: number) => {
    setValue('interests', interests.filter((_, i) => i !== index))
  }

  // Handle next step
  const handleNext = async () => {
    let isValid = false
    
    if (step === 1) {
      isValid = await trigger(['firstName', 'lastName', 'email'])
      if (isValid && isStep1Valid) setStep(2)
    } else if (step === 2) {
      isValid = await trigger(['major', 'year'])
      if (isValid && isStep2Valid) setStep(3)
    } else if (step === 3) {
      isValid = await trigger(['password', 'confirm'])
      if (isValid && isStep3Valid) setStep(4)
    } else if (step === 4) {
      isValid = await trigger(['interests'])
      if (isValid && isStep4Valid) setStep(5)
    } else if (step === 5) {
      // Step 5 is optional (bio and linkedin), bio and linkedin are optional fields
      setStep(6)
    }
  }

  // Handle back
  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as any)
    setServerError('')
  }

  // Submit
  const onSubmit = async (data: StudentRegisterInput) => {
    setServerError('')
    
    // Validate all steps
    const allValid = await trigger()
    if (!allValid) {
      setServerError('Please complete all steps')
      return
    }

    try {
      await registerStudent({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirm: data.confirm,
        year: data.year,
        major: data.major,
        interests: data.interests,
        bio: data.bio || null,
        linkedin: data.linkedin || null,
      })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Registration failed')
    }
  }

  return (
    <div className="w-full max-w-3xl">

      {/* ── PAGE HEADING ────────────────────────────────────────── */}
      <div className="mb-10">
        <h1 className="font-display font-bold text-[36px] text-primary tracking-tight leading-tight mb-3">
          Create your account
        </h1>
        <p className="font-body text-[16px] text-text-sub">
          Join the Ashesi mentorship network and find the guidance you need
        </p>
      </div>

      {/* ── STEP INDICATOR ────────────────────────────────────── */}
      <StepIndicator current={step} totalSteps={6} />

      {/* ── ERROR MESSAGE ─────────────────────────────────────── */}
      {serverError && (
        <div className="mb-8 px-4 py-3 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] flex items-start gap-3">
          <div className="shrink-0 mt-0.5 w-5 h-5 text-danger">
            <ErrorIcon />
          </div>
          <p className="font-body text-[14px] text-danger font-medium">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ── STEP 1 — PERSONAL INFO ────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display font-bold text-[24px] text-text">Personal Information</h2>
              <p className="font-body text-[14px] text-text-sub">Start with your basic details</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="label">First name *</label>
                <Input
                  id="firstName"
                  placeholder="Kwame"
                  autoComplete="given-name"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="label">Last name *</label>
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
              <label htmlFor="email" className="label">Ashesi email address *</label>
              <Input
                id="email"
                type="email"
                placeholder="you@ashesi.edu.gh"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <p className="font-body text-[12px] text-text-muted mt-2">
                Must be your official @ashesi.edu.gh account
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={handleNext}
                disabled={!isStep1Valid}
              >
                Continue to profile
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 — PROFILE ────────────────────────────────– */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display font-bold text-[24px] text-text">Academic Profile</h2>
              <p className="font-body text-[14px] text-text-sub">Tell us about your academic background</p>
            </div>

            {/* Major Selection */}
            <div>
              <label htmlFor="major" className="label">Major / Program *</label>
              <select
                id="major"
                className={`
                  w-full h-[44px] bg-white border rounded-[10px]
                  font-body text-[15px] text-text px-4
                  outline-none transition-all duration-150
                  ${errors.major
                    ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                    : 'border-border hover:border-border-strong focus:border-brand focus:shadow-[0_0_0_3px_rgba(127,29,29,0.10)]'
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
                  <ErrorIcon />
                  {errors.major.message}
                </p>
              )}
            </div>

            {/* Year Group */}
            <div>
              <label htmlFor="year" className="label">Current year *</label>
              <select
                id="year"
                className={`
                  w-full h-[44px] bg-white border rounded-[10px]
                  font-body text-[15px] text-text px-4
                  outline-none transition-all duration-150
                  ${errors.year
                    ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                    : 'border-border hover:border-border-strong focus:border-brand focus:shadow-[0_0_0_3px_rgba(127,29,29,0.10)]'
                  }
                `}
                {...register('year')}
              >
                <option value="">Select your year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
              {errors.year && (
                <p className="font-body text-[12px] text-danger mt-2 flex items-center gap-1.5">
                  <ErrorIcon />
                  {errors.year.message}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={handleBack}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={handleNext}
                disabled={!isStep2Valid}
              >
                Continue to security
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — SECURITY ────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display font-bold text-[24px] text-text">Security & Password</h2>
              <p className="font-body text-[14px] text-text-sub">Create a strong password to protect your account</p>
            </div>

            {/* Password */}
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="label">Password *</label>
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
                      className="text-text-muted hover:text-text transition-colors"
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
              <label htmlFor="confirm" className="label">Confirm password *</label>
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
                    className="text-text-muted hover:text-text transition-colors"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                }
                {...register('confirm')}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={handleBack}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={handleNext}
                disabled={!isStep3Valid}
              >
                Continue to interests
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4 — SKILLS & INTERESTS ───────────────────── */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display font-bold text-[24px] text-text">Skills & Interests</h2>
              <p className="font-body text-[14px] text-text-sub">Tell mentors what you're passionate about</p>
            </div>

            {/* Interest input */}
            <div>
              <label htmlFor="interestInput" className="label">Add an interest *</label>
              <div className="flex gap-2">
                <input
                  id="interestInput"
                  type="text"
                  placeholder="e.g., Fintech, Machine Learning, Web Dev"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addInterest(interestInput)
                    }
                  }}
                  className="flex-1 h-[44px] px-4 border border-border rounded-[10px] 
                    font-body text-[15px] outline-none transition-colors
                    focus:border-primary focus:shadow-[0_0_0_3px_rgba(127,29,29,0.10)]"
                />
                <button
                  type="button"
                  onClick={() => addInterest(interestInput)}
                  className="btn btn-primary h-[44px] px-6"
                >
                  Add
                </button>
              </div>
              {errors.interests && (
                <p className="font-body text-[12px] text-danger mt-2 flex items-center gap-1.5">
                  <ErrorIcon />
                  {errors.interests.message}
                </p>
              )}
            </div>

            {/* Suggested interests */}
            {interests.length < 10 && (
              <div>
                <p className="font-body text-[13px] font-semibold text-text-muted mb-3">Suggested interests:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_INTERESTS.filter(s => !interests.includes(s)).slice(0, 8).map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => addInterest(interest)}
                      className="px-4 py-2 bg-primary/8 border border-primary/20 text-primary rounded-[10px] 
                        font-body text-[13px] hover:bg-primary/12 transition-colors"
                    >
                      + {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected interests */}
            {interests.length > 0 && (
              <div>
                <p className="font-body text-[13px] font-semibold text-text-muted mb-3">Your interests ({interests.length}/10):</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, idx) => (
                    <div
                      key={interest}
                      className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-[10px] 
                        font-body text-[13px] flex items-center gap-2"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(idx)}
                        className="text-primary/60 hover:text-primary transition-colors font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={handleBack}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={handleNext}
                disabled={!isStep4Valid}
              >
                Continue to profile links
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5 — SOCIAL & PROFESSIONAL LINKS ────────────– */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display font-bold text-[24px] text-text">Profile & Links</h2>
              <p className="font-body text-[14px] text-text-sub">Optional: Help mentors learn more about you</p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="label">About you (bio)</label>
              <textarea
                id="bio"
                placeholder="Tell potential mentors a bit about yourself, your goals, and what you're looking for..."
                rows={4}
                className={`
                  w-full px-4 py-3 border rounded-[10px] resize-none
                  font-body text-[15px] outline-none transition-all
                  ${errors.bio
                    ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                    : 'border-border hover:border-border-strong focus:border-brand focus:shadow-[0_0_0_3px_rgba(127,29,29,0.10)]'
                  }
                `}
                {...register('bio')}
              />
              <p className="font-body text-[12px] text-text-muted mt-2">
                {bio?.length || 0}/500 characters
              </p>
              {errors.bio && (
                <p className="font-body text-[12px] text-danger mt-2 flex items-center gap-1.5">
                  <ErrorIcon />
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin" className="label">LinkedIn profile</label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                error={errors.linkedin?.message}
                {...register('linkedin')}
              />
              <p className="font-body text-[12px] text-text-muted mt-2">
                Include the full URL starting with https://
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={handleBack}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={handleNext}
              >
                Continue to agreements
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6 — LEGAL ACCEPTANCE ────────────────────────── */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display font-bold text-[24px] text-text">Review & Accept</h2>
              <p className="font-body text-[14px] text-text-sub">Please read and accept our policies to complete your registration</p>
            </div>

            {/* Terms & Privacy Agreement */}
            <div className="space-y-4 p-6 bg-primary/5 border border-primary/15 rounded-[12px]">
              <div className="space-y-3">
                {/* Terms of Service */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptedTerms}
                    onChange={(e) => !termsAutoChecked && setAcceptedTerms(e.target.checked)}
                    disabled={termsAutoChecked}
                    className="w-5 h-5 mt-0.5 rounded border-2 border-brand cursor-pointer accent-brand disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <label htmlFor="acceptTerms" className="font-body text-[14px] text-text font-medium cursor-pointer block">
                      I have read and accept the Terms of Service *
                    </label>
                    {termsAutoChecked && (
                      <p className="text-[12px] text-brand font-semibold mt-1">✓ Automatically marked as read</p>
                    )}
                    <button
                      type="button"
                      onClick={() => window.open('/legal/terms', '_blank')}
                      className="text-brand hover:text-brand-dark text-[13px] font-semibold mt-1 underline transition-colors"
                    >
                      Read Terms of Service →
                    </button>
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className="flex items-start gap-3 pt-2 border-t border-brand/10">
                  <input
                    type="checkbox"
                    id="acceptPrivacy"
                    checked={acceptedPrivacy}
                    onChange={(e) => !privacyAutoChecked && setAcceptedPrivacy(e.target.checked)}
                    disabled={privacyAutoChecked}
                    className="w-5 h-5 mt-0.5 rounded border-2 border-brand cursor-pointer accent-brand disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <label htmlFor="acceptPrivacy" className="font-body text-[14px] text-text font-medium cursor-pointer block">
                      I have read and accept the Privacy Policy *
                    </label>
                    {privacyAutoChecked && (
                      <p className="text-[12px] text-brand font-semibold mt-1">✓ Automatically marked as read</p>
                    )}
                    <button
                      type="button"
                      onClick={() => window.open('/legal/privacy', '_blank')}
                      className="text-brand hover:text-brand-dark text-[13px] font-semibold mt-1 underline transition-colors"
                    >
                      Read Privacy Policy →
                    </button>
                  </div>
                </div>
              </div>

              {/* Status message */}
              {!acceptedTerms || !acceptedPrivacy && (
                <div className="text-[13px] text-text-muted font-medium pt-2 border-t border-brand/10">
                  {!acceptedTerms && !acceptedPrivacy
                    ? '→ Please read and accept both policies to continue'
                    : !acceptedTerms
                    ? '→ Please read and accept the Terms of Service'
                    : '→ Please read and accept the Privacy Policy'}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={handleBack}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={!isStep6Valid || isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </div>
        )}

      </form>

      {/* Sign in link */}
      <p className="font-body text-center text-[13px] text-text-sub mt-10">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}