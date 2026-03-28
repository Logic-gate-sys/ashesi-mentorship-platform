import { afterEach } from "vitest";
import { prisma } from '@/app/_utils/db'
import '@testing-library/jest-dom';

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

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.warn("Cleanup warning (safe to ignore if first run):", errorMessage);
  }
});
