import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, requireAuth } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter } from '@/app/_lib/abac/engine'
import { MentorshipRequestService, NotificationService } from '@/app/_services'
import { withErrorHandling, NotFoundError, ForbiddenError, ConflictError } from '@/app/_middleware'
import { paginatedResponse, successResponse, validationErrorResponse } from '@/app/_utils/api-response'
import { parsePaginationParams } from '@/app/_lib/query-parser'
import { toMentorshipRequestDTO } from '@/app/_dtos'
import { z } from 'zod'

/**
 * GET /api/mentor/requests
 * List mentorship requests with pagination
 */
async function getHandler(request: NextRequest) {
  const authResult = await requirePermission(request, 'mentorship_request', 'list')
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { permissions } = authResult

  const pagination = parsePaginationParams(request)
  const statusParam = request.nextUrl.searchParams.get('status') || 'PENDING'
  const statusSchema = z.enum(['PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED'])

  const statusResult = statusSchema.safeParse(statusParam)
  if (!statusResult.success) {
    return validationErrorResponse(statusResult.error)
  }

  const filter = buildPermissionFilter(permissions, 'mentorship_request', 'list')
  const { requests, total } = await MentorshipRequestService.listRequests(filter, {
    status: statusResult.data,
    limit: pagination.limit,
    offset: pagination.offset,
  })

  const dtos = requests.map(toMentorshipRequestDTO)

  return paginatedResponse(dtos, pagination.limit, pagination.offset, total, 200)
}

/**
 * POST /api/mentor/requests
 * Accept a mentorship request
 */
const acceptRequestSchema = z.object({
  requestId: z.string().uuid('Invalid request ID'),
})

async function postHandler(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  const body = await request.json()
  const parseResult = acceptRequestSchema.safeParse(body)

  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  const { requestId } = parseResult.data
  const mentorshipRequest = await MentorshipRequestService.getRequestById(requestId)

  if (!mentorshipRequest) {
    throw new NotFoundError('Mentorship request')
  }

  // Check permission - alumni can only accept requests directed to them
  if (
    user.role === 'ALUMNI' &&
    mentorshipRequest.alumniId !== user.alumniProfile?.id
  ) {
    throw new ForbiddenError('You do not have permission to accept this request')
  }

  if (mentorshipRequest.status !== 'PENDING') {
    throw new ConflictError(`Cannot accept request with status: ${mentorshipRequest.status}`)
  }

  const updated = await MentorshipRequestService.acceptRequest(requestId)

  await NotificationService.createNotification(
    mentorshipRequest.student.userId,
    'REQUEST_ACCEPTED',
    'Mentorship Accepted',
    `${mentorshipRequest.alumni.user.firstName} ${mentorshipRequest.alumni.user.lastName} accepted your mentorship request`,
    `/dashboard/sessions?requestId=${requestId}`
  )

  const dto = toMentorshipRequestDTO(updated)

  return successResponse(dto, 'Request accepted successfully', 200)
}

export const GET = withErrorHandling(getHandler)
export const POST = withErrorHandling(postHandler)
