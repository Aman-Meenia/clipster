import nodemailer from "nodemailer";
import config from "@/config/config";

/**
 * Nodemailer transporter for sending emails.
 * Uses Ethereal SMTP in development for sandbox testing.
 * All sent emails can be previewed via the Ethereal URL logged to console.
 */

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: parseInt(config.SMTP_PORT, 10),
  secure: false,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

/**
 * Send email verification link to the user.
 */
export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const verifyUrl = `${config.APP_URL}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#06050e;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:520px;margin:40px auto;padding:0 20px;">
        <!-- Header -->
        <div style="text-align:center;padding:32px 0 24px;">
          <div style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:10px 14px;border-radius:12px;">
            <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:1px;">REELPEY</span>
          </div>
        </div>

        <!-- Card -->
        <div style="background:rgba(15,13,30,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px 32px;">
          <h1 style="margin:0 0 8px;color:#e8e6f0;font-size:24px;font-weight:700;text-align:center;">
            Verify your email
          </h1>
          <p style="margin:0 0 32px;color:rgba(255,255,255,0.5);font-size:14px;text-align:center;line-height:1.6;">
            Click the button below to confirm your email address and activate your account.
          </p>

          <div style="text-align:center;margin-bottom:32px;">
            <a href="${verifyUrl}"
               style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:12px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
              Verify Email Address
            </a>
          </div>

          <p style="margin:0 0 16px;color:rgba(255,255,255,0.35);font-size:12px;text-align:center;line-height:1.5;">
            This link expires in <strong style="color:rgba(255,255,255,0.5);">24 hours</strong>.
            If you didn't create an account, you can safely ignore this email.
          </p>

          <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;margin-top:16px;">
            <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;text-align:center;word-break:break-all;">
              ${verifyUrl}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <p style="margin:24px 0 0;color:rgba(255,255,255,0.2);font-size:11px;text-align:center;">
          © ${new Date().getFullYear()} Reelpey. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: '"Reelpey" <noreply@reelpey.com>',
    to,
    subject: "Verify your email — Reelpey",
    html,
  });

  // Log Ethereal preview URL in development
  console.log("📧 Verification email sent to:", to);
  console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
}

/**
 * Send password reset link to the user.
 */
export async function sendResetPasswordEmail(
  to: string,
  token: string
): Promise<void> {
  const resetUrl = `${config.APP_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#06050e;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:520px;margin:40px auto;padding:0 20px;">
        <!-- Header -->
        <div style="text-align:center;padding:32px 0 24px;">
          <div style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:10px 14px;border-radius:12px;">
            <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:1px;">REELPEY</span>
          </div>
        </div>

        <!-- Card -->
        <div style="background:rgba(15,13,30,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px 32px;">
          <h1 style="margin:0 0 8px;color:#e8e6f0;font-size:24px;font-weight:700;text-align:center;">
            Reset your password
          </h1>
          <p style="margin:0 0 32px;color:rgba(255,255,255,0.5);font-size:14px;text-align:center;line-height:1.6;">
            We received a request to reset your password. Click the button below to choose a new one.
          </p>

          <div style="text-align:center;margin-bottom:32px;">
            <a href="${resetUrl}"
               style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:12px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
              Reset Password
            </a>
          </div>

          <p style="margin:0 0 16px;color:rgba(255,255,255,0.35);font-size:12px;text-align:center;line-height:1.5;">
            This link expires in <strong style="color:rgba(255,255,255,0.5);">1 hour</strong>.
            If you didn't request a password reset, you can safely ignore this email.
          </p>

          <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;margin-top:16px;">
            <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;text-align:center;word-break:break-all;">
              ${resetUrl}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <p style="margin:24px 0 0;color:rgba(255,255,255,0.2);font-size:11px;text-align:center;">
          © ${new Date().getFullYear()} Reelpey. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: '"Reelpey" <noreply@reelpey.com>',
    to,
    subject: "Reset your password — Reelpey",
    html,
  });

  console.log("📧 Reset password email sent to:", to);
  console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
}
