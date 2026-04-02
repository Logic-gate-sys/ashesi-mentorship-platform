import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/_lib/abac/middleware'
import { SessionService, SessionFeedbackService, ProfileService } from '@/app/_services'
import { withErrorHandling, NotFoundError } from '@/app/_middleware'
import { successResponse } from '@/app/_utils/api-response'

interface MetricItem {
  value: string | number
  label: string
}

/**
 * GET /api/mentor/metrics
 * Fetches mentor impact metrics
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

  const { sessions, total: totalSessions } = await SessionService.listSessions(
    { mentorId: alumniProfile.id },
    { limit: 1000, offset: 0 }
  )

  const activeMentees = await SessionService.countActiveSessions(alumniProfile.id)
  const totalHours = sessions.reduce((sum, session) => {
    return sum + (session.duration || 0)
  }, 0)

  const avgRating = await SessionFeedbackService.getAverageRating(alumniProfile.id)

  const metrics: MetricItem[] = [
    {
      value: activeMentees,
      label: 'Active Mentees',
    },
    {
      value: totalSessions,
      label: 'Total Sessions',
    },
    {
      value: `${totalHours}h`,
      label: 'Total Hours',
    },
    {
      value: avgRating,
      label: 'Average Rating',
    },
  ]

  return successResponse({ metrics }, 'Metrics retrieved')
}

export const GET = withErrorHandling(handler)
