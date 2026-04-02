import { z } from 'zod'
import { NextRequest } from 'next/server'
import { withErrorHandling, NotFoundError, ValidationError } from '@/app/_middleware'
import { CycleService } from '@/app/_services'
import { successResponse } from '@/app/_utils/api-response'

/**
 * GET /api/cycles/current
 * Get the current active mentorship cycle
 * Used by both mentors and students to see cycle timeline
 * Public endpoint (no auth required)
 */
async function getHandler(request: NextRequest) {
  const cycle = await CycleService.getActiveCycle()

  if (!cycle) {
    throw new NotFoundError('No active or upcoming mentorship cycle found')
  }

  return successResponse(cycle, 'Current cycle status')
}

const endCycleSchema = z.object({
  cycleId: z.string().uuid('Invalid cycle ID format'),
})

/**
 * POST /api/cycles/end
 * Admin endpoint to manually end a cycle
 * Automatically:
 * 1. Dissolves all mentorship groups (pauses, not deletes)
 * 2. Archives mentorship history
 * 3. Marks cycle as 'ended'
 * 4. Notifies alumni of cycle completion
 */
async function postHandler(request: NextRequest) {
  const body = await request.json()
  const parsed = endCycleSchema.safeParse(body)

  if (!parsed.success) {
    throw new ValidationError('Invalid cycle data', parsed.error)
  }

  const { cycleId } = parsed.data

  const result = await CycleService.endCycle(cycleId)
  const alumniStats = await CycleService.getAlumniStatsForCycleEnd(cycleId)

  // Non-blocking email sending
  ;(async () => {
    try {
      const { sendBulkCycleEndedEmails } = await import('@/app/_services/email/emailHelpers')

      const stats: Record<string, any> = {}
      alumniStats.forEach(alumnus => {
        stats[alumnus.id] = {
          menteesCount: alumnus.menteesCount,
          sessionsCount: alumnus.sessionsCount,
          averageRating: alumnus.averageRating,
        }
      })

      const mentorData = alumniStats.map(m => ({
        id: m.id,
        email: m.email,
        name: m.name,
      }))

      const cycle = await CycleService.getCycleById(cycleId)
      if (cycle) {
        const emailResults = await sendBulkCycleEndedEmails(mentorData, cycle, stats)
        console.log(
          `Cycle ended emails sent: ${emailResults.successful} successful, ${emailResults.failed} failed`
        )
        if (emailResults.errors.length > 0) {
          console.error('Email errors:', emailResults.errors)
        }
      }
    } catch (emailError) {
      console.error('Failed to send cycle ended emails:', emailError)
    }
  })()

  return successResponse(
    {
      cycleId,
      status: 'ended',
      message:
        'Mentorship cycle ended. Notification emails queued to alumni. All mentorships have been archived. Alumni and students can now sign up for the next cycle.',
      archivedMentorships: result.archivedMentorships,
      completedSessions: result.completedSessions,
      averageRating: result.averageRating,
      emailsSent: alumniStats.length,
    },
    'Mentorship cycle ended successfully',
    201
  )
}

export const GET = withErrorHandling(getHandler)
export const POST = withErrorHandling(postHandler)

