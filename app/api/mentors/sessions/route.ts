/**
 * GET /api/mentors/sessions
 * List sessions for the mentor
 * 
 * POST /api/mentors/sessions
 * Create a new session
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import { getMentorSessions, createSession, getUpcomingMentorSessions } from '@/app/api/services/sessions.service';
import { prisma } from '@/app/_utils_and_types/utils/db';
import { SessionStatus } from '@/prisma/generated/prisma/client';

/**
 * GET - List sessions with optional filters
 */
export async function GET(request: NextRequest) {
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
    const filter = url.searchParams.get('filter');
    const status = url.searchParams.get('status') as SessionStatus | null;

    let sessions;
    if (filter === 'upcoming') {
      sessions = await getUpcomingMentorSessions(mentorProfile.id);
    } else {
      sessions = await getMentorSessions(mentorProfile.id, status || undefined);
    }

    return successResponse(
      {
        sessions,
        count: sessions.length,
        filters: { filter: filter || 'all', status: status || 'all' },
      },
      'Sessions retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch sessions',
      500
    );
  }
}

/**
 * POST - Create a new session
 */
export async function POST(request: NextRequest) {
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
    const { requestId, menteeId, topic, scheduledAt, duration, type, notes, meetingUrl } = body;

    if (!requestId || !menteeId || !topic || !scheduledAt || !duration) {
      return errorResponse('Missing required fields', 400);
    }

    const session = await createSession({
      requestId,
      menteeId,
      mentorId: mentorProfile.id,
      topic,
      scheduledAt: new Date(scheduledAt),
      duration: parseInt(duration, 10),
      type,
      notes,
      meetingUrl,
    });

    return successResponse(session, 'Session created successfully', 201);
  } catch (error) {
    console.error('Error creating session:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to create session',
      500
    );
  }
}
