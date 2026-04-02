import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/_lib/abac/middleware'
import { SessionService, ProfileService } from '@/app/_services'
import { withErrorHandling, NotFoundError } from '@/app/_middleware'
import { successResponse } from '@/app/_utils/api-response'

const MENTOR_CAPACITY = {
  MAX: 3,
  RECOMMENDED_MAX: 2,
  RECOMMENDED_MIN: 1,
}

const CAPACITY_MESSAGES = {
  ideal: 'You have room to take on more mentees. Recommended capacity.',
  good: 'You are at a manageable level. Can accept 1 more mentee.',
  full: 'You have reached maximum capacity (3 students).',
  over_capacity: 'You are mentoring more than recommended.',
}

type CapacityStatus = keyof typeof CAPACITY_MESSAGES

/**
 * GET /api/mentor/capacity
 * Get mentor's current mentoring capacity status
 */
async function handler(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  const alumniProfile = await ProfileService.getOrCreateAlumniProfile(user.id)

  if (!alumniProfile) {
    throw new NotFoundError('Alumni profile')
  }

  const activeMentees = await SessionService.countActiveSessions(alumniProfile.id)
  const canAcceptMore = activeMentees < MENTOR_CAPACITY.MAX

  let capacityStatus: CapacityStatus
  if (activeMentees >= MENTOR_CAPACITY.MAX) {
    capacityStatus = 'full'
  } else if (activeMentees > MENTOR_CAPACITY.RECOMMENDED_MAX) {
    capacityStatus = 'good'
  } else {
    capacityStatus = 'ideal'
  }

  const data = {
    activeMentees,
    maxCapacity: MENTOR_CAPACITY.MAX,
    recommendedCapacity: {
      min: MENTOR_CAPACITY.RECOMMENDED_MIN,
      max: MENTOR_CAPACITY.RECOMMENDED_MAX,
    },
    canAcceptMore,
    capacityStatus,
    message: CAPACITY_MESSAGES[capacityStatus],
  }

  return successResponse(data, 'Capacity retrieved')
}

export const GET = withErrorHandling(handler)
