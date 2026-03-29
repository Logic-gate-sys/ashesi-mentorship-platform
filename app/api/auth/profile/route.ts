import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/db'
import { requireAuth, requirePermission } from '@/app/_lib/abac/middleware'
import { updateProfileSchema } from '@/app/_schemas/auth.schema'
import { getPermittedFields } from '@/app/_lib/abac/engine'
import { ZodError } from 'zod'

/**
 * PATCH /api/auth/profile
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    // Authenticate and get user
    const authResult = await requirePermission(request, 'user_profile', 'update')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // Get permitted fields for this user
    const permittedData = getPermittedFields(
      permissions,
      'user_profile',
      'update',
      validatedData,
      { userId: user.id }
    )

    // Update user profile with only permitted fields
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(permittedData.firstName && { firstName: permittedData.firstName }),
        ...(permittedData.lastName && { lastName: permittedData.lastName }),
        ...(permittedData.avatarUrl && { avatarUrl: permittedData.avatarUrl }),
      },
      include: {
        studentProfile: true,
        alumniProfile: true,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          avatarUrl: updatedUser.avatarUrl,
          isVerified: updatedUser.isVerified,
          isActive: updatedUser.isActive,
          studentProfile: updatedUser.studentProfile,
          alumniProfile: updatedUser.alumniProfile,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      return NextResponse.json({ errors: fieldErrors }, { status: 400 })
    }

    console.error('[UPDATE_PROFILE_ERROR]', error)
    return NextResponse.json(
      { errors: { message: 'Failed to update profile' } },
      { status: 500 }
    )
  }
}
