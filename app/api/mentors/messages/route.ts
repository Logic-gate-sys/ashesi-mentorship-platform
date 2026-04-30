/**
 * GET /api/mentors/messages
 * Get conversations for the mentor
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { getUserConversations, getOrCreateConversation } from '#services/messages.service';

/**
 * GET - List conversations
 */
export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const conversations = await getUserConversations(user.id, limit, offset);

    return successResponse(
      {
        conversations,
        count: conversations.length,
        pagination: { limit, offset },
      },
      'Conversations retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch conversations',
      { status: 500 }
    );
  }
}

/**
 * POST - Create or reuse a conversation with a mentee
 */
export async function POST(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const participantId = body?.participantId as string | undefined;

    if (!participantId) {
      return errorResponse('participantId is required', { status: 400 });
    }

    const conversation = await getOrCreateConversation(user.id, participantId);

    return successResponse(
      { conversation },
      'Conversation ready'
    );
  } catch (error) {
    console.error('Error creating conversation:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to create conversation',
      { status: 500 }
    );
  }
}
