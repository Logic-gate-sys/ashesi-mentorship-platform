/**
 * Metrics Service
 * Business logic for generating dashboard metrics and statistics
 */

import { prisma } from '#utils-types/utils/db';
import {getMentorSessions,getUpcomingMentorSessions,getUserSessionStats} from './sessions.service';
import { getMentorshipRequests, getPendingRequestsCount } from './mentorship-requests.service';
import { getMentorFeedback, getMentorAverageRating } from './feedback.service';
import { retryAsync } from '#libs-schemas/caches/cacheEngine';

export interface MentorMetrics {
  totalMentees: number;
  activeMentees: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  pendingRequests: number;
  averageRating: number;
  completionRate: number;
}

export interface DashboardOverview {
  mentor: {
    id: string;
    userId: string;
    graduationYear: number;
    major: string;
    company: string;
    jobTitle: string;
    bio?: string | null;
    isAvailable: boolean;
    maxMentees: number;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string | null;
    };
  };
  metrics: MentorMetrics;
  pendingRequests: any[];
  activeMentees: any[];
  upcomingSessions: any[];
  recentActivities: Array<{
    id: string | number;
    event: string;
    timestamp: string;
    type: 'request' | 'message' | 'session' | 'feedback';
  }>;
}

/**
 * Get comprehensive metrics for a mentor
 */
export async function getMentorMetrics(mentorProfileId: string): Promise<MentorMetrics> {
  const activeMentees = await retryAsync(() => prisma.mentorshipRequest.findMany({
    where: { mentorId: mentorProfileId, status: 'ACCEPTED' },
    distinct: ['menteeId'],
    select: { menteeId: true },
  }), { attempts: 2, baseDelayMs: 150 });

  const totalAcceptedRequests = await retryAsync(() => prisma.mentorshipRequest.count({
    where: { mentorId: mentorProfileId, status: 'ACCEPTED' },
  }), { attempts: 2, baseDelayMs: 150 });

  const sessionStats = await retryAsync(
    () => getUserSessionStats(mentorProfileId, 'MENTOR'),
    { attempts: 2, baseDelayMs: 150 }
  );

  const pendingRequests = await retryAsync(
    () => getPendingRequestsCount(mentorProfileId, 'MENTOR'),
    { attempts: 2, baseDelayMs: 150 }
  );

  const ratingData = await retryAsync(
    () => getMentorAverageRating(mentorProfileId),
    { attempts: 2, baseDelayMs: 150 }
  );

  return {
    totalMentees: totalAcceptedRequests,
    activeMentees: activeMentees.length,
    totalSessions: sessionStats.total,
    completedSessions: sessionStats.completed,
    upcomingSessions: sessionStats.scheduled,
    pendingRequests,
    averageRating: ratingData.averageRating,
    completionRate: sessionStats.completionRate,
  };
}

