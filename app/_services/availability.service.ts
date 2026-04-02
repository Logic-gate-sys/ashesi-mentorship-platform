/**
 * Availability Service
 * Handles all database operations for alumni availability schedules
 */

import { prisma } from '@/app/_utils/db'

export class AvailabilityService {
  /**
   * Create availability slot
   */
  static async createAvailability(
    alumniId: string,
    data: {
      dayOfWeek: string
      startTime: string
      endTime: string
    }
  ) {
    // Check for duplicate
    const existing = await prisma.availability.findFirst({
      where: {
        alumniId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
      },
    })

    if (existing) {
      throw new Error('This availability slot already exists')
    }

    return prisma.availability.create({
      data: {
        alumniId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    })
  }

  /**
   * Get availability by ID
   */
  static async getAvailabilityById(id: string) {
    return prisma.availability.findUnique({
      where: { id },
      include: {
        alumni: {
          include: { user: true },
        },
      },
    })
  }

  /**
   * List availability slots with filtering
   */
  static async listAvailability(
    filter: any,
    options: { limit?: number; offset?: number } = {}
  ) {
    const { limit = 20, offset = 0 } = options

    const [slots, total] = await Promise.all([
      prisma.availability.findMany({
        where: filter,
        include: {
          alumni: {
            include: { user: true },
          },
        },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        take: limit,
        skip: offset,
      }),
      prisma.availability.count({ where: filter }),
    ])

    return { slots, total }
  }

  /**
   * Get all availability for a specific alumni
   */
  static async getAlumniAvailability(alumniId: string) {
    return prisma.availability.findMany({
      where: { alumniId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })
  }

  /**
   * Update availability
   */
  static async updateAvailability(
    id: string,
    data: {
      dayOfWeek?: number
      startTime?: string
      endTime?: string
    }
  ) {
    return prisma.availability.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete availability
   */
  static async deleteAvailability(id: string) {
    return prisma.availability.delete({
      where: { id },
    })
  }

  /**
   * Get available alumni for a specific day and time
   */
  static async getAvailableAlumni(dayOfWeek: number, startTime: string) {
    return prisma.availability.findMany({
      where: {
        dayOfWeek,
        startTime: { lte: startTime },
        endTime: { gte: startTime },
      },
      include: {
        alumni: {
          include: { user: true },
        },
      },
    })
  }

  /**
   * Bulk delete availability for an alumni
   */
  static async deleteAlumniAvailability(alumniId: string) {
    return prisma.availability.deleteMany({
      where: { alumniId },
    })
  }
}
