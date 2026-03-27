import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/_utils/db';
import { createJWT } from '@/app/_utils/jwt';
import { hashPassword } from '@/app/_utils/password';
import { studentRegisterSchema } from '@/app/_schemas/auth.schema';
import { Role } from '@/prisma/generated/prisma/enums';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = studentRegisterSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string> = {};
      
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      );
    }

    const validatedData = result.data;

    // Check if user already exists (but don't reveal this in response for security)
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = hashPassword(validatedData.password);

    // Create user with student profile
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role: Role.STUDENT,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        studentProfile: {
          create: {
            yearGroup: validatedData.year,
            major: validatedData.major,
          },
        },
      },
      include: { studentProfile: true },
    });

    // Create JWT token
    const token = createJWT({
      id: user.id,
      email: user.email,
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
      { status: 201 }
    );
  } catch (error) {
    console.error('Student registration error:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
