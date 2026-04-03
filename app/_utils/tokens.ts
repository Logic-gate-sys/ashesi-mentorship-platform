import { SignJWT } from 'jose';

const secret = new Uint8Array(
  Buffer.from(
    process.env.EMAIL_TOKEN_SECRET || 'development-secret-change-in-production',
    'utf-8'
  )
);

export interface MagicTokenPayload {
  userId: string;
  cycleId?: string;
  action: 'toggle-availability' | 'confirm-match' | 'rate-mentor';
  email: string;
  expiresAt: number;
  oneTime?: boolean;
}

export interface TokenValidationResult {
  valid: boolean;
  payload?: MagicTokenPayload;
  error?: string;
}


export async function generateMagicToken(
  userId: string,
  email: string,
  action: MagicTokenPayload['action'],
  cycleId?: string,
  expirationDays: number = 7
): Promise<string> {
  const now = Date.now();
  const expiresAt = now + expirationDays * 24 * 60 * 60 * 1000;

  const payload: MagicTokenPayload = {
    userId,
    cycleId,
    action,
    email,
    expiresAt,
    oneTime: false, // Track usage in database if needed
  };

  try {
    const token = await new SignJWT(payload as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(new Date(expiresAt))
      .sign(secret);

    return token;
  } catch (error) {
    console.error('Failed to generate magic token:', error);
    throw new Error('Token generation failed');
  }
}

/**
 * Verify and decode a magic token
 */
export async function verifyMagicToken(token: string): Promise<TokenValidationResult> {
  try {
    const { jwtVerify } = await import('jose');
    const verified = await jwtVerify(token, secret);
    const payload = verified.payload as unknown as MagicTokenPayload;

    // Check if expired
    if (payload.expiresAt && payload.expiresAt < Date.now()) {
      return {
        valid: false,
        error: 'Token has expired',
      };
    }

    return {
      valid: true,
      payload,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Token verification failed';
    return {
      valid: false,
      error: errorMessage,
    };
  }
}

/**
 * Generate a one-click availability toggle link
 * 
 * Usage in email:
 * const link = await generateAvailabilityLink(userId, email, cycleId);
 * // Link: https://asheimentor.dev/mentor/cycles/123/availability?token=jwt...
 */
export async function generateAvailabilityLink(
  userId: string,
  email: string,
  cycleId: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): Promise<string> {
  const token = await generateMagicToken(userId, email, 'toggle-availability', cycleId, 7);
  return `${baseUrl}/mentor/cycles/${cycleId}/availability?token=${token}`;
}

/**
 * Generate a confirm mentor match link
 */
export async function generateConfirmMatchLink(
  studentId: string,
  email: string,
  requestId: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): Promise<string> {
  const token = await generateMagicToken(studentId, email, 'confirm-match', undefined, 30);
  return `${baseUrl}/student/confirm-mentor?token=${token}&requestId=${requestId}`;
}

/**
 * Generate a rate mentor link (sent after cycle ends)
 */
export async function generateRateMentorLink(
  studentId: string,
  email: string,
  mentorshipId: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): Promise<string> {
  const token = await generateMagicToken(studentId, email, 'rate-mentor', undefined, 30);
  return `${baseUrl}/student/rate-mentor?token=${token}&mentorshipId=${mentorshipId}`;
}
