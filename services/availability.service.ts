/**
 * Availability Service
 * Business logic for managing mentor availability slots
 */

import { prisma } from '#utils-types/utils/db';
import { DayOfWeek } from '#/prisma/generated/prisma/client';

export interface AvailabilitySlot {
  id: string;
  mentorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
}

/**
 * Get all availability slots for a mentor
 */
export async function getMentorAvailability(mentorProfileId: string) {
  return await prisma.availability.findMany({
    where: { mentorId: mentorProfileId },
    orderBy: [
      { dayOfWeek: 'asc' },
      { startTime: 'asc' },
    ],
  });
}

/**
 * Get availability for a specific day
 */
export async function getMentorAvailabilityByDay(mentorProfileId: string, dayOfWeek: DayOfWeek) {
  return await prisma.availability.findMany({
    where: {
      mentorId: mentorProfileId,
      dayOfWeek,
    },
    orderBy: { startTime: 'asc' },
  });
}

/**
 * Add an availability slot
 */
export async function addAvailabilitySlot(data: {
  mentorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm" format
  endTime: string;
}) {
  // Validate time format
  if (!/^\d{2}:\d{2}$/.test(data.startTime) || !/^\d{2}:\d{2}$/.test(data.endTime)) {
    throw new Error('Invalid time format. Use HH:mm');
  }

  // Validate start time is before end time
  const [startHour, startMin] = data.startTime.split(':').map(Number);
  const [endHour, endMin] = data.endTime.split(':').map(Number);
  const startTotal = startHour * 60 + startMin;
  const endTotal = endHour * 60 + endMin;

  if (startTotal >= endTotal) {
    throw new Error('Start time must be before end time');
  }

  return await prisma.availability.create({
    data,
  });
}

/**
 * Update an availability slot
 */
export async function updateAvailabilitySlot(
  slotId: string,
  mentorProfileId: string,
  data: Partial<{
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }>
) {
  // Verify ownership
  const slot = await prisma.availability.findUnique({
    where: { id: slotId },
    select: { mentorId: true },
  });

  if (!slot) {
    throw new Error('Availability slot not found');
  }

  if (slot.mentorId !== mentorProfileId) {
    throw new Error('Unauthorized');
  }

  // Validate times if provided
  if (data.startTime || data.endTime) {
    const startTime = data.startTime || (await prisma.availability.findUnique({ where: { id: slotId }, select: { startTime: true } }))?.startTime;
    const endTime = data.endTime || (await prisma.availability.findUnique({ where: { id: slotId }, select: { endTime: true } }))?.endTime;

    if (startTime && endTime) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;

      if (startTotal >= endTotal) {
        throw new Error('Start time must be before end time');
      }
    }
  }

  return await prisma.availability.update({
    where: { id: slotId },
    data,
  });
}

/**
 * Delete an availability slot
 */
export async function deleteAvailabilitySlot(slotId: string, mentorProfileId: string) {
  const slot = await prisma.availability.findUnique({
    where: { id: slotId },
    select: { mentorId: true },
  });

  if (!slot) {
    throw new Error('Availability slot not found');
  }

  if (slot.mentorId !== mentorProfileId) {
    throw new Error('Unauthorized');
  }

  return await prisma.availability.delete({
    where: { id: slotId },
  });
}

/**
 * Check if mentor is available at specific time
 */
export async function isMentorAvailable(
  mentorProfileId: string,
  dayOfWeek: DayOfWeek,
  checkTime: string // "HH:mm" format
): Promise<boolean> {
  const slots = await getMentorAvailabilityByDay(mentorProfileId, dayOfWeek);

  const [checkHour, checkMin] = checkTime.split(':').map(Number);
  const checkTotal = checkHour * 60 + checkMin;

  return slots.some(slot => {
    const [startHour, startMin] = slot.startTime.split(':').map(Number);
    const [endHour, endMin] = slot.endTime.split(':').map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;

    return checkTotal >= startTotal && checkTotal < endTotal;
  });
}

/**
 * Get available time slots for a date range
 */
export async function getAvailableSlots(
  mentorProfileId: string,
  startDate: Date,
  endDate: Date,
  slotDuration: number = 60 // minutes
) {
  const slots = await getMentorAvailability(mentorProfileId);
  const availableSlots: Array<{ date: Date; startTime: string; endTime: string }> = [];

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayName = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][
      currentDate.getDay()
    ] as DayOfWeek;

    const daySlots = slots.filter(slot => slot.dayOfWeek === dayName);

    daySlots.forEach(slot => {
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      let startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;

      while (startTotal + slotDuration <= endTotal) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(Math.floor(startTotal / 60), startTotal % 60);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

        availableSlots.push({
          date: new Date(currentDate),
          startTime: `${String(slotStart.getHours()).padStart(2, '0')}:${String(slotStart.getMinutes()).padStart(2, '0')}`,
          endTime: `${String(slotEnd.getHours()).padStart(2, '0')}:${String(slotEnd.getMinutes()).padStart(2, '0')}`,
        });

        startTotal += slotDuration;
      }
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availableSlots;
}
