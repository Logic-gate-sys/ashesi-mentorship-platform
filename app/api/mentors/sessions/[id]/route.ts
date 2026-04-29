
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { getSession, updateSession, completeSession, cancelSession } from '#services/sessions.service';
import { prisma } from '#utils-types/utils/db';

/**
 * GET - Get session details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    const session = await getSession(id);

    if (!session) {
      return errorResponse('Session not found', { status: 404 });
    }

    if (session.mentorId !== mentorProfile.id) {
      return errorResponse('Unauthorized: Not your session', { status: 403 });
    }

    return successResponse(session, 'Session retrieved successfully');
  } catch (error) {
    console.error('Error fetching session:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch session',
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update session details
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    const body = await request.json();
    const { topic, scheduledAt, duration, notes, meetingUrl } = body;

    const updateData: any = {};
    if (topic) updateData.topic = topic;
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (duration) updateData.duration = parseInt(duration, 10);
    if (notes) updateData.notes = notes;
    if (meetingUrl) updateData.meetingUrl = meetingUrl;

    const session = await updateSession(id, mentorProfile.id, updateData);

    return successResponse(session, 'Session updated successfully');
  } catch (error) {
    console.error('Error updating session:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to update session',
      { status: 500 }
    );
  }
}

/**
 * POST - Complete or cancel session
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const body = await request.json().catch(() => ({}));

    if (action === 'complete') {
      const session = await completeSession(id, mentorProfile.id);

      return successResponse(session, 'Session marked as completed');
    } else if (action === 'cancel') {
      const session = await cancelSession(id, mentorProfile.id, body.reason);

      return successResponse(session, 'Session cancelled successfully');
    } else {
      return errorResponse('Invalid action. Use ?action=complete or ?action=cancel', { status: 400 });
    }
  } catch (error) {
    console.error('Error processing session action:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to process session action',
      { status: 500 }
    );
  }
}
