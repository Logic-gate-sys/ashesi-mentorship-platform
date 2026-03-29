import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/app/_lib/abac/middleware';
import { buildPermissionFilter } from '@/app/_lib/abac/engine';
import { SessionService, ProfileService, MentorshipRequestService, NotificationService } from '@/app/_services';
import {
  createSessionSchema,
  updateSessionSchema,
  listSessionsQuerySchema,
} from '@/app/_schemas/session.schema';
import {
  successResponse,
  paginatedResponse,
  notFoundResponse,
  serverErrorResponse,
  parseRequestBody,
  parseQueryParams,
} from '@/app/_utils/api-response';

/**
 * POST /api/sessions
 * Create a new session (Alumni only)
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication & Authorization
    const authResult = await requirePermission(request, 'session', 'create');

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Get alumni profile
    const alumniProfile = await ProfileService.getOrCreateAlumniProfile(user.id);

    if (!alumniProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alumni profile not found',
        },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const parseResult = await parseRequestBody(request, createSessionSchema);
    if (!parseResult.success) {
      return parseResult.error;
    }

    const { requestId, topic, notes, scheduledAt, duration, meetingUrl } = parseResult.data;

    // Get the mentorship request
    const mentorshipRequest = await MentorshipRequestService.getRequestById(requestId);

    if (!mentorshipRequest) {
      return notFoundResponse('Mentorship request');
    }

    if (mentorshipRequest.status !== 'ACCEPTED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Mentorship request must be accepted before creating sessions',
        },
        { status: 409 }
      );
    }

    if (mentorshipRequest.alumniId !== alumniProfile.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'You can only create sessions for requests directed to you',
        },
        { status: 403 }
      );
    }

    // Validate scheduled time is in the future
    if (new Date(scheduledAt) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session must be scheduled for a future date',
        },
        { status: 400 }
      );
    }

    // Create session using service
    const session = await SessionService.createSession(
      alumniProfile.id,
      requestId,
      {
        topic,
        notes,
        scheduledAt,
        duration,
        meetingUrl,
      }
    );

    // Notify student
    const studentProfile = await ProfileService.getStudentById(mentorshipRequest.studentId);
    if (studentProfile) {
      await NotificationService.createNotification(
        studentProfile.userId,
        {
          type: 'SESSION_SCHEDULED',
          title: 'Session Scheduled',
          message: `Your mentorship session is scheduled for ${new Date(scheduledAt).toLocaleString()}`,
          relatedId: session.id,
          relatedType: 'SESSION',
        }
      );
    }

    return successResponse(session, 'Session created successfully', 201);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to create session');
  }
}

/**
 * GET /api/sessions
 * List sessions for the authenticated user
 * Uses permission-based filtering to ensure users only see their authorized sessions
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication & Authorization
    const authResult = await requirePermission(request, 'session', 'list');

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user, permissions } = authResult;

    // Parse query parameters
    const queryResult = parseQueryParams(request, listSessionsQuerySchema);
    if (!queryResult.success) {
      return queryResult.error;
    }

    const { status, limit, offset } = queryResult.data;

    // Build where clause from permissions
    // This ensures users only see sessions they're authorized to access
    const permissionFilter = buildPermissionFilter(permissions, 'session', 'list');
    
    // Combine permission filter with status filter
    const whereClause: any = { ...permissionFilter };
    if (status) {
      whereClause.status = status;
    }

    // Get total count
    const total = await prisma.session.count({ where: whereClause });

    // Get sessions with pagination
    const sessions = await prisma.session.findMany({
      where: whereClause,
      include: {
        request: {
          include: {
            student: {
              include: { user: true },
            },
            alumni: {
              include: { user: true },
            },
          },
        },
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
        feedback: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip: offset,
    });

    return paginatedResponse(sessions, limit, offset, total);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to fetch sessions');
  }
}
