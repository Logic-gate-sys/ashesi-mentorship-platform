/**
 * Session Service
 * Handles all database operations for mentoring sessions
 */

import { prisma } from '@/app/_utils/db'

export class SessionService {
  /**
   * Create a new session
   */
  static async createSession(
    alumniId: string,
    requestId: string,
    data: {
      topic: string
      notes?: string
      scheduledAt: string
      duration: number
      meetingUrl?: string
    }
  ) {
    return prisma.session.create({
      data: {
        requestId,
        alumniId,
        topic: data.topic,
        notes: data.notes,
        scheduledAt: new Date(data.scheduledAt),
        duration: data.duration,
        meetingUrl: data.meetingUrl,
        status: 'SCHEDULED',
      },
      include: {
        request: {
          include: {
            student: {
              include: { user: true },
            },
          },
        },
        alumni: {
          include: { user: true },
        },
      },
    })
  }

  /**
   * Get session by ID
   */
  static async getSessionById(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        request: {
          include: {
            student: {
              include: { user: true },
            },
          },
        },
        alumni: {
          include: { user: true },
        },
        feedback: true,
      },
    })
  }

  /**
   * List sessions with filtering
   */
  static async listSessions(
    filter: any,
    options: { limit?: number; offset?: number } = {}
  ) {
    const { limit = 10, offset = 0 } = options

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where: filter,
        include: {
          request: {
            include: {
              student: {
                include: { user: true },
              },
            },
          },
          alumni: {
            include: { user: true },
          },
          feedback: true,
        },
        orderBy: { scheduledAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.session.count({ where: filter }),
    ])

    return { sessions, total }
  }

  /**
   * Update session
   */
  static async updateSession(
    id: string,
    data: {
      topic?: string
      notes?: string
      meetingUrl?: string
      scheduledAt?: string
      duration?: number
      status?: string
    }
  ) {
    return prisma.session.update({
      where: { id },
      data: {
        ...data,
        ...(data.scheduledAt && { scheduledAt: new Date(data.scheduledAt) }),
      },
      include: {
        request: true,
        alumni: true,
        feedback: true,
      },
    })
  }

  /**
   * Get upcoming sessions for an alumni
   */
  static async getUpcomingSessions(alumniId: string, limit = 5) {
    return prisma.session.findMany({
      where: {
        alumniId,
        status: 'SCHEDULED',
        scheduledAt: {
          gte: new Date(),
        },
      },
      include: {
        request: {
          include: {
            student: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: limit,
    })
  }

  /**
   * Get completed sessions for an alumni
   */
  static async getCompletedSessions(alumniId: string, limit = 10, offset = 0) {
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where: {
          alumniId,
          status: 'COMPLETED',
        },
        include: {
          request: {
            include: {
              student: {
                include: { user: true },
              },
            },
          },
          feedback: true,
        },
        orderBy: { scheduledAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.session.count({
        where: {
          alumniId,
          status: 'COMPLETED',
        },
      }),
    ])

    return { sessions, total }
  }

  /**
   * Count active sessions for capacity calculation
   */
  static async countActiveSessions(alumniId: string) {
    return prisma.session.count({
      where: {
        alumniId,
        status: { in: ['SCHEDULED', 'ONGOING'] },
      },
    })
  }

  /**
   * Complete a session
   */
  static async completeSession(id: string) {
    return prisma.session.update({
      where: { id },
      data: { status: 'COMPLETED' },
    })
  }
}
