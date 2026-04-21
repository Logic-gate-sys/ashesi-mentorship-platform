/**
 * GET /api/mentors/requests/[id]
 * Get single request details
 * 
 * POST /api/mentors/requests/[id]/accept
 * POST /api/mentors/requests/[id]/decline
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import {
  getMentorshipRequest,
  acceptMentorshipRequest,
  declineMentorshipRequest,
} from '@/app/api/services/mentorship-requests.service';
import { prisma } from '@/app/_utils_and_types/utils/db';

/**
 * GET - Get request details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', 401);
    }

    const req = await getMentorshipRequest(params.id);

    if (!req) {
      return errorResponse('Request not found', 404);
    }

    // Verify mentor ownership
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (req.mentorId !== mentorProfile?.id) {
      return errorResponse('Unauthorized: Not your request', 403);
    }

    return successResponse(req, 'Request retrieved successfully');
  } catch (error) {
    console.error('Error fetching request:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch request',
      500
    );
  }
}

/**
 * POST - Accept request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check action from query param
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'accept') {
      const result = await acceptMentorshipRequest(params.id, mentorProfile.id);
      return successResponse(result, 'Request accepted successfully', 200);
    } else if (action === 'decline') {
      const result = await declineMentorshipRequest(params.id, mentorProfile.id);
      return successResponse(result, 'Request declined successfully', 200);
    } else {
      return errorResponse('Invalid action. Use ?action=accept or ?action=decline', 400);
    }
  } catch (error) {
    console.error('Error processing request action:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to process request',
      500
    );
  }
}
