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

    // Get the student's user data
    const student = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        studentProfile: {
          include: {
            requests: {
              include: {
                alumni: {
                  include: {
                    user: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
            sessions: {
              include: {
                alumni: {
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

    if (!student || !student.studentProfile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    // Get current cycle
    const currentCycle = await prisma.mentorshipCycle.findFirst({
      where: { status: 'active' },
    })

    const { studentProfile } = student

    // Process requests by status
    const requestsByStatus = {
      pending: studentProfile.requests
        .filter(req => req.status === 'PENDING')
        .map(req => ({
          id: req.id,
          mentorName: `${req.alumni.user.firstName} ${req.alumni.user.lastName}`,
          mentorTitle: req.alumni.jobTitle,
          company: req.alumni.company,
          goal: req.goal,
          industry: req.alumni.industry,
          createdAt: req.createdAt,
          status: req.status,
        })),
      accepted: studentProfile.requests
        .filter(req => req.status === 'ACCEPTED')
        .map(req => ({
          id: req.id,
          mentorName: `${req.alumni.user.firstName} ${req.alumni.user.lastName}`,
          mentorTitle: req.alumni.jobTitle,
          company: req.alumni.company,
          goal: req.goal,
          industry: req.alumni.industry,
          createdAt: req.createdAt,
          status: req.status,
        })),
      declined: studentProfile.requests
        .filter(req => req.status === 'DECLINED')
        .map(req => ({
          id: req.id,
          mentorName: `${req.alumni.user.firstName} ${req.alumni.user.lastName}`,
          mentorTitle: req.alumni.jobTitle,
          company: req.alumni.company,
          goal: req.goal,
          industry: req.alumni.industry,
          createdAt: req.createdAt,
          status: req.status,
        })),
    }

    // Process active mentors (from accepted requests)
    const activeMentors = studentProfile.requests
      .filter(req => req.status === 'ACCEPTED')
      .map((req, index) => {
        const mentorSessions = studentProfile.sessions.filter(
          s => s.mentorId === req.alumniId
        )
        const avgRating =
          mentorSessions.length > 0
            ? (
                mentorSessions.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) /
                mentorSessions.length
              ).toFixed(1)
            : '0'

        return {
          id: req.id,
          name: `${req.alumni.user.firstName} ${req.alumni.user.lastName}`,
          company: req.alumni.company,
          title: req.alumni.jobTitle,
          industry: req.alumni.industry,
          goal: req.goal,
          sessionsCompleted: mentorSessions.length,
          avgRating: parseFloat(String(avgRating)),
          skills: req.alumni.skills || [],
          isAvailable: req.alumni.isAvailable,
          lastMessage: undefined, // Would come from messages table
          nextSession: undefined, // Would come from sessions table
        }
      })

    // Process upcoming sessions
    const upcomingSessions = studentProfile.sessions
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
        date: session.scheduledAt,
        time: new Date(session.scheduledAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        topic: session.topic,
        mentorName: `${session.alumni.user.firstName} ${session.alumni.user.lastName}`,
        mentorCompany: session.alumni.company,
        duration: session.duration,
        meetingUrl: session.meetingUrl,
        meetingPlatform: (session.meetingUrl?.includes('zoom')
          ? 'zoom'
          : session.meetingUrl?.includes('teams')
            ? 'teams'
            : session.meetingUrl?.includes('discord')
              ? 'discord'
              : 'in-person') as any,
      }))

    // Process completed sessions with feedback
    const completedSessions = studentProfile.sessions
      .filter(session => session.status === 'COMPLETED' && session.feedback)
      .map(session => ({
        id: session.id,
        date: session.scheduledAt,
        topic: session.topic || 'Session',
        mentorName: `${session.alumni.user.firstName} ${session.alumni.user.lastName}`,
        mentorCompany: session.alumni.company,
        rating: session.feedback!.rating,
        feedback: session.feedback!.comment || '',
        duration: session.duration,
      }))

    // Calculate stats
    const stats = {
      requestsCount: studentProfile.requests.length,
      mentorsCount: activeMentors.length,
      upcomingCount: upcomingSessions.length,
      completedCount: completedSessions.length,
      avgRating:
        completedSessions.length > 0
          ? (completedSessions.reduce((sum, s) => sum + s.rating, 0) / completedSessions.length)
          : 0,
    }

    const weeksRemaining = currentCycle
      ? Math.ceil(
          (new Date(currentCycle.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24 * 7)
        )
      : 0

    return NextResponse.json({
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        year: studentProfile.yearGroup,
        major: studentProfile.major || 'Undeclared',
      },
      cycle: {
        id: currentCycle?.id || '',
        name: currentCycle?.name || 'Current Cycle',
        status: currentCycle?.status || 'active',
        weeksRemaining,
      },
      requests: requestsByStatus,
      activeMentors,
      upcomingSessions,
      completedSessions,
      stats,
    })
  } catch (error) {
    console.error('Student Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
