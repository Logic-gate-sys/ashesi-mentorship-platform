import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/_utils/db';
import { requirePermission } from '@/app/_lib/abac/middleware';
import { buildPermissionFilter } from '@/app/_lib/abac/engine';
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
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student profile not found',
        },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const parseResult = await parseRequestBody(request, createMentorshipRequestSchema);
    if (!parseResult.success) {
      return parseResult.error;
    }

    const { alumniId, goal, message } = parseResult.data;

    // Verify alumni exists and is available
    const alumniProfile = await prisma.alumniProfile.findUnique({
      where: { id: alumniId },
      include: { user: true },
    });

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

    // Check for existing pending request
    const existingRequest = await prisma.mentorshipRequest.findFirst({
      where: {
        studentId: studentProfile.id,
        alumniId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          error: 'You already have a pending request with this mentor',
        },
        { status: 409 }
      );
    }

    // Create mentorship request
    const mentorshipRequest = await prisma.mentorshipRequest.create({
      data: {
        studentId: studentProfile.id,
        alumniId,
        goal,
        message,
        status: 'PENDING',
      },
      include: {
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
      },
    });

    // Create notification for alumni
    await prisma.notification.create({
      data: {
        userId: alumniProfile.userId,
        type: 'REQUEST_RECEIVED',
        title: 'New Mentorship Request',
        body: `${studentProfile.user.firstName} ${studentProfile.user.lastName} sent you a mentorship request`,
        link: `/mentor/requests/${mentorshipRequest.id}`,
      },
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

    // Build where clause from permissions
    // This ensures users only see requests they're authorized to access
    const permissionFilter = buildPermissionFilter(permissions, 'mentorship_request', 'list');
    
    // Combine permission filter with status filter
    const whereClause: any = { ...permissionFilter };
    if (status) {
      whereClause.status = status;
    }

    // Get total count
    const total = await prisma.mentorshipRequest.count({ where: whereClause });

    // Get requests with pagination
    const requests = await prisma.mentorshipRequest.findMany({
      where: whereClause,
      include: {
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip: offset,
    });

    return paginatedResponse(requests, limit, offset, total);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to fetch mentorship requests');
  }
}
