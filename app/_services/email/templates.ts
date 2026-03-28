/**
 * Email Templates
 * 
 * All templates use HTML with fallback plain text.
 * Supports variable interpolation with {{variable}} syntax.
 */

interface TemplateVariables {
  [key: string]: string | number | boolean | undefined;
}

function interpolate(template: string, vars: TemplateVariables): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = vars[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

// ============================================================================
// CYCLE INVITATION - Alumni Invitation to Toggle Availability
// ============================================================================

export const cycleInvitationTemplate = {
  subject: 'You\'re invited to mentor in {{cycleName}}',
  
  html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #7F1D1D 0%, #A02E2E 100%); padding: 40px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Mentor in {{cycleName}}</h1>
        <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Join our next cohort of mentees</p>
      </div>

      <div style="padding: 40px 20px; background: #f9f9f9;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Hi {{mentorName}},</p>
        
        <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 0 0 20px;">
          We're launching a new mentorship cycle <strong>{{cycleName}}</strong> starting <strong>{{startDate}}</strong> and would love to have you participate!
        </p>

        <div style="background: #fff3cd; border-left: 4px solid #7F1D1D; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="font-size: 14px; margin: 0; color: #333;">
            <strong>📋 Cycle Details:</strong><br>
            Duration: {{cycleName}} ({{durationMonths}} months)<br>
            Start Date: {{startDate}}<br>
            End Date: {{endDate}}
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 20px 0;">
          You can mentor <strong>1-3 students</strong> during this cycle. Based on the duration, we recommend mentoring <strong>1-2 students</strong> for the best experience.
        </p>

        <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 0 0 30px;">
          Ready to make an impact? Click below to toggle your availability and let students find you:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{availabilityLink}}" style="display: inline-block; background: #7F1D1D; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; transition: background 0.3s;">
            Toggle Availability
          </a>
        </div>

        <p style="font-size: 14px; color: #777; margin: 20px 0 0; text-align: center;">
          Or copy this link:<br>
          <span style="font-size: 12px; word-break: break-all; font-family: monospace; color: #666;">{{availabilityLink}}</span>
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 14px; color: #777; margin: 0 0 10px;">
          Questions? Reply to this email or visit our help center.
        </p>
        
        <p style="font-size: 13px; color: #999; margin: 10px 0 0;">
          This is an automated message from AshesiConnect. <a href="{{unsubscribeLink}}" style="color: #7F1D1D; text-decoration: none;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `,

  text: `
Mentor in {{cycleName}}
===============================

Hi {{mentorName}},

We're launching a new mentorship cycle "{{cycleName}}" starting {{startDate}} and would love to have you participate!

Cycle Details:
- Duration: {{cycleName}} ({{durationMonths}} months)
- Start Date: {{startDate}}
- End Date: {{endDate}}

You can mentor 1-3 students during this cycle. We recommend mentoring 1-2 students for the best experience.

Ready to make an impact? Toggle your availability here:
{{availabilityLink}}

Questions? Reply to this email or visit our help center.

---
AshesiConnect
  `,
};

// ============================================================================
// CYCLE ENDED - Mentor Notification
// ============================================================================

export const cycleEndedTemplate = {
  subject: 'Your {{cycleName}} mentorship cycle has ended',
  
  html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #5F1515 0%, #7F1D1D 100%); padding: 40px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Cycle Complete</h1>
        <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Thank you for making an impact!</p>
      </div>

      <div style="padding: 40px 20px; background: #f9f9f9;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Hi {{mentorName}},</p>
        
        <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 0 0 20px;">
          The {{cycleName}} mentorship cycle has officially ended. Thank you for dedicating your time to mentoring!
        </p>

        <div style="background: #e8f5e9; border-left: 4px solid #7F1D1D; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="font-size: 14px; margin: 0; color: #333;">
            <strong>✓ Your Impact This Cycle:</strong><br>
            Mentees Supported: {{menteesCount}}<br>
            Sessions Completed: {{sessionsCount}}<br>
            Average Rating: {{averageRating}}/5
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 20px 0;">
          All active mentorships have been paused. You can view your mentorship history and student feedback at any time from your dashboard.
        </p>

        <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 0 0 20px;">
          <strong>What's next?</strong> Be on the lookout for our next mentorship cycle. We'll send you an invitation to participate again!
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{dashboardLink}}" style="display: inline-block; background: #7F1D1D; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            View Your History
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 14px; color: #777; margin: 0;">
          Thank you for being part of the AshesiConnect community!
        </p>
      </div>
    </div>
  `,

  text: `
