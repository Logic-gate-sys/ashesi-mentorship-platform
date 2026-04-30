import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { getConversation, sendMessage } from '#services/messages.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { id: conversationId } = await params;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const conversation = await getConversation(conversationId, limit, offset);

    if (!conversation) {
      return errorResponse('Conversation not found', { status: 404 });
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
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { id: conversationId } = await params;
    const body = await request.json();
    const { receiverId, body: messageBody, type = 'TEXT', fileUrl } = body;

    if (!receiverId || !messageBody) {
      return errorResponse('Missing required fields: receiverId, body', { status: 400 });
    }

    const message = await sendMessage({
      conversationId,
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
      { status: 500 }
    );
  }
}