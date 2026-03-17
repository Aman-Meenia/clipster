import { NextResponse } from "next/server";

/**
 * Standardized API response helpers.
 * Every route should use these to ensure consistent JSON structure.
 */

interface SuccessPayload<T> {
  success: true;
  data: T;
}

interface ErrorPayload {
  success: false;
  error: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

export function successResponse<T>(data: T, status: number = 200) {
  const body: SuccessPayload<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string,
  status: number = 500,
  errors?: Record<string, string[]>
) {
  const body: ErrorPayload = {
    success: false,
    error: { message, ...(errors && { errors }) },
  };
  return NextResponse.json(body, { status });
}
