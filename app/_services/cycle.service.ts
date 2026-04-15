/**
 * Mentorship Cycle Service
 * Handles all database operations for mentorship cycles and cycle-related duties
 */

import { prisma } from '@/app/_utils/db'

export type CycleStatus = 'planning' | 'active' | 'closed' | 'ended'

export interface MentorshipCycle {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  status: CycleStatus
  createdAt: Date
  updatedAt: Date
  durationMonths: number
}

export interface MentorshipCycleStatus {
  id: string
  name: string
  status: CycleStatus
  startDate: string
  endDate: string
  daysRemaining: number
  progressPercent: number
  totalMentors: number
  activeMentorships: number
  message: string
}

export interface AlumniCycleAvailability {
  cycleId: string
  alumniId: string
  isAvailable: boolean
  maxMentees: number
  updatedAt: Date
}

export class CycleService {
  /**
   * Create a new mentorship cycle
   */
  static async createCycle(data: {
    name: string
    description: string
    startDate: Date
    endDate: Date
  }): Promise<MentorshipCycle> {
    // Calculate duration in months
    const durationMonths = Math.round(
      (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    )

    // Validate duration is between 3-6 months
    if (durationMonths < 3 || durationMonths > 6) {
      throw new Error(
        `Cycle duration must be between 3-6 months. Your cycle is ${durationMonths} months.`
      )
    }

    // Determine initial status based on dates
    const now = new Date()
    let status: CycleStatus = 'planning'
    if (now >= data.startDate && now <= data.endDate) {
      status = 'active'
    }

    const cycle = await prisma.mentorshipCycle.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status,
        durationMonths,
      },
    })

    return this.formatCycle(cycle)
  }

  /**
   * Get all mentorship cycles
   */
  static async listCycles(options: {
    limit?: number
    offset?: number
    status?: CycleStatus
  } = {}): Promise<{ cycles: MentorshipCycle[]; total: number }> {
    const { limit = 10, offset = 0, status } = options

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [cycles, total] = await Promise.all([
      prisma.mentorshipCycle.findMany({
        where,
        orderBy: { startDate: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.mentorshipCycle.count({ where }),
    ])

    return {
      cycles: cycles.map(c => this.formatCycle(c)),
      total,
    }
  }

  /**
   * Get a specific cycle by ID
   */
  static async getCycleById(cycleId: string): Promise<MentorshipCycle | null> {
    const cycle = await prisma.mentorshipCycle.findUnique({
      where: { id: cycleId },
    })

    return cycle ? this.formatCycle(cycle) : null
  }

  /**
   * Get current active cycle
   */
  static async getActiveCycle(): Promise<MentorshipCycleStatus | null> {
    const now = new Date()

    const cycle = await prisma.mentorshipCycle.findFirst({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
        status: 'active',
      },
    })

    if (!cycle) {
      // Get upcoming cycle
      const upcomingCycle = await prisma.mentorshipCycle.findFirst({
        where: {
          startDate: { gt: now },
          status: 'planning',
        },
        orderBy: { startDate: 'asc' },
      })

      if (!upcomingCycle) {
        return null
      }

      // Calculate metrics for upcoming cycle
      const daysUntilStart = Math.ceil(
        (upcomingCycle.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Get stats for upcoming cycle (mentorships scheduled for this cycle)
      const totalMentorships = await prisma.mentorshipRequest.count({
        where: { status: 'ACCEPTED' },
      })
      const totalMentors = await prisma.alumniProfile.count({
        where: { isAvailable: true },
      })

      return {
        id: upcomingCycle.id,
        name: upcomingCycle.name,
        status: 'planning',
        startDate: upcomingCycle.startDate.toISOString(),
        endDate: upcomingCycle.endDate.toISOString(),
        daysRemaining: daysUntilStart,
        progressPercent: 0,
        totalMentors,
        activeMentorships: totalMentorships,
        message: `Upcoming cycle starts in ${daysUntilStart} days`,
      }
    }

    // Calculate days remaining
    const daysRemaining = Math.ceil(
      (cycle.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    const totalDays = Math.ceil(
      (cycle.endDate.getTime() - cycle.startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const progressPercent = Math.round(
      ((now.getTime() - cycle.startDate.getTime()) / (cycle.endDate.getTime() - cycle.startDate.getTime())) * 100
    )

    // Get mentorship statistics
    const totalMentorships = await prisma.mentorshipRequest.count({
      where: { status: 'ACCEPTED' },
    })
    const totalMentors = await prisma.alumniProfile.count({
      where: { isAvailable: true },
    })

    return {
      id: cycle.id,
      name: cycle.name,
      status: 'active',
      startDate: cycle.startDate.toISOString(),
      endDate: cycle.endDate.toISOString(),
      daysRemaining: Math.max(0, daysRemaining),
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      totalMentors,
      activeMentorships: totalMentorships,
      message: `Active cycle: ${Math.max(0, daysRemaining)} days remaining`,
    }
  }

  /**
   * Update cycle status
   */
  static async updateCycleStatus(cycleId: string, status: CycleStatus): Promise<MentorshipCycle> {
    const cycle = await prisma.mentorshipCycle.update({
      where: { id: cycleId },
      data: { status },
    })

    return this.formatCycle(cycle)
  }

  /**
   * End a mentorship cycle
   */
  static async endCycle(cycleId: string): Promise<{
    cycleId: string
    status: CycleStatus
    archivedMentorships: number
    completedSessions: number
    averageRating: number
  }> {
    const cycle = await prisma.mentorshipCycle.findUnique({
      where: { id: cycleId },
    })

    if (!cycle) {
      throw new Error('Cycle not found')
    }

    // Update cycle status
    await prisma.mentorshipCycle.update({
      where: { id: cycleId },
      data: { status: 'ended' },
    })

    // Pause all mentorships for this cycle (mark sessions as closed)
    const mentorships = await prisma.mentorshipRequest.count({
      where: { status: 'ACCEPTED' },
    })

    const sessions = await prisma.session.findMany({
      where: {
        request: {
          cycleId,
        },
      },
      include: {
        feedback: true,
      },
    })

    // Mark sessions as completed/cancelled if not already done
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length

    // Calculate average rating
    const ratings = sessions
      .filter(s => s.feedback && s.feedback.rating)
      .map(s => s.feedback!.rating)

    const averageRating = ratings.length > 0
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
      : 0

    return {
      cycleId,
      status: 'ended',
      archivedMentorships: mentorships,
      completedSessions,
      averageRating,
    }
  }

  /**
   * Get alumni availability for a cycle
   */
  static async getAlumniCycleAvailability(
    cycleId: string,
    alumniId: string
  ): Promise<AlumniCycleAvailability | null> {
    const availability = await prisma.cyclealumniAvailability.findUnique({
      where: {
        cycleId_alumniId: {
          cycleId,
          alumniId,
        },
      },
    })

    if (!availability) {
      return null
    }

    return {
      cycleId: availability.cycleId,
      alumniId: availability.alumniId,
      isAvailable: availability.isAvailable,
      maxMentees: availability.maxMentees,
      updatedAt: availability.updatedAt,
    }
  }

  /**
   * Update alumni availability for a cycle
   */
  static async updateAlumniCycleAvailability(
    cycleId: string,
    alumniId: string,
    data: { isAvailable: boolean; maxMentees?: number }
  ): Promise<AlumniCycleAvailability> {
    const availability = await prisma.cyclealumniAvailability.upsert({
      where: {
        cycleId_alumniId: {
          cycleId,
          alumniId,
        },
      },
      update: {
        isAvailable: data.isAvailable,
        maxMentees: data.maxMentees ?? 3,
      },
      create: {
        cycleId,
        alumniId,
        isAvailable: data.isAvailable,
        maxMentees: data.maxMentees ?? 3,
      },
    })

    return {
      cycleId: availability.cycleId,
      alumniId: availability.alumniId,
      isAvailable: availability.isAvailable,
      maxMentees: availability.maxMentees,
      updatedAt: availability.updatedAt,
    }
  }

  /**
   * Get all alumni with stats for a cycle ready to end
   */
  static async getAlumniStatsForCycleEnd(cycleId: string): Promise<
    Array<{
      id: string
      email: string
      name: string
      menteesCount: number
      sessionsCount: number
      averageRating: number
    }>
  > {
    const alumni = await prisma.alumniProfile.findMany({
      include: {
        user: true,
        requests: {
          where: { status: 'ACCEPTED' },
          include: {
            sessions: {
              include: { feedback: true },
            },
          },
        },
      },
    })

    return alumni.map(alumnus => {
      const sessions = alumnus.requests.flatMap(r => r.sessions)
      const ratings = sessions
        .filter(s => s.feedback && s.feedback.rating)
        .map(s => s.feedback!.rating)

      const averageRating = ratings.length > 0
        ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
        : 0

      return {
        id: alumnus.id,
        email: alumnus.user.email,
        name: `${alumnus.user.firstName} ${alumnus.user.lastName}`,
        menteesCount: alumnus.requests.length,
        sessionsCount: sessions.length,
        averageRating,
      }
    })
  }

  /**
   * Get all alumni for cycle invitations
   */
  static async getAllAlumniForNotifications(): Promise<
    Array<{
      id: string
      email: string
      name: string
    }>
  > {
    const alumni = await prisma.alumniProfile.findMany({
      include: { user: true },
    })

    return alumni.map(alumnus => ({
      id: alumnus.id,
      email: alumnus.user.email,
      name: `${alumnus.user.firstName} ${alumnus.user.lastName}`,
    }))
  }

  /**
   * Format cycle data for API response
   */
  private static formatCycle(cycle: any): MentorshipCycle {
    return {
      id: cycle.id,
      name: cycle.name,
      description: cycle.description,
      startDate: new Date(cycle.startDate),
      endDate: new Date(cycle.endDate),
      status: cycle.status as CycleStatus,
      createdAt: new Date(cycle.createdAt),
      updatedAt: new Date(cycle.updatedAt),
      durationMonths: cycle.durationMonths,
    }
  }
}
