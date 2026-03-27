import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/app/_utils/jwt';
import { prisma } from '@/app/_utils/db';


export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { errors: { message: 'Missing or invalid authorization header' } },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7); 
    // const token = authHeader.split('.')[1]; 
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
