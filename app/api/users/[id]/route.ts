import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { errorResponse, successResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await extractUserFromRequest(request);

    if (!authUser) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        createdAt: true,
        mentorProfile: {
          select: {
            id: true,
            graduationYear: true,
            major: true,
            company: true,
            jobTitle: true,
            industry: true,
            bio: true,
            linkedin: true,
            skills: true,
            isAvailable: true,
            maxMentees: true,
          },
        },
        menteeProfile: {
          select: {
            id: true,
            yearGroup: true,
            major: true,
            interests: true,
            bio: true,
            linkedin: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse('User not found', { status: 404 });
    }

    if (user.role === 'MENTOR' && !user.mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    if (user.role === 'MENTEE' && !user.menteeProfile) {
      return errorResponse('Mentee profile not found', { status: 404 });
    }

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt.toISOString(),
        },
        mentorProfile: user.mentorProfile,
        menteeProfile: user.menteeProfile,
      },
      'User details retrieved successfully'
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve user details',
      { status: 500 }
    );
  }
}