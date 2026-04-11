/**
 * Notification Service
 * Handles all database operations for notifications
 */

import { prisma } from '@/app/_utils/db'

export class NotificationService {
  /**
   * Create a notification
   */
  static async createNotification(
    userId: string,
    data: {
      type: string
      title: string
      message: string
      link?: string
    }
  ) {
    return prisma.notification.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        body: data.message,
        link: data.link,
        isRead: false,
      },
    })
  }

  /**
   * Get notification by ID
   */
  static async getNotificationById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })
  }

  /**
   * Get unread notifications for a user
   */
  static async getUnreadNotifications(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * List all notifications for a user
   */
  static async listNotifications(
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ) {
    const { limit = 20, offset = 0 } = options

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where: { userId } }),
    ])

    return { notifications, total }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    })
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(id: string) {
    return prisma.notification.delete({
      where: { id },
    })
  }

  /**
   * Create bulk notifications
   */
  static async createBulkNotifications(
    userIds: string[],
    data: {
      type: string
      title: string
      message: string
      link?: string
    }
  ) {
    return prisma.notification.createMany({
      data: userIds.map(userId => ({
        userId,
        type: data.type,
        title: data.title,
        body: data.message,
        link: data.link,
        isRead: false,
      })),
    })
  }

  /**
   * Get notification count for a user
   */
  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    })
  }
}
