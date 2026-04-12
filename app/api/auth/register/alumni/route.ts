import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils&types/utils/db';
import { createJWT } from '@/utils&types/utils/jwt';
import { hashPassword } from '@/app/_utils_and_types/utils/password';
import { alumniRegisterSchema } from '@/app/ _libs_and_schemas/schemas/auth.schema';
import { Role } from '@/prisma/generated/prisma/enums';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate request body
    const result = alumniRegisterSchema.safeParse(body);
    if(!result.success){
      return NextResponse.json({
        success: false,
        details: result.error.issues.map((iss)=>({
          path: iss.path.join("."),
          message:iss.message
        }))
      },
      {status:400}
    )
    }
    const validatedData = result.data; 
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(validatedData.password);
    // Create user and alumni profile
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role:Role.MENTOR,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        mentorProfile: {
          create: {
            graduationYear: validatedData.graduationYear,
            major: validatedData.major,
            company: validatedData.company,
            jobTitle: validatedData.jobTitle,
            industry: validatedData.industry,
          },
        },
      },
      select: {
       id: true,
       email: true,
       firstName:true,
       lastName:true,
       role:true,
       menteeProfile: true
      }

    });

    // Generate JWT tokens
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
    // response json
    const response = NextResponse.json(
      {
        success: true,
        accessToken: accessToken,
        user: user,
      },
      { status: 201 }
    );
    // refresh token in cookie
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Alumni registration error:', err)
    return NextResponse.json(
      { 
        error: 'Registration failed. Please try again.',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
