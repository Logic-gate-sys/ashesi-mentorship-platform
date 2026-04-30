
import { NextRequest, NextResponse } from 'next/server';
import {  errorResponse } from '#utils-types/utils/api-response';
import {requireAuth, checkPermission } from '#/libs_schemas/middlewares/auth.middleware';
import { getMentorshipRequests} from '#services/mentorship-requests.service';
import { RequestStatus } from '#/prisma/generated/prisma/enums';
import { clearPermissionsCache } from '#/libs_schemas/abac/engine';
import { CacheTTL, buildCacheKey, getFromTTLCache, setTTLCache } from '#/libs_schemas/caches/cacheEngine';

// fetch all mentorship requests send to a mentor
export async function GET(request: NextRequest) {
  try {
  const authResult = await requireAuth(request);
  if ('status' in authResult) return authResult;
    const {user} = authResult;
    console.log('[GET /api/mentors/requests] User:', user.id, 'Role:', user.role, 'MentorProfile:', user.mentorProfile?.id);
    
    // Clear permission cache to ensure fresh permissions are loaded
    clearPermissionsCache(user.id);
    
    if (!user.mentorProfile) {
      console.log('[GET /api/mentors/requests] No mentor profile found');
      return NextResponse.json({ error: 'Unauthorized', message: 'Mentor profile not found' }, { status: 403 });
    }
    
     const permissionCondition = {
       mentorId: user.mentorProfile.id,
       menteeId: '',
       createdAt: new Date(),
       status: 'PENDING' as const,
     };
     const isAllowed = await checkPermission(user.id, 'mentorship_request', 'read', permissionCondition);
     console.log('[GET /api/mentors/requests] Permission check:', isAllowed, 'Condition:', permissionCondition);
      if(!isAllowed){
        console.log('[GET /api/mentors/requests] Permission denied for mentor:', user.mentorProfile.id);
        return NextResponse.json({error:'Unauthorized', message: 'Have no right to access this resource'}, {status: 403});
      }

    // Parse optional status query parameter
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status') as RequestStatus | null;

    const cacheKey = buildCacheKey('mentor-requests', user.mentorProfile.id, statusParam || 'all');
    const cached = getFromTTLCache<{
      data: {
        requests: Awaited<ReturnType<typeof getMentorshipRequests>>;
      };
      count: number;
      filters: { status: string };
    }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { status: 200 });
    }

    const requests = await getMentorshipRequests(user.mentorProfile.id, 'MENTOR', statusParam || undefined);
    const responseData = {
      data: {
        requests: requests,
      },
      count: requests.length,
      filters: { status: statusParam || 'all' },
    };

    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.SHORT,
      tags: [`user:${user.id}`, `mentor-profile:${user.mentorProfile.id}`, 'mentor:requests'],
    });

    return NextResponse.json(responseData, {status: 200});
  } catch (error) {
    console.error('Error fetching requests:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch requests',
      { status: 500 }
    );
  }
}

