import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

// Simple in-memory token store (resets on server restart, which is fine for admin)
const validTokens = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate a session token
    const token = nanoid(32);
    validTokens.add(token);

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

// Helper to validate tokens (exported for use in other admin routes)
export function isValidToken(token: string | null): boolean {
  if (!token) return false;
  return validTokens.has(token);
}

// Export the token set for other routes
export { validTokens };
