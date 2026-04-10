import crypto from 'crypto';
import {env} from '@/env';

const ITERATIONS = 10000;
const DIGEST = 'sha256';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, 64, DIGEST)
    .toString('hex');
  return `${salt}.${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    const [salt, hash] = hashedPassword.split('.');
    const newHash = crypto
      .pbkdf2Sync(password, salt, ITERATIONS, 64, DIGEST)
      .toString('hex');
    return hash === newHash;
  } catch {
    return false;
  }
}
