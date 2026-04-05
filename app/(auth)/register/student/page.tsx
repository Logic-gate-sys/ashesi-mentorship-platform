'use client'
import { StepIndicator } from '@/app/_components/ui/StepIndictor'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/app/_lib/context/auth-context'
import { studentRegisterSchema, validateStrongPassword } from '@/app/_schemas/auth.schema'
import { EyeIcon, ErrorIcon } from '@/app/_components/ui/icons'
import { PasswordStrengthIndicator } from '@/app/_components/ui/reusable-ui/PasswordStrenght'

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

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm({
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

  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const email = watch('email')
  const major = watch('major')
  const year = watch('year')
  const password = watch('password')
  const confirm = watch('confirm')
  const interests = watch('interests')
  const bio = watch('bio')

  // Auto-check legal docs on step 6 if user has scrolled to bottom in this session
  useEffect(() => {
    if (step === 6) {
      const termsScrolled = typeof window !== 'undefined' && sessionStorage.getItem('terms_scrolled_to_bottom')
      const privacyScrolled = typeof window !== 'undefined' && sessionStorage.getItem('privacy_scrolled_to_bottom')
      
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
  // Clear session storage after successful registration
  const clearSessionStorage = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('terms_scrolled_to_bottom')
      sessionStorage.removeItem('privacy_scrolled_to_bottom')
    }
  }
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
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3 | 4 | 5 | 6)
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
      clearSessionStorage()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Registration failed')
    }
  }

  return (
    <div className="w-full max-w-120">
      {/* Page heading */}
      <div className="mb-8">
        <h1
          className="text-[48px] leading-16.25 text-[#181821] text-center mb-2"
          style={{ fontFamily: "'Bree Serif', serif", fontWeight: 400 }}
        >
          Create Your Account
        </h1>
        <p className="text-center text-[14px] text-[#666] mt-2">
          Step {step} of 6
        </p>
      </div>

      <StepIndicator current={step} totalSteps={6} />

      {/* Switch Registration Type */}
      <div className="text-center mt-4 mb-6">
        <p
          className="text-xs text-[#666] mb-2"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          Are you an alumnus/mentor?{' '}
          <Link
            href="/register/alumni"
            className="font-bold text-[#923D41] hover:text-[#7B1427] cursor-pointer"
          >
            Register here instead
          </Link>
        </p>
      </div>

      {/* ── ERROR MESSAGE ─────────────────────────────────────── */}
      {serverError && (
        <div className="mb-6 px-4 py-3 bg-[#FEE2E2] border border-[#FECACA] rounded-md flex items-start gap-3">
          <div className="shrink-0 mt-0.5 w-5 h-5 text-danger">
            <ErrorIcon />
          </div>
          <p className="font-body text-[14px] text-danger font-medium">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
        {/* ── STEP 1 — PERSONAL INFO ────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>First name *</label>
              <input
                id="firstName"
                type="text"
                placeholder="Kwame"
                autoComplete="given-name"
                className={`w-full h-[46px] px-4 rounded-[10px] bg-[#FAF8F8] border-[1.5px] outline-none transition-all text-[15px] ${
                  errors.firstName ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                }`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-[12px] text-danger mt-2">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Last name *</label>
              <input
                id="lastName"
                type="text"
                placeholder="Mensah"
                autoComplete="family-name"
                className={`w-full h-[46px] px-4 rounded-[10px] bg-[#FAF8F8] border-[1.5px] outline-none transition-all text-[15px] ${
                  errors.lastName ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                }`}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-[12px] text-danger mt-2">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Ashesi email address *</label>
              <input
                id="email"
                type="email"
                placeholder="you@ashesi.edu.gh"
                autoComplete="email"
                className={`w-full h-[46px] px-4 rounded-[10px] bg-[#FAF8F8] border-[1.5px] outline-none transition-all text-[15px] ${
                  errors.email ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                }`}
                {...register('email')}
              />
              <p className="text-[12px] text-[#999] mt-2">Must be your official @ashesi.edu.gh account</p>
              {errors.email && (
                <p className="text-[12px] text-danger mt-2">{errors.email.message}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="w-full h-[60px] bg-[#923D41] text-white font-[400] text-[36px] rounded-[10px] hover:bg-[#7B1427] transition-all shadow-[0px_10px_20px_#941C2E]"
                onClick={handleNext}
                disabled={!isStep1Valid}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 — PROFILE ────────────────────────────────– */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="major" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Major / Program *</label>
              <select
                id="major"
                className={`w-full h-[46px] px-4 rounded-[10px] bg-[#FAF8F8] border-[1.5px] outline-none transition-all text-[15px] ${
                  errors.major ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                }`}
                {...register('major')}
              >
                <option value="">Select your major</option>
                {MAJORS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {errors.major && (
                <p className="text-[12px] text-danger mt-2">{errors.major.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="year" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Current year *</label>
              <select
                id="year"
                className={`w-full h-[46px] px-4 rounded-[10px] bg-[#FAF8F8] border-[1.5px] outline-none transition-all text-[15px] ${
                  errors.year ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                }`}
                {...register('year')}
              >
                <option value="">Select your year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
              {errors.year && (
                <p className="text-[12px] text-danger mt-2">{errors.year.message}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="w-full h-[60px] bg-white text-[#923D41] font-[400] text-[36px] rounded-[10px] border-2 border-[#923D41] hover:bg-[#F5F5F5] transition-all"
                onClick={handleBack}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                ← Back
              </button>
              <button
                type="button"
                className="w-full h-[60px] bg-[#923D41] text-white font-[400] text-[36px] rounded-[10px] hover:bg-[#7B1427] transition-all shadow-[0px_10px_20px_#941C2E]"
                onClick={handleNext}
                disabled={!isStep2Valid}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — SECURITY ────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Password *</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={`w-full h-[46px] px-4 pr-12 rounded-[10px] bg-[#FAF8F8] border-[1.5px] outline-none transition-all text-[15px] ${
                    errors.password ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#923D41] hover:text-[#7B1427] transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-danger mt-2">{errors.password.message}</p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <PasswordStrengthIndicator 
                password={password}
                requirements={passwordStrength.requirements}
              />
            )}

            <div>
              <label htmlFor="confirm" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Confirm password *</label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`w-full h-[46px] px-4 pr-12 rounded-[10px] bg-[#FAF8F8] border-[1.5px] outline-none transition-all text-[15px] ${
                    errors.confirm ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                  }`}
                  {...register('confirm')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#923D41] hover:text-[#7B1427] transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {errors.confirm && (
                <p className="text-[12px] text-danger mt-2">{errors.confirm.message}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="w-full h-[60px] bg-white text-[#923D41] font-[400] text-[36px] rounded-[10px] border-2 border-[#923D41] hover:bg-[#F5F5F5] transition-all"
                onClick={handleBack}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                ← Back
              </button>
              <button
                type="button"
                className="w-full h-[60px] bg-[#923D41] text-white font-[400] text-[36px] rounded-[10px] hover:bg-[#7B1427] transition-all shadow-[0px_10px_20px_#941C2E]"
                onClick={handleNext}
                disabled={!isStep3Valid}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4 — SKILLS & INTERESTS ───────────────────── */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="interestInput" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Add an interest *</label>
              <div className="flex gap-2">
                <input
                  id="interestInput"
                  type="text"
                  placeholder="e.g., Fintech, Machine Learning"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addInterest(interestInput)
                    }
                  }}
                  className="flex-1 h-[44px] px-4 border border-[#923D41] rounded-[10px] bg-white outline-none transition-colors focus:shadow-[0_0_0_3px_rgba(146,61,65,0.10)]"
                />
                <button
                  type="button"
                  onClick={() => addInterest(interestInput)}
                  className="px-6 h-[44px] bg-[#923D41] text-white rounded-[10px] hover:bg-[#7B1427] transition-all text-[14px] font-[700]"
                >
                  Add
                </button>
              </div>
              {errors.interests && (
                <p className="text-[12px] text-danger mt-2">{errors.interests.message}</p>
              )}
            </div>

            {/* Suggested interests */}
            {interests.length < 10 && (
              <div>
                <p className="text-[13px] font-[700] text-[#666] mb-3">Suggested interests:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_INTERESTS.filter(s => !interests.includes(s)).slice(0, 8).map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => addInterest(interest)}
                      className="px-4 py-2 bg-[#FAF8F8] border border-[#923D41] text-[#923D41] rounded-[10px] text-[13px] hover:bg-[#923D41] hover:text-white transition-colors"
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
                <p className="text-[13px] font-[700] text-[#666] mb-3">Your interests ({interests.length}/10):</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, idx) => (
                    <div
                      key={interest}
                      className="px-4 py-2 bg-[#923D41]/10 border border-[#923D41]/30 text-[#923D41] rounded-[10px] text-[13px] flex items-center gap-2"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(idx)}
                        className="text-[#923D41]/60 hover:text-[#923D41] transition-colors font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="w-full h-[60px] bg-white text-[#923D41] font-[400] text-[36px] rounded-[10px] border-2 border-[#923D41] hover:bg-[#F5F5F5] transition-all"
                onClick={handleBack}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                ← Back
              </button>
              <button
                type="button"
                className="w-full h-[60px] bg-[#923D41] text-white font-[400] text-[36px] rounded-[10px] hover:bg-[#7B1427] transition-all shadow-[0px_10px_20px_#941C2E]"
                onClick={handleNext}
                disabled={!isStep4Valid}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5 — SOCIAL & PROFESSIONAL LINKS ────────────– */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="bio" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>About you (bio)</label>
              <textarea
                id="bio"
                placeholder="Tell potential mentors a bit about yourself..."
                rows={4}
                className={`w-full px-4 py-3 border-[1.5px] rounded-[10px] resize-none outline-none transition-all bg-[#FAF8F8] ${
                  errors.bio ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                }`}
                {...register('bio')}
              />
              <p className="text-[12px] text-[#999] mt-2">{bio?.length || 0}/500 characters</p>
              {errors.bio && (
                <p className="text-[12px] text-danger mt-2">{errors.bio.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-[14px] font-[700] text-[#0A0909] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>LinkedIn profile</label>
              <input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                className={`w-full h-[46px] px-4 rounded-[10px] bg-[#FAF8F8] border-[1.5px] outline-none transition-all text-[15px] ${
                  errors.linkedin ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                }`}
                {...register('linkedin')}
              />
              <p className="text-[12px] text-[#999] mt-2">Include the full URL starting with https://</p>
              {errors.linkedin && (
                <p className="text-[12px] text-danger mt-2">{errors.linkedin.message}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="w-full h-[60px] bg-white text-[#923D41] font-[400] text-[36px] rounded-[10px] border-2 border-[#923D41] hover:bg-[#F5F5F5] transition-all"
                onClick={handleBack}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                ← Back
              </button>
              <button
                type="button"
                className="w-full h-[60px] bg-[#923D41] text-white font-[400] text-[36px] rounded-[10px] hover:bg-[#7B1427] transition-all shadow-[0px_10px_20px_#941C2E]"
                onClick={handleNext}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6 — LEGAL ACCEPTANCE ────────────────────────── */}
        {step === 6 && (
          <div className="space-y-6">
            {/* Instruction heading */}
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#181821] mb-2" style={{ fontFamily: "'Bree Serif', serif" }}>Review legal documents</h2>
              <p className="text-[14px] text-[#666]" style={{ fontFamily: "'Quicksand', sans-serif" }}>Open each document, scroll to the bottom to mark as read</p>
            </div>

            {/* Terms & Privacy Agreement */}
            <div className="space-y-4 p-6 bg-[#FAF8F8] border border-[#923D41]/20 rounded-[12px]">
              <div className="space-y-3">
                {/* Terms of Service */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptedTerms}
                    onChange={() => {}}
                    disabled={true}
                    className="w-5 h-5 mt-0.5 rounded border-2 border-[#923D41] cursor-not-allowed accent-[#923D41]"
                  />
                  <div className="flex-1">
                    <label htmlFor="acceptTerms" className="text-[14px] text-[#0A0909] font-[700] block" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                      I have read and accept the Terms of Service *
                    </label>
                    {acceptedTerms && (
                      <p className="text-[12px] text-[#923D41] font-semibold mt-1">✓ Read and marked</p>
                    )}
                    {!acceptedTerms && (
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#923D41] hover:text-[#7B1427] text-[13px] font-semibold mt-2 px-3 py-1.5 rounded border border-[#923D41] hover:bg-[#923D41]/5 transition-all"
                      >
                        Open & Read →
                      </Link>
                    )}
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className="flex items-start gap-3 pt-2 border-t border-[#923D41]/10">
                  <input
                    type="checkbox"
                    id="acceptPrivacy"
                    checked={acceptedPrivacy}
                    onChange={() => {}}
                    disabled={true}
                    className="w-5 h-5 mt-0.5 rounded border-2 border-[#923D41] cursor-not-allowed accent-[#923D41]"
                  />
                  <div className="flex-1">
                    <label htmlFor="acceptPrivacy" className="text-[14px] text-[#0A0909] font-[700] block" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                      I have read and accept the Privacy Policy *
                    </label>
                    {acceptedPrivacy && (
                      <p className="text-[12px] text-[#923D41] font-semibold mt-1">✓ Read and marked</p>
                    )}
                    {!acceptedPrivacy && (
                      <Link
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#923D41] hover:text-[#7B1427] text-[13px] font-semibold mt-2 px-3 py-1.5 rounded border border-[#923D41] hover:bg-[#923D41]/5 transition-all"
                      >
                        Open & Read →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status message */}
            {!acceptedTerms || !acceptedPrivacy && (
              <div className="p-4 bg-[#FEF2F2] border border-[#923D41]/20 rounded-[10px]">
                <p className="text-[13px] text-[#923D41] font-medium" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  ⚠️ {!acceptedTerms && !acceptedPrivacy
                    ? 'Please read both documents to continue'
                    : !acceptedTerms
                    ? 'Please read the Terms of Service to continue'
                    : 'Please read the Privacy Policy to continue'}
                </p>
              </div>
            )}

            {/* Action buttons */}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="w-full h-[60px] bg-white text-[#923D41] font-[400] text-[36px] rounded-[10px] border-2 border-[#923D41] hover:bg-[#F5F5F5] transition-all"
                onClick={handleBack}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="w-full h-[60px] bg-[#923D41] text-white font-[400] text-[36px] rounded-[10px] hover:bg-[#7B1427] transition-all shadow-[0px_10px_20px_#941C2E] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isStep6Valid || isLoading}
                style={{ fontFamily: "'Bree Serif', serif" }}
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        )}

          </form>

          {/* Sign in link - Mobile only */}
      <p className="font-body text-center text-[13px] text-text-muted mt-8">
        Already have an account?{" "}
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