/**
 * Session Feedback Service
 * Business logic for managing session feedback and ratings
 */

import { prisma } from '@/app/_utils_and_types/utils/db';

export interface SessionFeedbackData {
  id: string;
  sessionId: string;
  rating: number; // 1-5
  comment?: string | null;
  createdAt: Date;
  session?: any;
}

/**
 * Create feedback for a session
 */
export async function createSessionFeedback(data: {
  sessionId: string;
  rating: number;
  comment?: string;
}) {
  // Validate rating
  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Check if session exists and is completed
  const session = await prisma.session.findUnique({
    where: { id: data.sessionId },
    select: { status: true, id: true },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.status !== 'COMPLETED') {
    throw new Error('Can only provide feedback for completed sessions');
  }

  // Check if feedback already exists
  const existingFeedback = await prisma.sessionFeedback.findUnique({
    where: { sessionId: data.sessionId },
  });

  if (existingFeedback) {
    throw new Error('Feedback already exists for this session');
  }

  return await prisma.sessionFeedback.create({
    data: {
      sessionId: data.sessionId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      session: {
        select: {
          id: true,
          topic: true,
          mentee: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Get feedback for a session
 */
export async function getSessionFeedback(sessionId: string) {
  return await prisma.sessionFeedback.findUnique({
    where: { sessionId },
    include: {
      session: {
        select: {
          id: true,
          topic: true,
          mentee: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Get all feedback for a mentor
 */
export async function getMentorFeedback(mentorProfileId: string) {
  const feedback = await prisma.sessionFeedback.findMany({
    where: {
      session: {
        mentorId: mentorProfileId,
      },
    },
    include: {
      session: {
        select: {
          id: true,
          topic: true,
          mentee: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return feedback;
}

/**
 * Calculate mentor's average rating
 */
export async function getMentorAverageRating(mentorProfileId: string) {
  const result = await prisma.sessionFeedback.aggregate({
    where: {
      session: {
        mentorId: mentorProfileId,
      },
    },
    _avg: {
      rating: true,
    },
    _count: true,
  });

  return {
    averageRating: result._avg.rating ? Number(result._avg.rating.toFixed(2)) : 0,
    totalFeedback: result._count,
  };
}

/**
 * Get rating distribution for a mentor
 */
export async function getMentorRatingDistribution(mentorProfileId: string) {
  const feedback = await prisma.sessionFeedback.findMany({
    where: {
      session: {
        mentorId: mentorProfileId,
      },
    },
    select: { rating: true },
  });

  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  feedback.forEach(f => {
    distribution[f.rating as keyof typeof distribution]++;
  });

  return distribution;
}

/**
 * Update feedback
 */
export async function updateSessionFeedback(
  sessionId: string,
  data: Partial<{
    rating: number;
    comment: string;
  }>
) {
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  return await prisma.sessionFeedback.update({
    where: { sessionId },
    data,
  });
}

/**
 * Delete feedback
 */
export async function deleteSessionFeedback(sessionId: string) {
  return await prisma.sessionFeedback.delete({
    where: { sessionId },
  });
}
