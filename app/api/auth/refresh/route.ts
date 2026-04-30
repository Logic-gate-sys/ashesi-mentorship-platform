import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT , createJWT} from '#utils-types/utils/jwt';

export async function POST(request: NextRequest) {
  try {
    // Get refreshToken from httpOnly cookie
    const refreshToken = request.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = await verifyJWT(refreshToken);
    if (!decoded?.id) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Re-issue the access token directly from the verified refresh-token claims.
    // This avoids a database round-trip on refresh and prevents transient DB timeouts
    // from breaking session renewal.
    const accessToken = await createJWT(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      },
      '15m'
    );

    return NextResponse.json({
      accessToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 401 }
    );
  }
}
