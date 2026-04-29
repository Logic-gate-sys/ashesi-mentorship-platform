import { z } from 'zod';

/**
 * Availability Schemas
 */

export const dayOfWeekSchema = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

const timeRegex = /^([0-1]\d|2[0-3]):[0-5]\d$/; // HH:MM format

export const createAvailabilitySchema = z.object({
  dayOfWeek: dayOfWeekSchema,
  startTime: z
    .string()
    .regex(timeRegex, 'Time must be in HH:MM format')
    .refine((val) => {
      const [hours, minutes] = val.split(':').map(Number);
      return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    }, 'Invalid time'),
  endTime: z
    .string()
    .regex(timeRegex, 'Time must be in HH:MM format')
    .refine((val) => {
      const [hours, minutes] = val.split(':').map(Number);
      return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    }, 'Invalid time'),
});

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;

export const createAvailabilitySchema_Validated = createAvailabilitySchema.refine(
  (data) => {
    const [startHours, startMinutes] = data.startTime.split(':').map(Number);
    const [endHours, endMinutes] = data.endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    return startTotalMinutes < endTotalMinutes;
  },
  {
    message: 'Start time must be before end time',
    path: ['endTime'],
  }
);

export const updateAvailabilitySchema = createAvailabilitySchema.partial();

export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;

/**
 * Availability List Query
 */
export const listAvailabilityQuerySchema = z.object({
  alumniId: z.string().uuid('Invalid alumni ID').optional(),
  dayOfWeek: dayOfWeekSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type ListAvailabilityQuery = z.infer<typeof listAvailabilityQuerySchema>;
