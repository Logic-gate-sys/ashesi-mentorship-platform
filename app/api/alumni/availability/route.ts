import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter } from '@/app/_lib/abac/engine'
import { AvailabilityService, ProfileService } from '@/app/_services'
import { createAvailabilitySchema_Validated, listAvailabilityQuerySchema } from '@/app/_schemas/availability.schema'
import { withErrorHandling, NotFoundError } from '@/app/_middleware'
import { successResponse, paginatedResponse, validationErrorResponse } from '@/app/_utils/api-response'
import { toAvailabilityDTO } from '@/app/_dtos'
import { validateAvailability } from '@/app/_validators'
import { z } from 'zod'

/**
 * POST /api/alumni/availability
 * Create availability slot
 */
async function postHandler(request: NextRequest) {
  const authResult = await requirePermission(request, 'availability', 'create', {
    type: 'availability',
  })

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  const alumniProfile = await ProfileService.getOrCreateAlumniProfile(user.id)

  if (!alumniProfile) {
    throw new NotFoundError('Alumni profile')
  }

  const body = await request.json()
  const parseResult = createAvailabilitySchema_Validated.safeParse(body)

  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  const { dayOfWeek, startTime, endTime } = parseResult.data

  validateAvailability({ dayOfWeek, startTime, endTime })

  const availability = await AvailabilityService.createAvailability(
    alumniProfile.id,
    { dayOfWeek, startTime, endTime }
  )

  const dto = toAvailabilityDTO(availability)
  return successResponse(dto, 'Availability created successfully', 201)
}

/**
 * GET /api/alumni/availability
 * List availability slots with permission-based filtering
 */
async function getHandler(request: NextRequest) {
  const authResult = await requirePermission(request, 'availability', 'list')
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { permissions } = authResult

  const searchParams = request.nextUrl.searchParams
  const alumniId = searchParams.get('alumniId') || undefined
  const dayOfWeek = searchParams.get('dayOfWeek')
    ? parseInt(searchParams.get('dayOfWeek')!)
    : undefined
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
  const offset = parseInt(searchParams.get('offset') || '0')

  const filter = buildPermissionFilter(permissions, 'availability', 'list')

  if (alumniId) {
    filter.alumniId = alumniId
  }

  if (dayOfWeek !== undefined) {
    filter.dayOfWeek = dayOfWeek
  }

  const { availability: slots, total } = await AvailabilityService.listAvailability(
    filter,
    { limit, offset }
  )

  const dtos = slots.map(toAvailabilityDTO)

  return paginatedResponse(dtos, limit, offset, total)
}

export const POST = withErrorHandling(postHandler)
export const GET = withErrorHandling(getHandler)
      where: { id },
    });

    return successResponse(null, 'Availability deleted successfully');
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to delete availability');
  }
}
