import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import instagramService from "@/service/instagram/instagram.service";

/**
 * DELETE /api/instagram/accounts/[id]
 * Delete a connected Instagram account.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await params;

    if (!id) {
      return errorResponse("Account ID is required", 400);
    }

    await instagramService.deleteAccount(userId, id);

    return successResponse({ message: "Account removed successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("Instagram delete error:", error);
    return errorResponse("An unexpected error occurred", 500);
  }
}
