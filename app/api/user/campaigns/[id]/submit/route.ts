import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { AppError, NotFoundError } from "@/lib/errors";

const submitSchema = z.object({
  videoLink: z
    .string()
    .url("Please provide a valid video URL")
    .min(1, "Video link is required"),
});

/**
 * POST /api/user/campaigns/[id]/submit
 * Submit a video link for a campaign. Authenticated users only.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await params;

    // Verify campaign exists
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }

    // Parse body
    const body = await request.json();
    const { videoLink } = submitSchema.parse(body);

    // Check submission limit per user
    const existingCount = await prisma.campaignSubmission.count({
      where: { campaignId: id, userId },
    });

    if (existingCount >= campaign.maxSubmissionsPerAccount) {
      return errorResponse(
        `You have reached the maximum of ${campaign.maxSubmissionsPerAccount} submissions for this campaign.`,
        422,
      );
    }

    // Create submission
    const submission = await prisma.campaignSubmission.create({
      data: {
        userId,
        campaignId: id,
        videoLink,
      },
    });

    return successResponse(submission, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { fromZodError } = await import("zod-validation-error");
      return errorResponse(fromZodError(error).message, 422);
    }
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("Submit campaign error:", error);
    return errorResponse("Internal server error", 500);
  }
}
