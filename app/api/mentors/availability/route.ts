import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { getMentorAvailability, addAvailabilitySlot } from '#services/availability.service';
import { prisma } from '#utils-types/utils/db';
import { getIOInstance } from '#/libs_schemas/socket';
import {
  CacheTTL,
  buildCacheKey,
  getFromTTLCache,
  invalidateCacheByTags,
  setTTLCache,
} from '#/libs_schemas/caches/cacheEngine';

// do not initialize socket at module import time; obtain lazily inside handlers



export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    if (!user || !user.mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    const cacheKey = buildCacheKey('mentor-availability', user.mentorProfile.id);
    const cached = getFromTTLCache<{
      availability: Awaited<ReturnType<typeof getMentorAvailability>>;
      count: number;
    }>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Availability slots retrieved successfully');
    }

    const availability = await getMentorAvailability(user.id);
    const responseData = {
      availability,
      count: availability.length,
    };

    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.MEDIUM,
      tags: [`user:${user.id}`, `mentor-profile:${user.mentorProfile.id}`, 'mentor:availability'],
    });

    return successResponse(
      responseData,
      'Availability slots retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch availability',
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }
    if (!user || !user.mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }
    const body = await request.json(); 
    const { dayOfWeek, startTime, endTime } = body;

    if (!dayOfWeek || !startTime || !endTime) {
      return errorResponse('Missing required fields: dayOfWeek, startTime, endTime', { status: 400 });
    }

    // creates mentor availability slot
    const slot = await addAvailabilitySlot({mentorId: user.id,dayOfWeek,startTime,endTime});

    invalidateCacheByTags([
      `user:${user.id}`,
      `mentor-profile:${user.mentorProfile.id}`,
      'mentor:availability',
      'mentor:profile',
    ]);

    // everyone in the request/namespace can know if mentor is available
    try {
      const io = getIOInstance();
      io.of('/requests').emit('availability:created', { mentorId: user.id, slot, action: 'created' });
    } catch (err) {
      console.warn('Socket not initialised, skipping availability:created emit', err instanceof Error ? err.message : err);
    }

    return successResponse(slot, 'Availability slot added successfully', 201);
  } catch (error) {
    console.error('Error adding availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to add availability slot',
      { status: 500 }
    );
  }
}
