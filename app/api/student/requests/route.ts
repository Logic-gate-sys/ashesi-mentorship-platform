import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/app/_lib/abac/middleware';
import { buildPermissionFilter } from '@/app/_lib/abac/engine';
import { MentorshipRequestService, ProfileService, NotificationService } from '@/app/_services';
import {
  createMentorshipRequestSchema,
  listMentorshipRequestsQuerySchema,
} from '@/app/_schemas/request.schema';
import {
  successResponse,
  paginatedResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  parseRequestBody,
  parseQueryParams,
} from '@/app/_utils/api-response';

/**
 * POST /api/student/requests
 * Create a new mentorship request (Student only)
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication & Authorization
    const authResult = await requirePermission(request, 'mentorship_request', 'create');

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user, permissions } = authResult;

    // Get student profile
    const studentProfile = await ProfileService.getOrCreateStudentProfile(user.id);

    // Parse and validate request body
    const parseResult = await parseRequestBody(request, createMentorshipRequestSchema);
    if (!parseResult.success) {
      return parseResult.error;
    }

    const { alumniId, goal, message } = parseResult.data;

    // Verify alumni exists and is available
    const alumniProfile = await ProfileService.getAlumniById(alumniId);

    if (!alumniProfile) {
      return notFoundResponse('Alumni');
    }

    if (!alumniProfile.isAvailable) {
      return NextResponse.json(
        {
          success: false,
          error: 'This mentor is not currently available',
        },
        { status: 409 }
      );
    }

    // Create mentorship request (service handles duplicate checking)
    const mentorshipRequest = await MentorshipRequestService.createRequest(
      studentProfile.id,
      { alumniId, goal, message }
    );

    // Create notification for alumni
    await NotificationService.createNotification(alumniProfile.userId, {
      type: 'REQUEST_RECEIVED',
      title: 'New Mentorship Request',
      message: `${studentProfile.user.firstName} ${studentProfile.user.lastName} sent you a mentorship request`,
      relatedId: mentorshipRequest.id,
      relatedType: 'MENTORSHIP_REQUEST',
    });

    return successResponse(mentorshipRequest, 'Mentorship request created successfully', 201);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to create mentorship request');
  }
}

/**
 * GET /api/student/requests
 * List mentorship requests for the authenticated user (Student/Alumni/Admin)
 * Uses permission-based filtering to ensure users only see their authorized requests
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication & Authorization
    const authResult = await requirePermission(request, 'mentorship_request', 'list');

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user, permissions } = authResult;

    // Parse query parameters
    const queryResult = parseQueryParams(request, listMentorshipRequestsQuerySchema);
    if (!queryResult.success) {
      return queryResult.error;
    }

    const { status, limit, offset, sortBy, sortOrder } = queryResult.data;

    // Build permission filter
    const permissionFilter = buildPermissionFilter(permissions, 'mentorship_request', 'list');
    
    // Add status filter if provided
    const filter: any = { ...permissionFilter };
    if (status) {
      filter.status = status;
    }

    // Use service to fetch requests with pagination
    const { requests, total } = await MentorshipRequestService.listRequests(filter, {
      limit,
      offset,
    });

    return paginatedResponse(requests, limit, offset, total);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to fetch mentorship requests');
  }
}
