import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/_utils/db';
import { createJWT } from '@/app/_utils/jwt';
import { verifyPassword } from '@/app/_utils/password';
import { loginSchema } from '@/app/_schemas/auth.schema';
import { ZodError } from 'zod';

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

    // Generate tokens
    const accessToken = await createJWT(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      '15m' // Access token expires in 15 minutes
    );

    const refreshToken = await createJWT(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      '7d' // Refresh token expires in 7 days
    );

    // Create response with accessToken in body and refreshToken in httpOnly cookie
    const response = NextResponse.json(
      {
        accessToken, // Client should store this in sessionStorage
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

    // Set refresh token as httpOnly cookie (7 days max-age: 604800 seconds)
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
      path: '/',
    });

    return response;
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
