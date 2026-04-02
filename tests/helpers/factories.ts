import { prisma } from '@/app/_utils/db';
import { hashPassword } from '@/app/_utils/password';

export async function createTestUser(
  role: 'STUDENT' | 'ALUMNI' | 'ADMIN' = 'STUDENT',
  overrides = {}
) {
  const timestamp = Date.now();
  const roleEmail: Record<string, string> = {
    STUDENT: `student-${timestamp}@ashesi.edu.gh`,
    ALUMNI: `alumni-${timestamp}@ashesi.edu.gh`,
    ADMIN: `admin-${timestamp}@ashesi.edu.gh`,
  };

  return await prisma.user.create({
    data: {
      email: roleEmail[role],
      passwordHash:hashPassword('TestPass123!'),
      firstName: 'Test',
      lastName: role,
      role,
      isVerified: true,
      isActive: true,
      ...overrides,
    },
  });
}

/**
 * Creates a student profile for a given user
 */
export async function createStudentProfile(
  userId: string,
  overrides=  {}
) {
  return await prisma.studentProfile.create({
    data: {
      userId,
      yearGroup: 2,
      major:  'Computer Science',
      interests:  ['Web Dev'],
      ...overrides,
    },
  });
}

/**
 * Creates an alumni profile for a given user
 */
export async function createAlumniProfile(
  userId: string,
  overrides= {}
) {
  return await prisma.alumniProfile.create({
    data: {
      userId,
      graduationYear: 2020,
      major: 'Computer Science',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY',
      isAvailable: true,
      bio:  'Test mentor bio',
      ...overrides,
    },
  });
}

/**
 * Creates a complete student user with profile
 */
export async function createStudentWithProfile(
  userOverrides = {},
  profileOverrides= {}
) {
  const user = await createTestUser('STUDENT', userOverrides);
  const profile = await createStudentProfile(user.id, profileOverrides);
  return { user, profile };
}

/**
 * Creates a complete alumni user with profile
 */
export async function createAlumniWithProfile(
  userOverrides = {},
  profileOverrides = {}
) {
  const user = await createTestUser('ALUMNI', userOverrides);
  const profile = await createAlumniProfile(user.id, profileOverrides);
  return { user, profile };
}

/**
 * Creates a mentorship cycle
 */
export async function createMentorshipCycle(
  overrides= {}
) {
  const startDate =  new Date();
  const endDate =  new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000); // 3 months later
  await prisma.mentorshipRequest
  return await prisma.mentorshipCycle.create({
    data: {
      name: `Test Cycle ${Date.now()}`,
      description: 'Test mentorship cycle',
      startDate,
      endDate,
      status:'PLANNING',
      ...overrides,
    },
  });
}
