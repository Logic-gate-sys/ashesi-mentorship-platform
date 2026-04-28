
import { NextRequest, NextResponse } from 'next/server';
import {  errorResponse } from '#utils-types/utils/api-response';
import {requireAuth, requirePermission } from '#/libs_schemas/middlewares/auth.middleware';
import { getMentorshipRequests} from '#services/mentorship-requests.service';

// fetch all mentorship requests send to a mentor
export async function GET(request: NextRequest) {
  try {
  const authResult = await requireAuth(request);
  if ('status' in authResult) return authResult;
  const {user} = authResult; 
     const isAllowed = requirePermission(user.id, 'mentorship_request', 'read');
        if(!isAllowed){
            return NextResponse.json({error:'Uauthorised', message: 'Have no right to send request'}, {status: 403});
        }
    const requests = await getMentorshipRequests(user?.id, 'MENTOR');
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