Your {{cycleName}} Mentorship Cycle Has Ended
===============================================

Hi {{mentorName}},

The {{cycleName}} mentorship cycle has officially ended. Thank you for dedicating your time to mentoring!

Your Impact This Cycle:
- Mentees Supported: {{menteesCount}}
- Sessions Completed: {{sessionsCount}}
- Average Rating: {{averageRating}}/5

All active mentorships have been paused. You can view your mentorship history and student feedback anytime from your dashboard.

Be on the lookout for our next mentorship cycle. We'll send you an invitation to participate again!

View Your History: {{dashboardLink}}

---
Thank you for being part of the AshesiConnect community!
  `,
};

// ============================================================================
// STUDENT PAIRED - Student Paired with Mentor
// ============================================================================

export const studentPairedTemplate = {
  subject: 'Meet your mentor, {{mentorName}}! 🎉',
  
  html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #7F1D1D 0%, #A02E2E 100%); padding: 40px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">You're Matched! 🎉</h1>
        <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Meet {{mentorName}}</p>
      </div>

      <div style="padding: 40px 20px; background: #f9f9f9;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Hi {{studentName}},</p>
        
        <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 0 0 20px;">
          Great news! Your mentorship request has been accepted. <strong>{{mentorName}}</strong> is excited to mentor you!
        </p>

        <div style="background: white; border: 2px solid #7C3AED; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px;">👤</div>
            <div>
              <p style="margin: 0 0 5px; font-size: 18px; font-weight: bold;">{{mentorName}}</p>
              <p style="margin: 0 0 5px; font-size: 14px; color: #666;">{{mentorTitle}}</p>
              <p style="margin: 0; font-size: 14px; color: #7C3AED; font-weight: 600;">⭐ {{mentorRating}}/5 Rating</p>
            </div>
          </div>
          <p style="margin: 15px 0 0; font-size: 14px; line-height: 1.5; color: #555;">
            {{mentorBio}}
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 20px 0;">
          <strong>Next Steps:</strong>
        </p>

        <ol style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 20px; padding-left: 20px;">
          <li>Go to your dashboard and schedule your first session with {{mentorName}}</li>
          <li>Introduce yourself and discuss your mentorship goals</li>
          <li>Attend your first session (we recommend within the first week)</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{dashboardLink}}" style="display: inline-block; background: #7F1D1D; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Go to Dashboard
          </a>
        </div>

        <div style="background: #f0f4ff; border-left: 4px solid #7C3AED; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="font-size: 14px; margin: 0; color: #333;">
            <strong>💡 Tips for Success:</strong><br>
            • Be responsive and respectful of your mentor's time<br>
            • Come prepared to sessions with questions<br>
            • Provide feedback on how the mentorship is going
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 14px; color: #777; margin: 0 0 10px;">
          Have questions? Contact our support team or visit the help center.
        </p>
        
        <p style="font-size: 13px; color: #999; margin: 10px 0 0;">
          This is an automated message from AshesiConnect. <a href="{{unsubscribeLink}}" style="color: #7F1D1D; text-decoration: none;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `,

  text: `
You're Matched! 🎉
====================

Hi {{studentName}},

Great news! Your mentorship request has been accepted. {{mentorName}} is excited to mentor you!

Mentor Profile:
- Name: {{mentorName}}
- Title: {{mentorTitle}}
- Rating: {{mentorRating}}/5
- Bio: {{mentorBio}}

Next Steps:
1. Go to your dashboard and schedule your first session
2. Introduce yourself and discuss your mentorship goals
3. Attend your first session (we recommend within the first week)

Go to Dashboard: {{dashboardLink}}

Tips for Success:
- Be responsive and respectful of your mentor's time
- Come prepared to sessions with questions
- Provide feedback on how the mentorship is going

---
Questions? Contact our support team at support@asheimentor.dev
  `,
};

/**
 * Template factory
 */
export const emailTemplates = {
  cycleInvitation: cycleInvitationTemplate,
  cycleEnded: cycleEndedTemplate,
  studentPaired: studentPairedTemplate,

  /**
   * Render a template with variables
   */
  render(template: typeof cycleInvitationTemplate, variables: TemplateVariables) {
    return {
      subject: interpolate(template.subject, variables),
      html: interpolate(template.html, variables),
      text: interpolate(template.text || '', variables),
    };
  },
};
