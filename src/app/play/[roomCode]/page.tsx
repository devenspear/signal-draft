"use client";

import { use, useCallback } from "react";
import { useGameState, usePlayerId, useCurrentPlayer } from "@/hooks/useGameState";
import { PlayerLobby } from "@/components/player/PlayerLobby";
import { CardSelector } from "@/components/player/CardSelector";
import { ConceptBuilder } from "@/components/player/ConceptBuilder";
import { ScoringForm } from "@/components/player/ScoringForm";
import { PlayerSummary } from "@/components/player/PlayerSummary";
import { BusinessModel } from "@/lib/types";

interface PlayPageProps {
  params: Promise<{ roomCode: string }>;
}

export default function PlayPage({ params }: PlayPageProps) {
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

  // Action handlers
  const handleSelectCard = async (cardId: string, selected: boolean) => {
    const result = await performAction("DRAFT_CARDS", { cardId, selected });
    if (!result.success) {
      console.error("Failed to select card:", result.error);
    }
  };

  const handleLockPicks = async () => {
    const result = await performAction("LOCK_PICKS");
    if (!result.success) {
      console.error("Failed to lock picks:", result.error);
    }
  };

  const handleSubmitConcept = async (concept: {
    name: string;
    oneLiner: string;
    trendIds: string[];
    problemIds: string[];
    techIds: string[];
    assetIds: string[];
    marketDescription?: string;
    businessModel?: BusinessModel;
  }) => {
    const result = await performAction("SUBMIT_CONCEPT", concept);
    if (!result.success) {
      console.error("Failed to submit concept:", result.error);
    }
  };

  const handleSubmitScore = async (
    conceptId: string,
    score: {
      pain: number;
      marketSize: number;
      founderFit: number;
      wouldInvest: boolean;
    }
  ) => {
    const result = await performAction("SUBMIT_SCORE", {
      conceptId,
      ...score,
    });
    if (!result.success) {
      console.error("Failed to submit score:", result.error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-xl font-bold text-white mb-2">Game Not Found</h1>
          <p className="text-gray-400 mb-6">
            {error || "The game you're looking for doesn't exist or has ended."}
          </p>
          <a
            href="/join"
            className="inline-block px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  // Player not found in game
  if (!currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-xl font-bold text-white mb-2">Session Expired</h1>
          <p className="text-gray-400 mb-6">
            Your session has expired. Please rejoin the game.
          </p>
          <a
            href={`/join?code=${roomCode}`}
            className="inline-block px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-colors"
          >
            Rejoin Game
          </a>
        </div>
      </div>
    );
  }

  // Render based on game state
  switch (game.state) {
    case "LOBBY":
      return <PlayerLobby game={game} currentPlayer={currentPlayer} />;

    case "ROUND_TREND_DRAFT":
    case "ROUND_PROBLEM_DRAFT":
    case "ROUND_TECH_ASSET_DRAFT":
      return (
        <CardSelector
          game={game}
          currentPlayer={currentPlayer}
          onSelectCard={handleSelectCard}
          onLockPicks={handleLockPicks}
        />
      );

    case "BUILD_CONCEPTS":
      return (
        <ConceptBuilder
          game={game}
          currentPlayer={currentPlayer}
          onSubmitConcept={handleSubmitConcept}
        />
      );

    case "SCORING":
      return (
        <ScoringForm
          game={game}
          currentPlayer={currentPlayer}
          onSubmitScore={handleSubmitScore}
        />
      );

    case "SUMMARY":
    case "ENDED":
      return <PlayerSummary game={game} currentPlayer={currentPlayer} />;

    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">Unknown game state: {game.state}</p>
        </div>
      );
  }
}
