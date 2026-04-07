import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import prisma from "@/lib/prisma";
import { createCampaignRequestSchema } from "@/types/campaign-request";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * POST /api/campaign-requests
 * Public endpoint — anyone can submit a campaign request.
 *
 * Body (JSON):
 *  - fullName      (string, required)
 *  - email         (string, required)
 *  - phoneNumber   (string, optional)
 *  - title         (string, required)
 *  - description   (string, required)
 *  - campaignGoals (string, required)
 */
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Request body is required", 400);
    }

    // ── Validate ───────────────────────────────────────────────────────────
    const validated = createCampaignRequestSchema.parse(body);

    // Normalise optional empty phone to null
    const phoneNumber = validated.phoneNumber?.trim() || null;

    // ── Create ─────────────────────────────────────────────────────────────
    const campaignRequest = await prisma.campaignRequest.create({
      data: {
        fullName: validated.fullName.trim(),
        email: validated.email.trim().toLowerCase(),
        phoneNumber,
        title: validated.title.trim(),
        campaignGoals: validated.campaignGoals.trim(),
      },
    });

    return successResponse(campaignRequest, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return errorResponse(validationError.message, 422);
    }
    console.error("Create campaign request error:", error);
    return errorResponse("Internal server error", 500);
  }
}
