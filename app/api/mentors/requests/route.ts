
import { NextRequest, NextResponse } from 'next/server';
import {  errorResponse } from '#utils-types/utils/api-response';
import {requireAuth, checkPermission } from '#/libs_schemas/middlewares/auth.middleware';
import { getMentorshipRequests} from '#services/mentorship-requests.service';

// fetch all mentorship requests send to a mentor
export async function GET(request: NextRequest) {
  try {
  const authResult = await requireAuth(request);
  if ('status' in authResult) return authResult;
    const {user} = authResult; 
    if (!user.mentorProfile) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Mentor profile not found' }, { status: 403 });
    }
     const isAllowed = await checkPermission(user.id, 'mentorship_request', 'read');
      if(!isAllowed){
        return NextResponse.json({error:'Unauthorized', message: 'Have no right to access this resource'}, {status: 403});
      }
    const requests = await getMentorshipRequests(user.mentorProfile.id, 'MENTOR');
    return NextResponse.json({
      data: requests,
      count: requests.length,
      filters: { status: 'all' },
    },
    {status: 200}
  )
  } catch (error) {
    console.error('Error fetching requests:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch requests',
      { status: 500 }
    );
  }
}

