/**
 * Mentorship Request Service
 * Handles all database operations for mentorship requests
 */

import { prisma } from '@/app/_utils/db'
import { MentorshipRequestStatus } from '@/prisma/generated/prisma/client'

export class MentorshipRequestService {
  /**
   * List mentorship requests with optional filtering
   */
  static async listRequests(
    filter: any,
    options: { status?: string; limit?: number; offset?: number } = {}
  ) {
    const { status = 'PENDING', limit = 10, offset = 0 } = options

    const [requests, total] = await Promise.all([
      prisma.mentorshipRequest.findMany({
        where: {
          ...filter,
          status: status === 'ALL' ? undefined : { in: [status] },
        },
        include: {
          student: {
            include: { user: true },
          },
          alumni: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.mentorshipRequest.count({
        where: {
          ...filter,
          status: status === 'ALL' ? undefined : { in: [status] },
        },
      }),
    ])

    return { requests, total }
  }

  /**
   * Get a single mentorship request by ID
   */
  static async getRequestById(id: string) {
    return prisma.mentorshipRequest.findUnique({
      where: { id },
      include: {
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
      },
    })
  }

  /**
   * Create a new mentorship request
   */
  static async createRequest(
    studentId: string,
    data: {
      goal: string
      message: string
    }
  ) {
    return prisma.mentorshipRequest.create({
      data: {
        studentId,
        goal: data.goal,
        message: data.message,
        status: 'PENDING',
      },
      include: {
        student: {
          include: { user: true },
        },
      },
    })
  }

  /**
   * Accept a mentorship request
   */
  static async acceptRequest(requestId: string) {
    return prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
      include: {
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
      },
    })
  }

  /**
   * Decline a mentorship request
   */
  static async declineRequest(requestId: string) {
    return prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: { status: 'DECLINED' },
      include: {
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
      },
    })
  }

  /**
   * Get request by ID with full details
   */
  static async getRequestDetails(requestId: string) {
    return prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
      include: {
        student: {
          include: { user: true },
        },
        alumni: {
          include: { user: true },
        },
      },
    })
  }
}
