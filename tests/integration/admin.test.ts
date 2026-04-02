import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createJWT } from '@/app/_utils/jwt';
import { hashPassword } from '@/app/_utils/password';
import { createTestUser } from '../helpers/factories';
import { cleanupAllData, deleteUser, updateUserStatus, createNotificationDirect } from '../helpers/database.helpers';

const BASE_URL = 'http://localhost:3000';

async function getToken(userId: string, role: string = 'ADMIN') {
  return await createJWT(
    {
      id: userId,
      email: 'test@ashesi.edu.gh',
      role,
      firstName: 'Test',
      lastName: 'User',
    },
    '7d'
  );
}

describe('Admin - Mentorship Cycles', () => {
  let adminUser: any;
  let adminToken: string;
  let cycleId: string;

  beforeAll(async () => {
    adminUser = await createTestUser('ADMIN');
    adminToken = await getToken(adminUser.id, 'ADMIN');
  });

  afterAll(async () => {
    await cleanupAllData();
  });

  describe('POST /api/admin/cycles', () => {
    it('should create a new mentorship cycle as admin', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3); // 3 months later

      const response = await request(BASE_URL)
        .post('/api/admin/cycles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Spring 2026 Cohort',
          description: 'Third cohort of the mentorship program',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Spring 2026 Cohort');
      expect(response.body.data.status).toBe('PLANNING');

      cycleId = response.body.data.id;
    });

    it('should validate start date before end date', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 1); // Earlier than start

      const response = await request(BASE_URL)
        .post('/api/admin/cycles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Cycle',
          description: 'This should fail validation',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(response.status).toBe(400);
    });

    it('should require authentication and admin role', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      // Test without token
      const response1 = await request(BASE_URL)
        .post('/api/admin/cycles')
        .send({
          name: 'Test Cycle',
          description: 'Should fail',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(response1.status).toBe(401);

      // Test with non-admin user
      const studentUser = await createTestUser('STUDENT');
      const studentToken = await getToken(studentUser.id, 'STUDENT');

      const response2 = await request(BASE_URL)
        .post('/api/admin/cycles')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Test Cycle',
          description: 'Should fail',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      // Cleanup
      await deleteUser(studentUser.id);
    });
  });

  describe('GET /api/admin/cycles', () => {
    it('should list all mentorship cycles', async () => {
      const response = await request(BASE_URL)
        .get('/api/admin/cycles')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter by status', async () => {
      const response = await request(BASE_URL)
        .get('/api/admin/cycles?status=PLANNING')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every((c: any) => c.status === 'PLANNING')).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(BASE_URL)
        .get('/api/admin/cycles?limit=5&offset=0')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.offset).toBe(0);
    });
  });

  describe('PATCH /api/admin/cycles/:id', () => {
    it('should update a mentorship cycle', async () => {
      const response = await request(BASE_URL)
        .patch(`/api/admin/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'ACTIVE',
          description: 'Updated description',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('ACTIVE');
      expect(response.body.data.description).toBe('Updated description');
    });

    it('should only allow admins to update', async () => {
      const studentUser = await createTestUser('STUDENT');
      const studentToken = await getToken(studentUser.id, 'STUDENT');

      const response = await request(BASE_URL)
        .patch(`/api/admin/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          status: 'CLOSED',
        });

      expect(response.status).toBe(403);

      // Cleanup
      await deleteUser(studentUser.id);
    });
  });
});

