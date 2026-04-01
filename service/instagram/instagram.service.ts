import crypto from "crypto";
import prisma from "@/lib/prisma";
import { AppError, ConflictError } from "@/lib/errors";
import { getTokenExpiry } from "@/lib/token";
import type {
  ConnectedAccountResponse,
  InitiateVerificationResponse,
  VerifyAccountResponse,
} from "@/types/instagram";

/**
 * Instagram account verification service.
 * Handles verification code generation, bio scraping, and account linking.
 */

class InstagramService {
  private readonly CODE_PREFIX = "reelpe";
  private readonly CODE_EXPIRY_MINUTES = 30;

  /**
   * Generate a unique verification code in format: reelpe-XXXXX
   */
  generateVerificationCode(): string {
    const randomDigits = crypto.randomInt(10000, 99999);
    return `${this.CODE_PREFIX}-${randomDigits}`;
  }

  /**
   * Extract Instagram username from URL or return raw username.
   * Handles: instagram.com/username, www.instagram.com/username/, @username
   */
  extractUsername(input: string): string {
    // Remove @ prefix if present
    if (input.startsWith("@")) {
      return input.slice(1).toLowerCase();
    }

    // Check if it's a URL
    try {
      // Add protocol if missing for URL parsing
      let urlString = input;
      if (!urlString.startsWith("http")) {
        urlString = `https://${urlString}`;
      }

      const url = new URL(urlString);

      // Check if it's an Instagram URL
      if (
        url.hostname === "instagram.com" ||
        url.hostname === "www.instagram.com"
      ) {
        // Extract username from path (e.g., /username or /username/)
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length > 0) {
          // Filter out Instagram reserved paths
          const reserved = ["p", "reel", "reels", "stories", "explore", "accounts"];
          if (!reserved.includes(pathParts[0].toLowerCase())) {
            return pathParts[0].toLowerCase();
          }
        }
      }
    } catch {
      // Not a valid URL, treat as username
    }

    // Assume it's a raw username - clean and validate
    const cleaned = input.trim().toLowerCase();

    // Basic validation: alphanumeric, dots, underscores, max 30 chars
    const usernameRegex = /^[a-z0-9._]{1,30}$/;
    if (!usernameRegex.test(cleaned)) {
      throw new AppError("Invalid Instagram username format", 400);
    }

