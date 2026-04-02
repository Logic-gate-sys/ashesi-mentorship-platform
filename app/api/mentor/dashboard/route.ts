import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/_lib/abac/middleware'
import { SessionService, MentorshipRequestService, ProfileService } from '@/app/_services'
import { withErrorHandling, NotFoundError } from '@/app/_middleware'
import { successResponse } from '@/app/_utils/api-response'

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

  const { requests: allRequests } = await MentorshipRequestService.listRequests(
    { alumniId: alumniProfile.id }
  )

  const pendingRequests = allRequests
    .filter(req => req.status === 'PENDING')
    .map(req => ({
      id: req.id,
      studentId: req.studentId,
      studentName: `${req.student.user.firstName} ${req.student.user.lastName}`,
      goal: req.goal,
      message: req.message,
      status: req.status,
    }))

  const activeMentees = allRequests
    .filter(req => req.status === 'ACCEPTED')
    .map(req => ({
      id: req.id,
      studentId: req.studentId,
      studentName: `${req.student.user.firstName} ${req.student.user.lastName}`,
      studentEmail: req.student.user.email,
      goal: req.goal,
      status: 'active' as const,
    }))

  const upcoming = await SessionService.getUpcomingSessions(alumniProfile.id, 10)
  const upcomingSessions = upcoming
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

  const totalMentees = activeMentees.length
  const allSessions = await SessionService.listSessions(
    { mentorId: alumniProfile.id },
    { limit: 1000, offset: 0 }
  )
  const totalSessions = allSessions.sessions.length

  const avgRating =
    allSessions.sessions.length > 0
      ? (
          allSessions.sessions.reduce((sum, session) => {
            return sum + (session.feedback?.[0]?.rating || 0)
          }, 0) / allSessions.sessions.length
        ).toFixed(1)
      : '0'

  const dashboard = {
    mentor: {
      id: alumniProfile.user.id,
      name: `${alumniProfile.user.firstName} ${alumniProfile.user.lastName}`,
      email: alumniProfile.user.email,
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
  }

  return successResponse(dashboard, 'Dashboard data retrieved')
}

export const GET = withErrorHandling(handler)
