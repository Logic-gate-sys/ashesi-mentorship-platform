import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/app/_lib/abac/middleware'
import { CycleService } from '@/app/_services'
import { withErrorHandling, ValidationError } from '@/app/_middleware'
import { successResponse, validationErrorResponse, paginatedResponse } from '@/app/_utils/api-response'
import { z } from 'zod'

const createCycleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
})

/**
 * POST /api/admin/cycles
 * Create a new mentorship cycle
 */
async function postHandler(request: NextRequest) {
  const authResult = await requirePermission(request, 'cycle', 'create')
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const body = await request.json()
  const parseResult = createCycleSchema.safeParse(body)

  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  const { name, description, startDate, endDate } = parseResult.data

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start >= end) {
    throw new ValidationError('Start date must be before end date')
  }

  const cycle = await CycleService.createCycle({
    name,
    description,
    startDate: start,
    endDate: end,
  })

  (async () => {
    try {
      const alumni = await CycleService.getAllAlumniForNotifications()
      const { sendBulkCycleInvitations } = await import('@/app/_services/email/emailHelpers')

      const emailResults = await sendBulkCycleInvitations(
        alumni.map(a => ({
          id: a.id,
          email: a.email,
          name: a.name,
        })),
        {
          id: cycle.id,
          name: cycle.name,
          startDate: cycle.startDate.toISOString(),
          endDate: cycle.endDate.toISOString(),
          durationMonths: cycle.durationMonths,
        }
      )

      console.log(
        `Cycle notifications sent: ${emailResults.successful} successful, ${emailResults.failed} failed`
      )
    } catch (emailError) {
      console.error('Failed to send cycle notifications:', emailError)
    }
  })()

  const responseData = {
    id: cycle.id,
    name: cycle.name,
    description: cycle.description,
    startDate: cycle.startDate.toISOString(),
    endDate: cycle.endDate.toISOString(),
    status: cycle.status,
    createdAt: cycle.createdAt.toISOString(),
    durationMonths: cycle.durationMonths,
  }

  return successResponse(
    responseData,
    'Cycle created successfully. Notifications queued.',
    201
  )
}

/**
 * GET /api/admin/cycles
 * List all mentorship cycles
 */
async function getHandler(request: NextRequest) {
  const authResult = await requirePermission(request, 'cycle', 'list')
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const searchParams = request.nextUrl.searchParams
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
  const offset = parseInt(searchParams.get('offset') || '0')
  const status = searchParams.get('status') as any

  const { cycles, total } = await CycleService.listCycles({ limit, offset, status })

  const cycleData = cycles.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description,
    startDate: c.startDate.toISOString(),
    endDate: c.endDate.toISOString(),
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    durationMonths: c.durationMonths,
  }))

  return paginatedResponse(cycleData, limit, offset, total)
}

export const POST = withErrorHandling(postHandler)
export const GET = withErrorHandling(getHandler)
