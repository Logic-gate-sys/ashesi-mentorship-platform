/**
 * GET /api/mentors/feedback
 * Get all feedback for the mentor
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#libs-schemas/middlewares/auth.middleware';
import { getMentorFeedback, getMentorAverageRating } from '#services/feedback.service';
import { prisma } from '#utils-types/utils/db';
import { CacheTTL, buildCacheKey, getFromTTLCache, setTTLCache } from '#libs-schemas/caches/cacheEngine';

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

    const cacheKey = buildCacheKey('mentor-feedback', mentorProfile.id);
    const cached = getFromTTLCache<{
      feedback: Awaited<ReturnType<typeof getMentorFeedback>>;
      stats: Awaited<ReturnType<typeof getMentorAverageRating>>;
      count: number;
    }>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Feedback retrieved successfully');
    }

    const [feedback, stats] = await Promise.all([
      getMentorFeedback(mentorProfile.id),
      getMentorAverageRating(mentorProfile.id),
    ]);

    const responseData = {
      feedback,
      stats,
      count: feedback.length,
    };

    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.MEDIUM,
      tags: [`user:${user.id}`, `mentor-profile:${mentorProfile.id}`, 'mentor:feedback'],
    });

    return successResponse(
      responseData,
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
