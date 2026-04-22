'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '#/libs_schemas/context/auth-context'
import { loginSchema } from '#/libs_schemas/schemas/auth.schema'
import { EyeIcon } from '#comp-hooks/ui/icons/EyeIcon'
type LoginInput = z.infer<typeof loginSchema> ; 



export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {register,handleSubmit,formState: { errors }} = useForm<LoginInput>({
 resolver: zodResolver(loginSchema),
    mode: 'onTouched',
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
    <div className="w-full">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
            {/* Heading */}
            <h2
              className="text-3xl text-center mb-8 text-[#181821]"
              style={{ fontFamily: "'Bree Serif', serif", fontWeight: 400 }}
            >
              Welcome Back
            </h2>

            {/* Server Error */}
            {serverError && (
              <div className="mb-6 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded text-[#923D41] text-sm" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                {serverError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold mb-2 text-[#0A0909]"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@ashesi.edu.gh"
                    autoComplete="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 pr-10 rounded-lg bg-[#FAF8F8] border-2 outline-none transition-all ${
                      errors.email ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                    } focus:border-[#7B1427]`}
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#923D41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                {errors.email && <p className="text-xs text-[#923D41] mt-1">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold mb-2 text-[#0B0A0A]"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-[#FAF8F8] border-2 outline-none transition-all ${
                      errors.password ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                    } focus:border-[#7B1427]`}
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#923D41] hover:text-[#7B1427]"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && <p className="text-xs text-[#923D41] mt-1">{errors.password.message}</p>}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm font-bold text-[#923D41] hover:text-[#7B1427]"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-6 bg-[#923D41] text-white font-bold rounded-lg hover:bg-[#7B1427] disabled:opacity-50 transition-all shadow-md"
                style={{ fontFamily: "'Bree Serif', serif", fontSize: '18px' }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#E5E5E5]" />
              <span className="text-xs text-[#999]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                or
              </span>
              <div className="flex-1 h-px bg-[#E5E5E5]" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                className="flex-1 py-3 border border-[#E5E5E5] rounded-lg hover:border-[#923D41] hover:bg-[#FAF8F8] transition-all flex items-center justify-center"
              >
                {/* Google Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009766, -39.238281)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -13.004 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
              </button>

              <button
                type="button"
                className="flex-1 py-3 border border-[#E5E5E5] rounded-lg hover:border-[#923D41] bg-[#F5F5F5] hover:bg-[#ECECEC] transition-all flex items-center justify-center"
              >
                {/* Microsoft Logo */}
                <svg className="w-8 h-8" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="5" height="5" fill="#F25022"/>
                  <rect x="9" y="1" width="5" height="5" fill="#7FBA00"/>
                  <rect x="1" y="9" width="5" height="5" fill="#00A4EF"/>
                  <rect x="9" y="9" width="5" height="5" fill="#FFB900"/>
                </svg>
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-xs text-[#666] mt-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-[#923D41] hover:text-[#7B1427]">
                Sign up here
              </Link>
            </p>
        </div>
      </div>
    </div>
  )
}