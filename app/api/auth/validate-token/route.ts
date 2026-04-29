/**
 * POST /api/auth/validate-token
 * 
 * Validates a magic token from an email link
 * Used for one-click availability toggle, mentorship confirmations, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicToken } from '#utils-types/utils/tokens';

interface ValidateTokenBody {
  token: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ValidateTokenBody;
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Token is required',
        },
        { status: 400 }
      );
    }

    const result = await verifyMagicToken(token);

    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          error: result.error || 'Invalid token',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        payload: result.payload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json(
      {
        valid: false,
        error: 'Token validation failed',
      },
      { status: 500 }
    );
  }
}
