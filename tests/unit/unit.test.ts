import { describe, it, expect } from 'vitest';
import { createJWT, verifyJWT, decodeJWT } from '@/app/_utils/jwt';
import { hashPassword, verifyPassword } from '@/app/_utils/password';
import {
  studentRegisterSchema,
  alumniRegisterSchema,
  loginSchema,
  updateProfileSchema,
} from '@/app/_schemas/auth.schema';



describe('Unit Tests - Core Utilities', () => {
  describe('JWT Utilities', () => {
    const testPayload = {
      id: 'user-123',
      email: 'test@ashesi.edu.gh',
      firstName: 'John',
      lastName: 'Doe',
      role: 'STUDENT' as const,
    };

    it('should create a valid JWT token with correct structure', async () => {
      const token = await createJWT(testPayload);
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });

    it('should verify a valid token and return payload', async () => {
      const token = await createJWT(testPayload);
      const verified = await verifyJWT(token);

      expect(verified).not.toBeNull();
      expect(verified?.id).toBe(testPayload.id);
      expect(verified?.email).toBe(testPayload.email);
    });

    it('should return null for invalid token format', async () => {
      const invalidTokens = ['invalid', 'only.two', 'four.parts.here.too', ''];

      for (const token of invalidTokens) {
        const result = await verifyJWT(token);
        expect(result).toBeNull();
      }
    });

    it('should include payload data in token', async () => {
      const token = await createJWT(testPayload);
      const decoded = decodeJWT(token);

      expect(decoded?.id).toBe(testPayload.id);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.role).toBe(testPayload.role);
    });

    it('should handle different user roles (STUDENT, ALUMNI, ADMIN)', async () => {
      const studentPayload = { ...testPayload, role: 'STUDENT' as const };
      const alumniPayload = { ...testPayload, role: 'ALUMNI' as const };
      const adminPayload = { ...testPayload, role: 'ADMIN' as const };

      const studentToken = await createJWT(studentPayload);
      const alumniToken = await createJWT(alumniPayload);
      const adminToken = await createJWT(adminPayload);

      expect(decodeJWT(studentToken)?.role).toBe('STUDENT');
      expect(decodeJWT(alumniToken)?.role).toBe('ALUMNI');
      expect(decodeJWT(adminToken)?.role).toBe('ADMIN');
    });
  });

  describe('Password Utilities', () => {
    const testPassword = 'MySecurePassword123!@#';

    it('should hash password with salt', () => {
      const hash = hashPassword(testPassword);

      expect(typeof hash).toBe('string');
      expect(hash).toContain('.');

      const parts = hash.split('.');
      expect(parts).toHaveLength(2);
    });

    it('should verify correct password against its hash', () => {
      const hash = hashPassword(testPassword);
      const isValid = verifyPassword(testPassword, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', () => {
      const hash = hashPassword(testPassword);
      const isValid = verifyPassword('WrongPassword', hash);

      expect(isValid).toBe(false);
    });

    it('should return false for invalid hash format', () => {
      const invalidHashes = ['no-dot-hash', 'too.many.dots.here', '', 'invalid.hash'];

      invalidHashes.forEach(invalidHash => {
        expect(verifyPassword(testPassword, invalidHash)).toBe(false);
      });
    });

    it('should be case-sensitive', () => {
      const hash = hashPassword('MyPassword');

      expect(verifyPassword('MyPassword', hash)).toBe(true);
      expect(verifyPassword('mypassword', hash)).toBe(false);
      expect(verifyPassword('MYPASSWORD', hash)).toBe(false);
    });
  });

  describe('Schema Validation', () => {
    it('should accept valid student registration data', () => {
      const validData = {
        email: 'student@ashesi.edu.gh',
        firstName: 'John',
        lastName: 'Doe',
        password: 'SecurePass123!',
        confirm: 'SecurePass123!',
        year: 2,
        major: 'Computer Science',
        interests: ['Web Development', 'Machine Learning'],
      };

      const result = studentRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept valid alumni registration data', () => {
      const validData = {
        email: 'alumni@ashesi.edu.gh',
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

      const result = alumniRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept valid login credentials', () => {
      const validData = {
        email: 'user@ashesi.edu.gh',
        password: 'AnyPassword123!',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept valid profile update data', () => {
      const validData = {
        firstName: 'Updated',
        lastName: 'Name',
        avatarUrl: 'https://example.com/avatar.jpg',
      };

      const result = updateProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject non-ashesi email across all schemas', () => {
      const studentData = {
        email: 'student@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'SecurePass123!',
        confirm: 'SecurePass123!',
        year: 2,
        major: 'Computer Science',
      };

      const loginData = {
        email: 'user@yahoo.com',
        password: 'Password123!',
      };

      const studentResult = studentRegisterSchema.safeParse(studentData);
      const loginResult = loginSchema.safeParse(loginData);

      expect(studentResult.success).toBe(false);
      expect(loginResult.success).toBe(false);
    });
  });
});
