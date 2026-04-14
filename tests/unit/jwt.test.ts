import { describe, it, expect } from 'vitest';
import { createJWT, verifyJWT, decodeJWT } from '@/app/_utils/jwt';

describe('JWT Utilities', () => {
  const payload = { id: 'user-1', email: 'test@ashesi.edu.gh', role: 'STUDENT' as const };

  it('creates a token with 3 parts', async () => {
    const token = await createJWT(payload);
    expect(token.split('.')).toHaveLength(3);
  });

  it('verifies a valid token', async () => {
    const token = await createJWT(payload);
    const verified = await verifyJWT(token);
    expect(verified?.id).toBe(payload.id);
  });

  it('decodes the token payload', async () => {
    const token = await createJWT(payload);
    const decoded = decodeJWT(token);
    expect(decoded?.role).toBe('STUDENT');
  });

  it('returns null for invalid token', async () => {
    expect(await verifyJWT('invalid.token')).toBeNull();
  });
});