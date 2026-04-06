import { NextRequest } from "next/server";
import campaignService from "@/service/campaign/campaign.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { AppError } from "@/lib/errors";

/**
 * GET /api/user/campaigns
 * List all campaigns for authenticated users (creators).
 * Supports cursor-based pagination for infinite scroll.
 *
 * Query params:
 *  - cursor (string, optional) — ID of the last campaign from the previous page
 *  - limit  (number, default 12, max 50)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const { searchParams } = request.nextUrl;
    const cursor = searchParams.get("cursor") ?? undefined;
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") ?? "12")),
    );

    const result = await campaignService.listForUsers(cursor, limit);

    return successResponse(result);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("List user campaigns error:", error);
    return errorResponse("Internal server error", 500);
  }
}