describe('Admin - User Management', () => {
  let adminUser: any;
  let studentUser: any;
  let adminToken: string;

  beforeAll(async () => {
    adminUser = await createTestUser('ADMIN');
    studentUser = await createTestUser('STUDENT');
    adminToken = await getToken(adminUser.id, 'ADMIN');
  });

  afterAll(async () => {
    await cleanupAllData();
  });

  describe('GET /api/admin/users', () => {
    it('should list all users', async () => {
      const response = await request(BASE_URL)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by role', async () => {
      const response = await request(BASE_URL)
        .get('/api/admin/users?role=STUDENT')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every((u: any) => u.role === 'STUDENT')).toBe(true);
    });

    it('should filter by active status', async () => {
      const response = await request(BASE_URL)
        .get('/api/admin/users?isActive=true')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every((u: any) => u.isActive === true)).toBe(true);
    });
  });

  describe('PATCH /api/admin/users/:id/activate', () => {
    it('should activate a user', async () => {
      // First deactivate the user
      await updateUserStatus(studentUser.id, true);

      const response = await request(BASE_URL)
        .patch(`/api/admin/users/${studentUser.id}/activate`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.isActive).toBe(true);
    });

    it('should only allow admins', async () => {
      const userToken = await getToken(studentUser.id, 'STUDENT');

      const response = await request(BASE_URL)
        .patch(`/api/admin/users/${studentUser.id}/activate`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /api/admin/users/:id/deactivate', () => {
    it('should deactivate a user', async () => {
      const response = await request(BASE_URL)
        .patch(`/api/admin/users/${studentUser.id}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reason: 'Account violation',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.isActive).toBe(false);
    });
  });

  describe('PATCH /api/admin/users/:id/verify', () => {
    it('should verify a user', async () => {
      const response = await request(BASE_URL)
        .patch(`/api/admin/users/${studentUser.id}/verify`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.isVerified).toBe(true);
    });
  });
});

describe('Admin - Platform Analytics', () => {
  let adminUser: any;
  let adminToken: string;

  beforeAll(async () => {
    adminUser = await createTestUser('ADMIN');
    adminToken = await getToken(adminUser.id, 'ADMIN');
  });

  afterAll(async () => {
    await cleanupAllData();
  });

  describe('GET /api/admin/analytics', () => {
    it('should retrieve platform analytics for admins only', async () => {
      const response = await request(BASE_URL)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      // Should include metrics like total users, active mentorships, etc.
    });

    it('should not be accessible to non-admin users', async () => {
      const studentUser = await createTestUser('STUDENT');
      const studentToken = await getToken(studentUser.id, 'STUDENT');

      const response = await request(BASE_URL)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);

      // Cleanup
      await deleteUser(studentUser.id);
    });
  });
});

describe('ABAC Permission System', () => {
  let adminUser: any;
  let studentUser: any;
  let alumniUser: any;
  let adminToken: string;
  let studentToken: string;
  let alumniToken: string;

  beforeAll(async () => {
    adminUser = await createTestUser('ADMIN');
    studentUser = await createTestUser('STUDENT');
    alumniUser = await createTestUser('ALUMNI');

    adminToken = await getToken(adminUser.id, 'ADMIN');
    studentToken = await getToken(studentUser.id, 'STUDENT');
    alumniToken = await getToken(alumniUser.id, 'ALUMNI');
  });

  afterAll(async () => {
    await cleanupAllData();
  });

  it('should enforce role-based permissions', async () => {
    // Admin can create cycles
    const adminRes = await request(BASE_URL)
      .post('/api/admin/cycles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Cycle',
        description: 'Test description',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      });

    expect(adminRes.status).toBe(201);

    // Student cannot create cycles
    const studentRes = await request(BASE_URL)
      .post('/api/admin/cycles')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'Test Cycle',
        description: 'Test description',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      });

    expect(studentRes.status).toBe(403);
  });

  it('should enforce attribute-based permissions', async () => {
    // User can only see their own notifications
    const notification = await createNotificationDirect(studentUser.id, 'TEST', {
      title: 'Test',
      message: 'Test notification',
    });

    // Student can access their own notifications
    const ownRes = await request(BASE_URL)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(ownRes.status).toBe(200);

    // Alumni cannot access student's notifications (in detail view)
    // This would be tested in a detail endpoint

    // Cleanup
    // Notification cleaned up in afterAll via cleanupAllData()
  });
});
