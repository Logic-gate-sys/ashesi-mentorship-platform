/**
 * GET /api/mentors/dashboard
 * Get comprehensive dashboard data for the logged-in mentor
 * ABAC: User must be a mentor
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { requirePermission, extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import { getMentorDashboardOverview } from '@/app/api/services/metrics.service';
import { prisma } from '@/app/_utils_and_types/utils/db';

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

    // Fetch complete dashboard overview
    const dashboard = await getMentorDashboardOverview(mentorProfile.id);

    return successResponse(dashboard, 'Dashboard data retrieved successfully');
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      500
    );
  }
}
