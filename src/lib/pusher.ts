import Pusher from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher instance (for triggering events)
let pusherServer: Pusher | null = null;

export function getPusherServer(): Pusher {
  if (!pusherServer) {
    pusherServer = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return pusherServer;
}

// Client-side Pusher instance (for subscribing to events)
let pusherClient: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherClient && typeof window !== "undefined") {
    pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }
  return pusherClient!;
}

// Channel naming convention
export function getGameChannel(roomCode: string): string {
  return `game-${roomCode}`;
}

// Event types
export const PUSHER_EVENTS = {
  STATE_UPDATE: "game:state-update",
  PLAYER_JOINED: "player:joined",
  PLAYER_LEFT: "player:left",
  PLAYER_READY: "player:ready",
  DRAFT_PICK: "draft:pick",
  DRAFT_LOCKED: "draft:locked",
  CONCEPT_SUBMITTED: "concept:submitted",
  SCORE_SUBMITTED: "score:submitted",
  PHASE_CHANGED: "phase:changed",
} as const;

// Lightweight state update notification (tells clients to refetch)
export interface StateUpdateNotification {
  state: string;
  timestamp: number;
  trigger: string; // What caused this update
  playerCount?: number;
}

// Broadcast a lightweight notification that state has changed
// Clients should refetch full state from API
export async function broadcastStateChange(
  roomCode: string,
  state: string,
  trigger: string,
  playerCount?: number
): Promise<void> {
  const pusher = getPusherServer();
  const notification: StateUpdateNotification = {
    state,
    timestamp: Date.now(),
    trigger,
    playerCount,
  };
  await pusher.trigger(
    getGameChannel(roomCode),
    PUSHER_EVENTS.STATE_UPDATE,
    notification
  );
}

// Legacy function - now sends lightweight notification instead
export async function broadcastGameState(
  roomCode: string,
  gameState: { state: string; players?: { length: number }[] } & Record<string, unknown>
): Promise<void> {
  const playerCount = Array.isArray(gameState.players) ? gameState.players.length : undefined;
  await broadcastStateChange(roomCode, gameState.state as string, "state_sync", playerCount);
}

// Broadcast a specific event to a room
export async function broadcastEvent(
  roomCode: string,
  event: string,
  data: unknown
): Promise<void> {
  const pusher = getPusherServer();
  await pusher.trigger(getGameChannel(roomCode), event, data);
}
