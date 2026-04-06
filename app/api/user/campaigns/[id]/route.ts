import { NextRequest } from "next/server";
import campaignService from "@/service/campaign/campaign.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { AppError } from "@/lib/errors";

/**
 * GET /api/user/campaigns/[id]
 * Get full campaign detail for authenticated users (creators).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(request);
    const { id } = await params;
    const campaign = await campaignService.getById(id);
    return successResponse(campaign);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("Get user campaign error:", error);
    return errorResponse("Internal server error", 500);
  }
}
