import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/_lib/db';
import { createJWT } from '@/app/_lib/jwt';
import { hashPassword } from '@/app/_lib/password';
import { studentRegisterSchema } from '@/app/_schemas/auth.schema';
import { ZodError } from 'zod';

/**
 * POST /api/auth/register/student
 * Register a new student user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = studentRegisterSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { errors: { email: 'Email already registered' } },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = hashPassword(validatedData.password);

    // Create user and student profile
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role: 'STUDENT',
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        studentProfile: {
          create: {
            year: validatedData.year,
            major: validatedData.major,
          },
        },
      },
      include: { studentProfile: true },
    });

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
      { status: 201 }
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

    console.error('[STUDENT_REGISTER_ERROR]', error);
    return NextResponse.json(
      { errors: { message: 'Registration failed' } },
      { status: 500 }
    );
  }
}
