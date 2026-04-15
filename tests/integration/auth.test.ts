import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as registerStudent } from '@/app/api/auth/register/student/route';
import { POST as registerAlumni } from '@/app/api/auth/register/alumni/route';
import { POST as login } from '@/app/api/auth/login/route';
import { GET as authMe } from '@/app/api/auth/me/route';
import { PATCH as updateProfile } from '@/app/api/auth/profile/route';
import { clearDatabase, createTestAlumni, createTestStudent } from '../helpers/test-db-utils';
import { studentRegisterSchema } from '@/app/ _libs_and_schemas/schemas/auth.schema';
import z from 'zod';
import { createJWT } from '@/app/_utils_and_types/jwt';

describe('Auth API - Registration & Authentication', () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe('POST /api/auth/register/student', () => {
    it('Should signup student successfully', async () => {
      const payload :Partial< z.infer<typeof studentRegisterSchema>>= {
        email: 'student@ashesi.edu.gh',
        firstName: 'John',
        lastName: 'Doe',
        password: 'SecurePass123!',
        confirm: 'SecurePass123!',
        year: 2,
        major: 'Computer Science',
        interests: ['baseball', 'banana'],
        bio:"I am this bio",
      };

      const req = new NextRequest('http://localhost/api/auth/register/student', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const res = await registerStudent(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body).toBeDefined();
      expect(body.user?.role).toBe('STUDENT');
    });

    it('Should reject missing required fields', async () => {
      const payload = {
        email: 'student@ashesi.edu.gh',
        firstName: 'John',
        // Missing other required fields
      };

      const req = new NextRequest('http://localhost/api/auth/register/student', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await registerStudent(req);
      expect(res.status).toBe(400);
    });

    it('Should reject duplicate email', async () => {
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
      const req1 = new NextRequest('http://localhost/api/auth/register/student', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await registerStudent(req1);

      // Duplicate attempt
      const req2 = new NextRequest('http://localhost/api/auth/register/student', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await registerStudent(req2);
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/register/alumni', () => {
    it('Should signup alumni successfully', async () => {
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

      const req = new NextRequest('http://localhost/api/auth/register/alumni', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await registerAlumni(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.user?.role).toBe('ALUMNI');
    });
  });

  // describe('POST /api/auth/login', () => {
  //   it('Should login with correct credentials', async () => {
  //     const {user, rawPassword} = await createTestAlumni(); 

  //     const req = new NextRequest('http://localhost/api/auth/login', {
  //       method: 'POST',
  //       headers: { 'content-type': 'application/json' },
  //       body: JSON.stringify({email:(await user).email, password: rawPassword }),
  //     });

  //     const res = await login(req);
  //     const body = await res.json();
  //     console.log("RES: ", body)

  //     expect(res.status).toBe(200);
  //     expect(body.accessToken).toBeDefined();
  //   });

  //   it('Should reject incorrect password', async () => {
  //     const payload = {
  //       email: 'login-test@ashesi.edu.gh',
  //       password: 'WrongPassword123!',
  //     };

  //     const req = new NextRequest('http://localhost/api/auth/login', {
  //       method: 'POST',
  //       headers: { 'content-type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });

  //     const res = await login(req);
  //     expect(res.status).toBe(401);
  //   });
  // });

  describe('GET /api/auth/me', () => {
    it(
      'Should return current user with valid token', async () => {
      const {user} = await createTestAlumni(); 
      const token = await createJWT(
        {
          id: (await user).id, 
          firstName:(await user).firstName,
          lastName: (await user).lastName, 
          email:(await user).email, 
          role: (await user).role,
         });

      const req = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("ABOUT TO HIT REQUEST"); 
      const res = await authMe(req);
      const body = await res.json();
      console.log("RESPONSE: ", body)

      expect(res.status).toBe(200);
      expect(body.user).toBeDefined();
      expect(body.user?.email).toBeDefined();
    });

    it('Should reject request without token', async () => {
      const req = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
      });

      const res = await authMe(req);
      expect(res.status).toBe(401);
    });
  });

  // describe('PATCH /api/auth/profile', () => {
  //   let token: string;

  //   beforeAll(async () => {
  //     const payload = {
  //       email: `profile-test-${Date.now()}@ashesi.edu.gh`,
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       password: 'TestPass123!',
  //       confirm: 'TestPass123!',
  //       year: 2,
  //       major: 'CS',
  //     };

  //     const req = new NextRequest('http://localhost/api/auth/register/student', {
  //       method: 'POST',
  //       headers: { 'content-type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });
  //     const res = await registerStudent(req);
  //     const body = await res.json();
  //     token = body.accessToken;
  //   });

  //   it('Should update user profile', async () => {
  //     const req = new NextRequest('http://localhost/api/auth/profile', {
  //       method: 'PATCH',
  //       headers: {
  //         'content-type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         firstName: 'Jane',
  //         lastName: 'Smith',
  //       }),
  //     });

  //     const res = await updateProfile(req);
  //     const body = await res.json();

  //     expect(res.status).toBe(200);
  //     expect(body.user?.firstName).toBe('Jane');
  //   });
  // });
});
