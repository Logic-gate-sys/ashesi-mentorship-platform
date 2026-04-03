import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as createRequest, GET as getRequests } from '@/app/api/student/requests/route';
import { POST as createSession, GET as getSessions } from '@/app/api/sessions/route';
import { POST as createAvailability, GET as getAvailability } from '@/app/api/alumni/availability/route';
import { prisma } from '@/app/_utils/db';
import { createJWT } from '@/app/_utils/jwt';
import { hashPassword } from '@/app/_utils/password';

// Helper to create test user
async function createTestUser(role: 'STUDENT' | 'ALUMNI' | 'ADMIN') {
  const user = await prisma.user.create({
    data: {
      email: `test-${role.toLowerCase()}-${Date.now()}@ashesi.edu.gh`,
      passwordHash: hashPassword('TestPass123!'),
      role,
      firstName: 'Test',
      lastName: role,
      isVerified: true,
      isActive: true,
    },
  });

  return user;
}

// Helper to create test student profile
async function createStudentProfile(userId: string) {
  return await prisma.studentProfile.create({
    data: {
      userId,
      yearGroup: 2,
      major: 'Computer Science',
      interests: ['Web Dev', 'Machine Learning'],
    },
  });
}

// Helper to create test alumni profile
async function createAlumniProfile(userId: string) {
  return await prisma.alumniProfile.create({
    data: {
      userId,
      graduationYear: 2022,
      major: 'Computer Science',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY',
      isAvailable: true,
    },
  });
}

// Helper to get JWT token
async function getToken(userId: string) {
  return await createJWT(
    {
      id: userId,
      email: 'test@ashesi.edu.gh',
      role: 'STUDENT',
      firstName: 'Test',
      lastName: 'User',
    },
    '7d'
  );
}

describe('Mentorship Requests API', () => {
  let studentUser: any;
  let studentProfile: any;
  let alumniUser: any;
  let alumniProfile: any;
  let studentToken: string;
  let alumniToken: string;

  beforeAll(async () => {
    // Create test users
    studentUser = await createTestUser('STUDENT');
    alumniUser = await createTestUser('ALUMNI');

    // Create profiles
    studentProfile = await createStudentProfile(studentUser.id);
    alumniProfile = await createAlumniProfile(alumniUser.id);

    // Get tokens
    studentToken = await getToken(studentUser.id);
    alumniToken = await getToken(alumniUser.id);
  });

  afterAll(async () => {
    await prisma.mentorshipRequest.deleteMany();
    await prisma.alumniProfile.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/student/requests', () => {
    it('Should create a mentorship request as a student', async () => {
      const payload = {
        alumniId: alumniProfile.id,
        goal: 'Learn web development and system design best practices',
        message: 'I am very interested in working with you',
      };

      const req = new NextRequest('http://localhost/api/student/requests', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${studentToken}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await createRequest(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data?.status).toBe('PENDING');
    });

    it('Should reject duplicate pending requests', async () => {
      // First request
      const payload = {
        alumniId: alumniProfile.id,
        goal: 'Learn web development and system design best practices',
      };

      const req1 = new NextRequest('http://localhost/api/student/requests', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${studentToken}`,
        },
        body: JSON.stringify(payload),
      });
      await createRequest(req1);

      // Duplicate attempt
      const req2 = new NextRequest('http://localhost/api/student/requests', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ ...payload, alumniId: `${alumniProfile.id}-2` }),
      });
      const res = await createRequest(req2);

      expect([409, 400]).toContain(res.status);
    });
  });

  describe('GET /api/student/requests', () => {
    it('Should list requests for authenticated student', async () => {
      const req = new NextRequest('http://localhost/api/student/requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${studentToken}`,
        },
      });

      const res = await getRequests(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });
});

describe('Sessions API', () => {
  let studentUser: any;
  let studentProfile: any;
  let alumniUser: any;
  let alumniProfile: any;
  let studentToken: string;
  let alumniToken: string;
  let request_: any;

  beforeAll(async () => {
    studentUser = await createTestUser('STUDENT');
    alumniUser = await createTestUser('ALUMNI');
    studentProfile = await createStudentProfile(studentUser.id);
    alumniProfile = await createAlumniProfile(alumniUser.id);
    studentToken = await getToken(studentUser.id);
    alumniToken = await getToken(alumniUser.id);

    // Create and accept a mentorship request
    const req = await prisma.mentorshipRequest.create({
      data: {
        studentId: studentProfile.id,
        alumniId: alumniProfile.id,
        goal: 'Learn web development and system design best practices',
        status: 'ACCEPTED',
      },
    });

    request_ = req;
  });

  afterAll(async () => {
    await prisma.session.deleteMany();
    await prisma.sessionFeedback.deleteMany();
    await prisma.mentorshipRequest.deleteMany();
    await prisma.alumniProfile.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/sessions', () => {
    it('Should create a session as alumni', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const payload = {
        requestId: request_.id,
        topic: 'Introduction to Web Development',
        duration: 60,
        scheduledAt: futureDate.toISOString(),
        notes: 'First session - basics',
      };

      const req = new NextRequest('http://localhost/api/sessions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${alumniToken}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await createSession(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data?.status).toBe('SCHEDULED');
    });

    it('Should reject past dates', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const payload = {
        requestId: request_.id,
        topic: 'Introduction to Web Development',
        duration: 60,
        scheduledAt: pastDate.toISOString(),
      };

      const req = new NextRequest('http://localhost/api/sessions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${alumniToken}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await createSession(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/sessions', () => {
    it('Should list sessions for authenticated user', async () => {
      const req = new NextRequest('http://localhost/api/sessions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${studentToken}`,
        },
      });

      const res = await getSessions(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });
});

describe('Availability API', () => {
  let alumniUser: any;
  let alumniProfile: any;
  let alumniToken: string;

  beforeAll(async () => {
    alumniUser = await createTestUser('ALUMNI');
    alumniProfile = await createAlumniProfile(alumniUser.id);
    alumniToken = await getToken(alumniUser.id);
  });

  afterAll(async () => {
    await prisma.availability.deleteMany();
    await prisma.alumniProfile.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/alumni/availability', () => {
    it('Should create availability slot as alumni', async () => {
      const payload = {
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '11:00',
      };

      const req = new NextRequest('http://localhost/api/alumni/availability', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${alumniToken}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await createAvailability(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data?.dayOfWeek).toBe('MONDAY');
    });

    it('Should ensure start time before end time', async () => {
      const payload = {
        dayOfWeek: 'WEDNESDAY',
        startTime: '14:00',
        endTime: '10:00', // End before start
      };

      const req = new NextRequest('http://localhost/api/alumni/availability', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${alumniToken}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await createAvailability(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/alumni/availability', () => {
    it('Should list availability slots', async () => {
      const req = new NextRequest('http://localhost/api/alumni/availability', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${alumniToken}`,
        },
      });

      const res = await getAvailability(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });
});

describe('ABAC Permissions', () => {
  let studentUser: any;
  let studentToken: string;
  let alumniToken: string;

  beforeAll(async () => {
    studentUser = await createTestUser('STUDENT');
    await createStudentProfile(studentUser.id);
    studentToken = await getToken(studentUser.id);

    const alumniUser = await createTestUser('ALUMNI');
    await createAlumniProfile(alumniUser.id);
    alumniToken = await getToken(alumniUser.id);
  });

  afterAll(async () => {
    await prisma.studentProfile.deleteMany();
    await prisma.alumniProfile.deleteMany();
    await prisma.user.deleteMany();
  });

  it('Only students can create mentorship requests', async () => {
    const payload = {
      alumniId: 'some-id',
      goal: 'Learn web development and system design best practices',
    };

    const req = new NextRequest('http://localhost/api/student/requests', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${alumniToken}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await createRequest(req);
    expect(res.status).toBe(403);
  });

  it('Students cannot create availability slots', async () => {
    const payload = {
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '11:00',
    };

    const req = new NextRequest('http://localhost/api/alumni/availability', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${studentToken}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await createAvailability(req);
    expect(res.status).toBe(403);
  });
});
