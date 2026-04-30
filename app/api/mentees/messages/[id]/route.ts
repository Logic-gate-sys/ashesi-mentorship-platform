import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import { getConversation, sendMessage } from '#services/messages.service';
import { getIOInstance } from '#/libs_schemas/socket';
import {
  CacheTTL,
  buildCacheKey,
  getFromTTLCache,
  invalidateCacheByTags,
  setTTLCache,
} from '#/libs_schemas/caches/cacheEngine';

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

    const cacheKey = buildCacheKey('conversation-detail', conversationId, limit, offset);
    const cached = getFromTTLCache<{
      conversation: NonNullable<Awaited<ReturnType<typeof getConversation>>>;
      messageCount: number;
    }>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Conversation retrieved successfully');
    }

    const conversation = await getConversation(conversationId, limit, offset);

    if (!conversation) {
      return errorResponse('Conversation not found', { status: 404 });
    }

    const responseData = {
      conversation,
      messageCount: conversation.messages.length,
    };

    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.VERY_SHORT,
      tags: [`conversation:${conversationId}`, `user:${user.id}`, 'messages:conversation-detail'],
    });

    return successResponse(responseData, 'Conversation retrieved successfully');
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

    invalidateCacheByTags([
      `conversation:${conversationId}`,
      `user:${user.id}`,
      `user:${receiverId}`,
      `conversations:${user.id}`,
      `conversations:${receiverId}`,
      'messages:conversation-detail',
      'mentee:messages',
      'mentor:messages',
    ]);

    // Emit socket events to notify connected clients
    try {
      const io = getIOInstance();
      const nps = io.of('/conversation');
      
      // Emit to conversation room
      nps.to(`conversation:${conversationId}`).emit('message_received', {
        conversationId,
        message,
      });
      
      // Emit to receiver's personal room
      nps.to(`user:${receiverId}`).emit('notification', {
        type: 'new_message',
        conversationId,
        senderId: user.id,
      });
    } catch (socketError) {
      console.warn('Failed to emit socket events:', socketError);
      // Continue anyway - socket is optional
    }

    return successResponse(message, 'Message sent successfully', 201);
  } catch (error) {
    console.error('Error sending message:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to send message',
      { status: 500 }
    );
  }
}