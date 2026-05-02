import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#libs-schemas/middlewares/auth.middleware';
import { z } from 'zod';
import { uploadMedia } from '#libs-schemas/media_upload/cloudinary';
import {
  CacheTTL,
  buildCacheKey,
  getFromTTLCache,
  invalidateCacheByTags,
  setTTLCache,
} from '#libs-schemas/caches/cacheEngine';

const cloudinaryHeadshotUrlSchema = z
  .string()
  .trim()
  .min(1)
  .url()
  .refine((url) => /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//i.test(url));

export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTEE') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const cacheKey = buildCacheKey('mentee-profile', user.id);
    const cached = getFromTTLCache<{
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
      };
      menteeProfile: {
        id: string;
        yearGroup: string;
        major: string;
        interests: unknown;
        bio: string | null;
        linkedin: string | null;
      };
    }>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Mentee profile retrieved successfully');
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

    const responseData = {
      user: profile.user,
      menteeProfile: {
        id: profile.id,
        yearGroup: profile.yearGroup,
        major: profile.major,
        interests: profile.interests,
        bio: profile.bio,
        linkedin: profile.linkedin,
      },
    };

    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.MEDIUM,
      tags: [`user:${user.id}`, `mentee-profile:${profile.id}`, 'mentee:profile'],
    });

    return successResponse(responseData, 'Mentee profile retrieved successfully');
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

    const contentType = request.headers.get('content-type') || '';
    let body: {
      user?: {
        firstName?: string | null;
        lastName?: string | null;
        avatarUrl?: string | null;
      };
      menteeProfile?: {
        yearGroup?: string | number | null;
        major?: string | null;
        bio?: string | null;
        linkedin?: string | null;
        interests?: unknown;
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

      let interests: string[] | undefined;
      const interestsRaw = formData.get('interests');
      if (typeof interestsRaw === 'string' && interestsRaw.trim()) {
        try {
          const parsed = JSON.parse(interestsRaw);
          interests = Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : undefined;
        } catch {
          interests = undefined;
        }
      }

      body = {
        user: {
          firstName: getTextValue('firstName'),
          lastName: getTextValue('lastName'),
          avatarUrl,
        },
        menteeProfile: {
          yearGroup: getTextValue('yearGroup'),
          major: getTextValue('major'),
          bio: getTextValue('bio'),
          linkedin: getTextValue('linkedin'),
          interests,
        },
      };
    } else {
      body = await request.json();
    }

    const userUpdates: Record<string, unknown> = {};
    const menteeUpdates: Record<string, unknown> = {};

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

    invalidateCacheByTags([
      `user:${user.id}`,
      `mentee-profile:${updatedProfile?.id ?? ''}`,
      'mentee:profile',
      'mentee:dashboard',
      'mentee:requests',
      'mentee:messages',
    ]);

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
