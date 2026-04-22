
import { SignJWT, jwtVerify, decodeJwt, JWTPayload } from 'jose';
import { env } from '#/env';


export interface CustomPayload extends JWTPayload{
  id: string;
  role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  email: string;
  iat?: number;
  exp?: number;
}

const getSecret = (): Uint8Array => {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  // Use Buffer instead of TextEncoder for better cross-environment compatibility
  // This works in both Node.js and test environments
  return new Uint8Array(Buffer.from(secret, 'utf-8'));
};

export async function createJWT(
  payload: Omit<CustomPayload, 'iat' | 'exp'>,
  expiresIn: string = env.JWT_EXPIRES_IN || '7d'
): Promise<string> {
  const secret = getSecret();

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);

  return token;
}


export async function verifyJWT(token: string): Promise<CustomPayload | null> {
  try {
    const secret = getSecret();
    const verified = await jwtVerify(token, secret);
    return verified.payload as CustomPayload;
  } catch {
    return null;
  }
}

export function decodeJWT(token: string) {
  try {
    const decoded = decodeJwt(token);
    return {
      id: decoded.id as string,
      role: decoded.role as 'STUDENT' | 'ALUMNI' | 'ADMIN',
      firstName: decoded.firstName as string,
      lastName: decoded.lastName as string,
      email: decoded.email as string,
      exp: decoded.exp as number,
      iat: decoded.iat as number,
    };
  } catch {
    return null;
  }
}