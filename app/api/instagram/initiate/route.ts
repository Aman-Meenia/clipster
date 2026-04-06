import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { initiateVerificationSchema } from "@/types/instagram";
import instagramService from "@/service/instagram/instagram.service";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/instagram/initiate
 * Start Instagram account verification process.
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    // Rate limit: 10 requests per 5 minutes per user
    const rateLimitKey = `instagram-initiate:${userId}`;
    const rateLimitResult = rateLimit(rateLimitKey, 10, 5 * 60 * 1000);

    if (!rateLimitResult.success) {
      return errorResponse(
        `Too many requests. Please try again in ${Math.ceil(rateLimitResult.resetInMs / 1000)} seconds.`,
        429
      );
    }

    const body = await request.json();
    const parsed = initiateVerificationSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return errorResponse("Validation failed", 422, errors as Record<string, string[]>);
    }

    const result = await instagramService.initiateVerification(
      userId,
      parsed.data.input
    );

    return successResponse(result, 201);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("Instagram initiate error:", error);
    // Return more details in development
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return errorResponse(message, 500);
  }
}
