import { NextRequest, NextResponse } from "next/server";
import { createGame } from "@/lib/game-state";
import { saveGame } from "@/lib/kv";
import { broadcastGameState } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostName, settings } = body;

    if (!hostName || typeof hostName !== "string") {
      return NextResponse.json(
        { error: "Host name is required" },
        { status: 400 }
      );
    }

    // Create the game
    const game = createGame(hostName.trim(), settings);

    // Save to KV store
    await saveGame(game);

    // Broadcast initial state (for board view that might connect early)
    await broadcastGameState(game.roomCode, game);

    return NextResponse.json({
      success: true,
      roomCode: game.roomCode,
      playerId: game.hostPlayerId,
      game,
    });
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
