import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/app/_utils_and_types/utils/password';

/**
 * Password Utility Tests
 * Tests password hashing and verification using PBKDF2
 */
describe('Password Utilities', () => {
  const testPassword = 'MySecurePassword123!@#';
  const anotherPassword = 'DifferentPassword456$%^';

  describe('hashPassword', () => {
    it('should return a hash string with salt', () => {
      const hash = hashPassword(testPassword);

      expect(typeof hash).toBe('string');
      expect(hash).toContain('.');
      
      const parts = hash.split('.');
      expect(parts).toHaveLength(2);
    });

    it('should have different hashes for the same password', () => {
      const hash1 = hashPassword(testPassword);
      const hash2 = hashPassword(testPassword);

      // Different hashes due to random salt
      expect(hash1).not.toBe(hash2);
    });

    it('should extract salt and hash from result', () => {
      const hash = hashPassword(testPassword);
      const [salt, hashPart] = hash.split('.');

      // Salt should be hex string (from randomBytes(16))
      expect(/^[a-f0-9]{32}$/.test(salt)).toBe(true);

      // Hash should be hex string (64 bytes = 128 hex chars)
      expect(/^[a-f0-9]+$/.test(hashPart)).toBe(true);
    });

    it('should handle different passwords', () => {
      const hash1 = hashPassword(testPassword);
      const hash2 = hashPassword(anotherPassword);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle special characters', () => {
      const specialPassword = 'P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = hashPassword(specialPassword);

      expect(hash).toContain('.');
      expect(hash.split('.')).toHaveLength(2);
    });

    it('should handle long passwords', () => {
      const longPassword = 'a'.repeat(100);
      const hash = hashPassword(longPassword);

      expect(hash).toContain('.');
      expect(hash.split('.')).toHaveLength(2);
    });

    it('should handle empty password (edge case)', () => {
      const hash = hashPassword('');

      expect(hash).toContain('.');
      expect(hash.split('.')).toHaveLength(2);
    });
  });

  describe('verifyPassword', () => {
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

    it('should be case-sensitive', () => {
      const hash = hashPassword('MyPassword');

      expect(verifyPassword('MyPassword', hash)).toBe(true);
      expect(verifyPassword('mypassword', hash)).toBe(false); // Different due to case
      expect(verifyPassword('MYPASSWORD', hash)).toBe(false);
    });

    it('should handle whitespace in password', () => {
      const passwordWithSpace = 'My Password 123';
      const hash = hashPassword(passwordWithSpace);

      expect(verifyPassword(passwordWithSpace, hash)).toBe(true);
      expect(verifyPassword('MyPassword123', hash)).toBe(false);
    });

    it('should return false for invalid hash format', () => {
      const invalidHashes = [
        'no-dot-hash',
        'too.many.dots.here',
        '',
        'invalid.hash',
      ];

      invalidHashes.forEach(invalidHash => {
        expect(verifyPassword(testPassword, invalidHash)).toBe(false);
      });
    });

    it('should return false for corrupted salt', () => {
      const hash = hashPassword(testPassword);
      const [, hashPart] = hash.split('.');
      
      // Corrupt the salt
      const corruptedHash = 'not-a-valid-salt.' + hashPart;
      expect(verifyPassword(testPassword, corruptedHash)).toBe(false);
    });

    it('should return false for corrupted hash part', () => {
      const hash = hashPassword(testPassword);
      const [salt] = hash.split('.');
      
      // Corrupt the hash
      const corruptedHash = salt + '.' + 'not-a-valid-hash';
      expect(verifyPassword(testPassword, corruptedHash)).toBe(false);
    });

    it('should handle special characters in password', () => {
      const specialPassword = 'P@ssw0rd!#$%^&*()';
      const hash = hashPassword(specialPassword);

      expect(verifyPassword(specialPassword, hash)).toBe(true);
      expect(verifyPassword('P@ssw0rd!#$%^&*()', hash)).toBe(true);
      expect(verifyPassword('P@ssw0rd', hash)).toBe(false);
    });

    it('should reject similar but different passwords', () => {
      const hash = hashPassword('Password123');

      expect(verifyPassword('Password123', hash)).toBe(true);
      expect(verifyPassword('Password124', hash)).toBe(false);
      expect(verifyPassword('Password12', hash)).toBe(false);
      expect(verifyPassword('Password1234', hash)).toBe(false);
    });
  });

  describe('Password Hashing Flow', () => {
    it('should complete full password flow: hash and verify', () => {
      // Step 1: User signs up, password is hashed and stored
      const userPassword = 'MySecurePassword123!';
      const storedHash = hashPassword(userPassword);

      expect(storedHash).toContain('.');

      // Step 2: User logs in, password is verified against stored hash
      const loginAttempt = userPassword;
      const isCorrect = verifyPassword(loginAttempt, storedHash);

      expect(isCorrect).toBe(true);
    });

    it('should handle multiple users with same password', () => {
      const password = 'SamePassword123';

      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      // Hashes should be different (different salts)
      expect(hash1).not.toBe(hash2);

      // But both should verify the same password
      expect(verifyPassword(password, hash1)).toBe(true);
      expect(verifyPassword(password, hash2)).toBe(true);
    });

    it('should not verify password with a different users hash', () => {
      const password1 = 'AlicePassword123';
      const password2 = 'BobPassword456';

      const hash1 = hashPassword(password1);
      const hash2 = hashPassword(password2);

      // Each password should verify against its own hash only
      expect(verifyPassword(password1, hash1)).toBe(true);
      expect(verifyPassword(password1, hash2)).toBe(false);
      expect(verifyPassword(password2, hash1)).toBe(false);
      expect(verifyPassword(password2, hash2)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle unicode characters', () => {
      const unicodePassword = 'Pässwörd🔐123';
      const hash = hashPassword(unicodePassword);

      expect(verifyPassword(unicodePassword, hash)).toBe(true);
      expect(verifyPassword('Password123', hash)).toBe(false);
    });

    it('should handle very long passwords', () => {
      const longPassword = 'a'.repeat(1000);
      const hash = hashPassword(longPassword);

      expect(verifyPassword(longPassword, hash)).toBe(true);
      expect(verifyPassword('a'.repeat(999), hash)).toBe(false);
    });

    it('should return false gracefully on any error', () => {
      // Test with null-like values that might cause errors
      expect(verifyPassword(testPassword, 'malformed')).toBe(false);
      expect(verifyPassword(testPassword, '')).toBe(false);
      expect(verifyPassword('', '')).toBe(false);
    });
  });
});
