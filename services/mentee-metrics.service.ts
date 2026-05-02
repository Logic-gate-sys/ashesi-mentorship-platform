/**
 * Metrics Service
 * Business logic for generating dashboard metrics and statistics
 */

import { prisma } from '#utils-types/utils/db';
import {getMentorSessions,getUpcomingMentorSessions,getUserSessionStats} from './sessions.service';
import { getMentorshipRequests, getPendingRequestsCount } from './mentorship-requests.service';
import { getMentorFeedback, } from './feedback.service';
import { retryAsync } from '#libs-schemas/caches/cacheEngine';

export interface MenteeMetrics {
  totalMentors: number;
  activeMentors: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  pendingRequests: number;
  completionRate: number;
}

export interface DashboardOverview {
  mentee: {
    id: string;
    userId: string;
    major: string;
    bio?: string | null;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string | null;
    };
  };
  metrics: MenteeMetrics;
  pendingRequests: any[];
  requestHistory: any[];
  activeMentors: any[];
  upcomingSessions: any[];
  recentActivities: Array<{
    id: string | number;
    event: string;
    timestamp: string;
    type: 'request' | 'message' | 'session' | 'feedback';
  }>;
}


export async function getMenteeMetrics(menteeProfileId: string): Promise<MenteeMetrics> {
  // Execute queries sequentially to avoid exhausting the remote DB connection pool
  // 1) distinct active mentors
  const activeMentors = await retryAsync(() => prisma.mentorshipRequest.findMany({
    where: { menteeId: menteeProfileId, status: 'ACCEPTED' },
    distinct: ['mentorId'],
    select: { mentorId: true },
  }), { attempts: 2, baseDelayMs: 150 });

  // 2) total accepted requests
  const totalAcceptedRequests = await retryAsync(() => prisma.mentorshipRequest.count({
    where: { menteeId: menteeProfileId, status: 'ACCEPTED' },
  }), { attempts: 2, baseDelayMs: 150 });

  // 3) session stats
  const sessionStats = await retryAsync(
    () => getUserSessionStats(menteeProfileId, 'MENTEE'),
    { attempts: 2, baseDelayMs: 150 }
  );

  // 4) pending requests count
  const pendingRequests = await retryAsync(
    () => getPendingRequestsCount(menteeProfileId, 'MENTEE'),
    { attempts: 2, baseDelayMs: 150 }
  );

  return {
    totalMentors: totalAcceptedRequests,
    activeMentors: activeMentors.length,
    totalSessions: sessionStats.total,
    completedSessions: sessionStats.completed,
    upcomingSessions: sessionStats.scheduled,
    pendingRequests,
    completionRate: sessionStats.completionRate,
  };
}

export async function getMenteeDashboardOverview(menteeProfileId: string): Promise<DashboardOverview> {
  // Fetch mentor profile
  const mentee = await retryAsync(() => prisma.menteeProfile.findUnique({
    where: { id: menteeProfileId },
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
  if (!mentee) {
    throw new Error('Mentor profile not found');
  }
  // Fetch metrics
  const metrics = await getMenteeMetrics(menteeProfileId);
  // Fetch pending requests
  const pendingRequests = await retryAsync(
    () => getMentorshipRequests(menteeProfileId, 'MENTEE', 'PENDING'),
    { attempts: 2, baseDelayMs: 150 }
  );
  const requestHistory = await retryAsync(
    () => getMentorshipRequests(menteeProfileId, 'MENTEE'),
    { attempts: 2, baseDelayMs: 150 }
  );
  // Fetch active mentees
  const acceptedRequests = await retryAsync(
    () => getMentorshipRequests(menteeProfileId, 'MENTEE', 'ACCEPTED'),
    { attempts: 2, baseDelayMs: 150 }
  );
  const activeMentors = acceptedRequests.map(req => ({
    id: req.id,
    mentorId: req.mentor?.user.id,
    mentorName: req.mentor?.user?.firstName? `${req.mentor.user.firstName} ${req.mentor.user.lastName}`: 'Unknown',
    mentorEmail: req.mentor?.user?.email || '',
    mentorAvatarUrl: req.mentor?.user?.avatarUrl,
    goal: req.goal,
    status: 'active' as const,
  }));
  // Fetch upcoming sessions
  const upcomingSessions = await retryAsync(
    () => getUpcomingMentorSessions(menteeProfileId, 'MENTEE'),
    { attempts: 2, baseDelayMs: 150 }
  );
  // Fetch recent activities
  const recentActivities = await retryAsync(
    () => getMenteeRecentActivities(menteeProfileId, 6),
    { attempts: 2, baseDelayMs: 150 }
  );

  return {
    mentee: mentee,
    metrics,
    pendingRequests: pendingRequests.map(req => ({
      id: req.id,
      mentorId: req.mentor?.user?.id,
      studentName: req.mentor?.user?.firstName
        ? `${req.mentor.user.firstName} ${req.mentor.user.lastName}`
        : 'Unknown',
      studentAvatarUrl: req.mentor?.user?.avatarUrl || null,
      majorAndYear: req.mentor?.graduationYear ? `${req.mentor.major} '${(req.mentor.graduationYear % 100).toString().padStart(2, '0')}` : '',
      message: req.message,
      goal: req.goal,
      status: req.status,
    })),
    requestHistory: requestHistory.map(req => ({
      id: req.id,
      mentorId: req.mentor?.user?.id,
      studentName: req.mentor?.user?.firstName
        ? `${req.mentor.user.firstName} ${req.mentor.user.lastName}`
        : 'Unknown',
      studentAvatarUrl: req.mentor?.user?.avatarUrl || null,
      majorAndYear: req.mentor?.graduationYear ? `${req.mentor.major} '${(req.mentor.graduationYear % 100).toString().padStart(2, '0')}` : '',
      message: req.message,
      goal: req.goal,
      status: req.status,
    })),
    activeMentors,
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
export async function getMenteeRecentActivities(menteeProfileId: string, limit = 10) {
  const activities: Array<{
    id: string | number;
    event: string;
    timestamp: string;
    type: 'request' | 'message' | 'session' | 'feedback';
  }> = [];

  // Recent requests
  const recentRequests = await prisma.mentorshipRequest.findMany({
    where: { menteeId: menteeProfileId },
    select: {
      id: true,
      createdAt: true,
      status: true,
      mentor: {
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
    const mentorName = req.mentor?.user?.firstName || 'Unknown';
    activities.push({
      id: `req-${req.id}`,
      event: `${mentorName} sent a request`,
      timestamp: getTimeAgo(req.createdAt),
      type: 'request',
    });
  });

  // Recent messages
  const recentMessages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: (await prisma.menteeProfile.findUnique({
          where: { id: menteeProfileId },
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
      menteeId: menteeProfileId,
      status: 'COMPLETED',
    },
    select: {
      id: true,
      createdAt: true,
      mentor: {
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
      event: `Completed session with ${session.mentor?.user?.firstName || 'mentor'}`,
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
