/**
 * Messages & Conversations Service
 * Business logic for managing messaging between mentors and mentees
 */

import { prisma } from '@/app/_utils_and_types/utils/db';

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string, limit = 50, offset = 0) {
  // Get conversations where user is either mentor or mentee in related sessions
  const conversations = await prisma.$queryRaw`
    SELECT DISTINCT c.id, c."createdAt", c."updatedAt"
    FROM "Conversation" c
    WHERE c.id IN (
      SELECT DISTINCT m."conversationId"
      FROM "Message" m
      WHERE m."senderId" = ${userId} OR m."receiverId" = ${userId}
    )
    ORDER BY c."updatedAt" DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  // Get the full conversation data with participants
  const conversationIds = (conversations as any[]).map((c: any) => c.id);
  
  if (conversationIds.length === 0) {
    return [];
  }

  return await prisma.conversation.findMany({
    where: {
      id: { in: conversationIds },
    },
    include: {
      messages: {
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          body: true,
          type: true,
          fileUrl: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1, // Latest message
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

/**
 * Get or create conversation between two users
 */
export async function getOrCreateConversation(userId1: string, userId2: string) {
  // Try to find existing conversation
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      messages: {
        some: {
          OR: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
          ],
        },
      },
    },
    include: {
      messages: {
        select: {
          senderId: true,
          receiverId: true,
        },
        distinct: ['senderId', 'receiverId'],
      },
    },
  });

  if (existingConversation) {
    return existingConversation;
  }

  // Create new conversation
  return await prisma.conversation.create({
    data: {},
  });
}

/**
 * Get conversation with full message history
 */
export async function getConversation(conversationId: string, limit = 50, offset = 0) {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          body: true,
          type: true,
          fileUrl: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
      },
    },
  });
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(data: {
  conversationId: string;
  senderId: string;
  receiverId: string;
  body: string;
  type?: 'TEXT' | 'FILE' | 'IMAGE';
  fileUrl?: string;
}) {
  // Verify conversation exists
  const conversation = await prisma.conversation.findUnique({
    where: { id: data.conversationId },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return await prisma.message.create({
    data: {
      conversationId: data.conversationId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      body: data.body,
      type: data.type || 'TEXT',
      fileUrl: data.fileUrl,
    },
    include: {
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
  });
}

/**
 * Get messages between two users (for backward compatibility)
 */
export async function getMessagesBetweenUsers(userId1: string, userId2: string, limit = 50) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      body: true,
      type: true,
      fileUrl: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
        },
      },
      receiver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return messages.reverse(); // Return in chronological order
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId: string, userId: string) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { senderId: true },
  });

  if (!message) {
    throw new Error('Message not found');
  }

  if (message.senderId !== userId) {
    throw new Error('Unauthorized: Can only delete own messages');
  }

  return await prisma.message.delete({
    where: { id: messageId },
  });
}

/**
 * Get mentees a mentor can message (through accepted requests)
 */
export async function getMentorMessageRecipients(mentorProfileId: string) {
  return await prisma.mentorshipRequest.findMany({
    where: {
      mentorId: mentorProfileId,
      status: 'ACCEPTED',
    },
    select: {
      mentee: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });
}
