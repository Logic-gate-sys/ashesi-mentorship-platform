/**
 * Mentorship Requests Service
 * Business logic for managing mentorship requests
 * Handles: list, get, accept, decline, create
 */

import { prisma } from '#utils-types/utils/db';
import { RequestStatus } from '#/prisma/generated/prisma/client';

export interface MentorshipRequestWithRelations {
  id: string;
  status: RequestStatus;
  menteeId: string;
  mentorId: string;
  cycleId: string;
  goal: string;
  message?: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date | null;
  mentee?: {
    id: string;
    userId: string;
    yearGroup: number;
    major: string;
    bio?: string | null;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string | null;
    };
  };
  mentor?: {
    id: string;
    userId: string;
    graduationYear: number;
    major: string;
    company: string;
    jobTitle: string;
    bio?: string | null;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string | null;
    };
  };
}

/**
 * Get all mentorship requests for a mentor
 */
export async function getMentorRequests(mentorProfileId: string, status?: RequestStatus) {
  const where: any = { mentorId: mentorProfileId };
  if (status) where.status = status;

  return await prisma.mentorshipRequest.findMany({
    where,
    include: {
      mentee: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      },
      cycle: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get single mentorship request details
 */
export async function getMentorshipRequest(requestId: string) {
  return await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
    include: {
      mentee: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
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
              email: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      },
      cycle: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
      sessions: {
        select: {
          id: true,
          status: true,
          scheduledAt: true,
        },
      },
    },
  });
}

/**
 * Accept a mentorship request
 */
export async function acceptMentorshipRequest(requestId: string, mentorProfileId: string) {
  // Verify the mentor owns this request
  const request = await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
    select: { mentorId: true, status: true },
  });

  if (!request) {
    throw new Error('Request not found');
  }

  if (request.mentorId !== mentorProfileId) {
    throw new Error('Unauthorized: Not the mentor for this request');
  }

  if (request.status !== 'PENDING') {
    throw new Error(`Cannot accept request with status: ${request.status}`);
  }

  return await prisma.mentorshipRequest.update({
    where: { id: requestId },
    data: {
      status: 'ACCEPTED',
      updatedAt: new Date(),
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
      cycle: true,
    },
  });
}

/**
 * Decline a mentorship request
 */
export async function declineMentorshipRequest(requestId: string, mentorProfileId: string) {
  const request = await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
    select: { mentorId: true, status: true },
  });

  if (!request) {
    throw new Error('Request not found');
  }

  if (request.mentorId !== mentorProfileId) {
    throw new Error('Unauthorized: Not the mentor for this request');
  }

  if (request.status !== 'PENDING') {
    throw new Error(`Cannot decline request with status: ${request.status}`);
  }

  return await prisma.mentorshipRequest.update({
    where: { id: requestId },
    data: {
      status: 'DECLINED',
      resolvedAt: new Date(),
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
 * Get count of pending requests for a mentor
 */
export async function getPendingRequestsCount(mentorProfileId: string) {
  return await prisma.mentorshipRequest.count({
    where: {
      mentorId: mentorProfileId,
      status: 'PENDING',
    },
  });
}
