import { z } from 'zod';

const CURRENT_YEAR = new Date().getFullYear();

// ============================================
// STUDENT REGISTRATION SCHEMA
// ============================================
export const studentRegisterSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(64).trim(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(64).trim(),
    email: z
      .string()
      .email("Invalid email address")
      .regex(/@ashesi\.edu\.gh$/i, "Must be an @ashesi.edu.gh email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be less than 72 characters"),
    confirm: z.string(),
    year: z.coerce
      .number({ invalid_type_error: "Year must be a valid number" })
      .int()
      .min(1, "Must be year 1-4")
      .max(4, "Must be year 1-4"),
    major: z.string().min(2, "Major is required").max(100).trim(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;

// ============================================
// ALUMNI REGISTRATION SCHEMA
// ============================================
export const alumniRegisterSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(64).trim(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(64).trim(),
    email: z
      .string()
      .email("Invalid email address")
      .regex(/@ashesi\.edu\.gh$/i, "Must be an @ashesi.edu.gh email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be less than 72 characters"),
    confirm: z.string(),
    graduationYear: z.coerce
      .number({ invalid_type_error: "Enter a valid year" })
      .int()
      .min(2002, "Ashesi was founded in 2002")
      .max(CURRENT_YEAR, "Graduation year cannot be in the future"),
    major: z.string().min(2, "Major is required").max(100).trim(),
    company: z.string().min(2, "Company name is required").max(100).trim(),
    jobTitle: z.string().min(2, "Job title is required").max(100).trim(),
    industry: z.enum(["TECHNOLOGY", "FINANCE", "CONSULTING", "HEALTHCARE", "EDUCATION", "ENGINEERING", "OTHER"], {
      errorMap: () => ({ message: "Select a valid industry" }),
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type AlumniRegisterInput = z.infer<typeof alumniRegisterSchema>;

// ============================================
// LOGIN SCHEMA
// ============================================
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(/@ashesi\.edu\.gh$/i, "Must be an @ashesi.edu.gh email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// UPDATE PROFILE SCHEMA
// ============================================
export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(64).trim().optional(),
  lastName: z.string().min(2).max(64).trim().optional(),
  avatarUrl: z.string().url().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
