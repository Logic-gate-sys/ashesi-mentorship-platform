import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/_lib/db';
import { createJWT } from '@/app/_lib/jwt';
import { verifyPassword } from '@/app/_lib/password';
import { loginSchema } from '@/app/_schemas/auth.schema';
import { ZodError } from 'zod';

/**
 * POST /api/auth/login
 * Login a user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { errors: { message: 'Invalid email or password' } },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = verifyPassword(validatedData.password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { errors: { message: 'Invalid email or password' } },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = createJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
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

    console.error('[LOGIN_ERROR]', error);
    return NextResponse.json(
      { errors: { message: 'Login failed' } },
      { status: 500 }
    );
  }
}
