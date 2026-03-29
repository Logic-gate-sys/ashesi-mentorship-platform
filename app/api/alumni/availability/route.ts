import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, requireAuth } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter } from '@/app/_lib/abac/engine'
import { AvailabilityService, ProfileService } from '@/app/_services'
import {
  createAvailabilitySchema_Validated,
  listAvailabilityQuerySchema,
} from '@/app/_schemas/availability.schema'
import {
  successResponse,
  paginatedResponse,
  notFoundResponse,
  serverErrorResponse,
  parseRequestBody,
  parseQueryParams,
} from '@/app/_utils/api-response';

/**
 * POST /api/alumni/availability
 * Create availability slot (Alumni only)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, 'availability', 'create', {
      type: 'availability',
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Get alumni profile
    const alumniProfile = await ProfileService.getOrCreateAlumniProfile(user.id);

    if (!alumniProfile) {
      return NextResponse.json(
        { success: false, error: 'Alumni profile not found' },
        { status: 404 }
      );
    }

    const parseResult = await parseRequestBody(request, createAvailabilitySchema_Validated);
    if (!parseResult.success) {
      return parseResult.error;
    }

    const { dayOfWeek, startTime, endTime } = parseResult.data;

    // Use service to create availability
    const availability = await AvailabilityService.createAvailability(
      alumniProfile.id,
      { dayOfWeek, startTime, endTime }
    );

    return successResponse(availability, 'Availability created successfully', 201);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to create availability');
  }
}

/**
 * GET /api/alumni/availability
 * List availability slots
 * Query params:
 * - alumniId: string (optional, to view specific alumni's availability)
 * - dayOfWeek: string (optional, filter by day)
 * - limit: number (default 20)
 * - offset: number (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const queryResult = parseQueryParams(request, listAvailabilityQuerySchema)
    if (!queryResult.success) {
      return queryResult.error
    }

    const { alumniId, dayOfWeek, limit, offset } = queryResult.data

    const authResult = await requirePermission(request, 'availability', 'list')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Build permission filter - ensures users only see what they have access to
    const filter = buildPermissionFilter(permissions, 'availability', 'list')

    let whereClause: any = { ...filter }

    // If alumniId is provided, filter by that specific alumni (with permission check)
    if (alumniId) {
      whereClause.alumniId = alumniId
    }

    if (dayOfWeek) {
      whereClause.dayOfWeek = dayOfWeek
    }

    const [slots, total] = await Promise.all([
      prisma.availability.findMany({
        where: whereClause,
        include: {
          alumni: {
            include: { user: true },
          },
        },
        take: limit,
        skip: offset,
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      }),
      prisma.availability.count({ where: whereClause }),
    ])

    return paginatedResponse(slots, limit, offset, total)
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to fetch availability')
  }
}

/**
 * DELETE /api/alumni/availability/:id
 */
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const availability = await prisma.availability.findUnique({
      where: { id },
    });

    if (!availability) {
      return notFoundResponse('Availability');
    }

    const authResult = await requirePermission(request, 'availability', 'delete', {
      type: 'availability',
      alumniId: availability.alumniId,
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await prisma.availability.delete({
      where: { id },
    });

    return successResponse(null, 'Availability deleted successfully');
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to delete availability');
  }
}
