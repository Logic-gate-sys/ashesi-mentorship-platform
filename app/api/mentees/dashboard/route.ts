
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { getMenteeDashboardOverview } from '#services/mentee-metrics.service';
import { prisma } from '#utils-types/utils/db';
import { CacheTTL, buildCacheKey, getFromTTLCache, setTTLCache } from '#/libs_schemas/caches/cacheEngine';

export async function GET(request: NextRequest) {
  try {
    // Extract and validate user
    const user = await extractUserFromRequest(request);

    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    if (user.role !== 'MENTEE') {
      return errorResponse('Only mentees can access this endpoint', { status: 403 });
    }

    // Get mentee profile
    const menteeProfile = await prisma.menteeProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!menteeProfile) {
      return errorResponse('Mentee profile not found', { status: 404 });
    }

    const cacheKey = buildCacheKey('mentee-dashboard', menteeProfile.id);
    const cached = getFromTTLCache<Awaited<ReturnType<typeof getMenteeDashboardOverview>>>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Dashboard data retrieved successfully');
    }

    // Fetch complete dashboard overview
    const dashboard = await getMenteeDashboardOverview(menteeProfile.id);
    setTTLCache(cacheKey, dashboard, {
      ttl: CacheTTL.SHORT,
      tags: [
        `user:${user.id}`,
        `mentee-profile:${menteeProfile.id}`,
        'mentee:dashboard',
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
