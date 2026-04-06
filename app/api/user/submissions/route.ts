import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { getImageUrls } from "@/lib/storage";
import { AppError } from "@/lib/errors";

/**
 * GET /api/user/submissions
 * List all submissions made by the authenticated user.
 * Includes campaign details for each submission.
 *
 * Query params:
 *  - page  (number, default 1)
 *  - limit (number, default 20, max 50)
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "20")));
    const skip = (page - 1) * limit;

    const [submissions, total] = await prisma.$transaction([
      prisma.campaignSubmission.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
              images: true,
              supportedPlatforms: true,
              feePerCreator: true,
            },
          },
        },
      }),
      prisma.campaignSubmission.count({ where: { userId } }),
    ]);

    // Resolve image keys → full URLs for each campaign
    const resolved = submissions.map((s) => ({
      ...s,
      campaign: {
        ...s.campaign,
        images: getImageUrls(s.campaign.images),
      },
    }));

    return successResponse({ submissions: resolved, total, page, limit });
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("List user submissions error:", error);
    return errorResponse("Internal server error", 500);
  }
}
