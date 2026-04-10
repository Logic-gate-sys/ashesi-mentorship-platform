import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { clearDatabase } from '../helpers/test-db-utils';
import {prisma} from '@/app/_lib/db'; 


const BASE_URL = 'http://localhost:3000';

describe('Auth API - Registration & Authentication', () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
  });


  describe('POST /api/auth/register/student', () => {
    it('should register a new student successfully', async () => {
      const payload = {
        email: 'student@ashesi.edu.gh',
        firstName: 'John',
        lastName: 'Doe',
        password: 'SecurePass123!',
        confirm: 'SecurePass123!',
        year: 2,
        major: 'Computer Science',
      };

      const response = await request(BASE_URL)
        .post('/api/auth/register/student')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(payload.email);
      expect(response.body.user.role).toBe('STUDENT');

      // Verify user in database
      const user = await prisma.user.findUnique({ where: { email: payload.email } });
      expect(user).toBeDefined();
      expect(user?.passwordHash).not.toBe(payload.password); // Should be hashed
    });

    it('should validate required fields', async () => {
      const payload = {
        email: 'student@ashesi.edu.gh',
        firstName: 'John',
      };

      const response = await request(BASE_URL)
        .post('/api/auth/register/student')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should reject non-ashesi email', async () => {
      const payload = {
        email: 'student@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'SecurePass123!',
        confirm: 'SecurePass123!',
        year: 2,
        major: 'Computer Science',
      };

      const response = await request(BASE_URL)
        .post('/api/auth/register/student')
        .send(payload);

      expect(response.status).toBe(400);
    });

    it('should reject mismatched passwords', async () => {
      const payload = {
        email: 'student@ashesi.edu.gh',
        firstName: 'John',
        lastName: 'Doe',
        password: 'SecurePass123!',
        confirm: 'DifferentPass123!',
        year: 2,
        major: 'Computer Science',
      };

      const response = await request(BASE_URL)
        .post('/api/auth/register/student')
        .send(payload);

      expect(response.status).toBe(400);
    });

    it('should reject duplicate email', async () => {
      const email = `student-${Date.now()}@ashesi.edu.gh`;
      const payload = {
        email,
        firstName: 'John',
        lastName: 'Doe',
        password: 'SecurePass123!',
        confirm: 'SecurePass123!',
        year: 2,
        major: 'Computer Science',
      };

      // First registration
      await request(BASE_URL)
        .post('/api/auth/register/student')
        .send(payload);

      // Attempt duplicate
      const response = await request(BASE_URL)
        .post('/api/auth/register/student')
        .send(payload);

      expect(response.status).toBe(409); // Conflict
    });
  });


  describe('POST /api/auth/register/alumni', () => {
    it('should register a new alumni successfully', async () => {
      const payload = {
        email: `alumni-${Date.now()}@ashesi.edu.gh`,
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'SecurePass123!',
        confirm: 'SecurePass123!',
        graduationYear: 2020,
        major: 'Computer Science',
        company: 'Tech Corp',
        jobTitle: 'Senior Engineer',
        industry: 'TECHNOLOGY',
      };

      const response = await request(BASE_URL)
        .post('/api/auth/register/alumni')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.role).toBe('ALUMNI');
      expect(response.body.user.firstName).toBe(payload.firstName);
    });

    it('should validate alumni-specific fields', async () => {
      const payload = {
        email: `alumni-${Date.now()}@ashesi.edu.gh`,
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'SecurePass123!',
        confirm: 'SecurePass123!',
        graduationYear: 2020,
        // Missing major, company, jobTitle, industry
      };

      const response = await request(BASE_URL)
        .post('/api/auth/register/alumni')
        .send(payload);

      expect(response.status).toBe(400);
    });
  });


  describe('POST /api/auth/login', () => {
    let testUser ;

    beforeEach(async () => {
      // Create test user
      await clearDatabase();
      const response = await request(BASE_URL)
        .post('/api/auth/register/student')
        .send({
          email: 'testlogin@ashesi.edu.gh',
          firstName: 'Test',
          lastName: 'User',
          password: 'TestPass123!',
          confirm: 'TestPass123!',
          year: 2,
          major: 'CS',
        });
      testUser = response.body;
    });

    it('should login with correct credentials', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          email: 'testlogin@ashesi.edu.gh',
          password: 'TestPass123!',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('testlogin@ashesi.edu.gh');
    });

    it('should reject incorrect password', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          email: 'testlogin@ashesi.edu.gh',
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('errors');
    });

    it('should reject non-existent user', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@ashesi.edu.gh',
          password: 'TestPass123!',
        });

      expect(response.status).toBe(401);
    });

    it('should validate email format', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: 'TestPass123!',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      await clearDatabase();
      const response = await request(BASE_URL)
        .post('/api/auth/register/student')
        .send({
          email: `authme-${Date.now()}@ashesi.edu.gh`,
          firstName: 'Test',
          lastName: 'User',
          password: 'TestPass123!',
          confirm: 'TestPass123!',
          year: 2,
          major: 'CS',
        });
      token = response.body.token;
    });

    it('should return current user with valid token', async () => {
      const response = await request(BASE_URL)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('role');
    });

    it('should reject request without token', async () => {
      const response = await request(BASE_URL)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const response = await request(BASE_URL)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });


  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });


  describe('PATCH /api/auth/profile', () => {
    let token: string;

    beforeEach(async () => {
      await clearDatabase();
      const response = await request(BASE_URL)
        .post('/api/auth/register/student')
        .send({
          email: `profile-${Date.now()}@ashesi.edu.gh`,
          firstName: 'John',
          lastName: 'Doe',
          password: 'TestPass123!',
          confirm: 'TestPass123!',
          year: 2,
          major: 'CS',
        });
      token = response.body.token;
    });

    it('should update user profile', async () => {
      const response = await request(BASE_URL)
        .patch('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
        });

      expect(response.status).toBe(200);
      expect(response.body.user.firstName).toBe('Jane');
      expect(response.body.user.lastName).toBe('Smith');
    });

    it('should reject update without authentication', async () => {
      const response = await request(BASE_URL)
        .patch('/api/auth/profile')
        .send({ firstName: 'Jane' });

      expect(response.status).toBe(401);
    });
  });
});
