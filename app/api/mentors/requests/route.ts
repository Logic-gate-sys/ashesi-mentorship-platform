
import { NextRequest, NextResponse } from 'next/server';
import {  errorResponse } from '#utils-types/utils/api-response';
import {requireAuth, requirePermission } from '#/libs_schemas/middlewares/auth.middleware';
import { getMentorRequests,} from '#services/mentorship-requests.service';


export async function GET(request: NextRequest) {
  try {
     const {user} = await requireAuth(request); 
     const isAllowed = requirePermission(user.id, 'mentorship_request', 'read');
        if(!isAllowed){
            return NextResponse.json({error:'Uauthorised', message: 'Have no right to send request'}, {status: 403});
        }
    const requests = await getMentorRequests(user?.id);

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
