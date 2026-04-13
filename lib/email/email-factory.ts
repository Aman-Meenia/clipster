import config from "@/config/config";
import type { IEmailService } from "./email-service.interface";
import { MailtrapEmailService } from "./mailtrap.service";

/**
 * Email service factory — centralised provider selector.
 *
 * Reads `EMAIL_PROVIDER` from config and returns the corresponding
 * IEmailService singleton.  Adding a new provider is a two-step process:
 *   1. Create a class that implements IEmailService.
 *   2. Add a case to the switch below.
 *
 * Future providers: "ses" | "sendgrid" | "resend"
 */

let instance: IEmailService | null = null;

export function getEmailService(): IEmailService {
  if (instance) return instance;

  const provider = config.EMAIL_PROVIDER;

  switch (provider) {
    case "mailtrap":
      instance = new MailtrapEmailService();
      break;
    default:
      console.warn(
        `Unknown EMAIL_PROVIDER "${provider}", falling back to Mailtrap.`,
      );
      instance = new MailtrapEmailService();
  }

  return instance;
}
