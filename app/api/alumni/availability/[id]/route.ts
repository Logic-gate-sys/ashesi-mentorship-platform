import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/app/_lib/abac/middleware'
import { prisma } from '@/app/_utils/db'
import {
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from '@/app/_utils/api-response'

/**
 * DELETE /api/alumni/availability/[id]
 * Delete availability slot (Alumni only)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const availability = await prisma.availability.findUnique({
      where: { id },
    })

    if (!availability) {
      return notFoundResponse('Availability')
    }

    const authResult = await requirePermission(request, 'availability', 'delete', {
      type: 'availability',
      alumniId: availability.alumniId,
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    await prisma.availability.delete({
      where: { id },
    })

    return successResponse(null, 'Availability deleted successfully')
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to delete availability')
  }
}
