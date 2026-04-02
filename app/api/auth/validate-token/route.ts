/**
 * POST /api/auth/validate-token
 * Validates a magic token from an email link
 * Used for one-click availability toggle, mentorship confirmations, etc.
 */

import { NextRequest } from 'next/server'
import { verifyMagicToken } from '@/app/_utils/tokens'
import { withErrorHandling, ValidationError, UnauthorizedError } from '@/app/_middleware'
import { successResponse } from '@/app/_utils/api-response'
import { z } from 'zod'

const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

async function handler(request: NextRequest) {
  const body = await request.json()
  const parse = validateTokenSchema.safeParse(body)

  if (!parse.success) {
    throw new ValidationError('Invalid request body')
  }

  const { token } = parse.data
  const result = await verifyMagicToken(token)

  if (!result.valid) {
    throw new UnauthorizedError(result.error || 'Invalid token')
  }

  return successResponse(
    { valid: true, payload: result.payload },
    'Token validated successfully',
    200
  )
}

export const POST = withErrorHandling(handler)
