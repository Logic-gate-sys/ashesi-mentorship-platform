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

    const profile = await prisma.menteeProfile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!profile) {
      return errorResponse('Mentee profile not found', { status: 404 });
    }

    return successResponse(
      {
        user: profile.user,
        menteeProfile: {
          id: profile.id,
          yearGroup: profile.yearGroup,
          major: profile.major,
          interests: profile.interests,
          bio: profile.bio,
          linkedin: profile.linkedin,
        },
      },
      'Mentee profile retrieved successfully'
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve mentee profile',
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTEE') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const userUpdates: Record<string, unknown> = {};
    const menteeUpdates: Record<string, unknown> = {};

    if (typeof body?.user?.firstName === 'string') userUpdates.firstName = body.user.firstName;
    if (typeof body?.user?.lastName === 'string') userUpdates.lastName = body.user.lastName;
    if (typeof body?.user?.avatarUrl === 'string' || body?.user?.avatarUrl === null) {
      userUpdates.avatarUrl = body.user.avatarUrl;
    }

    if (typeof body?.menteeProfile?.yearGroup === 'string') menteeUpdates.yearGroup = body.menteeProfile.yearGroup;
    if (typeof body?.menteeProfile?.major === 'string') menteeUpdates.major = body.menteeProfile.major;
    if (typeof body?.menteeProfile?.bio === 'string' || body?.menteeProfile?.bio === null) {
      menteeUpdates.bio = body.menteeProfile.bio;
    }
    if (typeof body?.menteeProfile?.linkedin === 'string' || body?.menteeProfile?.linkedin === null) {
      menteeUpdates.linkedin = body.menteeProfile.linkedin;
    }
    if (Array.isArray(body?.menteeProfile?.interests)) menteeUpdates.interests = body.menteeProfile.interests;

    if (!Object.keys(userUpdates).length && !Object.keys(menteeUpdates).length) {
      return errorResponse('No valid fields were provided for update', { status: 400 });
    }

    if (Object.keys(userUpdates).length) {
      await prisma.user.update({
        where: { id: user.id },
        data: userUpdates,
      });
    }

    if (Object.keys(menteeUpdates).length) {
      await prisma.menteeProfile.update({
        where: { userId: user.id },
        data: menteeUpdates,
      });
    }

    const updatedProfile = await prisma.menteeProfile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return successResponse(
      {
        user: updatedProfile?.user,
        menteeProfile: {
          id: updatedProfile?.id,
          yearGroup: updatedProfile?.yearGroup,
          major: updatedProfile?.major,
          interests: updatedProfile?.interests,
          bio: updatedProfile?.bio,
          linkedin: updatedProfile?.linkedin,
        },
      },
      'Mentee profile updated successfully'
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to update mentee profile',
      { status: 500 }
    );
  }
}
