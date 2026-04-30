import { z } from 'zod';

/**
 * User Profile Schemas
 */

const validateName = (name: string) => {
  const nameRegex = /^[a-zA-Z]([a-zA-Z\s'-]*[a-zA-Z])?$/;
  return nameRegex.test(name.trim());
};

const cloudinaryHeadshotUrlSchema = z
  .string()
  .trim()
  .min(1, 'Professional headshot photo URL is required')
  .url('Invalid avatar URL')
  .refine(
    (url) => /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//i.test(url),
    'Please provide a valid Cloudinary image URL for your professional headshot'
  );

export const updateStudentProfileSchema = z.object({
  yearGroup: z
    .coerce.number()
    .int()
    .min(1, 'Year must be 1, 2, 3, or 4')
    .max(4, 'Year must be 1, 2, 3, or 4')
    .optional(),
  major: z
    .string()
    .min(2, 'Major is required')
    .max(100, 'Major must be less than 100 characters')
    .trim()
    .optional(),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .transform((val) => val?.trim() || null),
  linkedin: z
    .string()
    .url('Invalid LinkedIn URL')
    .optional()
    .transform((val) => val?.trim() || null),
  interests: z
    .array(
      z.string()
        .min(1, 'Interest cannot be empty')
        .max(50, 'Interest must be less than 50 characters')
        .trim()
    )
    .min(1, 'Add at least one interest')
    .max(10, 'Maximum 10 interests allowed')
    .optional(),
});

export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;

const CURRENT_YEAR = new Date().getFullYear();

export const updateAlumniProfileSchema = z.object({
  graduationYear: z
    .coerce.number()
    .int()
    .min(2002, 'Ashesi was founded in 2002')
    .max(CURRENT_YEAR, 'Graduation year cannot be in the future')
    .optional(),
  major: z
    .string()
    .min(2, 'Major is required')
    .max(100)
    .trim()
    .optional(),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(100)
    .trim()
    .optional(),
  jobTitle: z
    .string()
    .min(1, 'Job title is required')
    .max(100)
    .trim()
    .optional(),
  industry: z
    .enum([
      'TECHNOLOGY',
      'FINANCE',
      'CONSULTING',
      'HEALTHCARE',
      'EDUCATION',
      'ENGINEERING',
      'OTHER',
    ])
    .optional(),
  bio: z
    .string()
    .max(500)
    .optional()
    .transform((val) => val?.trim() || null),
  linkedin: z
    .string()
    .url('Invalid LinkedIn URL')
    .optional()
    .transform((val) => val?.trim() || null),
  skills: z
    .array(
      z
        .string()
        .min(1, 'Skill cannot be empty')
        .max(50)
        .trim()
    )
    .max(20, 'Maximum 20 skills allowed')
    .optional(),
  isAvailable: z
    .boolean()
    .optional(),
});

export type UpdateAlumniProfileInput = z.infer<typeof updateAlumniProfileSchema>;

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(64, 'First name must be less than 64 characters')
    .trim()
    .refine(validateName, 'First name must only contain letters, hyphens, and spaces')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(64, 'Last name must be less than 64 characters')
    .trim()
    .refine(validateName, 'Last name must only contain letters, hyphens, and spaces')
    .optional(),
  avatarUrl: z
    .union([cloudinaryHeadshotUrlSchema, z.undefined()]),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Notification Schemas
 */

export const listNotificationsQuerySchema = z.object({
  isRead: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;

export const markNotificationAsReadSchema = z.object({
  notificationId: z.string().uuid('Invalid notification ID'),
});

export type MarkNotificationAsReadInput = z.infer<typeof markNotificationAsReadSchema>;

export const markAllNotificationsAsReadSchema = z.object({});

export type MarkAllNotificationsAsReadInput = z.infer<typeof markAllNotificationsAsReadSchema>;

export const deleteNotificationSchema = z.object({
  notificationId: z.string().uuid('Invalid notification ID'),
});

export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>;
