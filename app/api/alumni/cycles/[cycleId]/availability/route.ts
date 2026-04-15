import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/_lib/abac/middleware'
import { CycleService } from '@/app/_services'
import { successResponse, serverErrorResponse, notFoundResponse } from '@/app/_utils/api-response'

interface RouteParams {
  params: Promise<{ cycleId: string }>
}

/**
 * GET /api/alumni/cycles/:cycleId/availability
 * Get an alumni's availability status for a specific cycle
 * Requires alumni authentication
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const { cycleId } = await context.params

    if (!user.alumniProfile?.id) {
      return notFoundResponse('Alumni profile')
    }

    const availability = await CycleService.getAlumniCycleAvailability(cycleId, user.alumniProfile.id)

    if (!availability) {
      return successResponse(
        {
          cycleId,
          alumniId: user.alumniProfile.id,
          isAvailable: false,
          maxMentees: 0,
          updatedAt: new Date().toISOString(),
        },
        'Alumni availability for cycle'
      )
    }

    return successResponse(
      {
        cycleId: availability.cycleId,
        alumniId: availability.alumniId,
        isAvailable: availability.isAvailable,
        maxMentees: availability.maxMentees,
        updatedAt: availability.updatedAt.toISOString(),
      },
      'Alumni availability for cycle'
    )
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to fetch availability status')
  }
}

interface UpdateAvailabilityBody {
  isAvailable: boolean
  maxMentees?: number // 1, 2, or 3 (respects capacity constraint)
}

/**
 * PUT /api/alumni/cycles/:cycleId/availability
 * Toggle alumni availability for a mentorship cycle
 * Alumni can set themselves as available/unavailable for the cycle
 * Requires alumni authentication
 */
export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const { cycleId } = await context.params
    const body = (await request.json()) as UpdateAvailabilityBody
    const { isAvailable, maxMentees = 2 } = body

    if (!user.alumniProfile?.id) {
      return notFoundResponse('Alumni profile')
    }

    if (maxMentees < 1 || maxMentees > 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Max mentees must be between 1-3',
        },
        { status: 400 }
      )
    }


    const updated = await CycleService.updateAlumniCycleAvailability(cycleId, user.alumniProfile.id, {
      isAvailable,
      maxMentees: isAvailable ? maxMentees : 0,
    })

    return successResponse(
      {
        cycleId: updated.cycleId,
        alumniId: updated.alumniId,
        isAvailable: updated.isAvailable,
        maxMentees: updated.maxMentees,
        updatedAt: updated.updatedAt.toISOString(),
      },
      isAvailable
        ? `You're now visible in student searches for up to ${maxMentees} mentee${maxMentees > 1 ? 's' : ''}`
        : 'Your profile is hidden from student searches for this cycle'
    )
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to update availability')
  }
}
