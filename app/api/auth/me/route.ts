import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils&types/utils/db';
import { requireAuth } from '@/app/ _libs_and_schemas/abac';

//get user profile : details 
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user: userData } = authResult

    // Fetch full user with profile data
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      include: {
        menteeProfile: true,
        mentorProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { errors: { message: 'User not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isVerified: user.isVerified,
          isActive: user.isActive,
          studentProfile: user.menteeProfile,
          alumniProfile: user.menteeProfile,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[GET_ME_ERROR]', error)
    return NextResponse.json(
      { errors: { message: 'Failed to fetch user' } },
      { status: 500 }
    )
  }
}
