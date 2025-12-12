import { NextRequest, NextResponse } from "next/server";
import { validTokens } from "../../auth/route";
import { updateCardInDeck, deleteCardFromDeck } from "@/lib/admin-kv";
import { CardType } from "@/lib/types";

// Auth check helper
function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return validTokens.has(token);
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT - Update card
export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { card, cardType } = await request.json();

    if (!cardType) {
      return NextResponse.json(
        { error: "cardType is required" },
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

    const updatedDeck = await updateCardInDeck(id, cardType, card);
    return NextResponse.json({ success: true, deck: updatedDeck });
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 }
    );
  }
}

// DELETE - Delete card
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cardType = searchParams.get("type") as CardType;

    if (!cardType) {
      return NextResponse.json(
        { error: "Card type query parameter is required" },
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

    const updatedDeck = await deleteCardFromDeck(id, cardType);
    return NextResponse.json({ success: true, deck: updatedDeck });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 }
    );
  }
}
