/**
 * Message Service
 * Handles all database operations for conversations and messages
 */

import { prisma } from '@/app/_utils/db'

export class MessageService {
  /**
   * Create a conversation
   */
  static async createConversation(
    participantIds: string[],
    title?: string
  ) {
    return prisma.conversation.create({
      data: {
        participants: {
          create: participantIds.map(id => ({
            userId: id,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })
  }

  /**
   * Get conversation by ID
   */
  static async getConversationById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        messages: {
          include: {
            sender: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  /**
   * List conversations for a user
   */
  static async listConversations(
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ) {
    const { limit = 20, offset = 0 } = options

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId,
            },
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.conversation.count({
        where: {
          participants: {
            some: {
              userId,
            },
          },
        },
      }),
    ])

    return { conversations, total }
  }

  /**
   * Send a message
   */
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ) {
    return prisma.message.create({
      data: {
        conversationId,
        senderId,
        body: content,
      },
      include: {
        sender: true,
      },
    })
  }

  /**
   * Get messages in a conversation
   */
  static async getMessages(
    conversationId: string,
    options: { limit?: number; offset?: number } = {}
  ) {
    const { limit = 50, offset = 0 } = options

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.message.count({ where: { conversationId } }),
    ])

    return { messages: messages.reverse(), total }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(id: string) {
    return prisma.message.delete({
      where: { id },
    })
  }

  /**
   * Get or create conversation between two users
   */
  static async getOrCreateConversation(userIds: [string, string]) {
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: userIds[0],
              },
            },
          },
          {
            participants: {
              some: {
                userId: userIds[1],
              },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })

    if (existing) {
      return existing
    }

    return this.createConversation(userIds)
  }
}
