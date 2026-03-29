import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, requireAuth } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter } from '@/app/_lib/abac/engine'
import { MentorshipRequestService, NotificationService } from '@/app/_services'

/**
 * GET /api/mentor/requests
 * List mentorship requests for current user (Alumni/Admin only)
 * Filters requests based on alumni role - alumni see only their requests
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, 'mentorship_request', 'list')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Build permission-based filter
    const filter = buildPermissionFilter(permissions, 'mentorship_request', 'list')

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const status = (searchParams.get('status') || 'PENDING') as string
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Use service to fetch requests
    const { requests, total } = await MentorshipRequestService.listRequests(filter, {
      status,
      limit,
      offset,
    })

    return NextResponse.json(
      {
        success: true,
        data: requests.map(req => ({
          id: req.id,
          status: req.status,
          studentName: `${req.student.user.firstName} ${req.student.user.lastName}`,
          studentEmail: req.student.user.email,
          studentMajor: req.student.major,
          goal: req.goal,
          message: req.message,
          createdAt: req.createdAt,
          updatedAt: req.updatedAt,
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching mentor requests:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch mentorship requests',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/mentor/requests
 * Accept a mentorship request (Alumni only)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Parse request body
    const body = await request.json()
    const { requestId } = body as { requestId: string }

    if (!requestId) {
      return NextResponse.json(
        {
          success: false,
          error: 'requestId is required',
        },
        { status: 400 }
      )
    }

    // Find the request
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
      return NextResponse.json(
        {
          success: false,
          error: 'Mentorship request not found',
        },
        { status: 404 }
      )
    }

    // Check permission - alumni can only accept requests directed to them
    if (
      user.role === 'ALUMNI' &&
      mentorshipRequest.alumniId !== user.alumniProfile?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'You do not have permission to accept this request',
        },
        { status: 403 }
      )
    }

    // Check status
    if (mentorshipRequest.status !== 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot accept request with status: ${mentorshipRequest.status}`,
        },
        { status: 409 }
      )
    }

    // Update request
    const updated = await prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: {
        status: 'ACCEPTED',
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

    // Send notification to student
    await prisma.notification.create({
      data: {
        userId: mentorshipRequest.student.userId,
        type: 'REQUEST_ACCEPTED',
        title: 'Mentorship Accepted',
        body: `${mentorshipRequest.alumni.user.firstName} ${mentorshipRequest.alumni.user.lastName} accepted your mentorship request`,
        link: `/dashboard/sessions?requestId=${requestId}`,
        isRead: false,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updated.id,
          status: updated.status,
          message: 'Request accepted successfully',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error accepting mentorship request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to accept mentorship request',
      },
      { status: 500 }
    )
  }
}
