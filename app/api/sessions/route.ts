import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter, buildSessionFilter } from '@/app/_lib/abac/engine'
import { SessionService, ProfileService, MentorshipRequestService, NotificationService } from '@/app/_services'
import { createSessionSchema } from '@/app/_schemas/session.schema'
import { withErrorHandling, NotFoundError, ConflictError } from '@/app/_middleware'
import { successResponse, paginatedResponse, validationErrorResponse } from '@/app/_utils/api-response'
import { parsePaginationParams } from '@/app/_lib/query-parser'
import { toSessionDTO } from '@/app/_dtos'
import { validateSessionData } from '@/app/_validators'
import { z } from 'zod'

/**
 * POST /api/sessions
 * Create a new session
 */
async function postHandler(request: NextRequest) {
  const authResult = await requirePermission(request, 'session', 'create')

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  const alumniProfile = await ProfileService.getOrCreateAlumniProfile(user.id)
  if (!alumniProfile) {
    throw new NotFoundError('Alumni profile')
  }

  const body = await request.json()
  const parseResult = createSessionSchema.safeParse(body)

  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  const { requestId, topic, notes, scheduledAt, duration, meetingUrl } = parseResult.data

  const mentorshipRequest = await MentorshipRequestService.getRequestById(requestId)
  if (!mentorshipRequest) {
    throw new NotFoundError('Mentorship request')
  }

  if (mentorshipRequest.status !== 'ACCEPTED') {
    throw new ConflictError('Mentorship request must be accepted before creating sessions')
  }

  if (mentorshipRequest.alumniId !== alumniProfile.id) {
    throw new ConflictError('You can only create sessions for requests directed to you')
  }

  validateSessionData({
    title: topic,
    description: notes || '',
    startTime: new Date(scheduledAt),
    endTime: new Date(new Date(scheduledAt).getTime() + duration * 60000),
    mentorId: alumniProfile.id,
    studentId: mentorshipRequest.studentId,
  })

  const session = await SessionService.createSession(alumniProfile.id, requestId, {
    topic,
    notes,
    scheduledAt: new Date(scheduledAt),
    duration,
    meetingUrl,
  })

  const studentProfile = await ProfileService.getStudentById(mentorshipRequest.studentId)
  if (studentProfile) {
    await NotificationService.createNotification(
      studentProfile.userId,
      'SESSION_SCHEDULED',
      'Session Scheduled',
      `Your mentorship session with ${alumniProfile.user.firstName} is scheduled for ${new Date(scheduledAt).toLocaleString()}`,
      `/dashboard/sessions/${session.id}`
    )
  }

  const dto = toSessionDTO(session)
  return successResponse(dto, 'Session created successfully', 201)
}

/**
 * GET /api/sessions
 * List sessions with permission-based filtering
 */
async function getHandler(request: NextRequest) {
  const authResult = await requirePermission(request, 'session', 'list')

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { permissions } = authResult

  const pagination = parsePaginationParams(request)
  const statusParam = request.nextUrl.searchParams.get('status')
  const statusSchema = z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional()

  const statusResult = statusSchema.safeParse(statusParam)
  if (!statusResult.success) {
    return validationErrorResponse(statusResult.error)
  }

  const permissionFilter = buildPermissionFilter(permissions, 'session', 'list')

  const { sessions, total } = await SessionService.listSessions(permissionFilter, {
    status: statusResult.data,
    limit: pagination.limit,
    offset: pagination.offset,
  })

  const dtos = sessions.map(toSessionDTO)

  return paginatedResponse(dtos, pagination.limit, pagination.offset, total)
}

export const POST = withErrorHandling(postHandler)
export const GET = withErrorHandling(getHandler)
