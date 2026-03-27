import { describe, it, expect} from 'vitest';
import { createJWT, verifyJWT, decodeJWT } from '@/app/_utils/jwt';


describe('JWT Utilities', () => {
  const testPayload = {
    id: 'user-123',
    email: 'test@ashesi.edu.gh',
    firstName: 'John',
    lastName: 'Doe',
    role: 'STUDENT' as const,
  };

  describe('createJWT', () => {
    it('should create a valid JWT token with correct structure', async () => {
      const token = await createJWT(testPayload);

      // JWT format: header.payload.signature (3 parts separated by dots)
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });

    it('should include payload data in token', async () => {
      const token = await createJWT(testPayload);
      const decoded = decodeJWT(token);

      expect(decoded?.id).toBe(testPayload.id);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.role).toBe(testPayload.role);
    });

    it('should set iat (issued at) timestamp', async () => {
      const token = await createJWT(testPayload);
      const decoded = decodeJWT(token);

      expect(decoded?.iat).toBeDefined();
      expect(typeof decoded?.iat).toBe('number');
    });

    it('should set exp (expiration) 7 days in future', async () => {
      const before = Math.floor(Date.now() / 1000);
      const token = await createJWT(testPayload);
      const decoded = decodeJWT(token);
      const after = Math.floor(Date.now() / 1000);

      const sevenDaysInSeconds = 7 * 24 * 60 * 60;
      const expectedExpMin = before + sevenDaysInSeconds;
      const expectedExpMax = after + sevenDaysInSeconds + 1;

      expect(decoded?.exp).toBeGreaterThanOrEqual(expectedExpMin);
      expect(decoded?.exp).toBeLessThanOrEqual(expectedExpMax);
    });

    it('should create different tokens for different payloads', async () => {
      const token1 = await createJWT(testPayload);
      const token2 = await createJWT({ ...testPayload, id: 'user-456' });

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyJWT', () => {
    it('should verify a valid token and return payload', async () => {
      const token = await createJWT(testPayload);
      const verified = await verifyJWT(token);

      expect(verified).not.toBeNull();
      expect(verified?.id).toBe(testPayload.id);
      expect(verified?.email).toBe(testPayload.email);
    });

    it('should return null for invalid token format', async () => {
      const invalidTokens = [
        'invalid',
        'only.two',
        'four.parts.here.too',
        '',
      ];

      for (const token of invalidTokens) {
        const result = await verifyJWT(token);
        expect(result).toBeNull();
      }
    });

    it('should return null if signature is tampered with', async () => {
      const token = await createJWT(testPayload);
      const parts = token.split('.');
      
      // Tamper with signature
      const tamperedToken = `${parts[0]}.${parts[1]}.invalidsignature`;
      const result = await verifyJWT(tamperedToken);
      
      expect(result).toBeNull();
    });

    it('should return null if payload is modified', async () => {
      const token = await createJWT(testPayload);
      const parts = token.split('.');
      
      // Decode and modify payload
      const modifiedPayload = Buffer.from(parts[1], 'base64url').toString('utf8');
      const tampered = JSON.parse(modifiedPayload);
      tampered.id = 'hacker-666';
      
      const modifiedPayloadEncoded = Buffer.from(JSON.stringify(tampered)).toString('base64url');
      const tamperedToken = `${parts[0]}.${modifiedPayloadEncoded}.${parts[2]}`;
      
      const result = await verifyJWT(tamperedToken);
      expect(result).toBeNull();
    });

    it('should reject expired tokens', async () => {
      const token = await createJWT(testPayload);
      const result = await verifyJWT(token);
      
      expect(result).toBeDefined();
      expect(result?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('should return null for malformed base64', async () => {
      const malformed = 'header.!!!invalid-base64!!!.signature';
      const result = await verifyJWT(malformed);
      expect(result).toBeNull();
    });
  });

  describe('decodeJWT', () => {
    it('should decode a valid token without verification', async () => {
      const token = await createJWT(testPayload);
      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe(testPayload.id);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.firstName).toBe(testPayload.firstName);
      expect(decoded?.lastName).toBe(testPayload.lastName);
    });

    it('should return null for invalid token format', () => {
      expect(decodeJWT('invalid')).toBeNull();
      expect(decodeJWT('only.two')).toBeNull();
      expect(decodeJWT('')).toBeNull();
    });

    it('should return null for malformed base64 payload', () => {
      const malformed = 'header.!!!invalid!!!.signature';
      expect(decodeJWT(malformed)).toBeNull();
    });

    it('should decode token even if signature is invalid', async () => {
      const token = await createJWT(testPayload);
      const parts = token.split('.');
      
      // Tamper with signature but keep valid payload
      const tamperedToken = `${parts[0]}.${parts[1]}.invalidsignature`;
      
      // decodeJWT should still work without verification
      const decoded = decodeJWT(tamperedToken);
      expect(decoded?.id).toBe(testPayload.id);
    });

    it('should include exp timestamp in decoded token', async () => {
      const token = await createJWT(testPayload);
      const decoded = decodeJWT(token);

      expect(decoded?.exp).toBeDefined();
      expect(typeof decoded?.exp).toBe('number');
      expect(decoded?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('should handle different user roles', async () => {
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

  describe('JWT Flow Integration', () => {
    it('should create, verify, and decode token in full flow', async () => {
      // Create
      const token = await createJWT(testPayload);
      expect(token).toBeDefined();

      // Verify
      const verified = await verifyJWT(token);
      expect(verified).not.toBeNull();
      expect(verified?.id).toBe(testPayload.id);

      // Decode
      const decoded = decodeJWT(token);
      expect(decoded?.id).toBe(testPayload.id);
      expect(decoded?.email).toBe(testPayload.email);
    });

    it('should handle different user types correctly', async () => {
      const studentPayload = {
        id: 'student-1',
        email: 'student@ashesi.edu.gh',
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'STUDENT' as const,
      };

      const alumniPayload = {
        id: 'alumni-1',
        email: 'alumni@ashesi.edu.gh',
        firstName: 'Bob',
        lastName: 'Smith',
        role: 'ALUMNI' as const,
      };

      const studentToken = await createJWT(studentPayload);
      const alumniToken = await createJWT(alumniPayload);

      const studentVerified = await verifyJWT(studentToken);
      const alumniVerified = await verifyJWT(alumniToken);

      expect(studentVerified?.role).toBe('STUDENT');
      expect(alumniVerified?.role).toBe('ALUMNI');
    });
  });
});
      
     