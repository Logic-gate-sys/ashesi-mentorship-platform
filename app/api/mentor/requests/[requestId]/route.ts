import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/app/_lib/abac/middleware'
import { MentorshipRequestService, NotificationService } from '@/app/_services'
import { withErrorHandling, NotFoundError, ConflictError, ValidationError } from '@/app/_middleware'
import { successResponse, validationErrorResponse } from '@/app/_utils/api-response'
import { toMentorshipRequestDTO } from '@/app/_dtos'
import { z } from 'zod'

/**
 * GET /api/mentor/requests/:requestId
 * Get a specific mentorship request details
 */
async function getHandler(
  request: NextRequest,
  context: { params: { requestId: string } }
) {
  const { requestId } = context.params

  if (!requestId || typeof requestId !== 'string') {
    throw new ValidationError('Invalid request ID')
  }

  const mentorshipRequest = await MentorshipRequestService.getRequestDetails(requestId)

  if (!mentorshipRequest) {
    throw new NotFoundError('Mentorship request')
  }

  const authResult = await requirePermission(
    request,
    'mentorship_request',
    'read',
    {
      type: 'mentorship_request',
      alumniId: mentorshipRequest.alumniId,
      studentId: mentorshipRequest.studentId,
    }
  )

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const dto = toMentorshipRequestDTO(mentorshipRequest)

  return successResponse(dto, 'Request details retrieved')
}

/**
 * POST /api/mentor/requests/:requestId
 * Accept or decline a mentorship request
 */
const actionSchema = z.object({
  action: z.enum(['accept', 'decline']),
  reason: z.string().optional(),
})

async function postHandler(
  request: NextRequest,
  context: { params: { requestId: string } }
) {
  const { requestId } = context.params

  if (!requestId || typeof requestId !== 'string') {
    throw new ValidationError('Invalid request ID')
  }

  const mentorshipRequest = await MentorshipRequestService.getRequestDetails(requestId)

  if (!mentorshipRequest) {
    throw new NotFoundError('Mentorship request')
  }

  const authResult = await requirePermission(request, 'mentorship_request', 'accept', {
    type: 'mentorship_request',
    alumniId: mentorshipRequest.alumniId,
  })

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const body = await request.json()
  const parseResult = actionSchema.safeParse(body)

  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  const { action, reason } = parseResult.data

  if (mentorshipRequest.status !== 'PENDING') {
    throw new ConflictError(
      `Cannot ${action} a request with status: ${mentorshipRequest.status}`
    )
  }

  const updatedRequest = action === 'accept'
    ? await MentorshipRequestService.acceptRequest(requestId)
    : await MentorshipRequestService.declineRequest(requestId)

  const notificationType = action === 'accept' ? 'REQUEST_ACCEPTED' : 'REQUEST_DECLINED'
  const notificationTitle = action === 'accept' ? 'Mentorship Request Accepted' : 'Mentorship Request Declined'
  const notificationMessage = reason
    ? `${mentorshipRequest.alumni.user.firstName} ${action === 'accept' ? 'accepted' : 'declined'} your request: ${reason}`
    : `${mentorshipRequest.alumni.user.firstName} ${action === 'accept' ? 'accepted' : 'declined'} your mentorship request`

  await NotificationService.createNotification(
    mentorshipRequest.student.userId,
    notificationType,
    notificationTitle,
    notificationMessage,
    `/dashboard/requests?requestId=${requestId}`
  )

  const dto = toMentorshipRequestDTO(updatedRequest)

  return successResponse(
    dto,
    `Mentorship request ${action === 'accept' ? 'accepted' : 'declined'}`,
    200
  )
}

export const GET = withErrorHandling(getHandler)
export const POST = withErrorHandling(postHandler)
