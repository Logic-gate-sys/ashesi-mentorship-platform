import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { CacheTTL, buildCacheKey, getFromTTLCache, setTTLCache } from '#/libs_schemas/caches/cacheEngine';

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

    const cacheKey = buildCacheKey('mentor-connected-mentees', mentorProfile.id);
    const cached = getFromTTLCache<{ mentees: Array<{
      id: string;
      userId: string;
      firstName: string;
      lastName: string;
      avatarUrl: string;
      yearGroup: string;
      major: string;
      bio: string;
      linkedin: string;
      interests: string[];
    }>; count: number }>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Connected mentees retrieved successfully');
    }

    // Get all accepted mentorship requests with mentee details
    const acceptedRequests = await prisma.mentorshipRequest.findMany({
      where: {
        mentorId: mentorProfile.id,
        status: 'ACCEPTED',
      },
      include: {
        mentee: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const mentees = acceptedRequests.map((req) => ({
      id: req.mentee.id,
      userId: req.mentee.user.id,
      firstName: req.mentee.user.firstName,
      lastName: req.mentee.user.lastName,
      avatarUrl: req.mentee.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.mentee.id}`,
      yearGroup: req.mentee.yearGroup || '',
      major: req.mentee.major || '',
      bio: req.mentee.bio || '',
      linkedin: req.mentee.linkedin || '',
      interests: Array.isArray(req.mentee.interests) ? req.mentee.interests : [],
    }));

    const responseData = { mentees, count: mentees.length };

    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.MEDIUM,
      tags: [`user:${user.id}`, `mentor-profile:${mentorProfile.id}`, 'mentor:connected-mentees'],
    });

    return successResponse(responseData, 'Connected mentees retrieved successfully');
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve mentees',
      { status: 500 }
    );
  }
}
