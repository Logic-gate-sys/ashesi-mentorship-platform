import { prisma } from "@/app/_utils_and_types/utils/db";
import { User } from "@/prisma/generated/prisma/client";

export async function getUserProfile(id: User['id']){
    try{
     const userProfile=  await prisma.user.findUnique({
        where: {id: id},
        select: {
          id:true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
          isActive: true,
          messages  : true, // news message can also show up as updates
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
                sessions: true,
                requests: true,
            
            }
          }
        }
      });

      //return refined result
      return {
        ...userProfile,
        sessions: userProfile?.mentorProfile?.sessions,// any upcomming session is an event
        mentees:  userProfile?.mentorProfile?.mentees,
        requests: userProfile?.mentorProfile?.requests,
        messages: userProfile?.messages,
        feedbacks: userProfile?.mentorProfile?.sessions?.feedback
     }; 
    }catch(err){
        throw new Error(err.message??"Failed to get user profile")
    }
}