import { prisma } from "#/utils_types/utils/db"

export async function getCurrentMentorshipCycle(){
    return await prisma.mentorshipCycle.findFirst({
       select: {
         id: true,
         name: true,
         status: true,
         description: true,
         startDate: true,
         endDate: true,
         registrationCloseDate: true,
         registrationOpenDate: true,
         requests: true,
         createdAt: true,
       }
    })

}

 