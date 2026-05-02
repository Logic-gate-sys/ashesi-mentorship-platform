import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#libs-schemas/middlewares/auth.middleware';
import { CacheTTL, buildCacheKey, getFromTTLCache, setTTLCache } from '#libs-schemas/caches/cacheEngine';

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

    const cacheKey = buildCacheKey('mentee-connected-mentors', menteeProfile.id);
    const cached = getFromTTLCache<{ mentors: Array<{
      id: string;
      userId: string;
      firstName: string;
      lastName: string;
      avatarUrl: string;
      company: string;
      jobTitle: string;
      industry: string;
      bio: string;
      skills: string[];
    }>; count: number }>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Connected mentors retrieved successfully');
    }

    // Get all accepted mentorship requests with mentor details
    const acceptedRequests = await prisma.mentorshipRequest.findMany({
      where: {
        menteeId: menteeProfile.id,
        status: 'ACCEPTED',
      },
      include: {
        mentor: {
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

    const mentors = acceptedRequests.map((req) => ({
      id: req.mentor.id,
      userId: req.mentor.user.id,
      firstName: req.mentor.user.firstName,
      lastName: req.mentor.user.lastName,
      avatarUrl: req.mentor.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.mentor.id}`,
      company: req.mentor.company || '',
      jobTitle: req.mentor.jobTitle || '',
      industry: req.mentor.industry || '',
      bio: req.mentor.bio || '',
      skills: Array.isArray(req.mentor.skills) ? req.mentor.skills : [],
    }));

    const responseData = { mentors, count: mentors.length };
    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.MEDIUM,
      tags: [`user:${user.id}`, `mentee-profile:${menteeProfile.id}`, 'mentee:connected-mentors'],
    });

    return successResponse(responseData, 'Connected mentors retrieved successfully');
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve mentors',
      { status: 500 }
    );
  }
}
