/**
 * Email Service Abstraction
 * 
 * This service provides a flexible, provider-agnostic email system.
 * Easily swap implementations by changing the provider in this file.
 * 
 * Current Implementation: Console Logger (Development)
 * Easy Swaps: Resend, SendGrid, Nodemailer, etc.
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailProvider {
  private provider: 'console' | 'resend' | 'sendgrid' = 'console';

  /**
   * Send email using configured provider
   */
  async send(options: EmailOptions): Promise<EmailResponse> {
    try {
      switch (this.provider) {
        case 'console':
          return this.sendConsole(options);
        case 'resend':
          return this.sendResend(options);
        case 'sendgrid':
          return this.sendSendGrid(options);
        default:
          return this.sendConsole(options);
      }
    } catch (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error',
      };
    }
  }

  /**
   * Development: Log to console instead of sending
   */
  private sendConsole(options: EmailOptions): EmailResponse {
    const recipients = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    
    console.log('\n━━━ EMAIL NOTIFICATION ━━━');
    console.log(`To: ${recipients}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`From: ${options.from || 'noreply@asheimentor.dev'}`);
    if (options.replyTo) console.log(`Reply-To: ${options.replyTo}`);
    console.log('---');
    console.log(options.text || options.html);
    console.log('━━━━━━━━━━━━━━━━━━━━━━\n');

    return {
      success: true,
      messageId: `console-${Date.now()}`,
    };
  }

  /**
   * Production: Resend Provider
   * Install: npm install resend
   */
  private async sendResend(options: EmailOptions): Promise<EmailResponse> {
    // When ready to use Resend:
    // const { Resend } = await import('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // const response = await resend.emails.send({
    //   from: options.from || 'noreply@asheimentor.dev',
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html,
    //   replyTo: options.replyTo,
    // });
    // return { success: !response.error, messageId: response.data?.id, error: response.error?.message };

    return {
      success: false,
      error: 'Resend provider not configured. Install resend and set RESEND_API_KEY',
    };
  }

  /**
   * Production: SendGrid Provider
   * Install: npm install @sendgrid/mail
   */
  private async sendSendGrid(options: EmailOptions): Promise<EmailResponse> {
    // When ready to use SendGrid:
    // const sgMail = await import('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //   to: options.to,
    //   from: options.from || 'noreply@asheimentor.dev',
    //   subject: options.subject,
    //   html: options.html,
    //   replyTo: options.replyTo,
    // };
    // const response = await sgMail.send(msg);
    // return { success: true, messageId: response[0].headers['x-message-id'] };

    return {
      success: false,
      error: 'SendGrid provider not configured. Install @sendgrid/mail and set SENDGRID_API_KEY',
    };
  }

  /**
   * Switch email provider
   */
  setProvider(provider: 'console' | 'resend' | 'sendgrid') {
    this.provider = provider;
  }

  /**
   * Get current provider
   */
  getProvider() {
    return this.provider;
  }
}

export const emailService = new EmailProvider();
