import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { getMentorshipRequest,acceptMentorshipRequest, declineMentorshipRequest,} from '#services/mentorship-requests.service';
import { prisma } from '#utils-types/utils/db';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }
    const { id } = await params;
    const req = await getMentorshipRequest(id);
    if (!req) {
      return errorResponse('Request not found', { status: 404 });
    }
    // Verify mentor ownership
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (req.mentorId !== mentorProfile?.id) {
      return errorResponse('Unauthorized: Not your request', { status: 403 });
    }

    return successResponse(req, 'Request retrieved successfully');
  } catch (error) {
    console.error('Error fetching request:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch request',
      {status: 500}
    );
  }
}


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    // Get mentor profile
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    // Check action from query param
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    const { id } = await params;

    if (action === 'accept') {
      const result = await acceptMentorshipRequest(id, mentorProfile.id);


      return successResponse(result, 'Request accepted successfully', 200);
    } else if (action === 'decline') {
      const result = await declineMentorshipRequest(id, mentorProfile.id);

      return successResponse(result, 'Request declined successfully', 200);
    } else {
      return errorResponse('Invalid action. Use ?action=accept or ?action=decline', { status: 400 });
    }
  } catch (error) {
    console.error('Error processing request action:', error);
    if (error instanceof Error && error.message.includes('Cannot')) {
      return errorResponse(error.message, { status: 400 });
    }
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to process request',
      { status: 500 }
    );
  }
}
