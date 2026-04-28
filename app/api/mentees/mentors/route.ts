import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTEE') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const menteeProfile = await prisma.menteeProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!menteeProfile) {
      return errorResponse('Mentee profile not found', { status: 404 });
    }

    // Get all accepted mentorship requests with mentor details
    const acceptedRequests = await prisma.mentorshipRequest.findMany({
      where: {
        menteeId: menteeProfile.id,
        status: 'ACCEPTED',
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const mentors = acceptedRequests.map((req) => ({
      id: req.mentor.id,
      userId: req.mentor.user.id,
      firstName: req.mentor.user.firstName,
      lastName: req.mentor.user.lastName,
      avatarUrl: req.mentor.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.mentor.id}`,
      company: req.mentor.company || '',
      jobTitle: req.mentor.jobTitle || '',
      industry: req.mentor.industry || '',
      bio: req.mentor.bio || '',
      skills: Array.isArray(req.mentor.skills) ? req.mentor.skills : [],
    }));

    return successResponse(
      { mentors, count: mentors.length },
      'Connected mentors retrieved successfully'
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve mentors',
      { status: 500 }
    );
  }
}
