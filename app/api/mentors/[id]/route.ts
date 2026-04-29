import { NextRequest, NextResponse} from 'next/server';
import { errorResponse } from '#utils-types/utils/api-response';
import { requirePermission } from '#/libs_schemas/middlewares/auth.middleware';
import { getUserProfile } from '#services/profile.service';


// retrive mentor stats and profile details
export async function GET( req: NextRequest,  { params }: { params: Promise< { id: string }> }) {
  try {
    const userParams = await params; 
    if(!userParams){
      return errorResponse("Invalid user id")
    }
    const userProfile = await getUserProfile(userParams.id); 

    //mentor must exist
     if (!userProfile|| !userProfile.id) {
      return errorResponse('Mentor not found', {status:404});
    }
    // permission
    await requirePermission(userProfile.id, 'user_profile', 'read');


     // return response
    return NextResponse.json({...userProfile, messages:'Mentor profile retrieved successfully'}, {status:200});
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch mentor profile',
      {status:500}
    );
  }
}
