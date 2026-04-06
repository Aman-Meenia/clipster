import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import authRegistry from "@/service/auth/auth.registry";
import { AuthenticationError } from "@/lib/errors";
import type { JwtPayload } from "@/types/auth";

/**
 * Extract and verify JWT from request.
 * Checks Authorization header first, then falls back to cookies.
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<JwtPayload> {
  const tokenStrategy = authRegistry.getTokenStrategy();

  // Try Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      return tokenStrategy.verifyAccessToken(token);
    } catch {
      throw new AuthenticationError("Invalid or expired token");
    }
  }

  // Fall back to cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new AuthenticationError("Authentication required");
  }

  try {
    return tokenStrategy.verifyAccessToken(token);
  } catch {
    throw new AuthenticationError("Invalid or expired token");
  }
}

/**
 * Helper to get userId from request or throw.
 */
export async function requireAuth(request: NextRequest): Promise<string> {
  const user = await getAuthenticatedUser(request);
  return user.userId;
}

/**
 * Require the authenticated user to have ADMIN role.
 * Returns the full JwtPayload on success, throws ForbiddenError otherwise.
 */
export async function requireAdmin(request: NextRequest): Promise<JwtPayload> {
  const user = await getAuthenticatedUser(request);
  if (user.role !== "ADMIN") {
    const { ForbiddenError } = await import("@/lib/errors");
    throw new ForbiddenError("Only administrators can access this resource");
  }
  return user;
}
