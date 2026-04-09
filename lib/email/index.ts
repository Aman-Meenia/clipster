import config from "@/config/config";
import { emailService } from "./email.service";
import { verificationEmailTemplate, resetPasswordEmailTemplate, welcomeEmailTemplate } from "./templates";

/**
 * Send email verification link
 */
export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const verifyUrl = \`\${config.APP_URL}/verify-email?token=\${token}\`;
  
  await emailService.send({
    to,
    subject: "Verify your email — Reelpey",
    html: verificationEmailTemplate(verifyUrl),
  });
}

/**
 * Send password reset link
 */
export async function sendResetPasswordEmail(to: string, token: string): Promise<void> {
  const resetUrl = \`\${config.APP_URL}/reset-password?token=\${token}\`;
  
  await emailService.send({
    to,
    subject: "Reset your password — Reelpey",
    html: resetPasswordEmailTemplate(resetUrl),
  });
}

/**
 * Send welcome email (optional)
 */
export async function sendWelcomeEmail(to: string, username: string): Promise<void> {
  await emailService.send({
    to,
    subject: "Welcome to Reelpey! \ud83c\udf89",
    html: welcomeEmailTemplate(username),
  });
}
