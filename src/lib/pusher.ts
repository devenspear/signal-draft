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

// Broadcast game state to all clients in a room
export async function broadcastGameState(
  roomCode: string,
  gameState: unknown
): Promise<void> {
  const pusher = getPusherServer();
  await pusher.trigger(
    getGameChannel(roomCode),
    PUSHER_EVENTS.STATE_UPDATE,
    gameState
  );
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
