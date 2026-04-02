import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ValidationError } from '@/app/_middleware/error-handler'

/**
 * Common Query Parameter Schemas
 */

export const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
  offset: z.coerce.number().int().nonnegative().default(0),
})

export const filterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type PaginationQuery = z.infer<typeof paginationSchema>
export type FilterQuery = z.infer<typeof filterSchema>

/**
 * Parse pagination parameters from request
 */
export function parsePaginationParams(request: NextRequest): PaginationQuery {
  const searchParams = request.nextUrl.searchParams

  const result = paginationSchema.safeParse({
    limit: searchParams.get('limit'),
    offset: searchParams.get('offset'),
  })

  if (!result.success) {
    throw new ValidationError('Invalid pagination parameters')
  }

  return result.data
}

/**
 * Parse filter and sort parameters
 */
export function parseFilterParams<T extends z.ZodSchema>(
  request: NextRequest,
  schema: T
): z.infer<T> {
  const searchParams = request.nextUrl.searchParams
  const params: Record<string, any> = {}

  searchParams.forEach((value, key) => {
    // Handle boolean strings
    if (value === 'true') params[key] = true
    else if (value === 'false') params[key] = false
    else params[key] = value || undefined
  })

  const result = schema.safeParse(params)

  if (!result.success) {
    throw new ValidationError('Invalid filter parameters')
  }

  return result.data
}

/**
 * Extract user context from request headers
 */
export function extractUserContext(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const userRole = request.headers.get('x-user-role')

  if (!userId) {
    throw new ValidationError('User context missing from request')
  }

  return { userId, userRole: userRole as string | null }
}

/**
 * Validate request ID parameter
 */
export function validateIdParam(id: unknown): string {
  const idSchema = z.string().uuid()
  const result = idSchema.safeParse(id)

  if (!result.success) {
    throw new ValidationError('Invalid ID parameter')
  }

  return result.data
}
