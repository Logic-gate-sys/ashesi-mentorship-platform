import { NextRequest, NextResponse } from 'next/server';
import { getIOInstance } from '#libs-schemas/socket/index';
import { requireAuth, checkPermission } from '#/libs_schemas/middlewares/auth.middleware';
import { createMentorshipRequestSchema } from '#libs-schemas/schemas/request.schema';
import {sendMentorshipRequest, getMentorshipRequests} from '#services/mentorship-requests.service'
import {
  CacheTTL,
  buildCacheKey,
  getFromTTLCache,
  invalidateCacheByTags,
  setTTLCache,
} from '#/libs_schemas/caches/cacheEngine';

// do not init socket at module load; obtain lazily inside handlers

// retrieve all mentee request in descending order limit by 10
export async function GET(request: NextRequest){
  try {
    //authorise user 
    const authResult = await requireAuth(request);
    if ('status' in authResult) return authResult;
    const { user } = authResult;
    //authorise user 
    const isAllowed = await checkPermission(user.id, 'mentorship_request', 'read');
    if (!isAllowed) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Have no right to access this resource' }, { status: 403 });
    }

    const cacheKey = buildCacheKey('mentee-requests', user.id);
    const cached = getFromTTLCache<{ success: true; data: Awaited<ReturnType<typeof getMentorshipRequests>> }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { status: 200 });
    }

    // retrieve all user request
    const mentorshipRequest = await getMentorshipRequests(user.id,"MENTEE"); 
    const responseData = {
      success: true,
      data: mentorshipRequest
    };

    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.SHORT,
      tags: [`user:${user.id}`, 'mentee:requests'],
    });

    return NextResponse.json(responseData, {status: 200});
}catch(err){
  return NextResponse.json(
    {error: err instanceof Error ? err.message : 'Failed to process request' },
      { status: 500 }
    );
   }
}

//send mentorship request 
export async function POST( request: NextRequest) {
  try {
    //authorise user 
    const authResult = await requireAuth(request);
    if ('status' in authResult) return authResult;
    const { user } = authResult;
    //authorise user 
    const isAllowed = await checkPermission(user.id, 'mentorship_request', 'create');
    if (!isAllowed) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Have no right to perform this action' }, { status: 403 });
    }
    // extract request data 
    const body = await request.json();
    const result = createMentorshipRequestSchema.safeParse({...body, menteeId: user?.menteeProfile?.id}); 
    if(result.error){
      return NextResponse.json({
        message: "error",
        details: result.error.issues.map((iss)=>({
          path: iss.path.join("."),
          message: iss.message
        }))
      },
      {status: 400}
    )
    }
    const mentorshipRequest = await sendMentorshipRequest(result.data);

    invalidateCacheByTags([
      `user:${user.id}`,
      `mentee-profile:${user.menteeProfile?.id ?? ''}`,
      `mentor-profile:${mentorshipRequest.mentorId}`,
      'mentee:requests',
      'mentor:requests',
      'mentee:dashboard',
      'mentor:dashboard',
    ]);

    // emit socket (if initialised)
    try {
      const io = getIOInstance();
      io.of('/requests').to(`user:${mentorshipRequest.mentorId}`).emit('request:sent', {
        mentorId: mentorshipRequest.menteeId,
        goal: mentorshipRequest.goal,
        message: mentorshipRequest.message,
        requestId: mentorshipRequest.id,
      });
    } catch (err) {
      console.warn('Socket not initialised, skipping request:sent emit', err instanceof Error ? err.message : err);
    }
    return NextResponse.json({message: 'success', data: mentorshipRequest});
  } catch (error) {
    console.error("ERROR:  ----------> ", error)
    return NextResponse.json({
        error: error instanceof Error ? error.message : 'Failed to process request'
      },
      { status: 500 }
    );
  }
}