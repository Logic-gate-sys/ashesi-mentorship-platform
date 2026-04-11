/**
 * Session Feedback Service
 * Handles all database operations for session feedback and ratings
 */

import { prisma } from '@/app/_utils/db'

export class SessionFeedbackService {
  /**
   * Create or update session feedback
   */
  static async createFeedback(sessionId: string, data: { rating: number; feedback?: string; topics?: string }) {
    // Check if feedback already exists
    const existing = await prisma.sessionFeedback.findFirst({
      where: { sessionId },
    })

    if (existing) {
      return SessionFeedbackService.updateFeedback(existing.id, data)
    }

    return prisma.sessionFeedback.create({
      data: {
        sessionId,
        rating: data.rating,
        comment: data.feedback,
      },
      include: {
        session: {
          include: {
            request: true,
            alumni: true,
          },
        },
      },
    })
  }

  /**
   * Get feedback for a session
   */
  static async getFeedbackBySessionId(sessionId: string) {
    return prisma.sessionFeedback.findFirst({
      where: { sessionId },
      include: {
        session: {
          include: {
            request: true,
            alumni: true,
          },
        },
      },
    })
  }

  /**
   * Update feedback
   */
  static async updateFeedback(
    id: string,
    data: {
      rating?: number
      feedback?: string
      topics?: string
    }
  ) {
    return prisma.sessionFeedback.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete feedback
   */
  static async deleteFeedback(id: string) {
    return prisma.sessionFeedback.delete({
      where: { id },
    })
  }

  /**
   * Get average rating for an alumni
   */
  static async getAverageRating(alumniId: string) {
    const sessions = await prisma.session.findMany({
      where: { alumniId },
      include: {
        feedback: true,
      },
    })

    const ratings = sessions
      .filter(s => s.feedback && s.feedback.rating)
      .map(s => s.feedback!.rating)

    if (ratings.length === 0) return 0

    const sum = ratings.reduce((a, b) => a + b, 0)
    return (sum / ratings.length).toFixed(2)
  }

  /**
   * Get all feedback for an alumni
   */
  static async getAlumniFeedback(
    alumniId: string,
    options: { limit?: number; offset?: number } = {}
  ) {
    const { limit = 10, offset = 0 } = options

    const [feedback, total] = await Promise.all([
      prisma.sessionFeedback.findMany({
        where: {
          session: {
            alumniId,
          },
        },
        include: {
          session: {
            include: {
              request: {
                include: {
                  student: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.sessionFeedback.count({
        where: {
          session: {
            alumniId,
          },
        },
      }),
    ])

    return { feedback, total }
  }
}
