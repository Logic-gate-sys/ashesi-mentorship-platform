import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/app/_utils/jwt';
import { prisma } from '@/app/_utils/db';


export async function GET(request: NextRequest) {
  try {
    // Get accessToken from Authorization header
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7); // Extract token after "Bearer "
    } else {
      // Fallback: try to get from refreshToken cookie if accessToken not provided
      token = request.cookies.get('refresh_token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { errors: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);

    if (!payload) {
      return NextResponse.json(
        { errors: { message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    // Fetch user with profile data
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        studentProfile: true,
        alumniProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { errors: { message: 'User not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatarUrl: user.avatarUrl,
          studentProfile: user.studentProfile,
          alumniProfile: user.alumniProfile,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET_ME_ERROR]', error);
    return NextResponse.json(
      { errors: { message: 'Failed to fetch user' } },
      { status: 500 }
    );
  }
}
