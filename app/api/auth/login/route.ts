import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/db'
import { createJWT } from '@/app/_utils/jwt'
import { verifyPassword } from '@/app/_utils/password'
import { loginSchema } from '@/app/_schemas/auth.schema'
import { withErrorHandling, UnauthorizedError } from '@/app/_middleware'
import { validationErrorResponse, successResponse } from '@/app/_utils/api-response'
import { ZodError } from 'zod'

async function handler(request: NextRequest) {
  const parseResult = loginSchema.safeParse(await request.json())
  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  const { email, password } = parseResult.data

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const isPasswordValid = verifyPassword(password, user.passwordHash)
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  }

  const accessToken = await createJWT(tokenPayload, '15m')
  const refreshToken = await createJWT(tokenPayload, '7d')

  const response = successResponse(
    {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    },
    'Login successful',
    200
  )

  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 604800, // 7 days
    path: '/',
  })

  return response
}

export const POST = withErrorHandling(handler)
