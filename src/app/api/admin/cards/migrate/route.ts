import { NextRequest, NextResponse } from "next/server";
import { validTokens } from "../../auth/route";
import { getMasterCardDeck, saveMasterCardDeck } from "@/lib/admin-kv";
import cardsData from "@/data/cards.json";
import { CardDeck } from "@/lib/types";

// Auth check helper
function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return validTokens.has(token);
}

// POST - Migrate cards from JSON to KV
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if force flag is set
    const { force } = await request.json().catch(() => ({ force: false }));

    // Check if master deck already exists
    const existing = await getMasterCardDeck();
    if (existing && !force) {
      return NextResponse.json(
        {
          error: "Master deck already exists. Use force: true to overwrite.",
          existingCounts: {
            trends: existing.trends.length,
            problems: existing.problems.length,
            tech: existing.tech.length,
            assets: existing.assets.length,
            markets: existing.markets.length,
          },
        },
        { status: 400 }
      );
    }

    // Save cards from JSON to KV
    await saveMasterCardDeck(cardsData as CardDeck);

    return NextResponse.json({
      success: true,
      message: "Migration complete",
      counts: {
        trends: cardsData.trends.length,
        problems: cardsData.problems.length,
        tech: cardsData.tech.length,
        assets: cardsData.assets.length,
        markets: cardsData.markets.length,
      },
    });
  } catch (error) {
    console.error("Error migrating cards:", error);
    return NextResponse.json(
      { error: "Failed to migrate cards" },
      { status: 500 }
    );
  }
}
