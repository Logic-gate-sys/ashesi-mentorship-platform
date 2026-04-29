import { z } from 'zod';

/**
 * Session Schemas
 */

export const createSessionSchema = z.object({
  requestId: z.string().uuid('Invalid request ID'),
  topic: z
    .string()
    .min(5, 'Topic must be at least 5 characters')
    .max(200, 'Topic must be less than 200 characters')
    .trim(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .transform((val) => val?.trim() || null),
  scheduledAt: z
    .string()
    .datetime('Invalid date format, must be ISO 8601')
    .transform((val) => new Date(val)),
  duration: z.coerce.number().int('Duration must be a whole number').min(15, 'Minimum duration is 15 minutes').max(480, 'Maximum duration is 8 hours'),
  meetingUrl: z
    .string()
    .url('Invalid URL')
    .optional()
    .transform((val) => val?.trim() || null),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const updateSessionSchema = z.object({
  topic: z
    .string()
    .min(5, 'Topic must be at least 5 characters')
    .max(200, 'Topic must be less than 200 characters')
    .trim()
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .transform((val) => val?.trim() || null),
  scheduledAt: z
    .string()
    .datetime('Invalid date format, must be ISO 8601')
    .transform((val) => new Date(val))
    .optional(),
  duration: z.coerce.number().int().min(15).max(480).optional(),
  meetingUrl: z
    .string()
    .url('Invalid URL')
    .optional()
    .transform((val) => val?.trim() || null),
});

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

export const sessionStatusSchema = z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);

/**
 * Session Feedback Schemas
 */

export const createSessionFeedbackSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  rating: z
    .coerce.number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  comment: z
    .string()
    .max(500, 'Comment must be less than 500 characters')
    .optional()
    .transform((val) => val?.trim() || null),
});

export type CreateSessionFeedbackInput = z.infer<typeof createSessionFeedbackSchema>;

export const updateSessionFeedbackSchema = z.object({
  rating: z
    .coerce.number()
    .int()
    .min(1)
    .max(5)
    .optional(),
  comment: z
    .string()
    .max(500)
    .optional()
    .transform((val) => val?.trim() || null),
});

export type UpdateSessionFeedbackInput = z.infer<typeof updateSessionFeedbackSchema>;

/**
 * List query schemas
 */
export const listSessionsQuerySchema = z.object({
  status: sessionStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(['scheduledAt', 'createdAt']).default('scheduledAt'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type ListSessionsQuery = z.infer<typeof listSessionsQuerySchema>;
