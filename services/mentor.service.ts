import { prisma } from "#/utils_types/utils/db";


export async function getAllMentors(page: number, limit:number){
    const skip = (page-1) * limit
    return await prisma.user.findMany({
        skip: skip,
        take: limit,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mentorProfile: {
                select: {
                    major: true,
                    graduationYear:true,
                    jobTitle: true,
                    company: true,
                    mentees: true,
                    skills: true,
                    bio: true
                }
            }

        },
        orderBy: {createdAt: 'desc'}
    })

}
