import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { AppError } from "@/lib/errors";

/**
 * GET /api/admin/users
 * List all users with pagination. ADMIN only.
 *
 * Query params:
 *  - page  (number, default 1)
 *  - limit (number, default 20, max 100)
 *  - search (string, optional — searches username and email)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));
    const search = searchParams.get("search") ?? "";
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          email: true,
          phoneNumber: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { campaignSubmissions: true, connectedAccounts: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse({ users, total, page, limit });
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error("List users error:", error);
    return errorResponse("Internal server error", 500);
  }
}
