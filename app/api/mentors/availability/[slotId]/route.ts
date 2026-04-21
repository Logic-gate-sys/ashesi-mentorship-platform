/**
 * PATCH /api/mentors/availability/[slotId]
 * Update availability slot
 * 
 * DELETE /api/mentors/availability/[slotId]
 * Delete availability slot
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import {
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
} from '@/app/api/services/availability.service';
import { prisma } from '@/app/_utils_and_types/utils/db';

/**
 * PATCH - Update availability slot
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slotId: string } }
) {
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

    const slot = await updateAvailabilitySlot(params.slotId, mentorProfile.id, {
      dayOfWeek,
      startTime,
      endTime,
    });

    return successResponse(slot, 'Availability slot updated successfully');
  } catch (error) {
    console.error('Error updating availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to update availability slot',
      500
    );
  }
}

/**
 * DELETE - Delete availability slot
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slotId: string } }
) {
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

    await deleteAvailabilitySlot(params.slotId, mentorProfile.id);

    return successResponse(null, 'Availability slot deleted successfully');
  } catch (error) {
    console.error('Error deleting availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to delete availability slot',
      500
    );
  }
}
