import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/_lib/abac/middleware'
import { MessageService } from '@/app/_services'
import { createConversationSchema } from '@/app/_schemas/messaging.schema'
import { withErrorHandling, ValidationError } from '@/app/_middleware'
import { successResponse, validationErrorResponse } from '@/app/_utils/api-response'
import { toMessageDTO } from '@/app/_dtos'

/**
 * POST /api/messages
 * Create a new conversation or get existing one
 */
async function postHandler(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  const body = await request.json()
  const parseResult = createConversationSchema.safeParse(body)

  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  const { participantIds } = parseResult.data

  if (!participantIds || participantIds.length === 0) {
    throw new ValidationError('At least one participant is required')
  }

  const uniqueParticipants = [...new Set([user.id, ...participantIds])]

  const conversation = await MessageService.getOrCreateConversation(uniqueParticipants)

  return successResponse(conversation, 'Conversation created successfully', 201)
}

/**
 * GET /api/messages
 * List conversations for the authenticated user
 */
async function getHandler(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  const conversations = await MessageService.listConversations(user.id)

  return successResponse(
    {
      conversations: conversations || [],
      total: conversations?.length || 0,
    },
    'Conversations retrieved'
  )
}

export const POST = withErrorHandling(postHandler)
export const GET = withErrorHandling(getHandler)
