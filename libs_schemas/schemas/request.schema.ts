import { z } from 'zod';

/**
 * Mentorship Request Schemas
 */

export const createMentorshipRequestSchema = z.object({
  alumniId: z.string().uuid('Invalid alumni ID'),
  goal: z
    .string()
    .min(20, 'Goal must be at least 20 characters')
    .max(500, 'Goal must be less than 500 characters')
    .trim(),
  message: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional()
    .transform((val) => val?.trim() || null),
});

export type CreateMentorshipRequestInput = z.infer<typeof createMentorshipRequestSchema>;

export const updateMentorshipRequestSchema = z.object({
  goal: z
    .string()
    .min(20, 'Goal must be at least 20 characters')
    .max(500, 'Goal must be less than 500 characters')
    .trim()
    .optional(),
  message: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional()
    .transform((val) => val?.trim() || null),
});

export type UpdateMentorshipRequestInput = z.infer<typeof updateMentorshipRequestSchema>;

export const mentorshipRequestStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED']);

export const acceptMentorshipRequestSchema = z.object({
  requestId: z.string().uuid('Invalid request ID'),
});

export const declineMentorshipRequestSchema = z.object({
  requestId: z.string().uuid('Invalid request ID'),
  reason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
    .transform((val) => val?.trim() || null),
});

export type DeclineMentorshipRequestInput = z.infer<typeof declineMentorshipRequestSchema>;

/**
 * List query schemas
 */
export const listMentorshipRequestsQuerySchema = z.object({
  status: mentorshipRequestStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListMentorshipRequestsQuery = z.infer<typeof listMentorshipRequestsQuerySchema>;
