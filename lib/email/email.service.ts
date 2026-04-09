import config from "@/config/config";
import { IEmailProvider, EmailOptions, EmailResult } from "./email-provider.interface";
import { SandboxProvider } from "./sandbox.provider";
import { SmtpProvider } from "./smtp.provider";

/**
 * Strategy-based Email Service
 * Determines which provider to use and handles fallbacks/retries.
 */
class EmailService {
  private primaryProvider: IEmailProvider;
  private fallbackProvider: IEmailProvider;

  constructor() {
    // Initialize providers
    const sandbox = new SandboxProvider();
    const smtp = new SmtpProvider();

    // Determine strategy based on config
    if (config.EMAIL_PROVIDER === "sandbox") {
      this.primaryProvider = sandbox;
      this.fallbackProvider = sandbox; // No real fallback in sandbox mode
    } else if (config.EMAIL_PROVIDER === "smtp") {
      this.primaryProvider = smtp;
      this.fallbackProvider = sandbox; // Fallback to sandbox if production SMTP fails
    } else {
      // Auto mode: You could add conditions here to switch based on NODE_ENV 
      // or the presence of actual SMTP credentials.
      if (process.env.NODE_ENV === "production") {
        this.primaryProvider = smtp;
        this.fallbackProvider = sandbox;
      } else {
        this.primaryProvider = sandbox;
        this.fallbackProvider = sandbox;
      }
    }
  }

  /**
   * Internal method with retry and fallback logic.
   */
  private async sendWithRetryAndFallback(options: EmailOptions, retries = 1): Promise<EmailResult> {
    let lastError: unknown;

    // Try primary provider
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        const result = await this.primaryProvider.sendEmail(options);
        if (result.success) return result;
        lastError = result.error;
      } catch (e) {
        lastError = e;
      }
      
      if (attempt <= retries) {
        console.warn(\`[EmailService] Primary provider failed (Attempt \${attempt}/\${retries + 1}). Retrying in 1s...\`);
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    // Try fallback if primary failed completely
    console.error(\`[EmailService] Primary provider (\${this.primaryProvider.name}) failed completely. Attempting fallback to \${this.fallbackProvider.name}.\`);
    
    try {
      return await this.fallbackProvider.sendEmail(options);
    } catch (fallbackError) {
      console.error(\`[EmailService] Fallback provider (\${this.fallbackProvider.name}) also failed.\`, fallbackError);
      return {
        success: false,
        provider: this.fallbackProvider.name,
        error: fallbackError || lastError,
      };
    }
  }

  /**
   * Public interface to send an email. Never throws an exception.
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    return this.sendWithRetryAndFallback(options, 1);
  }
}

export const emailService = new EmailService();
