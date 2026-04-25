import { createMentorshipRequestSchema } from '#libs-schemas/schemas/request.schema.js';
import { prisma } from '#utils-types/utils/db';
import {z} from 'zod'; 
import { RequestStatus } from '#/prisma/generated/prisma/enums';






export async function updateMentorshipRequestStatus(requestId: string, mentorProfileId: string, status: RequestStatus) {
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
    where: { id: requestId, mentorId: mentorProfileId },
    data: {
      status:status,
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


export async function getPendingRequestsCount(userProfileId: string, user:'MENTEE'|'MENTOR') {
  const where = user==='MENTEE'? {menteeId: userProfileId} : {mentorId: userProfileId}
  return await prisma.mentorshipRequest.count({
    where: {
      ...where,
      status: 'PENDING',
    },
  });
}


export async function sendMentorshipRequest(data: z.infer<typeof createMentorshipRequestSchema>){
    return await prisma.mentorshipRequest.create({
      data: {
         ...data,
      }
    })
}

export async function getMentorshipRequestDetails(requestId: string) {
   return await prisma.mentorshipRequest.findMany({
     where: { id: requestId },
     include: {
       id: true,
       mentor:{
         select: {
         id: true,
         firstName: true,
         lastName: true,
         profession: true,
         graduationYear: true,
         }
       },
       message: true,
       status: true,
       sessions: true,
       resolvedAt: true,
       createdAt: true   }
   });
 }
export async function getMentorshipRequests(userProfileId: string, user: 'MENTEE'|'MENTOR',status?: RequestStatus, ) {

  
  const where = user==='MENTEE'? {menteeId: userProfileId}:{mentorId: userProfileId}
  return await prisma.mentorshipRequest.findMany({
    where: {...where, status: status},
    select: {
      id: true,
      goal: true,
      message: true,
      status: true,
      mentee: {
        select: {
          yearGroup: true,
          major: true,
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
        select: {
         jobTitle: true,
         graduationYear: true,
         major: true,
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
