import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { CacheTTL, buildCacheKey, getFromTTLCache, setTTLCache } from '#/libs_schemas/caches/cacheEngine';

export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTEE') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const menteeProfile = await prisma.menteeProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!menteeProfile) {
      return errorResponse('Mentee profile not found', { status: 404 });
    }

    const cacheKey = buildCacheKey('mentee-feedback', menteeProfile.id);
    const cached = getFromTTLCache<{
      feedback: Array<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        mentorName: string;
        mentorAvatar: string;
        topic: string;
      }>;
      metrics: {
        totalSessions: number;
        averageRating: number;
        totalFeedbackGiven: number;
      };
    }>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Feedback retrieved successfully');
    }

    // Get all feedback given by this mentee
    const feedback = await prisma.sessionFeedback.findMany({
      where: {
        session: {
          menteeId: menteeProfile.id,
        },
      },
      include: {
        session: {
          include: {
            mentor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const mapped = feedback.map((item) => ({
      id: item.id,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.createdAt,
      mentorName: `${item.session.mentor.user.firstName} ${item.session.mentor.user.lastName}`,
      mentorAvatar: item.session.mentor.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.session.mentorId}`,
      topic: item.session.topic || 'General Session',
    }));

    const metrics = {
      totalSessions: feedback.length,
      averageRating: feedback.length > 0
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
        : 0,
      totalFeedbackGiven: feedback.length,
    };

    const responseData = { feedback: mapped, metrics };
    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.MEDIUM,
      tags: [`user:${user.id}`, `mentee-profile:${menteeProfile.id}`, 'mentee:feedback'],
    });

    return successResponse(responseData, 'Feedback retrieved successfully');
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve feedback',
      { status: 500 }
    );
  }
}
