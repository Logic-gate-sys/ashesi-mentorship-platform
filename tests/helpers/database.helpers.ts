import { prisma } from '@/app/_utils/db';

/**
 * Database cleanup helpers
 * Abstracts all direct Prisma calls from test files
 */

/**
 * Clean up all database tables in correct FK dependency order
 */
export async function cleanupAllData() {
  try {
    // Delete in correct order to respect foreign key constraints
    await Promise.all([
      prisma.sessionFeedback.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.message.deleteMany(),
      prisma.availability.deleteMany(),
      prisma.session.deleteMany(),
      prisma.mentorshipRequest.deleteMany(),
      prisma.alumniProfile.deleteMany(),
      prisma.studentProfile.deleteMany(),
      prisma.mentorshipCycle.deleteMany(),
      prisma.conversationParticipant.deleteMany(),
      prisma.conversation.deleteMany(),
    ]);
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

/**
 * Delete a specific user by ID
 */
export async function deleteUser(userId: string) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}

/**
 * Create a student profile directly
 */
export async function createStudentProfileDirect(userId: string, overrides = {}) {
  return await prisma.studentProfile.create({
    data: {
      userId,
      yearGroup: 2,
      major: 'Computer Science',
      interests: ['Web Dev'],
      ...overrides,
    },
  });
}

/**
 * Create an alumni profile directly
 */
export async function createAlumniProfileDirect(userId: string, overrides = {}) {
  return await prisma.alumniProfile.create({
    data: {
      userId,
      graduationYear: 2020,
      major: 'Computer Science',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY',
      isAvailable: true,
      bio: 'Test mentor bio',
      ...overrides,
    },
  });
}

/**
 * Create a mentorship request directly
 */
export async function createMentorshipRequestDirect(
  studentId: string,
  alumniProfileId: string,
  overrides = {}
) {
  return await prisma.mentorshipRequest.create({
    data: {
      studentId,
      alumniProfileId,
      goal: 'Learn web development and system design best practices',
      status: 'ACCEPTED',
      ...overrides,
    },
  });
}

/**
 * Create a session directly
 */
export async function createSessionDirect(
  requestId: string,
  topic: string,
  overrides = {}
) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  return await prisma.session.create({
    data: {
      mentorshipRequestId: requestId,
      topic,
      duration: 60,
      scheduledAt: futureDate,
      status: 'SCHEDULED',
      ...overrides,
    },
  });
}

/**
 * Create a notification directly
 */
export async function createNotificationDirect(
  userId: string,
  type: string,
  overrides = {}
) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title: 'Test Notification',
      message: 'This is a test notification',
      isRead: false,
      ...overrides,
    },
  });
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Find a conversation participant
 */
export async function findConversationParticipant(
  conversationId: string,
  userId: string
) {
  return await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  });
}

/**
 * Update user status
 */
export async function updateUserStatus(
  userId: string,
  isActive: boolean,
  isVerified?: boolean
) {
  const data: any = { isActive };
  if (isVerified !== undefined) {
    data.isVerified = isVerified;
  }

  return await prisma.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * Create a cycle directly
 */
export async function createCycleDirect(
  name: string,
  startDate: Date,
  endDate: Date,
  overrides = {}
) {
  return await prisma.mentorshipCycle.create({
    data: {
      name,
      startDate,
      endDate,
      ...overrides,
    },
  });
}

/**
 * Clean up specific tables
 */
export async function cleanupTables(...tables: string[]) {
  const tableMap: Record<string, any> = {
    users: prisma.user,
    students: prisma.studentProfile,
    alumni: prisma.alumniProfile,
    cycles: prisma.mentorshipCycle,
    requests: prisma.mentorshipRequest,
    sessions: prisma.session,
    feedback: prisma.sessionFeedback,
    conversations: prisma.conversation,
    messages: prisma.message,
    notifications: prisma.notification,
    availability: prisma.availability,
  };

  for (const table of tables) {
    if (tableMap[table]) {
      await tableMap[table].deleteMany();
    }
  }
}
