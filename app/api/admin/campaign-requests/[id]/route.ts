import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import prisma from "@/lib/prisma";
import { updateCampaignRequestStatusSchema } from "@/types/campaign-request";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { AppError, NotFoundError } from "@/lib/errors";

/**
 * PATCH /api/admin/campaign-requests/[id]
 * Update the status of a campaign request. ADMIN only.
 *
 * Body (JSON):
 *  - status     ("APPROVED" | "REJECTED")
 *  - adminNotes (string, optional)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();

    // ── Validate ───────────────────────────────────────────────────────────
    const validated = updateCampaignRequestStatusSchema.parse(body);

    // ── Check existence ────────────────────────────────────────────────────
    const existing = await prisma.campaignRequest.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Campaign request not found");
    }

    // ── Update ─────────────────────────────────────────────────────────────
    const updated = await prisma.campaignRequest.update({
      where: { id },
      data: {
        status: validated.status,
        adminNotes: validated.adminNotes?.trim() || null,
      },
    });

    return successResponse(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return errorResponse(validationError.message, 422);
    }
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("Update campaign request error:", error);
    return errorResponse("Internal server error", 500);
  }
}
