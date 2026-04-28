import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest, requirePermission } from '#/libs_schemas/middlewares/auth.middleware';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const conversationId = params.id;
    const user = await extractUserFromRequest(request);

    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    // Verify user is a participant in this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          select: { id: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            body: true,
            senderId: true,
            receiverId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!conversation) {
      return errorResponse('Conversation not found', { status: 404 });
    }

    const isParticipant = conversation.participants.some((p) => p.id === user.id);
    if (!isParticipant) {
      return errorResponse('Forbidden', { status: 403 });
    }

    const mappedMessages = conversation.messages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      text: msg.body,
      createdAt: msg.createdAt,
      isMe: msg.senderId === user.id,
    }));

    return successResponse(
      { conversation: { id: conversation.id, messages: mappedMessages } },
      'Messages retrieved successfully'
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve messages',
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const conversationId = params.id;
    const user = await extractUserFromRequest(request);

    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { receiverId, body: messageBody, type } = body;

    if (!receiverId || !messageBody) {
      return errorResponse('receiverId and body are required', { status: 400 });
    }

    // Verify user is a participant in this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          select: { id: true },
        },
      },
    });

    if (!conversation) {
      return errorResponse('Conversation not found', { status: 404 });
    }

    const isParticipant = conversation.participants.some((p) => p.id === user.id);
    if (!isParticipant) {
      return errorResponse('Forbidden', { status: 403 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        receiverId,
        body: messageBody,
        type: type || 'TEXT',
      },
    });

    // Emit socket event
    const io = (global as any).io;
    if (io) {
      const receiverRoom = `user:${receiverId}`;
      io.to(receiverRoom).emit('message_received', {
        conversationId,
        messageId: message.id,
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName}`,
      });
    }

    return successResponse(
      {
        message: {
          id: message.id,
          senderId: message.senderId,
          receiverId: message.receiverId,
          text: message.body,
          createdAt: message.createdAt,
          isMe: true,
        },
      },
      'Message sent successfully'
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to send message',
      { status: 500 }
    );
  }
}
