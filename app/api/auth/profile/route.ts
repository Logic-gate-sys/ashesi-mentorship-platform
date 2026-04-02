import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/app/_lib/abac/middleware'
import { updateProfileSchema } from '@/app/_schemas/auth.schema'
import { getPermittedFields } from '@/app/_lib/abac/engine'
import { ProfileService } from '@/app/_services'
import { ZodError } from 'zod'

/**
 * PATCH /api/auth/profile
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, 'user_profile', 'update')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const permittedData = getPermittedFields(
      permissions,
      'user_profile',
      'update',
      validatedData,
      { userId: user.id }
    )

    const updatedUser = await ProfileService.updateUserProfile(user.id, {
      ...(permittedData.firstName && { firstName: permittedData.firstName }),
      ...(permittedData.lastName && { lastName: permittedData.lastName }),
      ...(permittedData.avatarUrl && { avatarUrl: permittedData.avatarUrl }),
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
