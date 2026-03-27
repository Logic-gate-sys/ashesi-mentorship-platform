import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/app/_lib/jwt';
import { prisma } from '@/app/_lib/db';
import { updateProfileSchema } from '@/app/_schemas/auth.schema';
import { ZodError } from 'zod';

/**
 * PATCH /api/auth/profile
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { errors: { message: 'Missing or invalid authorization header' } },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const payload = verifyJWT(token);

    if (!payload) {
      return NextResponse.json(
        { errors: { message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Update user profile
    const user = await prisma.user.update({
      where: { id: payload.id },
      data: {
        ...(validatedData.firstName && { firstName: validatedData.firstName }),
        ...(validatedData.lastName && { lastName: validatedData.lastName }),
        ...(validatedData.avatarUrl && { avatarUrl: validatedData.avatarUrl }),
      },
      include: {
        studentProfile: true,
        alumniProfile: true,
      },
    });

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
    // Handle validation errors
    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return NextResponse.json(
        { errors: fieldErrors },
        { status: 400 }
      );
    }

    console.error('[UPDATE_PROFILE_ERROR]', error);
    return NextResponse.json(
      { errors: { message: 'Failed to update profile' } },
      { status: 500 }
    );
  }
}
