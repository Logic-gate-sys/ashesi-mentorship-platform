'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/app/_components/ui/Input';
import { Button } from '@/app/_components/ui/Button';

// ── Schema ────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email('Invalid email').regex(/@ashesi\.edu\.gh$/i, 'Must be an @ashesi.edu.gh email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginInput = z.infer<typeof loginSchema>

// ── Eye icon ──────────────────────────────────────────────────

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

// ── Page ──────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError,  setServerError]  = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setServerError(json.message ?? 'Something went wrong. Please try again.')
        return
      }

      // Redirect based on role returned from backend
      switch (json.user.role) {
        case 'STUDENT': router.push('/student/dashboard'); break
        case 'ALUMNI':  router.push('/alumni/dashboard');  break
        case 'ADMIN':   router.push('/admin/dashboard');   break
        default:        router.push('/')
      }
    } catch {
      setServerError('Network error. Please check your connection.')
    }
  }

  return (
    <div className="w-full max-w-[400px]">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-[28px] text-text tracking-tight leading-tight">
          Welcome back
        </h1>
        <p className="font-body text-[14px] text-text-muted mt-1.5">
          Log in to your mentorship account
        </p>
      </div>

      {/* Server error banner */}
      {serverError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px] flex items-start gap-2.5">
          <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="font-body text-[13px] text-red-600">{serverError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@ashesi.edu.gh"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
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

        {/* Remember + forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-brand cursor-pointer"
            />
            <span className="font-body text-[13px] text-text-sub">Keep me logged in</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-body text-[13px] font-medium text-brand hover:opacity-80 transition-opacity"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          full
          loading={isSubmitting}
        >
          Log in
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-border" />
        <span className="font-body text-[12px] text-text-muted">new here?</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-2 gap-3">

        <Link
          href="/register/student"
          className="card p-4 flex flex-col items-center gap-2.5 text-center hover:border-brand transition-colors group"
        >
          <div className="w-9 h-9 rounded-[10px] bg-brand/10 flex items-center justify-center group-hover:bg-brand/15 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <p className="font-body text-[13px] font-semibold text-text">Student</p>
            <p className="font-body text-[11px] text-text-muted mt-0.5">Find a mentor</p>
          </div>
        </Link>

        <Link
          href="/register/alumni"
          className="card p-4 flex flex-col items-center gap-2.5 text-center hover:border-tag-purple transition-colors group"
        >
          <div className="w-9 h-9 rounded-[10px] bg-tag-purple/10 flex items-center justify-center group-hover:bg-tag-purple/15 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9747FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <p className="font-body text-[13px] font-semibold text-text">Alumni</p>
            <p className="font-body text-[11px] text-text-muted mt-0.5">Become a mentor</p>
          </div>
        </Link>
      </div>

      {/* Sign up link */}
      <p className="font-body text-center text-[13px] text-text-muted mt-8">
        Don&apos;t have an account?{' '}
        <Link
          href="/register/student"
          className="font-semibold text-brand hover:opacity-80 transition-opacity"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}