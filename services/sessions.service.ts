/**
 * Sessions Service
 * Business logic for managing mentorship sessions
 */

import { prisma } from '#utils-types/utils/db';
import { SessionStatus, MeetingType } from '#/prisma/generated/prisma/client';

export interface SessionWithRelations {
  id: string;
  status: SessionStatus;
  type: MeetingType;
  requestId: string;
  menteeId: string;
  mentorId: string;
  topic: string;
  notes?: string | null;
  scheduledAt: Date;
  duration: number;
  meetingUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  mentee?: any;
  mentor?: any;
  request?: any;
  feedback?: any;
}

/**
 * Get all sessions for a mentor
 */
export async function getMentorSessions(mentorProfileId: string, status?: SessionStatus) {
  const where: any = { mentorId: mentorProfileId };
  if (status) where.status = status;

  return await prisma.session.findMany({
    where,
    include: {
      mentee: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
      request: {
        select: {
          id: true,
          status: true,
          goal: true,
        },
      },
      feedback: {
        select: {
          id: true,
          rating: true,
          comment: true,
        },
      },
    },
    orderBy: {
      scheduledAt: 'desc',
    },
  });
}

/**
 * Get upcoming sessions for a mentor (within next 30 days)
 */
export async function getUpcomingMentorSessions(mentorProfileId: string) {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return await prisma.session.findMany({
    where: {
      mentorId: mentorProfileId,
      status: { in: ['SCHEDULED', 'RESCHEDULED'] },
      scheduledAt: {
        gte: now,
        lte: thirtyDaysFromNow,
      },
    },
    include: {
      mentee: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
      request: {
        select: {
          id: true,
          goal: true,
        },
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  });
}

/**
 * Get single session details
 */
export async function getSession(sessionId: string) {
  return await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      mentee: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
      mentor: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      request: true,
      feedback: true,
    },
  });
}

/**
 * Create a new session
 */
export async function createSession(data: {
  requestId: string;
  menteeId: string;
  mentorId: string;
  topic: string;
  scheduledAt: Date;
  duration: number;
  type?: MeetingType;
  notes?: string;
  meetingUrl?: string;
}) {
  return await prisma.session.create({
    data: {
      ...data,
      type: data.type || 'VIRTUAL',
      status: 'SCHEDULED',
    },
    include: {
      mentee: {
        include: {
          user: true,
        },
      },
      mentor: {
        include: {
          user: true,
        },
      },
      request: true,
    },
  });
}

/**
 * Update session details
 */
export async function updateSession(
  sessionId: string,
  mentorProfileId: string,
  data: Partial<{
    topic: string;
    scheduledAt: Date;
    duration: number;
    notes: string;
    meetingUrl: string;
  }>
) {
  // Verify mentor ownership
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { mentorId: true },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.mentorId !== mentorProfileId) {
    throw new Error('Unauthorized: Not the mentor for this session');
  }

  return await prisma.session.update({
    where: { id: sessionId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    include: {
      mentee: {
        include: {
          user: true,
        },
      },
    },
  });
}

/**
 * Mark session as completed
 */
export async function completeSession(sessionId: string, mentorProfileId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { mentorId: true, status: true },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.mentorId !== mentorProfileId) {
    throw new Error('Unauthorized');
  }

  if (session.status !== 'SCHEDULED' && session.status !== 'RESCHEDULED') {
    throw new Error(`Cannot complete session with status: ${session.status}`);
  }

  return await prisma.session.update({
    where: { id: sessionId },
    data: {
      status: 'COMPLETED',
      updatedAt: new Date(),
    },
    include: {
      mentee: {
        include: {
          user: true,
        },
      },
    },
  });
}

/**
 * Cancel session
 */
export async function cancelSession(sessionId: string, mentorProfileId: string, reason?: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { mentorId: true, status: true },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.mentorId !== mentorProfileId) {
    throw new Error('Unauthorized');
  }

  if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
    throw new Error(`Cannot cancel session with status: ${session.status}`);
  }

  return await prisma.session.update({
    where: { id: sessionId },
    data: {
      status: 'CANCELLED',
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled by mentor',
      updatedAt: new Date(),
    },
    include: {
      mentee: {
        include: {
          user: true,
        },
      },
    },
  });
}

/**
 * Get mentor's session statistics
 */
export async function getMentorSessionStats(mentorProfileId: string) {
  const [total, completed, scheduled, cancelled] = await Promise.all([
    prisma.session.count({
      where: { mentorId: mentorProfileId },
    }),
    prisma.session.count({
      where: {
        mentorId: mentorProfileId,
        status: 'COMPLETED',
      },
    }),
    prisma.session.count({
      where: {
        mentorId: mentorProfileId,
        status: { in: ['SCHEDULED', 'RESCHEDULED'] },
      },
    }),
    prisma.session.count({
      where: {
        mentorId: mentorProfileId,
        status: 'CANCELLED',
      },
    }),
  ]);

  return {
    total,
    completed,
    scheduled,
    cancelled,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
  };
}
