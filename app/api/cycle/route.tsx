import { NextRequest, NextResponse} from 'next/server';
import { errorResponse } from '#utils-types/utils/api-response';
import { checkPermission, requireAuth } from '#/libs_schemas/middlewares/auth.middleware';
import {getCurrentMentorshipCycle} from '#services/mentorship-cycle.service'

//get current mentorship cycle
export async function GET( req: NextRequest) {
  try {
    //authorise user 
        const {user} = await requireAuth(req);
        //authorise user 
        const isAllowed = await checkPermission(user.id,'user', 'read');
        if(!isAllowed){
          return NextResponse.json({error:'Unauthorized', message: 'Have no right to access this resource'}, {status: 403});
        }
        // pagination deatils
        
       const currentCycle = await getCurrentMentorshipCycle();
       if(!currentCycle){
        return errorResponse("Failed to fetch mentorship cycle details", {status: 400});
       }
     // return response
    return NextResponse.json({data:currentCycle, success: true}, {status:200});
  } catch (error) {
    console.error('Error fetching mentorship cycle ', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch mentorship cycle ',
      {status:500}
    );
  }
}
