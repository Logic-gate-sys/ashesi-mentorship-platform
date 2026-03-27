'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {Input, Button } from '@/app/_components/ui/_index'
import { useAuth } from '@/app/_lib/context/auth-context'
import { loginSchema } from '@/app/_schemas/auth.schema'
import { EyeIcon, ErrorIcon, StudentIcon, AlumniIcon } from '@/app/_components/ui/icons'

type LoginInput = z.infer<typeof loginSchema>

// ── Page ──────────────────────────────────────────────────────

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched', // Validate on blur/touched for better UX
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    try {
      await login(data.email, data.password)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Login failed')
    }
  }

  return (
    <div className="w-full max-w-125">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-[32px] text-text tracking-tight leading-tight">
          Welcome back
        </h1>
        <p className="font-body text-[15px] text-text-muted mt-2">
          Log in to your mentorship account
        </p>
      </div>

      {/* Server error banner */}
      {serverError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px] flex items-start gap-2.5">
          <div className="shrink-0 mt-0.5 text-red-500">
            <ErrorIcon />
          </div>
          <p className="font-body text-[14px] text-red-600">{serverError}</p>
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
            <span className="font-body text-[14px] text-text-sub">Keep me logged in</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-body text-[14px] font-medium text-brand hover:opacity-80 transition-opacity"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          full
          loading={isLoading}
          className="mt-6 text-red-900"
        >
          Log in
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-border" />
        <span className="font-body text-[13px] text-text-muted">new here?</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-2 gap-3">

        <Link
          href="/register/student"
          className="card p-6 flex flex-col items-center gap-3 text-center hover:border-brand transition-colors group min-h-[140px] justify-center"
        >
          <div className="w-12 h-12 rounded-[10px] bg-brand/10 flex items-center justify-center group-hover:bg-brand/15 transition-colors text-brand">
            <StudentIcon />
          </div>
          <div>
            <p className="font-body text-[14px] font-semibold text-text">Student</p>
            <p className="font-body text-[12px] text-text-muted mt-0.5">Find a mentor</p>
          </div>
        </Link>

        <Link
          href="/register/alumni"
          className="card p-6 flex flex-col items-center gap-3 text-center hover:border-tag-purple transition-colors group min-h-[140px] justify-center"
        >
          <div className="w-12 h-12 rounded-[10px] bg-tag-purple/10 flex items-center justify-center group-hover:bg-tag-purple/15 transition-colors text-tag-purple">
            <AlumniIcon />
          </div>
          <div>
            <p className="font-body text-[14px] font-semibold text-text">Alumni</p>
            <p className="font-body text-[12px] text-text-muted mt-0.5">Become a mentor</p>
          </div>
        </Link>
      </div>

      {/* Sign up link */}
      <p className="font-body text-center text-[14px] text-text-muted mt-8">
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