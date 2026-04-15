import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT , createJWT} from '@/utils&types/utils/jwt';
import { prisma } from '@/utils&types/utils/db';

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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create new access token (15 minutes)
    const accessToken = await createJWT(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
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
