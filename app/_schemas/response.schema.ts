import { z } from 'zod';

/**
 * Generic API Response Schemas
 */

export const createApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    timestamp: z.string().datetime().optional(),
  });

export const paginatedResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    pagination: z.object({
      limit: z.number().int().min(1),
      offset: z.number().int().min(0),
      total: z.number().int().min(0),
      hasMore: z.boolean(),
    }),
    timestamp: z.string().datetime().optional(),
  });

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.record(z.string()).optional(),
  timestamp: z.string().datetime().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

/**
 * Login/Auth Response Schemas
 */
export const loginResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string().optional(),
    user: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      role: z.enum(['STUDENT', 'ALUMNI', 'ADMIN']),
      isVerified: z.boolean(),
      isActive: z.boolean(),
    }),
  }),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

/**
 * Register Response Schema
 */
export const registerResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    token: z.string(),
    user: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      role: z.enum(['STUDENT', 'ALUMNI', 'ADMIN']),
    }),
  }),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;

/**
 * Pagination input schema
 */
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * Sort input schema
 */
export const sortInputSchema = z.object({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SortInput = z.infer<typeof sortInputSchema>;
