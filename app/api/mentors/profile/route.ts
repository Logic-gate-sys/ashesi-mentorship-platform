import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { z } from 'zod';
import { uploadMedia } from '#/libs_schemas/media_upload/cloudinary';
import {
  CacheTTL,
  buildCacheKey,
  getFromTTLCache,
  invalidateCacheByTags,
  setTTLCache,
} from '#/libs_schemas/caches/cacheEngine';

const cloudinaryHeadshotUrlSchema = z
  .string()
  .trim()
  .min(1)
  .url()
  .refine((url) => /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//i.test(url));

export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const cacheKey = buildCacheKey('mentor-profile', user.id);
    const cached = getFromTTLCache<{
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
      };
      mentorProfile: {
        id: string;
        graduationYear: number;
        major: string;
        company: string;
        jobTitle: string;
        industry: string;
        bio: string | null;
        linkedin: string | null;
        skills: string[];
        isAvailable: boolean;
        maxMentees: number;
      };
    }>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Mentor profile retrieved successfully');
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

    const responseData = {
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
    };

    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.MEDIUM,
      tags: [`user:${user.id}`, `mentor-profile:${profile.id}`, 'mentor:profile'],
    });

    return successResponse(responseData, 'Mentor profile retrieved successfully');
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

    const contentType = request.headers.get('content-type') || '';
    let body: {
      user?: {
        firstName?: string | null;
        lastName?: string | null;
        avatarUrl?: string | null;
      };
      mentorProfile?: {
        graduationYear?: number | string | null;
        major?: string | null;
        company?: string | null;
        jobTitle?: string | null;
        industry?: string | null;
        bio?: string | null;
        linkedin?: string | null;
        skills?: unknown;
        isAvailable?: boolean | null;
        maxMentees?: number | string | null;
      };
    } = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const getTextValue = (key: string): string | undefined => {
        const value = formData.get(key);
        return typeof value === 'string' && value.trim() ? value.trim() : undefined;
      };
      const avatar = formData.get('avatar');
      let avatarUrl: string | undefined;

      if (avatar instanceof File && avatar.size > 0) {
        const uploadedAvatarUrl = await uploadMedia(avatar);
        if (!uploadedAvatarUrl) {
          return errorResponse('Failed to upload professional headshot', { status: 400 });
        }
        avatarUrl = uploadedAvatarUrl;
      }

      let skills: string[] | undefined;
      const skillsRaw = formData.get('skills');
      if (typeof skillsRaw === 'string' && skillsRaw.trim()) {
        try {
          const parsed = JSON.parse(skillsRaw);
          skills = Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : undefined;
        } catch {
          skills = undefined;
        }
      }

      const graduationYearRaw = formData.get('graduationYear');
      const maxMenteesRaw = formData.get('maxMentees');
      const isAvailableRaw = formData.get('isAvailable');

      body = {
        user: {
          firstName: getTextValue('firstName'),
          lastName: getTextValue('lastName'),
          avatarUrl,
        },
        mentorProfile: {
          graduationYear: typeof graduationYearRaw === 'string' && graduationYearRaw ? Number(graduationYearRaw) : undefined,
          major: getTextValue('major'),
          company: getTextValue('company'),
          jobTitle: getTextValue('jobTitle'),
          industry: getTextValue('industry'),
          bio: getTextValue('bio'),
          linkedin: getTextValue('linkedin'),
          skills,
          isAvailable: typeof isAvailableRaw === 'string' ? isAvailableRaw === 'true' : undefined,
          maxMentees: typeof maxMenteesRaw === 'string' && maxMenteesRaw ? Number(maxMenteesRaw) : undefined,
        },
      };
    } else {
      body = await request.json();
    }

    const userUpdates: Record<string, unknown> = {};
    const mentorUpdates: Record<string, unknown> = {};

    if (typeof body?.user?.firstName === 'string') userUpdates.firstName = body.user.firstName;
    if (typeof body?.user?.lastName === 'string') userUpdates.lastName = body.user.lastName;
    if (body?.user?.avatarUrl === null) {
      return errorResponse('Professional headshot photo is required for profile picture', { status: 400 });
    }
    if (typeof body?.user?.avatarUrl === 'string') {
      const avatarValidation = cloudinaryHeadshotUrlSchema.safeParse(body.user.avatarUrl);
      if (!avatarValidation.success) {
        return errorResponse('Avatar must be a valid Cloudinary image URL', { status: 400 });
      }
      userUpdates.avatarUrl = avatarValidation.data;
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

    invalidateCacheByTags([
      `user:${user.id}`,
      `mentor-profile:${updated.id}`,
      'mentor:profile',
      'mentor:dashboard',
      'mentor:requests',
      'mentor:messages',
      'mentor:availability',
      'mentor:feedback',
      'mentors:list',
      'mentee:connected-mentors',
    ]);

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
