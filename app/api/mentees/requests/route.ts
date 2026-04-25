import { NextRequest, NextResponse } from 'next/server';
import { getIOInstance } from '#libs-schemas/socket/index';
import { requireAuth, requirePermission } from '#/libs_schemas/middlewares/auth.middleware';
import { createMentorshipRequestSchema } from '#libs-schemas/schemas/request.schema';
import {sendMentorshipRequest, getMentorshipRequests} from '#services/mentorship-requests.service'

const io = getIOInstance(); 

// retrieve all mentee request in descending order limit by 10
export async function GET(request: NextRequest){
  try {
    //authorise user 
    const {user} = await requireAuth(request);
    //authorise user 
    const isAllowed = requirePermission(user.id, 'mentorship_request', 'read');
    if(!isAllowed){
        return NextResponse.json({error:'Uauthorised', message: 'Have no right to send request'}, {status: 403});
    }
    // retrieve all user request
    const mentorshipRequest = await getMentorshipRequests(user.id,"MENTEE"); 
    return NextResponse.json({
      success: true,
      data: mentorshipRequest
    },
    {status: 200}
  )
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
    const {user} = await requireAuth(request);
    //authorise user 
    const isAllowed = requirePermission(user.id, 'mentorship_request', 'create');
    if(!isAllowed){
        return NextResponse.json({error:'Uauthorised', message: 'Have no right to send request'}, {status: 403});
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
    //emit socket 
    io.of('/requests').to(`user:${mentorshipRequest.mentorId}`).emit('requets:sent', {...mentorshipRequest})
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