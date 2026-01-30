import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security";

interface AuthRequestBody {
  apiKey?: string;
}

// Rate limit for auth attempts (stricter than other endpoints)
const AUTH_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 5 };

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  // Rate limit auth attempts to prevent brute force
  const rateLimit = checkRateLimit(`auth:${clientIP}`, AUTH_RATE_LIMIT);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many authentication attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter ?? 60),
        },
      }
    );
  }

  try {
    const body = (await request.json()) as AuthRequestBody;
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const validApiKey = process.env.LINKS_API_KEY;
    if (!validApiKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Validate the API key
    if (apiKey !== validApiKey) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // Create response with HTTP-only cookie
    const response = NextResponse.json({ success: true });

    // Set secure HTTP-only cookie
    // The cookie contains a hash/signature rather than the raw API key
    // for additional security, but we're using the key directly here for simplicity
    response.cookies.set({
      name: "links_auth",
      value: apiKey,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // Cookie expires in 7 days
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

export function DELETE() {
  // Logout - clear the auth cookie
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "links_auth",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
