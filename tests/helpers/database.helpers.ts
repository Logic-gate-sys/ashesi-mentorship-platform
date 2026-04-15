import { prisma } from '../../app/_utils/db';

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
      prisma.conversationParticipant.deleteMany(),
      prisma.conversation.deleteMany(),
    ]);
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}


export async function deleteUser(userId: string) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}

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


export async function createMentorshipRequestDirect(
  studentId: string,
  alumniId: string,
  overrides = {}
) {
  return await prisma.mentorshipRequest.create({
    data: {
      studentId,
      alumniId,
      goal: 'Learn web development and system design best practices',
      status: 'ACCEPTED',
      ...overrides,
    },
  });
}

export async function createSessionDirect(
  requestId: string,
  topic: string,
  overrides = {}
) {
  // Get the request to extract student and alumni IDs
  const request = await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error(`Mentorship request not found: ${requestId}`);
  }

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  return await prisma.session.create({
    data: {
      requestId,
      studentId: request.studentId,
      alumniId: request.alumniId,
      topic,
      duration: 60,
      scheduledAt: futureDate,
      status: 'SCHEDULED',
      ...overrides,
    },
  });
}


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
      body: 'This is a test notification',
      isRead: false,
      ...overrides,
    },
  });
}


export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}


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


export async function createCycleDirect(
  name: string,
  startDate: Date,
  endDate: Date,
  overrides = {}
) {
  throw new Error('MentorshipCycle model does not exist in the current schema');
}


export async function cleanupTables(...tables: string[]) {
  const tableMap: Record<string, any> = {
    users: prisma.user,
    students: prisma.studentProfile,
    alumni: prisma.alumniProfile,
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


export async function findNotificationById(id: string) {
  return await prisma.notification.findUnique({
    where: { id },
  });
}
