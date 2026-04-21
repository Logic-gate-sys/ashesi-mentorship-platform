/**
 * GET /api/mentors/requests
 * List mentorship requests for the mentor
 * 
 * POST /api/mentors/requests/:id/accept
 * Accept a mentorship request
 * 
 * POST /api/mentors/requests/:id/decline
 * Decline a mentorship request
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import {
  getMentorRequests,
  acceptMentorshipRequest,
  declineMentorshipRequest,
  getMentorshipRequest,
} from '@/app/api/services/mentorship-requests.service';
import { prisma } from '@/app/_utils_and_types/utils/db';
import { RequestStatus } from '@/prisma/generated/prisma/client';

/**
 * GET - List requests with optional status filter
 */
export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', 401);
    }

    // Get mentor profile
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', 404);
    }

    // Get status filter from query
    const url = new URL(request.url);
    const status = url.searchParams.get('status') as RequestStatus | null;

    const requests = await getMentorRequests(mentorProfile.id, status || undefined);

    return successResponse(
      {
        requests,
        count: requests.length,
        filters: { status: status || 'all' },
      },
      'Requests retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching requests:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch requests',
      500
    );
  }
}