    return cleaned;
  }

  /**
   * Build full Instagram profile URL from username.
   */
  buildAccountUrl(username: string): string {
    return `https://www.instagram.com/${username}/`;
  }

  /**
   * Fetch Instagram bio by scraping the profile page.
   * Returns null if unable to fetch or parse.
   */
  async fetchInstagramBio(username: string): Promise<string | null> {
    try {
      const url = this.buildAccountUrl(username);

      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Cache-Control": "no-cache",
        },
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        console.error(`Instagram fetch failed: ${response.status}`);
        return null;
      }

      const html = await response.text();

      // Try multiple extraction methods

      // Method 1: Look for meta description tag
      const metaMatch = html.match(
        /<meta\s+(?:name="description"|property="og:description")\s+content="([^"]+)"/i
      );
      if (metaMatch) {
        return metaMatch[1];
      }

      // Method 2: Look for JSON-LD data
      const jsonLdMatch = html.match(
        /<script\s+type="application\/ld\+json"[^>]*>([^<]+)<\/script>/i
      );
      if (jsonLdMatch) {
        try {
          const data = JSON.parse(jsonLdMatch[1]);
          if (data.description) {
            return data.description;
          }
        } catch {
          // Ignore JSON parse errors
        }
      }

      // Method 3: Look for shared data in script
      const sharedDataMatch = html.match(
        /window\._sharedData\s*=\s*(\{.+?\});<\/script>/
      );
      if (sharedDataMatch) {
        try {
          const data = JSON.parse(sharedDataMatch[1]);
          const bio =
            data?.entry_data?.ProfilePage?.[0]?.graphql?.user?.biography;
          if (bio) {
            return bio;
          }
        } catch {
          // Ignore JSON parse errors
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching Instagram profile:", error);
      return null;
    }
  }

  /**
   * Check if bio contains the verification code.
   */
  verifyBioContainsCode(bio: string, code: string): boolean {
    return bio.toLowerCase().includes(code.toLowerCase());
  }

  /**
   * Initiate verification for an Instagram account.
   */
  async initiateVerification(
    userId: string,
    input: string
  ): Promise<InitiateVerificationResponse> {
    const username = this.extractUsername(input);
    const accountUrl = this.buildAccountUrl(username);

    // Check if account already exists for this user
    const existing = await prisma.connectedAccount.findFirst({
      where: {
        userId,
        username,
      },
    });

    if (existing?.isVerified) {
      throw new ConflictError("This Instagram account is already connected");
    }

    const verificationCode = this.generateVerificationCode();
    const codeExpiresAt = getTokenExpiry(this.CODE_EXPIRY_MINUTES);

    let account;

    if (existing) {
      // Update existing pending verification
      account = await prisma.connectedAccount.update({
        where: { id: existing.id },
        data: {
          verificationCode,
          codeExpiresAt,
          isVerified: false,
          verifiedAt: null,
        },
      });
    } else {
      // Create new pending verification
      account = await prisma.connectedAccount.create({
        data: {
          userId,
          username,
          accountUrl,
          verificationCode,
          codeExpiresAt,
          isVerified: false,
        },
      });
    }

    return {
      accountId: account.id,
      verificationCode,
      username,
      accountUrl,
      instructions: `Add "${verificationCode}" to your Instagram bio, then click Verify. Code expires in ${this.CODE_EXPIRY_MINUTES} minutes.`,
    };
  }

  /**
   * Verify an Instagram account by checking bio for verification code.
   */
  async verifyAccount(
    userId: string,
    accountId: string
  ): Promise<VerifyAccountResponse> {
    const account = await prisma.connectedAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new AppError("Account not found", 404);
    }

    if (account.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    if (account.isVerified) {
      return {
        success: true,
        message: "Account is already verified",
        account: this.formatAccount(account),
      };
    }

    // Check if code has expired
    if (new Date() > account.codeExpiresAt) {
      throw new AppError(
        "Verification code has expired. Please generate a new one.",
        400
      );
    }

    // Fetch bio and check for code
    const bio = await this.fetchInstagramBio(account.username);

    if (!bio) {
      return {
        success: false,
        message:
          "Unable to fetch Instagram profile. The profile may be private or temporarily unavailable. Please ensure your profile is public and try again.",
      };
    }

    if (!this.verifyBioContainsCode(bio, account.verificationCode)) {
      return {
        success: false,
        message: `Verification code "${account.verificationCode}" not found in bio. Please add it and try again.`,
      };
    }

    // Success - update account as verified
    const verified = await prisma.connectedAccount.update({
      where: { id: accountId },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Instagram account verified successfully! You can now remove the code from your bio.",
      account: this.formatAccount(verified),
    };
  }

  /**
   * Get all connected accounts for a user.
   */
  async getAccounts(userId: string): Promise<ConnectedAccountResponse[]> {
    const accounts = await prisma.connectedAccount.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return accounts.map(this.formatAccount);
  }

  /**
   * Delete a connected account.
   */
  async deleteAccount(userId: string, accountId: string): Promise<void> {
    const account = await prisma.connectedAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new AppError("Account not found", 404);
    }

    if (account.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    await prisma.connectedAccount.delete({
      where: { id: accountId },
    });
  }

  /**
   * Format account for API response.
   */
  private formatAccount(account: {
    id: string;
    username: string;
    accountUrl: string;
    isVerified: boolean;
    verifiedAt: Date | null;
    createdAt: Date;
  }): ConnectedAccountResponse {
    return {
      id: account.id,
      username: account.username,
      accountUrl: account.accountUrl,
      isVerified: account.isVerified,
      verifiedAt: account.verifiedAt?.toISOString() ?? null,
      createdAt: account.createdAt.toISOString(),
    };
  }
}

const instagramService = new InstagramService();
export default instagramService;
