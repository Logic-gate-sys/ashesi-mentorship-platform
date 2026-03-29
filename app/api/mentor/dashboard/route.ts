import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/db'
import { requireAuth } from '@/app/_lib/abac/middleware'

export async function GET(request: NextRequest) {
  try {
    // Use middleware to authenticate
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Get the mentor's user data
    const mentor = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        alumniProfile: {
          include: {
            requests: {
              include: {
                student: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            sessions: {
              include: {
                student: {
                  include: {
                    user: true,
                  },
                },
                feedback: true,
              },
            },
          },
        },
      },
    })

    if (!mentor || !mentor.alumniProfile) {
      return NextResponse.json({ error: 'Alumni profile not found' }, { status: 404 })
    }

    const { alumniProfile } = mentor

    // Process pending requests
    const pendingRequests = alumniProfile.requests
      .filter(req => req.status === 'PENDING')
      .map(req => ({
        id: req.id,
        studentId: req.studentId,
        studentName: `${req.student.user.firstName} ${req.student.user.lastName}`,
        goal: req.goal,
        message: req.message,
        status: req.status,
      }))

    // Process active mentees (accepted requests)
    const activeMentees = alumniProfile.requests
      .filter(req => req.status === 'ACCEPTED')
      .map(req => ({
        id: req.id,
        studentId: req.studentId,
        studentName: `${req.student.user.firstName} ${req.student.user.lastName}`,
        studentEmail: req.student.user.email,
        goal: req.goal,
        status: 'active' as const,
      }))

    // Process upcoming sessions
    const upcomingSessions = alumniProfile.sessions
      .filter(
        session =>
          session.status === 'SCHEDULED' &&
          new Date(session.scheduledAt) > new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      )
      .map(session => ({
        id: session.id,
        studentName: `${session.student.user.firstName} ${session.student.user.lastName}`,
        topic: session.topic,
        scheduledAt: session.scheduledAt.toISOString(),
        duration: session.duration,
        meetingUrl: session.meetingUrl,
      }))

    // Calculate metrics
    const totalMentees = activeMentees.length
    const totalSessions = alumniProfile.sessions.length
    const avgRating =
      alumniProfile.sessions.length > 0
        ? (
            alumniProfile.sessions.reduce((sum, session) => {
              return sum + (session.feedback?.rating || 0)
            }, 0) / alumniProfile.sessions.length
          ).toFixed(1)
        : '0'

    return NextResponse.json({
      mentor: {
        id: mentor.id,
        name: `${mentor.firstName} ${mentor.lastName}`,
        email: mentor.email,
        jobTitle: alumniProfile.jobTitle,
        company: alumniProfile.company,
        bio: alumniProfile.bio,
        skills: alumniProfile.skills,
        isAvailable: alumniProfile.isAvailable,
      },
      metrics: {
        totalMentees,
        totalSessions,
        avgRating: parseFloat(String(avgRating)),
        pendingRequests: pendingRequests.length,
      },
      pendingRequests,
      activeMentees,
      upcomingSessions,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
