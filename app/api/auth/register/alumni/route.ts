import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/_utils/db';
import { createJWT } from '@/app/_utils/jwt';
import { hashPassword } from '@/app/_utils/password';
import { alumniRegisterSchema } from '@/app/_schemas/auth.schema';
import { ZodError } from 'zod';

/**
 * POST /api/auth/register/alumni
 * Register a new alumni user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = alumniRegisterSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { errors: { email: 'Email already registered' } },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(validatedData.password);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role: 'ALUMNI',
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        alumniProfile: {
          create: {
            graduationYear: validatedData.graduationYear,
            major: validatedData.major,
            company: validatedData.company,
            jobTitle: validatedData.jobTitle,
            industry: validatedData.industry,
          },
        },
      },
      include: { alumniProfile: true },
    });

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

    const refreshToken = await createJWT(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      '7d'
    );

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
      { status: 201 }
    );

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return NextResponse.json(
        { errors: fieldErrors },
        { status: 400 }
      );
    }

    console.error('[ALUMNI_REGISTER_ERROR]', error);
    return NextResponse.json(
      { errors: { message: 'Registration failed' } },
      { status: 500 }
    );
  }
}
