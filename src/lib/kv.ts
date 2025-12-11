import { kv } from "@vercel/kv";
import { Game } from "./types";

// Key prefix for game storage
const GAME_KEY_PREFIX = "game:";

// TTL for game data (24 hours in seconds)
const GAME_TTL = 60 * 60 * 24;

// Get game key
function getGameKey(roomCode: string): string {
  return `${GAME_KEY_PREFIX}${roomCode}`;
}

// Store a game
export async function saveGame(game: Game): Promise<void> {
  const key = getGameKey(game.roomCode);
  await kv.set(key, JSON.stringify(game), { ex: GAME_TTL });
}

// Retrieve a game by room code
export async function getGame(roomCode: string): Promise<Game | null> {
  const key = getGameKey(roomCode);
  const data = await kv.get<string>(key);

  if (!data) {
    return null;
  }

  // Handle both string and object responses from KV
  if (typeof data === "string") {
    return JSON.parse(data) as Game;
  }

  return data as unknown as Game;
}

// Delete a game
export async function deleteGame(roomCode: string): Promise<void> {
  const key = getGameKey(roomCode);
  await kv.del(key);
}

// Check if a room code exists
export async function roomExists(roomCode: string): Promise<boolean> {
  const key = getGameKey(roomCode);
  const exists = await kv.exists(key);
  return exists === 1;
}

// Update game state atomically
export async function updateGame(
  roomCode: string,
  updater: (game: Game) => Game
): Promise<Game | null> {
  const game = await getGame(roomCode);

  if (!game) {
    return null;
  }

  const updatedGame = updater(game);
  await saveGame(updatedGame);

  return updatedGame;
}

// Extend game TTL (call this on activity to keep game alive)
export async function extendGameTTL(roomCode: string): Promise<void> {
  const key = getGameKey(roomCode);
  await kv.expire(key, GAME_TTL);
}
