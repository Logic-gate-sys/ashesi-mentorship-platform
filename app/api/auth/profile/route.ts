import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '#utils-types/utils/db'
import { requireAuth, requirePermission } from '#/libs_schemas/middlewares/auth.middleware'
import { updateProfileSchema } from '#/libs_schemas/schemas/auth.schema'
import { ZodError } from 'zod'

/**
 * PATCH /api/auth/profile
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    await requirePermission(user.id, 'user_profile', 'update')

    const body = await request.json()
    const result = updateProfileSchema.safeParse(body);
    if(!result.success){
       return NextResponse.json({
        success: false,
        details: result.error.issues.map((iss)=>({
          path: iss.path.join('.'),
          message: iss.message
        }))
       }, 
       {status: 400}
      );
    }
 
    const validatedData = result.data ;
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(validatedData.firstName && { firstName: validatedData.firstName }),
        ...(validatedData.lastName && { lastName: validatedData.lastName }),
        ...(validatedData.avatarUrl && { avatarUrl: validatedData.avatarUrl }),
      },
      include: {
        menteeProfile: true,
        mentorProfile: true,
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
          studentProfile: updatedUser.menteeProfile,
          alumniProfile: updatedUser.mentorProfile,
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
