import {z} from  'zod';

const CURRENT_YEAR = new Date().getFullYear();


export const alumniRegisterSchema = z.object({
    firstName: z.string().min(2, "At least 2 characters").max(64).trim(),
    lastName: z.string().min(2, "At least 2 characters").max(64).trim(),
    email: z
      .string()
      .email("Invalid email address")
      .regex(/@ashesi\.edu\.gh$/i, "Must be an @ashesi.edu.gh email"),
    graduationYear: z.number().int("Enter a valid year").min(2002, "Ashesi was founded in 2002").max(CURRENT_YEAR, "Graduation year cannot be in the future"),
    major: z.string().min(2, "Select your major"),
    company: z.string().min(2, "Company name is required").max(100).trim(),
    jobTitle: z.string().min(2, "Job title is required").max(100).trim(),
    industry: z.enum(["TECHNOLOGY","FINANCE","CONSULTING","HEALTHCARE","EDUCATION","ENGINEERING","OTHER"],
      { message: "Select an industry" }
    ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72),
    confirm: z.string(),
 })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });