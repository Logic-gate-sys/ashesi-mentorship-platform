import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createJWT } from '@/app/_utils/jwt';
import { createTestUser } from '../helpers/factories';
import { cleanupAllData, createStudentProfileDirect, createAlumniProfileDirect, createMentorshipRequestDirect, deleteUser } from '../helpers/database.helpers';

const BASE_URL = 'http://localhost:3000';

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
    studentProfile = await createStudentProfileDirect(studentUser.id, {
      yearGroup: 2,
      major: 'Computer Science',
      interests: ['Web Dev', 'Machine Learning'],
    });
    alumniProfile = await createAlumniProfileDirect(alumniUser.id, {
      graduationYear: 2022,
      major: 'Computer Science',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY',
      isAvailable: true,
    });

    // Get tokens
    studentToken = await getToken(studentUser.id);
    alumniToken = await getToken(alumniUser.id);
  });

  afterAll(async () => {
    await cleanupAllData();
  });

  describe('POST /api/student/requests', () => {
    it('should create a mentorship request as a student', async () => {
      const response = await request(BASE_URL)
        .post('/api/student/requests')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          alumniId: alumniProfile.id,
          goal: 'Learn web development and system design best practices',
          message: 'I am very interested in working with you',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.status).toBe('PENDING');
    });

    it('should validate goal length', async () => {
      const response = await request(BASE_URL)
        .post('/api/student/requests')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          alumniId: alumniProfile.id,
          goal: 'Short goal',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should prevent duplicate pending requests', async () => {
      // Create first request
      await request(BASE_URL)
        .post('/api/student/requests')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          alumniId: alumniProfile.id,
          goal: 'Learn web development and system design best practices',
        });

      // Try to create duplicate
      const response = await request(BASE_URL)
        .post('/api/student/requests')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          alumniId: alumniProfile.id,
          goal: 'Another goal for learning web development and design',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const response = await request(BASE_URL)
        .post('/api/student/requests')
        .send({
          alumniId: alumniProfile.id,
          goal: 'Learn web development and system design best practices',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/student/requests', () => {
    it('should list requests for authenticated student', async () => {
      const response = await request(BASE_URL)
        .get('/api/student/requests')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter by status', async () => {
      const response = await request(BASE_URL)
        .get('/api/student/requests?status=PENDING')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every((r: any) => r.status === 'PENDING')).toBe(true);
    });

    it('should respect pagination', async () => {
      const response = await request(BASE_URL)
        .get('/api/student/requests?limit=5&offset=0')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.offset).toBe(0);
    });
  });

  describe('POST /api/mentor/requests/:requestId/accept', () => {
    let requestId: string;

    beforeEach(async () => {
      // Create a request
      const createRes = await request(BASE_URL)
        .post('/api/student/requests')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          alumniId: alumniProfile.id,
          goal: 'Learn web development and system design best practices',
          message: 'I am interested',
        });

      requestId = createRes.body.data.id;
    });

    it('should accept a mentorship request as alumni', async () => {
      const response = await request(BASE_URL)
        .post(`/api/mentor/requests/${requestId}/accept`)
        .set('Authorization', `Bearer ${alumniToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('ACCEPTED');
    });

    it('should prevent non-assigned alumni from accepting', async () => {
      const otherAlumniUser = await createTestUser('ALUMNI');
      const otherAlumniProfile = await createAlumniProfileDirect(otherAlumniUser.id, {
        graduationYear: 2022,
        major: 'Computer Science',
        company: 'Tech Corp',
        jobTitle: 'Software Engineer',
        industry: 'TECHNOLOGY',
        isAvailable: true,
      });
      const otherToken = await getToken(otherAlumniUser.id);

      const response = await request(BASE_URL)
        .post(`/api/mentor/requests/${requestId}/accept`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);

      // Cleanup
      await deleteUser(otherAlumniUser.id);
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
    studentProfile = await createStudentProfileDirect(studentUser.id, {
      yearGroup: 2,
      major: 'Computer Science',
      interests: ['Web Dev', 'Machine Learning'],
    });
    alumniProfile = await createAlumniProfileDirect(alumniUser.id, {
      graduationYear: 2022,
      major: 'Computer Science',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY',
      isAvailable: true,
    });
    studentToken = await getToken(studentUser.id);
    alumniToken = await getToken(alumniUser.id);

    // Create and accept a mentorship request
    const req = await createMentorshipRequestDirect(studentProfile.id, alumniProfile.id, {
      goal: 'Learn web development and system design best practices',
      status: 'ACCEPTED',
    });

    request_ = req;
  });

  afterAll(async () => {
    await cleanupAllData();
  });

  describe('POST /api/sessions', () => {
    it('should create a session as alumni', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const response = await request(BASE_URL)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${alumniToken}`)
        .send({
          requestId: request_.id,
          topic: 'Introduction to Web Development',
          duration: 60,
          scheduledAt: futureDate.toISOString(),
          notes: 'First session - basics',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('SCHEDULED');
    });

    it('should not allow past dates', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const response = await request(BASE_URL)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${alumniToken}`)
        .send({
          requestId: request_.id,
          topic: 'Introduction to Web Development',
          duration: 60,
          scheduledAt: pastDate.toISOString(),
        });

      expect(response.status).toBe(400);
    });

    it('should validate duration limits', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const response = await request(BASE_URL)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${alumniToken}`)
        .send({
          requestId: request_.id,
          topic: 'Introduction to Web Development',
          duration: 500, // Too long
          scheduledAt: futureDate.toISOString(),
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sessions', () => {
    it('should list sessions for authenticated user', async () => {
      const response = await request(BASE_URL)
        .get('/api/sessions')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});

describe('Availability API', () => {
  let alumniUser: any;
  let alumniProfile: any;
  let alumniToken: string;

  beforeAll(async () => {
    alumniUser = await createTestUser('ALUMNI');
    alumniProfile = await createAlumniProfileDirect(alumniUser.id, {
      graduationYear: 2022,
      major: 'Computer Science',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY',
      isAvailable: true,
    });
    alumniToken = await getToken(alumniUser.id);
  });

  afterAll(async () => {
    await cleanupAllData();
  });

  describe('POST /api/alumni/availability', () => {
    it('should create availability slot as alumni', async () => {
      const response = await request(BASE_URL)
        .post('/api/alumni/availability')
        .set('Authorization', `Bearer ${alumniToken}`)
        .send({
          dayOfWeek: 'MONDAY',
          startTime: '09:00',
          endTime: '11:00',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.dayOfWeek).toBe('MONDAY');
    });

    it('should validate time formats', async () => {
      const response = await request(BASE_URL)
        .post('/api/alumni/availability')
        .set('Authorization', `Bearer ${alumniToken}`)
        .send({
          dayOfWeek: 'TUESDAY',
          startTime: '9:00', // Wrong format
          endTime: '11:00',
        });

      expect(response.status).toBe(400);
    });

    it('should ensure start time before end time', async () => {
      const response = await request(BASE_URL)
        .post('/api/alumni/availability')
        .set('Authorization', `Bearer ${alumniToken}`)
        .send({
          dayOfWeek: 'WEDNESDAY',
          startTime: '14:00',
          endTime: '10:00', // End before start
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/alumni/availability', () => {
    it('should list availability slots', async () => {
      const response = await request(BASE_URL)
        .get('/api/alumni/availability')
        .set('Authorization', `Bearer ${alumniToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by day of week', async () => {
      const response = await request(BASE_URL)
        .get('/api/alumni/availability?dayOfWeek=MONDAY')
        .set('Authorization', `Bearer ${alumniToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every((slot: any) => slot.dayOfWeek === 'MONDAY')).toBe(true);
    });
  });
});

describe('ABAC Permissions', () => {
  let studentUser: any;
  let studentToken: string;
  let alumniToken: string;

  beforeAll(async () => {
    studentUser = await createTestUser('STUDENT');
    await createStudentProfileDirect(studentUser.id, {
      yearGroup: 2,
      major: 'Computer Science',
      interests: ['Web Dev', 'Machine Learning'],
    });
    studentToken = await getToken(studentUser.id);

    const alumniUser = await createTestUser('ALUMNI');
    await createAlumniProfileDirect(alumniUser.id, {
      graduationYear: 2022,
      major: 'Computer Science',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY',
      isAvailable: true,
    });
    alumniToken = await getToken(alumniUser.id);
  });

  afterAll(async () => {
    await cleanupAllData();
  });

  it('only students can create mentorship requests', async () => {
    const response = await request(BASE_URL)
      .post('/api/student/requests')
      .set('Authorization', `Bearer ${alumniToken}`)
      .send({
        alumniId: 'some-id',
        goal: 'Learn web development and system design best practices',
      });

    expect(response.status).toBe(403);
  });

  it('students cannot create availability slots', async () => {
    const response = await request(BASE_URL)
      .post('/api/alumni/availability')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '11:00',
      });

    expect(response.status).toBe(403);
  });
});
