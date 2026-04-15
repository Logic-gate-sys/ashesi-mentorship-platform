import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/db'
import { createJWT } from '@/app/_utils/jwt'
import { hashPassword } from '@/app/_utils/password'
import { studentRegisterSchema } from '@/app/_schemas/auth.schema'
import { Role } from '@/prisma/generated/prisma/enums'

/**
 * POST /api/auth/register/student
 * 
 * Register a new student user with complete profile information
 * 
 * Expected body:
 * {
 *   firstName: string       // Step 1: Personal Info
 *   lastName: string
 *   email: string           // Must be @ashesi.edu.gh
 *   major: string           // Step 2: Profile
 *   year: number            // 1-4
 *   password: string        // Step 3: Security
 *   confirm: string         // Must match password
 *   interests: string[]     // Step 4: Skills & Interests (min 1, max 10)
 *   bio?: string            // Step 5: Profile & Links (optional, max 500 chars)
 *   linkedin?: string       // Optional, must be valid URL
 * }
 * 
 * Returns:
 * - 201: { token, user } - Successfully registered with JWT token
 * - 400: { error, details } - Validation errors
 * - 500: { error } - Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = studentRegisterSchema.safeParse(body)
    if (!result.success) {
      const errors: Record<string, string> = {}
      
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        errors[path] = issue.message
      })

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      )
    }

    const validatedData = result.data

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    const passwordHash = hashPassword(validatedData.password)

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role: Role.STUDENT,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,

        studentProfile: {
          create: {
            yearGroup: validatedData.year,
            major: validatedData.major,
            interests: validatedData.interests || [],
            bio: validatedData.bio || null,
            linkedin: validatedData.linkedin || null,
          },
        },
      },
      include: { studentProfile: true },
    })

    const accessToken = await createJWT(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      '15m'
    )

    const refreshToken = await createJWT(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      '7d'
    )

    const response = NextResponse.json(
      {
        accessToken, // Client should store this in sessionStorage
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          studentProfile: user.studentProfile ? {
            yearGroup: user.studentProfile.yearGroup,
            major: user.studentProfile.major,
            interests: user.studentProfile.interests,
            bio: user.studentProfile.bio,
            linkedin: user.studentProfile.linkedin,
          } : null,
        },
      },
      { status: 201 }
    )

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Student registration error:', error)

    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 400 }
        )
      }
      
      console.error('Unexpected error during registration:', error.message)
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
