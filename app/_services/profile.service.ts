/**
 * Profile Service
 * Handles all database operations for user profiles (Student and Alumni)
 */

import { prisma } from '@/app/_utils/db'

export class ProfileService {
  /**
   * Get user profile (student or alumni)
   */
  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        alumniProfile: true,
      },
    })

    return user
  }

  /**
   * Get or create student profile
   */
  static async getOrCreateStudentProfile(userId: string) {
    let profile = await prisma.studentProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      profile = await prisma.studentProfile.create({
        data: {
          userId,
          yearGroup: 'YEAR1',
        },
      })
    }

    return profile
  }

  /**
   * Get or create alumni profile
   */
  static async getOrCreateAlumniProfile(userId: string) {
    let profile = await prisma.alumniProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      profile = await prisma.alumniProfile.create({
        data: {
          userId,
        },
      })
    }

    return profile
  }

  /**
   * Update student profile
   */
  static async updateStudentProfile(
    userId: string,
    data: {
      yearGroup?: string
      major?: string
      interests?: string
      bio?: string
      linkedin?: string
    }
  ) {
    return prisma.studentProfile.update({
      where: { userId },
      data,
    })
  }

  /**
   * Update alumni profile
   */
  static async updateAlumniProfile(
    userId: string,
    data: {
      company?: string
      jobTitle?: string
      skills?: string
      bio?: string
      linkedin?: string
      isAvailable?: boolean
    }
  ) {
    return prisma.alumniProfile.update({
      where: { userId },
      data,
    })
  }

  /**
   * Update user profile (common fields)
   */
  static async updateUserProfile(
    userId: string,
    data: {
      firstName?: string
      lastName?: string
      avatarUrl?: string
      bio?: string
      linkedin?: string
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
      include: {
        studentProfile: true,
        alumniProfile: true,
      },
    })
  }

  /**
   * Get student profile by ID
   */
  static async getStudentById(studentId: string) {
    return prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: true,
      },
    })
  }

  /**
   * Get alumni profile by ID
   */
  static async getAlumniById(alumniId: string) {
    return prisma.alumniProfile.findUnique({
      where: { id: alumniId },
      include: {
        user: true,
      },
    })
  }

  /**
   * List all alumni with optional filtering
   */
  static async listAlumni(options: { limit?: number; offset?: number } = {}) {
    const { limit = 20, offset = 0 } = options

    const [alumni, total] = await Promise.all([
      prisma.alumniProfile.findMany({
        where: {
          isAvailable: true,
        },
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.alumniProfile.count({
        where: {
          isAvailable: true,
        },
      }),
    ])

    return { alumni, total }
  }

  /**
   * Search alumni by skills
   */
  static async searchAlumniBySkills(skill: string) {
    return prisma.alumniProfile.findMany({
      where: {
        skills: {
          contains: skill,
          mode: 'insensitive',
        },
        isAvailable: true,
      },
      include: {
        user: true,
      },
    })
  }
}
