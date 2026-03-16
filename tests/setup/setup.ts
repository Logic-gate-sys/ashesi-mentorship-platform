import { afterEach } from "vitest";
import { prisma } from '@/lib/db'

afterEach(async () => {
  try {
    await prisma.alumniProfile.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.mentorshipRequest.deleteMany(); 
    await prisma.message.deleteMany(); 
    await prisma.notification.deleteMany();
    await prisma.session.deleteMany();
    await prisma.sessionFeedback.deleteMany(); 
    await prisma.studentProfile.deleteMany(); 
    await prisma.user.deleteMany(); 

  } catch (err: any) {
    console.warn("Cleanup warning (safe to ignore if first run):", err.message);
  }
});
