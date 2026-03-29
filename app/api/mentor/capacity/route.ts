import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/db'
import { requireAuth } from '@/app/_lib/abac/middleware'

const MENTOR_CAPACITY = {
  MAX: 3,
  RECOMMENDED_MAX: 2,
  RECOMMENDED_MIN: 1,
}

/**
 * GET /api/mentor/capacity
 * Get mentor's current mentoring capacity status
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Get alumni profile and active mentees
    const alumniProfile = await prisma.alumniProfile.findUnique({
      where: { userId: user.id },
      include: {
        requests: {
          where: { status: 'ACCEPTED' },
          select: { id: true },
        },
      },
    })

    if (!alumniProfile) {
      return NextResponse.json(
        { success: false, error: 'Alumni profile not found' },
        { status: 404 }
      )
    }

    const activeMentees = alumniProfile.requests.length
    const canAcceptMore = activeMentees < MENTOR_CAPACITY.MAX

    let capacityStatus: 'ideal' | 'good' | 'full' | 'over_capacity'
    if (activeMentees >= MENTOR_CAPACITY.MAX) {
      capacityStatus = 'full'
    } else if (activeMentees > MENTOR_CAPACITY.RECOMMENDED_MAX) {
      capacityStatus = 'good'
    } else {
      capacityStatus = 'ideal'
    }

    const messages = {
      ideal: 'You have room to take on more mentees. Recommended capacity.',
      good: 'You are at a manageable level. Can accept 1 more mentee.',
      full: 'You have reached maximum capacity (3 students).',
      over_capacity: 'You are mentoring more than recommended.',
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          activeMentees,
          maxCapacity: MENTOR_CAPACITY.MAX,
          recommendedCapacity: {
            min: MENTOR_CAPACITY.RECOMMENDED_MIN,
            max: MENTOR_CAPACITY.RECOMMENDED_MAX,
          },
          canAcceptMore,
          capacityStatus,
          message: messages[capacityStatus],
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching mentor capacity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mentor capacity' },
      { status: 500 }
    )
  }
}
