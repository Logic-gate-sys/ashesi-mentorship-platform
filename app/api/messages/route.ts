import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/_lib/abac/middleware';
import { MessageService } from '@/app/_services';
import {
  createConversationSchema,
  createMessageSchema,
  listMessagesQuerySchema,
} from '@/app/_schemas/messaging.schema';
import {
  successResponse,
  paginatedResponse,
  notFoundResponse,
  serverErrorResponse,
  parseRequestBody,
  parseQueryParams,
} from '@/app/_utils/api-response';

/**
 * POST /api/messages/conversations
 * Create a new conversation
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    const parseResult = await parseRequestBody(request, createConversationSchema);
    if (!parseResult.success) {
      return parseResult.error;
    }

    const { participantIds } = parseResult.data;

    // Ensure current user is in participants
    if (!participantIds.includes(user.id)) {
      participantIds.push(user.id);
    }

    // Use service to create or get existing conversation
    const conversation = await MessageService.getOrCreateConversation(
      [user.id, participantIds[0]]
    );

    return successResponse(conversation, 'Conversation created successfully', 201);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to create conversation');
  }
}

/**
 * POST /api/messages/:conversationId
 * Send a message to a conversation
 */
export async function POST_MESSAGE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    const parseResult = await parseRequestBody(request, createMessageSchema);
    if (!parseResult.success) {
      return parseResult.error;
    }

    const { conversationId, type, body, fileUrl } = parseResult.data;

    // Verify user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation) {
      return notFoundResponse('Conversation');
    }

    const isParticipant = conversation.participants.some((p) => p.userId === user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { success: false, error: 'You are not a participant in this conversation' },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        type,
        body,
        fileUrl,
      },
      include: {
        sender: true,
      },
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Emit WebSocket event (if configured)
    // await emitUpdate(`conversation:${conversationId}`, 'new_message', message);

    return successResponse(message, 'Message sent successfully', 201);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to send message');
  }
}

/**
 * GET /api/messages/:conversationId
 * Get messages in a conversation
 */
export async function GET_MESSAGES(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    const queryResult = parseQueryParams(request, listMessagesQuerySchema);
    if (!queryResult.success) {
      return queryResult.error;
    }

    const { conversationId, limit, offset, sortOrder } = queryResult.data;

    // Verify user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation) {
      return notFoundResponse('Conversation');
    }

    const isParticipant = conversation.participants.some((p) => p.userId === user.id);
    if (!isParticipant) {
      return NextResponse.json(
        { success: false, error: 'You are not a participant in this conversation' },
        { status: 403 }
      );
    }

    const total = await prisma.message.count({
      where: { conversationId },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: sortOrder as any },
      take: limit,
      skip: offset,
    });

    // Mark as read
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.id,
        },
      },
      data: { lastReadAt: new Date() },
    });

    return paginatedResponse(messages, limit, offset, total);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to fetch messages');
  }
}
