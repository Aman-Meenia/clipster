import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { getImageUrls } from "@/lib/storage";
import { AppError } from "@/lib/errors";

/**
 * GET /api/admin/users/[id]/submissions
 * List all submissions made by a specific user. ADMIN only.
 *
 * Query params:
 *  - page  (number, default 1)
 *  - limit (number, default 20, max 100)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));
    const skip = (page - 1) * limit;

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return errorResponse("User not found", 404);
    }

    const [submissions, total] = await prisma.$transaction([
      prisma.campaignSubmission.findMany({
        where: { userId: id },
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
            },
          },
        },
      }),
      prisma.campaignSubmission.count({ where: { userId: id } }),
    ]);

    // Resolve campaign images
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
