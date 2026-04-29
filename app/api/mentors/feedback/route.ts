/**
 * GET /api/mentors/feedback
 * Get all feedback for the mentor
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { getMentorFeedback, getMentorAverageRating } from '#services/feedback.service';
import { prisma } from '#utils-types/utils/db';

/**
 * GET - List feedback
 */
export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    const [feedback, stats] = await Promise.all([
      getMentorFeedback(mentorProfile.id),
      getMentorAverageRating(mentorProfile.id),
    ]);

    return successResponse(
      {
        feedback,
        stats,
        count: feedback.length,
      },
      'Feedback retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch feedback',
      { status: 500 }
    );
  }
}
