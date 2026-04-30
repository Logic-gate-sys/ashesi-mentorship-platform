import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { requireAuth } from '#/libs_schemas/middlewares/auth.middleware';
import { invalidateCacheByTags } from '#/libs_schemas/caches/cacheEngine';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { user } = authResult;
    if (user.role !== 'MENTEE' || !user.menteeProfile?.id) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Have no right to perform this action' }, { status: 403 });
    }

    const action = request.nextUrl.searchParams.get('action') ?? 'cancel';
    const { id: requestId } = await params;

    const mentorshipRequest = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
      select: { id: true, menteeId: true, status: true },
    });

    if (!mentorshipRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (mentorshipRequest.menteeId !== user.menteeProfile.id) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Have no right to access this resource' }, { status: 403 });
    }

    if (action === 'remind') {
      invalidateCacheByTags([
        `user:${user.id}`,
        `mentee-profile:${user.menteeProfile.id}`,
        'mentee:requests',
      ]);
      return NextResponse.json({
        success: true,
        message: 'Reminder sent',
        data: mentorshipRequest,
      }, { status: 200 });
    }

    if (mentorshipRequest.status !== 'PENDING') {
      return NextResponse.json({
        error: 'Request cannot be cancelled',
        message: `Cannot cancel request with status: ${mentorshipRequest.status}`,
      }, { status: 400 });
    }

    const updatedRequest = await prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED', updatedAt: new Date() },
    });

    invalidateCacheByTags([
      `user:${user.id}`,
      `mentee-profile:${user.menteeProfile.id}`,
      `mentor-profile:${updatedRequest.mentorId}`,
      'mentee:requests',
      'mentor:requests',
      'mentee:dashboard',
      'mentor:dashboard',
    ]);

    return NextResponse.json({
      success: true,
      message: 'Request cancelled',
      data: updatedRequest,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}