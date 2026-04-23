import { createMentorshipRequestSchema } from '#libs-schemas/schemas/request.schema.js';
import { prisma } from '#utils-types/utils/db';
import {z} from 'zod'; 
import { RequestStatus } from '#/prisma/generated/prisma/enums';

export async function getMentorRequests(mentorProfileId: string) {
  return await prisma.mentorshipRequest.findMany({
    where: {mentorId: mentorProfileId},
    select: {
      mentee: {
        select: {
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

export async function getPendingRequestsCount(mentorProfileId: string) {
  return await prisma.mentorshipRequest.count({
    where: {
      mentorId: mentorProfileId,
      status: 'PENDING',
    },
  });
}


export async function sendMentorshipRequest(data: z.infer<typeof createMentorshipRequestSchema>){
  try{
    return await prisma.mentorshipRequest.create({
      data: {
        ...data
      }
    })
  }catch(err){
    throw new Error('Failed to create mentorship request');
  }

}

export async function getMentorshipRequest(id: string, page: number, limit:number) {
  const skip = (page - 1) * limit; 
  const take = limit ; 
  return await prisma.mentorshipRequest.findMany({
    where: { menteeId: id },
    skip: skip,
    take: take,
    select: {
      id: true,
      mentor:{
        select: {
        id: true,
        firstName: true,
        lastName: true,
        profession: true,
        }
      },
      message: true,
      status: true,
      resolvedAt: true,
      createdAt: true
    }
  });
}