export async function getMentorDashboardOverview(mentorProfileId: string): Promise<DashboardOverview> {
  // Fetch mentor profile
  const mentor = await retryAsync(() => prisma.mentorProfile.findUnique({
    where: { id: mentorProfileId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
  }), { attempts: 2, baseDelayMs: 150 });
  //if no mentor
  if (!mentor) {
    throw new Error('Mentor profile not found');
  }
  // Fetch metrics
  const metrics = await getMentorMetrics(mentorProfileId);
  // Fetch pending requests
  const pendingRequests = await retryAsync(
    () => getMentorshipRequests(mentorProfileId, 'MENTOR', 'PENDING'),
    { attempts: 2, baseDelayMs: 150 }
  );
  // Fetch active mentees
  const acceptedRequests = await retryAsync(
    () => getMentorshipRequests(mentorProfileId, 'MENTOR', 'ACCEPTED'),
    { attempts: 2, baseDelayMs: 150 }
  );
  const activeMentees = acceptedRequests.map(req => ({
    id: req.id,
    studentId: req.mentee?.user.id,
    studentName: req.mentee?.user?.firstName? `${req.mentee.user.firstName} ${req.mentee.user.lastName}`: 'Unknown',
    studentEmail: req.mentee?.user?.email || '',
    studentAvatarUrl: req.mentee?.user?.avatarUrl,
    goal: req.goal,
    status: 'active' as const,
  }));
  // Fetch upcoming sessions
  const upcomingSessions = await retryAsync(
    () => getUpcomingMentorSessions(mentorProfileId, 'MENTOR'),
    { attempts: 2, baseDelayMs: 150 }
  );
  // Fetch recent activities
  const recentActivities = await retryAsync(
    () => getMentorRecentActivities(mentorProfileId, 6),
    { attempts: 2, baseDelayMs: 150 }
  );

  return {
    mentor,
    metrics,
    pendingRequests: pendingRequests.map(req => ({
      id: req.id,
      studentId: req.mentee?.user?.id,
      studentName: req.mentee?.user?.firstName
        ? `${req.mentee.user.firstName} ${req.mentee.user.lastName}`
        : 'Unknown',
      studentAvatarUrl: req.mentee?.user?.avatarUrl,
      majorAndYear: req.mentee?.major ? `${req.mentee.major} '${(req.mentee.yearGroup % 100).toString().padStart(2, '0')}` : '',
      message: req.message || req.goal,
      goal: req.goal,
      status: req.status,
    })),
    activeMentees,
    upcomingSessions: upcomingSessions.map(session => ({
      id: session.id,
      mentee: session.mentee?.user?.firstName
        ? `${session.mentee.user.firstName} ${session.mentee.user.lastName}`
        : 'Unknown',
      menteeId: session.mentee?.userId,
      date: session.scheduledAt.toLocaleDateString(),
      time: session.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: session.topic,
      type: session.type,
      scheduledAt: session.scheduledAt.toISOString(),
      duration: session.duration,
      meetingUrl: session.meetingUrl,
      status: session.status,
    })),
    recentActivities,
  };
}

/**
 * Get recent activities for mentor dashboard
 */
export async function getMentorRecentActivities(mentorProfileId: string, limit = 10) {
  const activities: Array<{
    id: string | number;
    event: string;
    timestamp: string;
    type: 'request' | 'message' | 'session' | 'feedback';
  }> = [];

  // Recent requests
  const recentRequests = await prisma.mentorshipRequest.findMany({
    where: { mentorId: mentorProfileId },
    select: {
      id: true,
      createdAt: true,
      status: true,
      mentee: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  recentRequests.forEach(req => {
    const studentName = req.mentee?.user?.firstName || 'Unknown';
    activities.push({
      id: `req-${req.id}`,
      event: `${studentName} sent a request`,
      timestamp: getTimeAgo(req.createdAt),
      type: 'request',
    });
  });

  // Recent messages
  const recentMessages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: (await prisma.mentorProfile.findUnique({
          where: { id: mentorProfileId },
          select: { userId: true },
        }))?.userId || '' },
      ],
    },
    select: {
      id: true,
      createdAt: true,
      sender: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      receiver: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  recentMessages.forEach(msg => {
    activities.push({
      id: `msg-${msg.id}`,
      event: `Message from ${msg.sender.firstName}`,
      timestamp: getTimeAgo(msg.createdAt),
      type: 'message',
    });
  });

  // Recent completed sessions
  const recentSessions = await prisma.session.findMany({
    where: {
      mentorId: mentorProfileId,
      status: 'COMPLETED',
    },
    select: {
      id: true,
      createdAt: true,
      mentee: {
        select: {
          user: {
            select: {
              firstName: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  recentSessions.forEach(session => {
    activities.push({
      id: `session-${session.id}`,
      event: `Completed session with ${session.mentee?.user?.firstName || 'mentee'}`,
      timestamp: getTimeAgo(session.createdAt),
      type: 'session',
    });
  });

  return activities.sort((a, b) => {
    // Sort by timestamp (most recent first)
    const aTime = parseFloat(a.timestamp.match(/\d+/)?.[0] || '0');
    const bTime = parseFloat(b.timestamp.match(/\d+/)?.[0] || '0');
    return bTime - aTime;
  }).slice(0, limit);
}

/**
 * Helper function to convert date to "time ago" format
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}
