/**
 * GET /api/mentors/sessions/[id]
 * Get session details
 * 
 * PATCH /api/mentors/sessions/[id]
 * Update session
 * 
 * POST /api/mentors/sessions/[id]?action=complete|cancel
 * Complete or cancel a session
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import { getSession, updateSession, completeSession, cancelSession } from '@/app/api/services/sessions.service';
import { prisma } from '@/app/_utils_and_types/utils/db';

/**
 * GET - Get session details
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

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', 404);
    }

    const session = await getSession(params.id);

    if (!session) {
      return errorResponse('Session not found', 404);
    }

    if (session.mentorId !== mentorProfile.id) {
      return errorResponse('Unauthorized: Not your session', 403);
    }

    return successResponse(session, 'Session retrieved successfully');
  } catch (error) {
    console.error('Error fetching session:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch session',
      500
    );
  }
}

/**
 * PATCH - Update session details
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', 401);
    }

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', 404);
    }

    const body = await request.json();
    const { topic, scheduledAt, duration, notes, meetingUrl } = body;

    const updateData: any = {};
    if (topic) updateData.topic = topic;
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (duration) updateData.duration = parseInt(duration, 10);
    if (notes) updateData.notes = notes;
    if (meetingUrl) updateData.meetingUrl = meetingUrl;

    const session = await updateSession(params.id, mentorProfile.id, updateData);

    return successResponse(session, 'Session updated successfully');
  } catch (error) {
    console.error('Error updating session:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to update session',
      500
    );
  }
}

/**
 * POST - Complete or cancel session
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

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', 404);
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const body = await request.json().catch(() => ({}));

    if (action === 'complete') {
      const session = await completeSession(params.id, mentorProfile.id);
      return successResponse(session, 'Session marked as completed');
    } else if (action === 'cancel') {
      const session = await cancelSession(params.id, mentorProfile.id, body.reason);
      return successResponse(session, 'Session cancelled successfully');
    } else {
      return errorResponse('Invalid action. Use ?action=complete or ?action=cancel', 400);
    }
  } catch (error) {
    console.error('Error processing session action:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to process session action',
      500
    );
  }
}
