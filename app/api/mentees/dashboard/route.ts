
import { NextRequest, NextResponse} from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { requirePermission, requireAuth } from '#/libs_schemas/middlewares/auth.middleware';
import { getMenteeDashboardOverview } from '#services/mentee-metrics.service';

export async function GET(request: NextRequest) {
  try {
    //authorise user 
        const {user} = await requireAuth(request);
        //authorise user 
        const isAllowed = requirePermission(user.id,'user', 'read');
        if(!isAllowed){
            return NextResponse.json({error:'Uauthorised', message: 'Have no right to send request'}, {status: 403});
        }
    // Fetch complete dashboard overview
    const dashboard = await getMenteeDashboardOverview(user.menteeProfile.id);
    return successResponse(dashboard, 'Dashboard data retrieved successfully');
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      {status: 500}
    );
  }
}
