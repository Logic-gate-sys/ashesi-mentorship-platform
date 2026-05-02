
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { requirePermission, extractUserFromRequest } from '#libs-schemas/middlewares/auth.middleware';
import { getMentorDashboardOverview } from '#services/mentor-metrics.service';
import { prisma } from '#utils-types/utils/db';
import { CacheTTL, buildCacheKey, getFromTTLCache, setTTLCache } from '#libs-schemas/caches/cacheEngine';

export async function GET(request: NextRequest) {
  try {
    // Extract and validate user
    const user = await extractUserFromRequest(request);

    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    if (user.role !== 'MENTOR') {
      return errorResponse('Only mentors can access this endpoint', { status: 403 });
    }

    // Get mentor profile
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    const cacheKey = buildCacheKey('mentor-dashboard', mentorProfile.id);
    const cached = getFromTTLCache<Awaited<ReturnType<typeof getMentorDashboardOverview>>>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Dashboard data retrieved successfully');
    }

    // Fetch complete dashboard overview
    const dashboard = await getMentorDashboardOverview(mentorProfile.id);
    setTTLCache(cacheKey, dashboard, {
      ttl: CacheTTL.SHORT,
      tags: [
        `user:${user.id}`,
        `mentor-profile:${mentorProfile.id}`,
        'mentor:dashboard',
      ],
    });
    return successResponse(dashboard, 'Dashboard data retrieved successfully');
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      {status: 500}
    );
  }
}
