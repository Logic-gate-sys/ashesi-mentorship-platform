import { prisma } from "#utils-types/utils/db";
import { User } from "#/prisma/generated/prisma/client";

export async function getUserProfile(id: User['id']){
    try{
     const userProfile =  await prisma.user.findUnique({
        where: {id: id},
        select: {
          id:true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
          isActive: true,
          messages  : true,
          mentorProfile:{
            include: {
                mentees: {select:{
                    major: true,
                    yearGroup: true,
                    user:{
                     select: {
                        firstName: true,
                        lastName: true,
                        avatarUrl: true
                     }
                    }
                }},
                sessions: {
                  include: {
                    feedback: true,
                  },
                },
                requests: true,
            
            }
          }
        }
      });

      if (!userProfile) {
        return null;
      }

      const feedbacks = userProfile.mentorProfile?.sessions
        ?.map((session) => session.feedback)
        .filter(Boolean);

      //return refined result
      return {
        ...userProfile,
        sessions: userProfile?.mentorProfile?.sessions,// any upcomming session is an event
        mentees:  userProfile?.mentorProfile?.mentees,
        requests: userProfile?.mentorProfile?.requests,
        messages: userProfile?.messages,
        feedbacks,
     }; 
    }catch(err: unknown){
        throw new Error(err instanceof Error ? err.message : "Failed to get user profile")
    }
}