import { NextRequest, NextResponse} from 'next/server';
import { errorResponse } from '#utils-types/utils/api-response';
import { checkPermission, requireAuth } from '#libs-schemas/middlewares/auth.middleware';
import {getAllMentors} from '#services/mentor.service'
import { CacheTTL, buildCacheKey, getFromTTLCache, setTTLCache } from '#libs-schemas/caches/cacheEngine';

//get all available mentors 
export async function GET( req: NextRequest) {
  try {
        const {searchParams} = new URL(req.url); 
    //authorise user 
        const authResult = await requireAuth(req);
        if (authResult instanceof NextResponse) {
          return authResult;
        }
        const { user } = authResult;
        //authorise user 
        const isAllowed = await checkPermission(user.id,'user_profile', 'read');
        if(!isAllowed){
          return NextResponse.json({error:'Unauthorized', message: 'Have no right to access this resource'}, {status: 403});
        }
        // pagination deatils
        const page = searchParams.get('page') || "1";
       const limit = searchParams.get('limit') || "15"; 

       const cacheKey = buildCacheKey('mentors-list', page, limit);
       const cached = getFromTTLCache<Awaited<ReturnType<typeof getAllMentors>>>(cacheKey);
       if (cached) {
         return NextResponse.json({data: cached, page: page, total: limit, success: true}, {status:200});
       }

       const mentors = await getAllMentors(parseInt(page), parseInt(limit));
       if(!mentors){
        return errorResponse("Failed to fetch mentors", {status: 400});
       }

       setTTLCache(cacheKey, mentors, {
         ttl: CacheTTL.MEDIUM,
         tags: ['mentors:list'],
       });

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
