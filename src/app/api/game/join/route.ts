import { NextRequest, NextResponse } from "next/server";
import { addPlayer } from "@/lib/game-state";
import { getGame, saveGame } from "@/lib/kv";
import { broadcastStateChange, broadcastEvent, PUSHER_EVENTS } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomCode, playerName } = body;

    if (!roomCode || typeof roomCode !== "string") {
      return NextResponse.json(
        { error: "Room code is required" },
        { status: 400 }
      );
    }

    if (!playerName || typeof playerName !== "string") {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    // Get the game
    const game = await getGame(roomCode.toUpperCase());

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    // Add the player
    const { game: updatedGame, playerId } = addPlayer(game, playerName.trim());

    // Save updated game
    await saveGame(updatedGame);

    // Broadcast player joined event
    await broadcastEvent(roomCode, PUSHER_EVENTS.PLAYER_JOINED, {
      playerId,
      playerName: playerName.trim(),
    });

    // Broadcast lightweight state change notification
    await broadcastStateChange(roomCode, updatedGame.state, "PLAYER_JOINED", updatedGame.players.length);

    return NextResponse.json({
      success: true,
      playerId,
      game: updatedGame,
    });
  } catch (error) {
    console.error("Error joining game:", error);
    const message = error instanceof Error ? error.message : "Failed to join game";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
