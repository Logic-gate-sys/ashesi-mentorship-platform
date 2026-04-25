import { NextRequest, NextResponse} from 'next/server';
import { errorResponse } from '#utils-types/utils/api-response';
import { requirePermission, requireAuth } from '#/libs_schemas/middlewares/auth.middleware';
import {getAllMentors} from '#services/mentor.service'

//get all available mentors 
export async function GET( req: NextRequest) {
  try {
        const {searchParams} = new URL(req.url); 
    //authorise user 
        const {user} = await requireAuth(req);
        //authorise user 
        const isAllowed = requirePermission(user.id,'user_profile', 'read');
        if(!isAllowed){
            return NextResponse.json({error:'Uauthorised', message: 'Have no right to send request'}, {status: 403});
        }
        // pagination deatils
        const page = searchParams.get('page') || "1";
       const limit = searchParams.get('limit') || "15"; 
       const mentors = await getAllMentors(parseInt(page), parseInt(limit));
       if(!mentors){
        return errorResponse("Failed to fetch mentors", {status: 400});
       }
     // return response
    return NextResponse.json({data:mentors,page: page, total: limit, success: true}, {status:200});
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch mentor profile',
      {status:500}
    );
  }
}
