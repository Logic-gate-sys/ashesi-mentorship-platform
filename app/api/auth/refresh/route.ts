import { NextRequest } from 'next/server'
import { verifyJWT } from '@/app/_utils/jwt'
import { createJWT } from '@/app/_utils/jwt'
import { prisma } from '@/app/_utils/db'
import { withErrorHandling, UnauthorizedError, NotFoundError } from '@/app/_middleware'
import { successResponse } from '@/app/_utils/api-response'

async function handler(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value
  if (!refreshToken) {
    throw new UnauthorizedError('No refresh token found')
  }

  const decoded = await verifyJWT(refreshToken)
  if (!decoded?.id) {
    throw new UnauthorizedError('Invalid refresh token')
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  })

  if (!user) {
    throw new NotFoundError('User')
  }

  const accessToken = await createJWT(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    '15m'
  )

  return successResponse(
    { accessToken },
    'Token refreshed successfully',
    200
  )
}

export const POST = withErrorHandling(handler)
