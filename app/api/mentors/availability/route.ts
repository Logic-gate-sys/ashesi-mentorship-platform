/**
 * GET /api/mentors/availability
 * Get mentor's availability slots
 * 
 * POST /api/mentors/availability
 * Add a new availability slot
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import { getMentorAvailability, addAvailabilitySlot } from '@/app/api/services/availability.service';
import { prisma } from '@/app/_utils_and_types/utils/db';

/**
 * GET - List availability slots
 */
export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', 401);
    }

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', 404);
    }

    const availability = await getMentorAvailability(mentorProfile.id);

    return successResponse(
      {
        availability,
        count: availability.length,
      },
      'Availability slots retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch availability',
      500
    );
  }
}

/**
 * POST - Add availability slot
 */
export async function POST(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', 401);
    }

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', 404);
    }

    const body = await request.json();
    const { dayOfWeek, startTime, endTime } = body;

    if (!dayOfWeek || !startTime || !endTime) {
      return errorResponse('Missing required fields: dayOfWeek, startTime, endTime', 400);
    }

    const slot = await addAvailabilitySlot({
      mentorId: mentorProfile.id,
      dayOfWeek,
      startTime,
      endTime,
    });

    return successResponse(slot, 'Availability slot added successfully', 201);
  } catch (error) {
    console.error('Error adding availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to add availability slot',
      500
    );
  }
}
