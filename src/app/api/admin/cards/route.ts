import { NextRequest, NextResponse } from "next/server";
import { validTokens } from "../auth/route";
import {
  getMasterCardDeck,
  addCardToDeck,
} from "@/lib/admin-kv";
import { CardType } from "@/lib/types";

// Auth check helper
function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return validTokens.has(token);
}

// GET - Fetch all cards
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cards = await getMasterCardDeck();
    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}

// POST - Create new card
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { card, cardType } = await request.json();

    if (!card || !cardType) {
      return NextResponse.json(
        { error: "Card and cardType are required" },
        { status: 400 }
      );
    }

    // Validate card type
    const validTypes: CardType[] = ["trend", "problem", "tech", "asset", "market"];
    if (!validTypes.includes(cardType)) {
      return NextResponse.json(
        { error: "Invalid card type" },
        { status: 400 }
      );
    }

    // Ensure card has required fields
    if (!card.id || !card.title || !card.type) {
      return NextResponse.json(
        { error: "Card must have id, title, and type" },
        { status: 400 }
      );
    }

    const updatedDeck = await addCardToDeck(card, cardType);
    return NextResponse.json({ success: true, deck: updatedDeck });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}
