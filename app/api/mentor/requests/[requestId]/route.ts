import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/db'
import { requirePermission } from '@/app/_lib/abac/middleware'
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  parseRequestBody,
} from '@/app/_utils/api-response'

/**
 * GET /api/mentor/requests/:requestId
 * Get a specific mentorship request details
 */
export async function GET(
  request: NextRequest,
  context: { params: { requestId: string } }
) {
  try {
    const { requestId } = context.params

    // Get the request
    const mentorshipRequest = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
      include: {
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
      },
    })

    if (!mentorshipRequest) {
      return notFoundResponse('Mentorship request')
    }

    // Check permission - can read if admin or involved in request
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

    return successResponse(
      {
        id: mentorshipRequest.id,
        status: mentorshipRequest.status,
        goal: mentorshipRequest.goal,
        message: mentorshipRequest.message,
        student: {
          id: mentorshipRequest.student.id,
          name: `${mentorshipRequest.student.user.firstName} ${mentorshipRequest.student.user.lastName}`,
          email: mentorshipRequest.student.user.email,
          major: mentorshipRequest.student.major,
          yearGroup: mentorshipRequest.student.yearGroup,
        },
        alumni: {
          id: mentorshipRequest.alumni.id,
          name: `${mentorshipRequest.alumni.user.firstName} ${mentorshipRequest.alumni.user.lastName}`,
          email: mentorshipRequest.alumni.user.email,
          company: mentorshipRequest.alumni.company,
          jobTitle: mentorshipRequest.alumni.jobTitle,
        },
        createdAt: mentorshipRequest.createdAt,
        updatedAt: mentorshipRequest.updatedAt,
      },
      'Request details'
    )
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to fetch request')
  }
}

/**
 * POST /api/mentor/requests/:requestId
 * Accept or decline a mentorship request (Alumni only)
 *
 * Body:
 * {
 *   action: 'accept' | 'decline',
 *   reason?: string (for decline)
 * }
 */
export async function POST(
  request: NextRequest,
  context: { params: { requestId: string } }
) {
  try {
    const { requestId } = context.params

    // Get the request first
    const mentorshipRequest = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
      include: {
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
      },
    })

    if (!mentorshipRequest) {
      return notFoundResponse('Mentorship request')
    }

    // Check permission
    const authResult = await requirePermission(request, 'mentorship_request', 'accept', {
      type: 'mentorship_request',
      alumniId: mentorshipRequest.alumniId,
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Parse request body
    const parseResult = await parseRequestBody(request, {})
    if (!parseResult.success) {
      return parseResult.error
    }

    const { action, reason } = parseResult.data as {
      action: 'accept' | 'decline'
      reason?: string
    }

    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Action must be "accept" or "decline"',
        },
        { status: 400 }
      )
    }

    // Check current status
    if (mentorshipRequest.status !== 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot ${action} a request with status: ${mentorshipRequest.status}`,
        },
        { status: 409 }
      )
    }

    // Update request status
    const newStatus = action === 'accept' ? 'ACCEPTED' : 'DECLINED'
    const updatedRequest = await prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
      include: {
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
      },
    })

    // Create notification for student
    let notificationTitle: string
    let notificationBody: string

    if (action === 'accept') {
      notificationTitle = 'Mentorship Request Accepted'
      notificationBody = `${mentorshipRequest.alumni.user.firstName} ${mentorshipRequest.alumni.user.lastName} accepted your mentorship request`
    } else {
      notificationTitle = 'Mentorship Request Declined'
      notificationBody = reason
        ? `${mentorshipRequest.alumni.user.firstName} declined your request: ${reason}`
        : `${mentorshipRequest.alumni.user.firstName} declined your request`
    }

    await prisma.notification.create({
      data: {
        userId: mentorshipRequest.student.userId,
        type: action === 'accept' ? 'REQUEST_ACCEPTED' : 'REQUEST_DECLINED',
        title: notificationTitle,
        body: notificationBody,
        link:
          action === 'accept'
            ? `/dashboard/sessions?requestId=${requestId}`
            : undefined,
        isRead: false,
      },
    })

    return successResponse(
      {
        id: updatedRequest.id,
        status: updatedRequest.status,
      },
      `Mentorship request ${action === 'accept' ? 'accepted' : 'declined'}`
    )
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to process mentorship request')
  }
}
