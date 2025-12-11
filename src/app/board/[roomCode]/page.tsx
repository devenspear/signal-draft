"use client";

import { use, useCallback } from "react";
import { useGameState, usePlayerId, useCurrentPlayer } from "@/hooks/useGameState";
import { BoardLobby } from "@/components/board/BoardLobby";
import { BoardDraftView } from "@/components/board/BoardDraftView";
import { BoardBuildView } from "@/components/board/BoardBuildView";
import { BoardScoreView } from "@/components/board/BoardScoreView";
import { BoardSummary } from "@/components/board/BoardSummary";

interface BoardPageProps {
  params: Promise<{ roomCode: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { roomCode } = use(params);
  const playerId = usePlayerId(roomCode);

  const handlePhaseChanged = useCallback((data: { newState: string }) => {
    console.log("Phase changed to:", data.newState);
  }, []);

  const { game, isLoading, error, performAction } = useGameState({
    roomCode,
    playerId: playerId || undefined,
    onPhaseChanged: handlePhaseChanged,
  });

  const currentPlayer = useCurrentPlayer(game, playerId);
  const isHost = currentPlayer?.isHost ?? false;

  // Action handlers
  const handleStartGame = async () => {
    const result = await performAction("START_GAME");
    if (!result.success) {
      console.error("Failed to start game:", result.error);
    }
  };

  const handleAdvanceRound = async () => {
    const result = await performAction("ADVANCE_ROUND");
    if (!result.success) {
      console.error("Failed to advance round:", result.error);
    }
  };

  const handleEndGame = async () => {
    const result = await performAction("END_GAME");
    if (!result.success) {
      console.error("Failed to end game:", result.error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-xl">Loading game...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">Game Not Found</h1>
          <p className="text-gray-400 mb-6">
            {error || "The game you're looking for doesn't exist or has ended."}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Render based on game state
  switch (game.state) {
    case "LOBBY":
      return (
        <BoardLobby game={game} onStartGame={handleStartGame} isHost={isHost} />
      );

    case "ROUND_TREND_DRAFT":
    case "ROUND_PROBLEM_DRAFT":
    case "ROUND_TECH_ASSET_DRAFT":
      return (
        <BoardDraftView
          game={game}
          onAdvanceRound={handleAdvanceRound}
          isHost={isHost}
        />
      );

    case "BUILD_CONCEPTS":
      return (
        <BoardBuildView
          game={game}
          onAdvanceToScoring={handleAdvanceRound}
          isHost={isHost}
        />
      );

    case "SCORING":
      return (
        <BoardScoreView
          game={game}
          onAdvanceToSummary={handleAdvanceRound}
          isHost={isHost}
        />
      );

    case "SUMMARY":
    case "ENDED":
      return (
        <BoardSummary game={game} onEndGame={handleEndGame} isHost={isHost} />
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">Unknown game state: {game.state}</p>
        </div>
      );
  }
}
