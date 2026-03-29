import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { prisma } from '@/app/_utils/db';
import { createJWT } from '@/app/_utils/jwt';
import { hashPassword } from '@/app/_utils/password';

const BASE_URL = 'http://localhost:3000';

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

describe('Messaging API', () => {
  let user1: any;
  let user2: any;
  let token1: string;
  let token2: string;
  let conversationId: string;

  beforeAll(async () => {
    user1 = await createTestUser('STUDENT');
    user2 = await createTestUser('ALUMNI');
    token1 = await getToken(user1.id);
    token2 = await getToken(user2.id);
  });

  afterAll(async () => {
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/messages/conversations', () => {
    it('should create a conversation between two users', async () => {
      const response = await request(BASE_URL)
        .post('/api/messages/conversations')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          participantIds: [user2.id],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.participants).toBeDefined();

      conversationId = response.body.data.id;
    });

    it('should require at least 2 participants', async () => {
      const response = await request(BASE_URL)
        .post('/api/messages/conversations')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          participantIds: [user1.id], // Same user
        });

      expect(response.status).toBe(400);
    });

    it('should automatically add requester to participants', async () => {
      const response = await request(BASE_URL)
        .post('/api/messages/conversations')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          participantIds: [user2.id],
        });

      expect(response.status).toBe(201);
      const participantIds = response.body.data.participants.map((p: any) => p.userId);
      expect(participantIds).toContain(user1.id);
      expect(participantIds).toContain(user2.id);
    });

    it('should return existing conversation if already exists', async () => {
      // Create first
      const res1 = await request(BASE_URL)
        .post('/api/messages/conversations')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          participantIds: [user2.id],
        });

      conversationId = res1.body.data.id;

      // Try to create same conversation again
      const res2 = await request(BASE_URL)
        .post('/api/messages/conversations')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          participantIds: [user2.id],
        });

      expect(res2.status).toBe(200);
      expect(res2.body.data.id).toBe(conversationId);
    });
  });

  describe('Message Operations', () => {
    beforeEach(async () => {
      // Ensure conversation exists
      const res = await request(BASE_URL)
        .post('/api/messages/conversations')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          participantIds: [user2.id],
        });
      conversationId = res.body.data.id;
    });

    it('should send a message to conversation', async () => {
      const response = await request(BASE_URL)
        .post(`/api/messages/${conversationId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          conversationId,
          type: 'TEXT',
          body: 'Hello, this is a test message',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.body).toBe('Hello, this is a test message');
      expect(response.body.data.senderId).toBe(user1.id);
    });

    it('should validate message content', async () => {
      const response = await request(BASE_URL)
        .post(`/api/messages/${conversationId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          conversationId,
          type: 'TEXT',
          body: '', // Empty message
        });

      expect(response.status).toBe(400);
    });

    it('should prevent non-participants from sending messages', async () => {
      const otherUser = await createTestUser('STUDENT');
      const otherToken = await getToken(otherUser.id);

      const response = await request(BASE_URL)
        .post(`/api/messages/${conversationId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          conversationId,
          type: 'TEXT',
          body: 'I should not be able to send this',
        });

      expect(response.status).toBe(403);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });

    it('should retrieve conversation messages with pagination', async () => {
      // Send multiple messages
      for (let i = 0; i < 3; i++) {
        await request(BASE_URL)
          .post(`/api/messages/${conversationId}`)
          .set('Authorization', `Bearer ${token1}`)
          .send({
            conversationId,
            type: 'TEXT',
            body: `Message ${i + 1}`,
          });
      }

      const response = await request(BASE_URL)
        .get(`/api/messages/${conversationId}?limit=2&offset=0`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBeGreaterThanOrEqual(3);
    });

    it('should prevent non-participants from reading messages', async () => {
      const otherUser = await createTestUser('ALUMNI');
      const otherToken = await getToken(otherUser.id);

      const response = await request(BASE_URL)
        .get(`/api/messages/${conversationId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });

    it('should mark conversation as read', async () => {
      const response = await request(BASE_URL)
        .get(`/api/messages/${conversationId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);

      // Verify lastReadAt was updated
      const participant = await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: user2.id,
          },
        },
      });

      expect(participant?.lastReadAt).toBeDefined();
      expect(participant?.lastReadAt).not.toBeNull();
    });
  });
});

describe('Session Feedback API', () => {
  let studentUser: any;
  let alumniUser: any;
  let studentProfile: any;
  let alumniProfile: any;
  let studentToken: string;
  let alumniToken: string;
  let sessionId: string;

  beforeAll(async () => {
    studentUser = await createTestUser('STUDENT');
    alumniUser = await createTestUser('ALUMNI');
    studentToken = await getToken(studentUser.id);
    alumniToken = await getToken(alumniUser.id);

    // Create profiles
    studentProfile = await prisma.studentProfile.create({
      data: {
        userId: studentUser.id,
        yearGroup: 2,
        major: 'Computer Science',
        interests: ['Web Dev'],
      },
    });

    alumniProfile = await prisma.alumniProfile.create({
      data: {
        userId: alumniUser.id,
        graduationYear: 2022,
        major: 'CS',
        company: 'Tech',
        jobTitle: 'Engineer',
        industry: 'TECHNOLOGY',
      },
    });

    // Create request and session
    const req = await prisma.mentorshipRequest.create({
      data: {
        studentId: studentProfile.id,
        alumniId: alumniProfile.id,
        goal: 'Learn web development and system design best practices',
        status: 'ACCEPTED',
      },
    });

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const session = await prisma.session.create({
      data: {
        requestId: req.id,
        studentId: studentProfile.id,
        alumniId: alumniProfile.id,
        topic: 'Web Dev Basics',
        scheduledAt: futureDate,
        duration: 60,
        status: 'COMPLETED',
      },
    });

    sessionId = session.id;
  });

  afterAll(async () => {
    await prisma.sessionFeedback.deleteMany();
    await prisma.session.deleteMany();
    await prisma.mentorshipRequest.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.alumniProfile.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/sessions/:sessionId/feedback', () => {
    it('should create feedback for a session as student', async () => {
      const response = await request(BASE_URL)
        .post(`/api/sessions/${sessionId}/feedback`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          sessionId,
          rating: 5,
          comment: 'Great session, learned a lot',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.rating).toBe(5);
    });

    it('should validate rating range', async () => {
      const response = await request(BASE_URL)
        .post(`/api/sessions/${sessionId}/feedback`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          sessionId,
          rating: 10, // Invalid: max is 5
          comment: 'Test',
        });

      expect(response.status).toBe(400);
    });

    it('should only allow students to create feedback', async () => {
      const response = await request(BASE_URL)
        .post(`/api/sessions/${sessionId}/feedback`)
        .set('Authorization', `Bearer ${alumniToken}`)
        .send({
          sessionId,
          rating: 4,
          comment: 'Good session',
        });

      expect(response.status).toBe(403);
    });

    it('should validate feedback content length', async () => {
      const longComment = 'a'.repeat(501); // Exceeds max length

      const response = await request(BASE_URL)
        .post(`/api/sessions/${sessionId}/feedback`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          sessionId,
          rating: 3,
          comment: longComment,
        });

      expect(response.status).toBe(400);
    });
  });
});

describe('Notification API', () => {
  let user: any;
  let token: string;
  let notificationId: string;

  beforeAll(async () => {
    user = await createTestUser('STUDENT');
    token = await getToken(user.id);

    // Create a test notification
    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'REQUEST_RECEIVED',
        title: 'Test Notification',
        body: 'This is a test notification',
      },
    });

    notificationId = notification.id;
  });

  afterAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /api/notifications', () => {
    it('should list user notifications', async () => {
      const response = await request(BASE_URL)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by read status', async () => {
      const response = await request(BASE_URL)
        .get('/api/notifications?isRead=false')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every((n: any) => !n.isRead)).toBe(true);
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const response = await request(BASE_URL)
        .patch(`/api/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.isRead).toBe(true);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('should delete a notification', async () => {
      // Create a notification to delete
      const notification = await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'SESSION_REMINDER',
          title: 'To Delete',
          body: 'Delete me',
        },
      });

      const response = await request(BASE_URL)
        .delete(`/api/notifications/${notification.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      // Verify it's deleted
      const check = await prisma.notification.findUnique({
        where: { id: notification.id },
      });

      expect(check).toBeNull();
    });
  });
});
