"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getPusherClient, getGameChannel, PUSHER_EVENTS } from "@/lib/pusher";
import { Game } from "@/lib/types";
import type { Channel } from "pusher-js";

interface UseGameStateOptions {
  roomCode: string;
  playerId?: string;
  onPlayerJoined?: (data: { playerId: string; playerName: string }) => void;
  onPlayerLeft?: (data: { playerId: string }) => void;
  onPhaseChanged?: (data: { newState: string }) => void;
}

interface UseGameStateReturn {
  game: Game | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  performAction: (
    type: string,
    payload?: Record<string, unknown>
  ) => Promise<{ success: boolean; error?: string }>;
}

export function useGameState({
  roomCode,
  playerId,
  onPlayerJoined,
  onPlayerLeft,
  onPhaseChanged,
}: UseGameStateOptions): UseGameStateReturn {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<Channel | null>(null);

  // Fetch current game state
  const fetchGameState = useCallback(async () => {
    try {
      const res = await fetch(`/api/game/state?roomCode=${roomCode}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch game state");
      }

      setGame(data.game);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load game");
    } finally {
      setIsLoading(false);
    }
  }, [roomCode]);

  // Perform a game action
  const performAction = useCallback(
    async (
      type: string,
      payload?: Record<string, unknown>
    ): Promise<{ success: boolean; error?: string }> => {
      if (!playerId) {
        return { success: false, error: "Player ID not set" };
      }

      try {
        const res = await fetch("/api/game/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            playerId,
            roomCode,
            payload,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, error: data.error || "Action failed" };
        }

        // Update local state immediately
        if (data.game) {
          setGame(data.game);
        }

        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Action failed",
        };
      }
    },
    [playerId, roomCode]
  );

  // Set up Pusher subscription
  useEffect(() => {
    // Initial fetch
    fetchGameState();

    // Subscribe to Pusher channel
    const pusher = getPusherClient();
    const channelName = getGameChannel(roomCode);
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    // Handle state updates
    channel.bind(PUSHER_EVENTS.STATE_UPDATE, (data: Game) => {
      setGame(data);
    });

    // Handle player joined
    channel.bind(
      PUSHER_EVENTS.PLAYER_JOINED,
      (data: { playerId: string; playerName: string }) => {
        onPlayerJoined?.(data);
      }
    );

    // Handle player left
    channel.bind(PUSHER_EVENTS.PLAYER_LEFT, (data: { playerId: string }) => {
      onPlayerLeft?.(data);
    });

    // Handle phase changed
    channel.bind(PUSHER_EVENTS.PHASE_CHANGED, (data: { newState: string }) => {
      onPhaseChanged?.(data);
    });

    // Cleanup
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [roomCode, fetchGameState, onPlayerJoined, onPlayerLeft, onPhaseChanged]);

  return {
    game,
    isLoading,
    error,
    refetch: fetchGameState,
    performAction,
  };
}

// Hook to get current player ID from session storage
export function usePlayerId(roomCode: string): string | null {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`player_${roomCode}`);
      setPlayerId(stored);
    }
  }, [roomCode]);

  return playerId;
}

// Hook to get current player from game state
export function useCurrentPlayer(game: Game | null, playerId: string | null) {
  if (!game || !playerId) return null;
  return game.players.find((p) => p.id === playerId) || null;
}
