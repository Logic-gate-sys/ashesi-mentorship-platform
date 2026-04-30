import { z } from 'zod';

const CURRENT_YEAR = new Date().getFullYear();
const validateName = (name: string) => {
  const nameRegex = /^[a-zA-Z]([a-zA-Z\s'-]*[a-zA-Z])?$/;
  return nameRegex.test(name.trim());
};

const validateStrongPassword = (password: string) => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*\-_=+]/.test(password);

  return {
    isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
    requirements: {
      minLength: hasMinLength,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
      specialChar: hasSpecialChar,
    },
  };
};

const cloudinaryHeadshotUrlSchema = z
  .string()
  .trim()
  .min(1, 'Professional headshot photo is required')
  .url('Headshot URL must be a valid URL')
  .refine(
    (url) => /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//i.test(url),
    'Please provide a valid Cloudinary image URL for your professional headshot'
  );


export const studentRegisterSchema = z
  .object({
    // Step 1: Personal Info
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(64, "First name must be less than 64 characters")
      .trim()
      .refine(validateName, "First name must only contain letters, hyphens, and spaces"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(64, "Last name must be less than 64 characters")
      .trim()
      .refine(validateName, "Last name must only contain letters, hyphens, and spaces"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format")
      .regex(/@ashesi\.edu\.gh$/i, "Must use your @ashesi.edu.gh email address"),
    avatarUrl: cloudinaryHeadshotUrlSchema,
    
    // Step 2: Profile
    major: z.string().min(1, "Major is required").max(100).trim(),
    year: z.preprocess(
      (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
      z.number().int("Year must be a whole number").min(1, "Must be year 1, 2, 3, or 4").max(4, "Must be year 1, 2, 3, or 4")
    ),

    // Step 3: Auth Requirements
    password: z
      .string()
      .min(1, "Password is required")
      .max(72, "Password must be less than 72 characters")
      .refine(
        (pwd) => validateStrongPassword(pwd).isValid,
        "Password must contain: uppercase, lowercase, number, and special character (!@#$%^&*-_=+)"
      ),
    confirm: z.string().min(1, "Please confirm your password"),

    // Step 4: Skills & Interests
    interests: z
      .array(z.string().trim().min(1, "Interest cannot be empty").max(50))
      .min(1, "Add at least one interest")
      .max(10, "Maximum 10 interests allowed"),

    // Step 5: Social & Professional Links
    bio: z
      .string()
      .max(500, "Bio must be less than 500 characters")
      .optional()
      .transform(val => val?.trim() || null),
    linkedin: z
      .string()
      .url("Invalid LinkedIn URL")
      .optional()
      .transform(val => val?.trim() || null),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

// Export helper for password strength checking in UI
export { validateStrongPassword };

export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;

// ================
export const alumniRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(64, "First name must be less than 64 characters")
      .trim()
      .refine(validateName, "First name must only contain letters, hyphens, and spaces"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(64, "Last name must be less than 64 characters")
      .trim()
      .refine(validateName, "Last name must only contain letters, hyphens, and spaces"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format")
      .regex(/@ashesi\.edu\.gh$/i, "Must use your @ashesi.edu.gh email address"),
    avatarUrl: cloudinaryHeadshotUrlSchema,
    password: z
      .string()
      .min(1, "Password is required")
      .max(72, "Password must be less than 72 characters")
      .refine(
        (pwd) => validateStrongPassword(pwd).isValid,
        "Password must contain: uppercase, lowercase, number, and special character (!@#$%^&*-_=+)"
      ),
    confirm: z.string().min(1, "Please confirm your password"),
    graduationYear: z.number().int("Graduation year must be a whole number").min(2002, "Ashesi was founded in 2002").max(CURRENT_YEAR, "Graduation year cannot be in the future"),
    major: z.string().min(1, "Major is required").max(100).trim(),
    company: z.string().min(1, "Company name is required").max(100).trim(),
    jobTitle: z.string().min(1, "Job title is required").max(100).trim(),
    industry: z.enum(["TECHNOLOGY", "FINANCE", "CONSULTING", "HEALTHCARE", "EDUCATION", "ENGINEERING", "OTHER"]),
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
  avatarUrl: cloudinaryHeadshotUrlSchema.optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
