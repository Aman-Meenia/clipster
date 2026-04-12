/**
 * Email service interface — Strategy pattern.
 * All email providers (Mailtrap, SES, SendGrid, Resend) implement this.
 */
export interface IEmailService {
  /**
   * Send an email.
   * @param to - Recipient email address
   * @param subject - Email subject line
   * @param html - HTML body content
   */
  sendEmail(to: string, subject: string, html: string): Promise<void>;
}
