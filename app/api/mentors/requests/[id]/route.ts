import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { getMentorshipRequestDetails,updateMentorshipRequestStatus,} from '#services/mentorship-requests.service';
import { getIOInstance } from '#libs-schemas/socket/index';
import { requireAuth, checkPermission } from '#/libs_schemas/middlewares/auth.middleware';
import { clearPermissionsCache } from '#/libs_schemas/abac/engine';



// Do not call getIOInstance at module init — obtain it lazily inside handlers
 
// get deatils of one request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if ('status' in authResult) return authResult;
    const { user } = authResult;
    
    // Clear permission cache to ensure fresh permissions
    clearPermissionsCache(user.id);
    
    const mentorProfile = user.mentorProfile;
    if (!mentorProfile) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Mentor profile not found' },
        { status: 403 },
      );
    }
    const isAllowed = await checkPermission(user.id, 'mentorship_request', 'accept', { mentorId: mentorProfile.id });
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Do not have permission to access this resource' },
        { status: 403 },
      );
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
    const { user } = authResult;
    
    // Clear permission cache to ensure fresh permissions
    clearPermissionsCache(user.id);
    
    const mentorProfile = user.mentorProfile;
    if (!mentorProfile) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Mentor profile not found' },
        { status: 403 },
      );
    }
    const isAllowed = await checkPermission(user.id, 'mentorship_request', 'accept', { mentorId: mentorProfile.id });
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Do not have permission to perform this action' },
        { status: 403 },
      );
    }

    // Check action from query param
    const action = request.nextUrl.searchParams.get('action');
    const { id } = await params;
    const mentorProfileId = mentorProfile.id;
    // if accept
    if (action === 'accept') {
      const result = await updateMentorshipRequestStatus(id, mentorProfileId, "ACCEPTED");
      // emit request accepted -- shown to sender (if socket initialized)
      try {
        const io = getIOInstance();
        io.of('/requests').to(`user:${result.mentee.user.id}`).emit('request:accepted', {
          mentorId: mentorProfileId,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      } catch (err) {
        console.warn('Socket not initialised, skipping request:accepted emit', err instanceof Error ? err.message : err);
      }
      return successResponse(result, 'Request accepted successfully', 200);
    } else if (action === 'decline') {
      const result = await updateMentorshipRequestStatus(id, mentorProfileId, "DECLINED");
       try {
         const io = getIOInstance();
         io.of('/requests').to(`user:${result.mentee.user.id}`).emit('request:declined', {
           mentorId: mentorProfileId,
           firstName: user.firstName,
           lastName: user.lastName,
         });
       } catch (err) {
         console.warn('Socket not initialised, skipping request:declined emit', err instanceof Error ? err.message : err);
       }
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
