import { z } from 'zod';

/**
 * Mentorship Cycle Schemas
 */

export const cycleStatusSchema = z.enum(['PLANNING', 'ACTIVE', 'CLOSED', 'ENDED']);

export const createMentorshipCycleSchema = z.object({
  name: z
    .string()
    .min(3, 'Cycle name must be at least 3 characters')
    .max(100, 'Cycle name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional(),
  startDate: z
    .string()
    .datetime('Invalid start date format, must be ISO 8601')
    .transform((val) => new Date(val)),
  endDate: z
    .string()
    .datetime('Invalid end date format, must be ISO 8601')
    .transform((val) => new Date(val)),
});

export type CreateMentorshipCycleInput = z.infer<typeof createMentorshipCycleSchema>;

export const createMentorshipCycleSchema_Validated = createMentorshipCycleSchema.refine(
  (data) => data.startDate < data.endDate,
  {
    message: 'Start date must be before end date',
    path: ['endDate'],
  }
);

export const updateMentorshipCycleSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100)
    .trim()
    .optional(),
  description: z
    .string()
    .min(10)
    .max(1000)
    .trim()
    .optional(),
  startDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  endDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  status: cycleStatusSchema.optional(),
});

export type UpdateMentorshipCycleInput = z.infer<typeof updateMentorshipCycleSchema>;

/**
 * List Cycles Query
 */
export const listMentorshipCyclesQuerySchema = z.object({
  status: cycleStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(['startDate', 'createdAt']).default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListMentorshipCyclesQuery = z.infer<typeof listMentorshipCyclesQuerySchema>;

/**
 * User Management Schemas (Admin)
 */

export const activateUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export type ActivateUserInput = z.infer<typeof activateUserSchema>;

export const deactivateUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  reason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
    .transform((val) => val?.trim() || null),
});

export type DeactivateUserInput = z.infer<typeof deactivateUserSchema>;

export const verifyUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export type VerifyUserInput = z.infer<typeof verifyUserSchema>;

export const listUsersQuerySchema = z.object({
  role: z.enum(['STUDENT', 'ALUMNI', 'ADMIN']).optional(),
  isActive: z.coerce.boolean().optional(),
  isVerified: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(['createdAt', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
