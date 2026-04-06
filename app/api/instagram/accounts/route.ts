import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import instagramService from "@/service/instagram/instagram.service";

/**
 * GET /api/instagram/accounts
 * Get all connected Instagram accounts for the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const accounts = await instagramService.getAccounts(userId);
    return successResponse({ accounts });
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("Instagram accounts error:", error);
    return errorResponse("An unexpected error occurred", 500);
  }
}
