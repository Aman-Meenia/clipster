import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { Prisma } from "@prisma/client";

/**
 * GET /api/admin/campaign-requests
 * List campaign requests with pagination, search, and status filter. ADMIN only.
 *
 * Query params:
 *  - page   (number, default 1)
 *  - limit  (number, default 15, max 100)
 *  - search (string, optional — searches name and email)
 *  - status (string, optional — PENDING | APPROVED | REJECTED)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") ?? "15"))
    );
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";
    const skip = (page - 1) * limit;

    // Build where clause
    const conditions: Prisma.CampaignRequestWhereInput[] = [];

    if (search) {
      conditions.push({
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      conditions.push({
        status: status as "PENDING" | "APPROVED" | "REJECTED",
      });
    }

    const where: Prisma.CampaignRequestWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const [requests, total] = await prisma.$transaction([
      prisma.campaignRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.campaignRequest.count({ where }),
    ]);

    return successResponse({ requests, total, page, limit });
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("List campaign requests error:", error);
    return errorResponse("Internal server error", 500);
  }
}
