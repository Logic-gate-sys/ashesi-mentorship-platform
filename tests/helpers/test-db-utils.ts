import {prisma} from '@/app/_utils/db'; 

/**
 * Clear all tables in the database (for test isolation)
 * Order matters for foreign key constraints
 */
export async function clearDatabase() {
  try {
    // Order tables from least to most dependent
    await prisma.message.deleteMany();
    await prisma.sessionFeedback.deleteMany();
    await prisma.session.deleteMany();
    await prisma.mentorshipRequest.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.alumniProfile.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

/**
 * Create a test user
 */
export async function createTestUser(data = {}) {
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      passwordHash: '$2b$12$abc123', // dummy hash for tests
      role: 'STUDENT',
      ...data,
    },
  });
}

/**
 * Create a test alumni profile
 */
export async function createTestAlumni(userId: string, data = {}) {
  return prisma.alumniProfile.create({
    data: {
      userId,
      graduationYear: 2020,
      major: 'Computer Science',
      company: 'Test Company',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY',
      bio: 'Test bio',
      ...data,
    },
  });
}

/**
 * Create a test student profile
 */
export async function createTestStudent(userId: string, data = {}) {
  return prisma.studentProfile.create({
    data: {
      userId,
      yearGroup: 1,
      major: 'Computer Science',
      ...data,
    },
  });
}

/**
 * Disconnect Prisma after tests
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export { prisma };
