/**
 * Email Helper Functions
 * 
 * Convenience functions for sending common emails in the application.
 * These combine the email service and templates.
 */

import { emailService } from './emailService';
import { emailTemplates } from './templates';
import {
  generateAvailabilityLink,
  generateConfirmMatchLink,
  generateRateMentorLink,
} from '@/app/_utils/tokens';

interface EmailContext {
  userId: string;
  email: string;
  name: string;
}

/**
 * Send cycle invitation email to alumni
 */
export async function sendCycleInvitationEmail(
  mentor: EmailContext,
  cycle: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    durationMonths: number;
  }
) {
  const availabilityLink = await generateAvailabilityLink(
    mentor.userId,
    mentor.email,
    cycle.id
  );

  const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(mentor.email)}`;

  const rendered = emailTemplates.render(emailTemplates.cycleInvitation, {
    mentorName: mentor.name,
    cycleName: cycle.name,
    startDate: new Date(cycle.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    endDate: new Date(cycle.endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    durationMonths: cycle.durationMonths,
    availabilityLink,
    unsubscribeLink,
  });

  return emailService.send({
    to: mentor.email,
    from: process.env.EMAIL_FROM || 'noreply@asheimentor.dev',
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

/**
 * Send cycle ended email to mentors
 */
export async function sendCycleEndedEmail(
  mentor: EmailContext,
  cycle: { name: string },
  stats: {
    menteesCount: number;
    sessionsCount: number;
    averageRating: number;
  }
) {
  const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL}/mentor/history?cycleId=${encodeURIComponent(cycle.name)}`;

  const rendered = emailTemplates.render(emailTemplates.cycleEnded, {
    mentorName: mentor.name,
    cycleName: cycle.name,
    menteesCount: stats.menteesCount,
    sessionsCount: stats.sessionsCount,
    averageRating: stats.averageRating.toFixed(1),
    dashboardLink,
  });

  return emailService.send({
    to: mentor.email,
    from: process.env.EMAIL_FROM || 'noreply@asheimentor.dev',
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

/**
 * Send student paired with mentor email
 */
export async function sendStudentPairedEmail(
  student: EmailContext,
  mentor: {
    userId: string;
    email: string;
    name: string;
    title: string;
    bio: string;
    rating: number;
  },
  requestId: string
) {
  const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL}/student/mentorship/${requestId}`;
  const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(student.email)}`;

  const rendered = emailTemplates.render(emailTemplates.studentPaired, {
    studentName: student.name,
    mentorName: mentor.name,
    mentorTitle: mentor.title,
    mentorBio: mentor.bio,
    mentorRating: mentor.rating.toFixed(1),
    dashboardLink,
    unsubscribeLink,
  });

  return emailService.send({
    to: student.email,
    from: process.env.EMAIL_FROM || 'noreply@asheimentor.dev',
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

/**
 * Send bulk emails (e.g., to all alumni for cycle invitation)
 */
export async function sendBulkCycleInvitations(
  mentors: Array<{
    id: string;
    email: string;
    name: string;
  }>,
  cycle: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    durationMonths: number;
  }
) {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>,
  };

  // Send emails sequentially to avoid rate limiting
  for (const mentor of mentors) {
    try {
      const result = await sendCycleInvitationEmail(
        { userId: mentor.id, email: mentor.email, name: mentor.name },
        cycle
      );

      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({
          email: mentor.email,
          error: result.error || 'Unknown error',
        });
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: mentor.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Small delay between emails to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Send bulk emails to all mentors when cycle ends
 */
export async function sendBulkCycleEndedEmails(
  mentors: Array<{
    id: string;
    email: string;
    name: string;
  }>,
  cycle: { name: string },
  stats: Record<
    string,
    {
      menteesCount: number;
      sessionsCount: number;
      averageRating: number;
    }
  >
) {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>,
  };

  for (const mentor of mentors) {
    try {
      const mentorStats = stats[mentor.id] || {
        menteesCount: 0,
        sessionsCount: 0,
        averageRating: 0,
      };

      const result = await sendCycleEndedEmail(
        { userId: mentor.id, email: mentor.email, name: mentor.name },
        cycle,
        mentorStats
      );

      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({
          email: mentor.email,
          error: result.error || 'Unknown error',
        });
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: mentor.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}
