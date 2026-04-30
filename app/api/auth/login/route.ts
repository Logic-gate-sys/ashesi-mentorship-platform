import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { createJWT } from '#utils-types/utils/jwt';
import { verifyPassword } from '#utils-types/utils/password';
import { loginSchema } from '#/libs_schemas/schemas/auth.schema';



// api layer 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if(!result.success){
      return NextResponse.json(
        {
          success: false, 
          message:'Invalid request body',
          details: result.error.issues.map((iss)=>({
            path: iss.path.join("."),
            message:iss.message
          }) )
        }, 
        {status:400}
      )
    }
    const validatedData = result.data ; 

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id:true,
        email:true,
        passwordHash:true,
        role:true,
        firstName:true,
        lastName:true,
        mentorProfile: {
          select: {
            company: true,
            jobTitle: true,
            industry: true
          }
        }
      }
    });

    if (!user || !verifyPassword(validatedData.password, user.passwordHash)) {
      return NextResponse.json(
        { errors: { message: 'Invalid login details' } },
        { status: 401 }
      );
    }
    const {id, email, role,firstName, lastName} = user ; 

    // Generate tokens
    const accessToken = await createJWT({id, email, role, firstName, lastName,}, '15m');
    const refreshToken = await createJWT({id, email,role, firstName,lastName}, '7d' )

    const response = NextResponse.json(
      {
       accessToken: accessToken, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profession: user.mentorProfile?.jobTitle??""
        },
      },
      { status: 200 }
    );
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
      path: '/',
    });
    // return response
    return response  
  } catch (err) {
    const details = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { errors: { message: 'Login failed', details } },
      { status: 500 }
    );
  }
}
