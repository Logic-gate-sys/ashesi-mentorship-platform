import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '#utils-types/utils/db'
import { createJWT } from '#utils-types/utils/jwt'
import { hashPassword } from '#utils-types/utils/password'
import { studentRegisterSchema } from '#libs-schemas/schemas/auth.schema'
import { Role } from '#/prisma/generated/prisma/enums'
import { uploadMedia } from '#libs-schemas/media_upload/cloudinary'



export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: unknown;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const avatar = formData.get('avatar');

      if (!(avatar instanceof File) || avatar.size === 0) {
        return NextResponse.json(
          { error: 'Professional headshot photo is required' },
          { status: 400 }
        );
      }

      const uploadedAvatarUrl = await uploadMedia(avatar);
      if (!uploadedAvatarUrl) {
        return NextResponse.json(
          { error: 'Failed to upload professional headshot' },
          { status: 400 }
        );
      }

      let interests: string[] = [];
      const interestsRaw = formData.get('interests');
      if (typeof interestsRaw === 'string' && interestsRaw.trim()) {
        try {
          const parsed = JSON.parse(interestsRaw);
          interests = Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
        } catch {
          interests = [];
        }
      }

      body = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        avatarUrl: uploadedAvatarUrl,
        major: formData.get('major'),
        year: formData.get('year'),
        password: formData.get('password'),
        confirm: formData.get('confirm'),
        interests,
        bio: formData.get('bio') || undefined,
        linkedin: formData.get('linkedin') || undefined,
      };
    } else {
      body = await request.json()
    }

    const result = studentRegisterSchema.safeParse(body)
   // if response fails
    if (!result.success) {
      return NextResponse.json({
        success: false,
        details: result.error.issues.map((iss)=>({
          path: iss.path.join("."),
          message:iss.message
        }))
      }, 
      {
        status:400
      })
    }
    const validatedData = result.data
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }
    const passwordHash = hashPassword(validatedData.password)
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role: Role.MENTEE,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        avatarUrl: validatedData.avatarUrl,
        menteeProfile: {
          create: {
            yearGroup: validatedData.year,
            major: validatedData.major,
            interests: validatedData.interests || [],
            bio: validatedData.bio || null,
            linkedin: validatedData.linkedin || null,
          },
        },
      },
      select:{
       id: true,
       email:true,
       role:true,
       firstName:true,
       lastName:true,
       menteeProfile: true
      }
    })

    const accessToken = await createJWT(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      '15m' // Access token expires in 15 minutes
    )
    const refreshToken = await createJWT(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      '7d' // Refresh token expires in 7 days
    )
    const response = NextResponse.json(
      {
        success: true,
        accessToken: accessToken,
        user: user,
      },
      { status: 201 }
    )
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Student registration error:', error)
    return NextResponse.json(
      { 
        error: 'Registration failed. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
