/**
 * Email System Integration Tests
 * 
 * Tests for email notifications sent during mentorship cycle events
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { emailService } from '@/app/_services/email/emailService';
import { emailTemplates } from '@/app/_services/email/templates';
import {
  sendCycleInvitationEmail,
  sendCycleEndedEmail,
  sendStudentPairedEmail,
} from '@/app/_services/email/emailHelpers';
import {
  generateMagicToken,
  verifyMagicToken,
  generateAvailabilityLink,
} from '@/app/_utils/tokens';

describe('Email Service', () => {
  beforeEach(() => {
    emailService.setProvider('console');
  });

  describe('Email Templates', () => {
    it('should render cycle invitation email with variables', () => {
      const rendered = emailTemplates.render(emailTemplates.cycleInvitation, {
        mentorName: 'Dr. Kwame Asante',
        cycleName: 'Spring 2026 Cohort',
        startDate: '2026-03-01',
        endDate: '2026-08-31',
        durationMonths: 6,
        availabilityLink: 'https://asheimentor.dev/mentor/cycles/123/availability?token=abc',
        unsubscribeLink: 'https://asheimentor.dev/unsubscribe',
      });

      expect(rendered.subject).toContain('Spring 2026 Cohort');
      expect(rendered.html).toContain('Dr. Kwame Asante');
      expect(rendered.html).toContain('6 months');
      expect(rendered.html).toContain('Toggle Availability');
      expect(rendered.text).toBeDefined();
    });

    it('should render cycle ended email with stats', () => {
      const rendered = emailTemplates.render(emailTemplates.cycleEnded, {
        mentorName: 'Dr. Kwame Asante',
        cycleName: 'Spring 2026 Cohort',
        menteesCount: 3,
        sessionsCount: 12,
        averageRating: 4.8,
        dashboardLink: 'https://asheimentor.dev/mentor/history',
      });

      expect(rendered.subject).toContain('Spring 2026 Cohort');
      expect(rendered.html).toContain('3');
      expect(rendered.html).toContain('12');
      expect(rendered.html).toContain('4.8');
    });

    it('should render student paired email with mentor info', () => {
      const rendered = emailTemplates.render(emailTemplates.studentPaired, {
        studentName: 'Ama Asante',
        mentorName: 'Dr. Kwame Asante',
        mentorTitle: 'Senior Software Engineer',
        mentorBio: 'Expert in web development',
        mentorRating: 4.8,
        dashboardLink: 'https://asheimentor.dev/student/mentorship/123',
        unsubscribeLink: 'https://asheimentor.dev/unsubscribe',
      });

      expect(rendered.subject).toContain('Dr. Kwame Asante');
      expect(rendered.html).toContain('Ama Asante');
      expect(rendered.html).toContain('Senior Software Engineer');
    });
  });

  describe('Magic Token Generation', () => {
    it('should generate and verify a valid token', async () => {
      const token = await generateMagicToken(
        'user_123',
        'user@ashesi.edu.gh',
        'toggle-availability',
        'cycle_001'
      );

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const result = await verifyMagicToken(token);
      expect(result.valid).toBe(true);
      expect(result.payload?.userId).toBe('user_123');
      expect(result.payload?.email).toBe('user@ashesi.edu.gh');
      expect(result.payload?.action).toBe('toggle-availability');
      expect(result.payload?.cycleId).toBe('cycle_001');
    });

    it('should reject an invalid token', async () => {
      const result = await verifyMagicToken('invalid.token.here');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should generate a one-click availability link', async () => {
      const link = await generateAvailabilityLink(
        'user_123',
        'user@ashesi.edu.gh',
        'cycle_001',
        'http://localhost:3000'
      );

      expect(link).toContain('/mentor/cycles/cycle_001/availability');
      expect(link).toContain('token=');
      expect(link).toContain('localhost:3000');
    });
  });

  describe('Email Helpers', () => {
    it('should send cycle invitation email (console output)', async () => {
      const result = await sendCycleInvitationEmail(
        {
          userId: 'mentor_001',
          email: 'mentor@ashesi.edu.gh',
          name: 'Dr. Kwame Asante',
        },
        {
          id: 'cycle_001',
          name: 'Spring 2026 Cohort',
          startDate: '2026-03-01',
          endDate: '2026-08-31',
          durationMonths: 6,
        }
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send cycle ended email (console output)', async () => {
      const result = await sendCycleEndedEmail(
        {
          userId: 'mentor_001',
          email: 'mentor@ashesi.edu.gh',
          name: 'Dr. Kwame Asante',
        },
        { name: 'Spring 2026 Cohort' },
        {
          menteesCount: 3,
          sessionsCount: 12,
          averageRating: 4.8,
        }
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send student paired email (console output)', async () => {
      const result = await sendStudentPairedEmail(
        {
          userId: 'student_001',
          email: 'student@ashesi.edu.gh',
          name: 'Ama Asante',
        },
        {
          userId: 'mentor_001',
          email: 'mentor@ashesi.edu.gh',
          name: 'Dr. Kwame Asante',
          title: 'Senior Software Engineer',
          bio: 'Expert mentor',
          rating: 4.8,
        },
        'request_123'
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });

  describe('Email Service Provider', () => {
    it('should use console provider by default', () => {
      expect(emailService.getProvider()).toBe('console');
    });

    it('should allow switching providers', () => {
      emailService.setProvider('resend');
      expect(emailService.getProvider()).toBe('resend');

      emailService.setProvider('console');
      expect(emailService.getProvider()).toBe('console');
    });

    it('should send email with console provider', async () => {
      const result = await emailService.send({
        to: 'test@ashesi.edu.gh',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
        text: 'Test',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });
});

/**
 * Manual Testing Guide
 * 
 * To test email functionality locally:
 * 
 * 1. Create a cycle via POST /api/admin/cycles
 *    - Check console for "EMAIL NOTIFICATION" output
 *    - Verify invitation email template is rendered
 * 
 * 2. Accept a mentorship request via POST /api/mentor/requests
 *    - Check console for student paired email
 *    - Verify student receives confirmation
 * 
 * 3. End a cycle via POST /api/cycles/end
 *    - Check console for cycle ended emails
 *    - Verify mentors receive notifications with stats
 * 
 * 4. Click a one-click link in console output
 *    - Token should validate at /api/auth/validate-token
 *    - UI should show availability toggle form
 *    - Selecting yes/no should update availability
 * 
 * Production: Swap 'console' provider to 'resend' or 'sendgrid'
 * and set environment variables (RESEND_API_KEY, SENDGRID_API_KEY)
 */
