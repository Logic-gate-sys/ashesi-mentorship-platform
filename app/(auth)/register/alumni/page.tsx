"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button} from "@/app/_components/ui/_index";
import { alumniRegisterSchema } from "@/app/_schemas/alumni.schema";
import { validateStrongPassword } from "@/app/_schemas/auth.schema";
import { useAuth } from "@/app/_lib/context/auth-context";
import { EyeIcon, ErrorIcon } from "@/app/_components/ui/icons";
import { PasswordStrengthIndicator } from "@/app/_components/ui/reusable-ui/PasswordStrenght";

type AlumniRegisterInput = z.infer<typeof alumniRegisterSchema>;

const MAJORS = [
  "Computer Science",
  "Management Information Systems",
  "Business Administration",
  "Electrical and Electronic Engineering",
  "Mechanical Engineering",
  "Mechatronics Engineering",
  "Economics",
  "Law in Public Policy"
];

const INDUSTRIES = [
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "FINANCE", label: "Finance" },
  { value: "CONSULTING", label: "Consulting" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "EDUCATION", label: "Education" },
  { value: "ENGINEERING", label: "Engineering" },
  { value: "OTHER", label: "Other" },
];

function SelectField({id,label,error,children,...props}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-[13px] font-semibold text-text">
        {label}
      </label>
      <select
        id={id}
        className={`w-full h-11 bg-surface border rounded-base font-body text-[14px] text-text px-4 outline-none transition-all duration-150 appearance-none
          ${
            error
              ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
              : "border-border hover:border-[#c0bfbf] focus:border-primary focus:shadow-[0_0_0_3px_rgba(127,29,29,0.15)]"
          }
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="font-body text-[12px] text-red-500 flex items-center gap-1.5">
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  );
}




function Steps({ current }: { current: 1 | 2 | 3 }) {
  const labels = ["Identity", "Career", "Security"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2, 3] as const).map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`
            w-6 h-6 rounded-full flex items-center justify-center
            font-body text-[11px] font-bold transition-colors shrink-0
            ${current >= step ? "bg-primary text-white" : "bg-border text-text-muted"}
          `}
          >
            {current > step ? (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              step
            )}
          </div>
          <span
            className={`font-body text-[12px] font-medium hidden sm:block ${current >= step ? "text-text-sub" : "text-text-muted"}`}
          >
            {labels[i]}
          </span>
          {i < 2 && (
            <div
              className={`w-6 h-px mx-1 transition-colors ${current > step ? "bg-brand" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function AlumniRegisterPage() {
  const { registerAlumni, isLoading } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [termsAutoChecked, setTermsAutoChecked] = useState(false);
  const [privacyAutoChecked, setPrivacyAutoChecked] = useState(false);

  const {register, handleSubmit, trigger, watch, formState: { errors },} = useForm<AlumniRegisterInput>({
    resolver: zodResolver(alumniRegisterSchema),
    mode: "onTouched",
  });

  const password = watch("password");

  // Password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { isValid: false, requirements: { minLength: false, uppercase: false, lowercase: false, number: false, specialChar: false } }
    return validateStrongPassword(password)
  }, [password])

  // Auto-check legal docs on step 3 if user has scrolled to bottom in this session
  useEffect(() => {
    if (step === 3) {
      const termsScrolled = typeof window !== 'undefined' && sessionStorage.getItem('terms_scrolled_to_bottom');
      const privacyScrolled = typeof window !== 'undefined' && sessionStorage.getItem('privacy_scrolled_to_bottom');
      
      if (termsScrolled) {
        setAcceptedTerms(true);
        setTermsAutoChecked(true);
      }
      if (privacyScrolled) {
        setAcceptedPrivacy(true);
        setPrivacyAutoChecked(true);
      }
    }
  }, [step]);

  const goNext = async (fields: (keyof AlumniRegisterInput)[]) => {
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, 3) as 1 | 2 | 3);
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1) as 1 | 2 | 3);

  const clearSessionStorage = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('terms_scrolled_to_bottom');
      sessionStorage.removeItem('privacy_scrolled_to_bottom');
    }
  };

  const onSubmit = async (data: AlumniRegisterInput) => {
    setServerError(null);
    try {
      await registerAlumni(data);
      clearSessionStorage();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Registration failed');
      // If email conflict, send back to step 1
      if (error instanceof Error && error.message.includes('email')) setStep(1);
    }
  };

  return (
    <div className="w-full max-w-125">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-[28px] text-text tracking-tight leading-tight">
          Become a mentor
        </h1>
        <p className="font-body text-[14px] text-text-muted mt-1.5">
          Share your journey with current Ashesi students
        </p>
      </div>

      {/* Step indicator */}
      <Steps current={step} />

      {/* Switch Registration Type */}
      <div className="text-center mt-4 mb-6">
        <p
          className="text-xs text-[#666] mb-2"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          Are you a current student?{' '}
          <Link
            href="/register/student"
            className="font-bold text-[#923D41] hover:text-[#7B1427] cursor-pointer"
          >
            Register here instead
          </Link>
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px] flex items-start gap-2.5">
          <svg
            className="shrink-0 mt-0.5"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
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
                placeholder="Ama"
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <Input
                id="lastName"
                label="Last name"
                placeholder="Owusu"
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register("lastName")}
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
              {...register("email")}
            />

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                id="major"
                label="Major"
                error={errors.major?.message}
                {...register("major")}
              >
                <option value="">Select major</option>
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </SelectField>

              <Input
                id="graduationYear"
                type="number"
                label="Graduation year"
                placeholder="2021"
                error={errors.graduationYear?.message}
                {...register("graduationYear", { valueAsNumber: true })}
              />
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              full
              onClick={() =>
                goNext([
                  "firstName",
                  "lastName",
                  "email",
                  "major",
                  "graduationYear",
                ])
              }
            >
              Continue →
            </Button>
          </div>
        )}

        {/* ── STEP 2 — career ─────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <Input
              id="company"
              label="Current company"
              placeholder="e.g. Google, Stanbic Bank"
              autoComplete="organization"
              error={errors.company?.message}
              {...register("company")}
            />

            <Input
              id="jobTitle"
              label="Job title"
              placeholder="e.g. Software Engineer"
              autoComplete="organization-title"
              error={errors.jobTitle?.message}
              {...register("jobTitle")}
            />

            <SelectField
              id="industry"
              label="Industry"
              error={errors.industry?.message}
              {...register("industry")}
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </SelectField>

            {/* What mentoring means — context card */}
            <div className="bg-tag-purple/6 border border-tag-purple/15 rounded-[10px] px-4 py-3.5">
              <p className="font-body text-[12px] font-semibold text-tag-purple mb-1">
                What this means
              </p>
              <p className="font-body text-[12px] text-text-muted leading-relaxed">
                You set your own availability. Students send requests — you
                accept only those you can genuinely help. No pressure, no fixed
                hours.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="primary"
                size="lg"
                full
                onClick={() => goNext(["company", "jobTitle", "industry"])}
              >
                Continue →
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                full
                onClick={goBack}
              >
                ← Back
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — password ───────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            {/* Instruction heading */}
            <div className="mb-4">
              <h2 className="font-display font-bold text-[22px] text-text tracking-tight leading-tight mb-2">
                Review legal documents
              </h2>
              <p className="font-body text-[13px] text-text-muted">Open each document, scroll to the bottom to mark as read</p>
            </div>

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              right={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="hover:text-text transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              }
              {...register("password")}
            />

            {/* Password Strength Indicator */}
            {password && (
              <PasswordStrengthIndicator 
                password={password}
                requirements={passwordStrength.requirements}
              />
            )}

            <Input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              label="Confirm password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirm?.message}
              right={
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="hover:text-text transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              }
              {...register("confirm")}
            />

            {/* Legal Agreements */}
            <div className="space-y-3 border border-border rounded-[10px] p-4 bg-surface">
              {/* Terms of Service */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={() => {}}
                  disabled={true}
                  className="w-5 h-5 mt-0.5 rounded border-2 border-brand cursor-not-allowed accent-brand"
                />
                <div className="flex-1">
                  <label
                    htmlFor="acceptTerms"
                    className="font-body text-[13px] font-semibold text-text block"
                  >
                    I have read and accept the Terms of Service *
                  </label>
                  {acceptedTerms && (
                    <p className="font-body text-[11px] text-brand font-semibold mt-1">✓ Read and marked</p>
                  )}
                  {!acceptedTerms && (
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-body text-[12px] font-semibold text-brand hover:text-brand/80 mt-2 px-3 py-1.5 rounded border border-brand hover:bg-brand/5 transition-all"
                    >
                      Open & Read →
                    </Link>
                  )}
                </div>
              </div>

              {/* Privacy Policy */}
              <div className="flex items-start gap-3 pt-2 border-t border-border">
                <input
                  type="checkbox"
                  id="acceptPrivacy"
                  checked={acceptedPrivacy}
                  onChange={() => {}}
                  disabled={true}
                  className="w-5 h-5 mt-0.5 rounded border-2 border-brand cursor-not-allowed accent-brand"
                />
                <div className="flex-1">
                  <label
                    htmlFor="acceptPrivacy"
                    className="font-body text-[13px] font-semibold text-text block"
                  >
                    I have read and accept the Privacy Policy *
                  </label>
                  {acceptedPrivacy && (
                    <p className="font-body text-[11px] text-brand font-semibold mt-1">✓ Read and marked</p>
                  )}
                  {!acceptedPrivacy && (
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-body text-[12px] font-semibold text-brand hover:text-brand/80 mt-2 px-3 py-1.5 rounded border border-brand hover:bg-brand/5 transition-all"
                    >
                      Open & Read →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Status message */}
            {!acceptedTerms || !acceptedPrivacy && (
              <div className="font-body text-[12px] text-text-muted font-medium px-4 py-3 bg-surface border border-border rounded-[8px]">
                ⚠️ {!acceptedTerms && !acceptedPrivacy
                  ? 'Please read both documents to continue'
                  : !acceptedTerms
                  ? 'Please read the Terms of Service to continue'
                  : 'Please read the Privacy Policy to continue'}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                full
                loading={isLoading}
                disabled={!acceptedTerms || !acceptedPrivacy || isLoading}
              >
                Create mentor account
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                full
                onClick={goBack}
              >
                ← Back
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Sign in link */}
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
  );
}
