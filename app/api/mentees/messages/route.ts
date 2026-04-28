import { NextRequest } from 'next/server';
import { prisma } from '#utils-types/utils/db';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest, requirePermission } from '#/libs_schemas/middlewares/auth.middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    // Get all conversations where mentee is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: user.id },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            body: true,
            senderId: true,
            receiverId: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
            receiver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        participants: {
          where: { id: { not: user.id } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    const mapped = conversations.map((conv) => {
      const participant = conv.participants[0];
      const latestMessage = conv.messages[0];

      return {
        id: conv.id,
        participantId: participant?.id || '',
        participantName: participant ? `${participant.firstName} ${participant.lastName}` : 'Unknown',
        participantAvatar: participant?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.id}`,
        lastMessage: latestMessage?.body || 'No messages yet',
        lastMessageAt: latestMessage?.createdAt || conv.updatedAt,
      };
    });

    return successResponse(
      { conversations: mapped },
      'Conversations retrieved successfully'
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve conversations',
      { status: 500 }
    );
  }
}
