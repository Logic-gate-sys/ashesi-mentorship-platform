import { getIOInstance } from '#/libs_schemas/socket';
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { updateAvailabilitySlot, deleteAvailabilitySlot,} from '#services/availability.service';
import { prisma } from '#utils-types/utils/db';

/**
 * PATCH - Update availability slot
 */

const io = getIOInstance(); 
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slotId: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { slotId } = await params;

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    const body = await request.json();
    const { dayOfWeek, startTime, endTime } = body;

    const slot = await updateAvailabilitySlot(slotId, mentorProfile.id, {
      dayOfWeek,
      startTime,
      endTime,
    });

    io.of().to().emit(`mentor:${mentorProfile.id}:availability`, 'availability_updated', {
      mentorId: mentorProfile.id,
      slot,
      action: 'updated',
    });

    return successResponse(slot, 'Availability slot updated successfully');
  } catch (error) {
    console.error('Error updating availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to update availability slot',
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete availability slot
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slotId: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user || user.role !== 'MENTOR') {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { slotId } = await params;

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!mentorProfile) {
      return errorResponse('Mentor profile not found', { status: 404 });
    }

    await deleteAvailabilitySlot(slotId, mentorProfile.id);

    return successResponse(null, 'Availability slot deleted successfully');
  } catch (error) {
    console.error('Error deleting availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to delete availability slot',
      { status: 500 }
    );
  }
}
