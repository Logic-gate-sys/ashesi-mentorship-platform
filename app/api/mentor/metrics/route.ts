import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/db'
import { requireAuth } from '@/app/_lib/abac/middleware'

interface MetricItem {
  value: string | number
  label: string
}

/**
 * GET /api/mentor/metrics
 * Fetches mentor impact metrics (mentees, sessions, hours, rating)
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Get alumni profile for the current user
    const alumniProfile = await prisma.alumniProfile.findUnique({
      where: { userId: user.id },
      include: {
        requests: {
          where: { status: 'ACCEPTED' },
        },
        sessions: {
          include: { feedback: true },
        },
      },
    })

    if (!alumniProfile) {
      return NextResponse.json({ success: false, error: 'Alumni profile not found' }, { status: 404 })
    }

    // Calculate metrics
    const activeMentees = alumniProfile.requests.length
    const totalSessions = alumniProfile.sessions.length
    const totalHours = alumniProfile.sessions.reduce((sum, session) => {
      return sum + (session.duration || 0)
    }, 0)
    const avgRating =
      totalSessions > 0
        ? (
            alumniProfile.sessions.reduce((sum, session) => {
              return sum + (session.feedback?.rating || 0)
            }, 0) / totalSessions
          ).toFixed(1)
        : '0'

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

    return NextResponse.json({ success: true, data: metrics }, { status: 200 })
  } catch (error) {
    console.error('Error fetching mentor metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mentor metrics' },
      { status: 500 }
    )
  }
}
