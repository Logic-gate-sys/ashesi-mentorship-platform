import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/app/_utils/password';

describe('Password Utilities', () => {
  const password = 'SecurePass123!';

  it('hashes a password', async () => {
    const hash = await hashPassword(password);
    expect(typeof hash).toBe('string');
  });

  it('verifies correct password', async () => {
    const hash = await hashPassword(password);
    expect(await verifyPassword(password, hash)).toBe(true);
  });

  it('rejects wrong password', async () => {
    const hash = await hashPassword(password);
    expect(await verifyPassword('WrongPass', hash)).toBe(false);
  });
});