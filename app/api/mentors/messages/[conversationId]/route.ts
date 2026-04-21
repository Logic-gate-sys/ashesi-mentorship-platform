/**
 * GET /api/mentors/messages/[conversationId]
 * Get conversation messages
 * 
 * POST /api/mentors/messages/[conversationId]
 * Send a message in a conversation
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import { getConversation, sendMessage } from '@/app/api/services/messages.service';

/**
 * GET - Get conversation messages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const conversation = await getConversation(params.conversationId, limit, offset);

    if (!conversation) {
      return errorResponse('Conversation not found', 404);
    }

    return successResponse(
      {
        conversation,
        messageCount: conversation.messages.length,
      },
      'Conversation retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch conversation',
      500
    );
  }
}

/**
 * POST - Send a message
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { receiverId, body: messageBody, type = 'TEXT', fileUrl } = body;

    if (!receiverId || !messageBody) {
      return errorResponse('Missing required fields: receiverId, body', 400);
    }

    const message = await sendMessage({
      conversationId: params.conversationId,
      senderId: user.id,
      receiverId,
      body: messageBody,
      type: type as 'TEXT' | 'FILE' | 'IMAGE',
      fileUrl,
    });

    return successResponse(message, 'Message sent successfully', 201);
  } catch (error) {
    console.error('Error sending message:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to send message',
      500
    );
  }
}
