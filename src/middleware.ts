import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if there's a token in localStorage (via cookies)
  const authToken = request.cookies.get("auth_token")?.value;

  // Set the Authorization header for the backend API requests
  if (authToken) {
    response.headers.set("Authorization", `Bearer ${authToken}`);
  }

  return response;
}

export const config = {
  matcher: [
    // Only run on API routes
    "/api/:path*",
    // And on requests to our backend
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [{ type: "header", key: "next-router-prefetch" }],
    },
  ],
};
