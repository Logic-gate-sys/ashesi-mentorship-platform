import { describe, it, expect } from 'vitest';
import {
  studentRegisterSchema,
  alumniRegisterSchema,
  loginSchema,
  updateProfileSchema,
} from '@/app/ _libs_and_schemas/schemas/auth.schema';

/**
 * Auth Schema Validation Tests
 * Tests Zod schemas for complex validation logic
 */
describe('Auth Schemas', () => {
  describe('studentRegisterSchema', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@ashesi.edu.gh',
      password: 'SecurePass123!',
      confirm: 'SecurePass123!',
      year: 2,
      major: 'Computer Science',
    };

    it('should accept valid student registration data', () => {
      const result = studentRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject if first name is too short', () => {
      const result = studentRegisterSchema.safeParse({
        ...validData,
        firstName: 'A',
      });
      expect(result.success).toBe(false);
    });

    it('should reject if last name is too short', () => {
      const result = studentRegisterSchema.safeParse({
        ...validData,
        lastName: 'X',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-ashesi email', () => {
      const result = studentRegisterSchema.safeParse({
        ...validData,
        email: 'john@gmail.com',
      });
      expect(result.success).toBe(false);
    });

    it('should accept various ashesi email formats', () => {
      const emails = [
        'student@ashesi.edu.gh',
        'john.doe@ashesi.edu.gh',
        'contact123@ashesi.edu.gh',
      ];

      emails.forEach(email => {
        const result = studentRegisterSchema.safeParse({
          ...validData,
          email,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid email format', () => {
      const result = studentRegisterSchema.safeParse({
        ...validData,
        email: 'notanemail@ashesi.edu.gh.',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = studentRegisterSchema.safeParse({
        ...validData,
        password: 'Short1!',
        confirm: 'Short1!',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password longer than 72 characters', () => {
      const longPassword = 'a'.repeat(73);
      const result = studentRegisterSchema.safeParse({
        ...validData,
        password: longPassword,
        confirm: longPassword,
      });
      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const result = studentRegisterSchema.safeParse({
        ...validData,
        password: 'SecurePass123!',
        confirm: 'DifferentPass123!',
      });
      expect(result.success).toBe(false);
    });

    it('should reject year outside 1-4 range', () => {
      const invalidYears = [0, 5, -1, 100];

      invalidYears.forEach(year => {
        const result = studentRegisterSchema.safeParse({
          ...validData,
          year,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should accept valid years 1-4', () => {
      [1, 2, 3, 4].forEach(year => {
        const result = studentRegisterSchema.safeParse({
          ...validData,
          year,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject missing major', () => {
      const { major, ...incomplete } = validData;
      const result = studentRegisterSchema.safeParse(incomplete);
      expect(result.success).toBe(false);
    });

    it('should trim whitespace from names and major', () => {
      const result = studentRegisterSchema.safeParse({
        ...validData,
        firstName: '  John  ',
        lastName: '  Doe  ',
        major: '  Computer Science  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('John');
        expect(result.data.lastName).toBe('Doe');
        expect(result.data.major).toBe('Computer Science');
      }
    });
  });

  describe('alumniRegisterSchema', () => {
    const validData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@ashesi.edu.gh',
      password: 'SecurePass123!',
      confirm: 'SecurePass123!',
      graduationYear: 2020,
      major: 'Business Administration',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY' as const,
    };

    it('should accept valid alumni registration data', () => {
      const result = alumniRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject non-ashesi email', () => {
      const result = alumniRegisterSchema.safeParse({
        ...validData,
        email: 'jane@gmail.com',
      });
      expect(result.success).toBe(false);
    });

    it('should reject graduation year before 2002 (Ashesi founding)', () => {
      const result = alumniRegisterSchema.safeParse({
        ...validData,
        graduationYear: 2001,
      });
      expect(result.success).toBe(false);
    });

    it('should reject future graduation year', () => {
      const futureYear = new Date().getFullYear() + 1;
      const result = alumniRegisterSchema.safeParse({
        ...validData,
        graduationYear: futureYear,
      });
      expect(result.success).toBe(false);
    });

    it('should accept current year as graduation year', () => {
      const currentYear = new Date().getFullYear();
      const result = alumniRegisterSchema.safeParse({
        ...validData,
        graduationYear: currentYear,
      });
      expect(result.success).toBe(true);
    });

    it('should reject short company name', () => {
      const result = alumniRegisterSchema.safeParse({
        ...validData,
        company: 'A',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short job title', () => {
      const result = alumniRegisterSchema.safeParse({
        ...validData,
        jobTitle: 'A',
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid industries', () => {
      const validIndustries = [
        'TECHNOLOGY',
        'FINANCE',
        'CONSULTING',
        'HEALTHCARE',
        'EDUCATION',
        'ENGINEERING',
        'OTHER',
      ] as const;

      validIndustries.forEach(industry => {
        const result = alumniRegisterSchema.safeParse({
          ...validData,
          industry,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid industry', () => {
      const result = alumniRegisterSchema.safeParse({
        ...validData,
        industry: 'INVALID_INDUSTRY',
      });
      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const result = alumniRegisterSchema.safeParse({
        ...validData,
        password: 'SecurePass123!',
        confirm: 'DifferentPass123!',
      });
      expect(result.success).toBe(false);
    });

    it('should trim professional details', () => {
      const result = alumniRegisterSchema.safeParse({
        ...validData,
        company: '  Tech Corp  ',
        jobTitle: '  Software Engineer  ',
        major: '  Business Admin  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.company).toBe('Tech Corp');
        expect(result.data.jobTitle).toBe('Software Engineer');
      }
    });
  });

  describe('loginSchema', () => {
    const validData = {
      email: 'user@ashesi.edu.gh',
      password: 'SecurePass123!',
    };

    it('should accept valid login credentials', () => {
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject non-ashesi email', () => {
      const result = loginSchema.safeParse({
        ...validData,
        email: 'user@gmail.com',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email format', () => {
      const result = loginSchema.safeParse({
        ...validData,
        email: 'notanemail@ashesi.edu.gh.',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const { password, ...incomplete } = validData;
      const result = loginSchema.safeParse(incomplete);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        ...validData,
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('should accept password of any length', () => {
      const passwords = [
        '1', // Single character
        '123456789', // Short
        'a'.repeat(100), // Long
      ];

      passwords.forEach(password => {
        const result = loginSchema.safeParse({
          email: validData.email,
          password,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('updateProfileSchema', () => {
    it('should accept valid profile update data', () => {
      const result = updateProfileSchema.safeParse({
        firstName: 'Jonathan',
        lastName: 'Smith',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty object (all optional)', () => {
      const result = updateProfileSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should accept partial updates', () => {
      const partials = [
        { firstName: 'John' },
        { lastName: 'Doe' },
        { avatarUrl: 'https://example.com/avatar.jpg' },
      ];

      partials.forEach(partial => {
        const result = updateProfileSchema.safeParse(partial);
        expect(result.success).toBe(true);
      });
    });

    it('should reject firstName shorter than 2 characters', () => {
      const result = updateProfileSchema.safeParse({
        firstName: 'A',
      });
      expect(result.success).toBe(false);
    });

    it('should reject lastName shorter than 2 characters', () => {
      const result = updateProfileSchema.safeParse({
        lastName: 'X',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid URL for avatarUrl', () => {
      const result = updateProfileSchema.safeParse({
        avatarUrl: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    it('should accept various valid URLs', () => {
      const validUrls = [
        'https://example.com/avatar.jpg',
        'http://example.com/avatar/123',
        'https://cdn.example.com/avatars/user-123.png',
      ];

      validUrls.forEach(url => {
        const result = updateProfileSchema.safeParse({
          avatarUrl: url,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should trim whitespace from names', () => {
      const result = updateProfileSchema.safeParse({
        firstName: '  Jane  ',
        lastName: '  Doe  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('Jane');
        expect(result.data.lastName).toBe('Doe');
      }
    });
  });

  describe('Cross-Schema Tests', () => {
    it('should reject common password mistakes across schemas', () => {
      const tooShortPassword = 'Short1!';

      const studentResult = studentRegisterSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@ashesi.edu.gh',
        password: tooShortPassword,
        confirm: tooShortPassword,
        year: 2,
        major: 'CS',
      });

      const alumniResult = alumniRegisterSchema.safeParse({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@ashesi.edu.gh',
        password: tooShortPassword,
        confirm: tooShortPassword,
        graduationYear: 2020,
        major: 'BA',
        company: 'Corp',
        jobTitle: 'Manager',
        industry: 'FINANCE',
      });

      expect(studentResult.success).toBe(false);
      expect(alumniResult.success).toBe(false);
    });

    it('should enforce ashesi email across all schemas', () => {
      const schemas = [
        { schema: studentRegisterSchema, type: 'student' },
        { schema: alumniRegisterSchema, type: 'alumni' },
        { schema: loginSchema, type: 'login' },
      ];

      const invalidEmail = 'user@gmail.com';

      schemas.forEach(({ schema }) => {
        const result = schema.safeParse({
          email: invalidEmail,
          password: 'ValidPassword123!',
          // Add other required fields as needed
          firstName: 'John',
          lastName: 'Doe',
          confirm: 'ValidPassword123!',
          year: 1,
          major: 'CS',
        });
        expect(result.success).toBe(false);
      });
    });
  });
});
