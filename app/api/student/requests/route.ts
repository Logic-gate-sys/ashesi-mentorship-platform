import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter } from '@/app/_lib/abac/engine'
import { MentorshipRequestService, ProfileService, NotificationService } from '@/app/_services'
import { createMentorshipRequestSchema } from '@/app/_schemas/request.schema'
import { withErrorHandling, NotFoundError, ConflictError } from '@/app/_middleware'
import { successResponse, paginatedResponse, validationErrorResponse } from '@/app/_utils/api-response'
import { parsePaginationParams } from '@/app/_lib/query-parser'
import { toMentorshipRequestDTO } from '@/app/_dtos'
import { validateMentorshipRequest } from '@/app/_validators'
import { z } from 'zod'

/**
 * POST /api/student/requests
 * Create a new mentorship request
 */
async function postHandler(request: NextRequest) {
  const authResult = await requirePermission(request, 'mentorship_request', 'create')

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  const studentProfile = await ProfileService.getOrCreateStudentProfile(user.id)
  if (!studentProfile) {
    throw new NotFoundError('Student profile')
  }

  const body = await request.json()
  const parseResult = createMentorshipRequestSchema.safeParse(body)

  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  const { alumniId, goal, message } = parseResult.data

  const alumniProfile = await ProfileService.getAlumniById(alumniId)
  if (!alumniProfile) {
    throw new NotFoundError('Alumni')
  }

  if (!alumniProfile.isAvailable) {
    throw new ConflictError('This mentor is not currently available')
  }

  const existingRequests = await MentorshipRequestService.listRequests(
    { studentId: studentProfile.id, alumniId, statusIn: ['PENDING', 'ACCEPTED'] },
    { limit: 1, offset: 0 }
  )

  validateMentorshipRequest(
    { studentId: studentProfile.id, alumniId, goal, message },
    existingRequests.total
  )

  const mentorshipRequest = await MentorshipRequestService.createRequest(
    studentProfile.id,
    { alumniId, goal, message }
  )

  await NotificationService.createNotification(
    alumniProfile.userId,
    'REQUEST_RECEIVED',
    'New Mentorship Request',
    `${studentProfile.user.firstName} ${studentProfile.user.lastName} sent you a mentorship request`,
    `/dashboard/requests?requestId=${mentorshipRequest.id}`
  )

  const dto = toMentorshipRequestDTO(mentorshipRequest)
  return successResponse(dto, 'Mentorship request created successfully', 201)
}

/**
 * GET /api/student/requests
 * List mentorship requests with permission-based filtering
 */
async function getHandler(request: NextRequest) {
  const authResult = await requirePermission(request, 'mentorship_request', 'list')

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { permissions } = authResult

  const pagination = parsePaginationParams(request)
  const statusParam = request.nextUrl.searchParams.get('status')
  const statusSchema = z.enum(['PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED']).optional()

  const statusResult = statusSchema.safeParse(statusParam)
  if (!statusResult.success) {
    return validationErrorResponse(statusResult.error)
  }

  const filter = buildPermissionFilter(permissions, 'mentorship_request', 'list')

  if (statusResult.data) {
    filter.status = statusResult.data
  }

  const { requests, total } = await MentorshipRequestService.listRequests(filter, {
    limit: pagination.limit,
    offset: pagination.offset,
  })

  const dtos = requests.map(toMentorshipRequestDTO)

  return paginatedResponse(dtos, pagination.limit, pagination.offset, total)
}

export const POST = withErrorHandling(postHandler)
export const GET = withErrorHandling(getHandler)
