/**
 * GET /api/mentors/messages
 * Get conversations for the mentor
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import { getUserConversations, getMentorMessageRecipients } from '@/app/api/services/messages.service';

/**
 * GET - List conversations
 */
export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
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
      500
    );
  }
}
