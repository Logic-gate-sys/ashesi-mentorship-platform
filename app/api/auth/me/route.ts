import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/_lib/abac/middleware'
import { ProfileService } from '@/app/_services'
import { withErrorHandling, NotFoundError } from '@/app/_middleware'
import { successResponse } from '@/app/_utils/api-response'
import { toUserProfileDTO } from '@/app/_dtos'

async function handler(request: NextRequest) {
  const authResult = await requireAuth(request)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user: userData } = authResult

  const user = await ProfileService.getUserProfile(userData.id)

  if (!user) {
    throw new NotFoundError('User')
  }

  const dto = toUserProfileDTO(user)

  return successResponse(
    {
      user: {
        ...dto,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        isActive: user.isActive,
        studentProfile: user.studentProfile,
        alumniProfile: user.alumniProfile,
      },
    },
    'User profile retrieved'
  )
}

export const GET = withErrorHandling(handler)
