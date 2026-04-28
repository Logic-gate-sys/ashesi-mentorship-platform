import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { getMentorshipRequestDetails,updateMentorshipRequestStatus,} from '#services/mentorship-requests.service';
import { getIOInstance } from '#libs-schemas/socket/index.js';
import { requireAuth, requirePermission } from '#/libs_schemas/middlewares/auth.middleware';



const io = getIOInstance();
 
// get deatils of one request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if ('status' in authResult) return authResult;
    const {user} = authResult; 
    const isAllowed = requirePermission(user.id, 'mentorship_request', 'accept');
    if(!isAllowed){
      return NextResponse.json({error:'Uauthorised', message: 'Have no right to send request'}, {status: 403});
    }
    const {id } = await params; 
    const requestDetails  = await getMentorshipRequestDetails(id);
    return NextResponse.json({
      success: true,
      data: requestDetails,
    },
    {status: 200}
  )
  } catch (error) {
    console.error('Error fetching request:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch request',
      {status: 500}
    );
  }
}



//mentor accepting/declining request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if ('status' in authResult) return authResult;
    const {user} = authResult; 
    const isAllowed = requirePermission(user.id, 'mentorship_request', 'accept');
    if(!isAllowed){
      return NextResponse.json({error:'Uauthorised', message: 'Have no right to send request'}, {status: 403});
    }

    // Check action from query param
    const action = request.nextUrl.searchParams.get('action');
    const { id } = await params;
    // if accept
    if (action === 'accept') {
      const result = await updateMentorshipRequestStatus(id, user.id, "ACCEPTED");
      // emit request accepted --. shown to sender
      io.of('/requests').to(`user:${user?.id}`).emit('request:accepted', {
        mentorId: user.id,
        firstName: user.firstName, 
        lastName: user.lastName
      })
      return successResponse(result, 'Request accepted successfully', 200);
    } else if (action === 'decline') {
      const result = await updateMentorshipRequestStatus(id, user.id, "DECLINED");
       io.of('/requests').to(`user:${user?.id}`).emit('request:declined', {
        mentorId: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName
      })
      return successResponse(result, 'Request declined successfully', 200);
    } else {
      return errorResponse('Invalid action. Use ?action=accept or ?action=decline', { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot')) {
      return errorResponse(error.message, { status: 400 });
    }
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to process request',
      { status: 500 }
    );
  }
}
