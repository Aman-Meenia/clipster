import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";

export async function POST() {
  const response = successResponse({ message: "Logged out successfully" }, 200);
  
  // Clear the accessToken cookie
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Immediately expire
    path: "/",
  });

  return response;
}
