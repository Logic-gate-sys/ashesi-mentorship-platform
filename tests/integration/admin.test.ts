import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as createCycle, GET as getCycles } from '@/app/api/admin/cycles/route';
import { clearDatabase } from '../helpers/test-db-utils';
import { prisma } from '@/app/_utils/db';
import { createJWT } from '@/app/_utils/jwt';
import { hashPassword } from '@/app/_utils/password';

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

  beforeAll(async () => {
    await clearDatabase();
    adminUser = await createTestUser('ADMIN');
    adminToken = await getToken(adminUser.id, 'ADMIN');
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe('POST /api/admin/cycles', () => {
    it('Should create a new mentorship cycle as admin', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3); // 3 months later

      const payload = {
        name: 'Spring 2026 Cohort',
        description: 'Third cohort of the mentorship program',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const req = new NextRequest('http://localhost/api/admin/cycles', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await createCycle(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data?.name).toBe('Spring 2026 Cohort');
    });

    it('Should reject invalid date range', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 1); // Earlier than start

      const payload = {
        name: 'Invalid Cycle',
        description: 'This should fail validation',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const req = new NextRequest('http://localhost/api/admin/cycles', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await createCycle(req);
      expect(res.status).toBe(400);
    });

    it('Should reject non-admin users', async () => {
      const studentUser = await createTestUser('STUDENT');
      const studentToken = await getToken(studentUser.id, 'STUDENT');

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const payload = {
        name: 'Test Cycle',
        description: 'Should fail',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const req = new NextRequest('http://localhost/api/admin/cycles', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${studentToken}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await createCycle(req);
      expect(res.status).toBe(403);

      await prisma.user.delete({ where: { id: studentUser.id } });
    });
  });

  describe('GET /api/admin/cycles', () => {
    it('Should list all mentorship cycles', async () => {
      const req = new NextRequest('http://localhost/api/admin/cycles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      const res = await getCycles(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });
});
