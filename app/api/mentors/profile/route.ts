import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const profile = await prisma.mentorProfile.findUnique({
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
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    return successResponse(
      {
        user: profile.user,
        mentorProfile: {
          id: profile.id,
          graduationYear: profile.graduationYear,
          major: profile.major,
          company: profile.company,
          jobTitle: profile.jobTitle,
          industry: profile.industry,
          bio: profile.bio,
          linkedin: profile.linkedin,
          skills: profile.skills,
          isAvailable: profile.isAvailable,
          maxMentees: profile.maxMentees,
        },
      },
      'Mentor profile retrieved successfully'
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve mentor profile',
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const userUpdates: Record<string, unknown> = {};
    const mentorUpdates: Record<string, unknown> = {};

    if (typeof body?.user?.firstName === 'string') userUpdates.firstName = body.user.firstName;
    if (typeof body?.user?.lastName === 'string') userUpdates.lastName = body.user.lastName;
    if (typeof body?.user?.avatarUrl === 'string' || body?.user?.avatarUrl === null) {
      userUpdates.avatarUrl = body.user.avatarUrl;
    }

    if (typeof body?.mentorProfile?.graduationYear === 'number') {
      mentorUpdates.graduationYear = body.mentorProfile.graduationYear;
    }
    if (typeof body?.mentorProfile?.major === 'string') mentorUpdates.major = body.mentorProfile.major;
    if (typeof body?.mentorProfile?.company === 'string') mentorUpdates.company = body.mentorProfile.company;
    if (typeof body?.mentorProfile?.jobTitle === 'string') mentorUpdates.jobTitle = body.mentorProfile.jobTitle;
    if (typeof body?.mentorProfile?.industry === 'string') mentorUpdates.industry = body.mentorProfile.industry;
    if (typeof body?.mentorProfile?.bio === 'string' || body?.mentorProfile?.bio === null) {
      mentorUpdates.bio = body.mentorProfile.bio;
    }
    if (typeof body?.mentorProfile?.linkedin === 'string' || body?.mentorProfile?.linkedin === null) {
      mentorUpdates.linkedin = body.mentorProfile.linkedin;
    }
    if (Array.isArray(body?.mentorProfile?.skills)) mentorUpdates.skills = body.mentorProfile.skills;
    if (typeof body?.mentorProfile?.isAvailable === 'boolean') {
      mentorUpdates.isAvailable = body.mentorProfile.isAvailable;
    }
    if (typeof body?.mentorProfile?.maxMentees === 'number') {
      mentorUpdates.maxMentees = body.mentorProfile.maxMentees;
    }

    if (!Object.keys(userUpdates).length && !Object.keys(mentorUpdates).length) {
      return errorResponse('No valid fields were provided for update', { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (Object.keys(userUpdates).length) {
        await tx.user.update({
          where: { id: user.id },
          data: userUpdates,
        });
      }

      if (Object.keys(mentorUpdates).length) {
        await tx.mentorProfile.update({
          where: { userId: user.id },
          data: mentorUpdates,
        });
      }

      return tx.mentorProfile.findUnique({
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
    });

    if (!updated) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    return successResponse(
      {
        user: updated.user,
        mentorProfile: {
          id: updated.id,
          graduationYear: updated.graduationYear,
          major: updated.major,
          company: updated.company,
          jobTitle: updated.jobTitle,
          industry: updated.industry,
          bio: updated.bio,
          linkedin: updated.linkedin,
          skills: updated.skills,
          isAvailable: updated.isAvailable,
          maxMentees: updated.maxMentees,
        },
      },
      'Mentor profile updated successfully'
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to update mentor profile',
      { status: 500 }
    );
  }
}
