"use client";

import { Game, GameState } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface BoardDraftViewProps {
  game: Game;
  onAdvanceRound: () => void;
  isHost: boolean;
}

const roundTitles: Record<string, string> = {
  ROUND_TREND_DRAFT: "Round 1: Trend Draft",
  ROUND_PROBLEM_DRAFT: "Round 2: Problem Draft",
  ROUND_TECH_ASSET_DRAFT: "Round 3: Tech & Asset Draft",
};

const roundInstructions: Record<string, string> = {
  ROUND_TREND_DRAFT:
    "Pick the macro trends you believe will shape the future. Select cards on your phone.",
  ROUND_PROBLEM_DRAFT:
    "Choose painful problems worth solving. Look for problems aligned with your trends.",
  ROUND_TECH_ASSET_DRAFT:
    "Select technologies and assign your assets to build your startup foundation.",
};

export function BoardDraftView({ game, onAdvanceRound, isHost }: BoardDraftViewProps) {
  const connectedPlayers = game.players.filter((p) => p.isConnected);
  const lockedPlayers = connectedPlayers.filter((p) => p.hasLockedPicks);
  const allLocked = lockedPlayers.length === connectedPlayers.length;

  // Get picks count based on round
  const getPicksCount = (playerId: string): number => {
    const player = game.players.find((p) => p.id === playerId);
    if (!player) return 0;

    switch (game.state) {
      case "ROUND_TREND_DRAFT":
        return player.draftedTrends.length;
      case "ROUND_PROBLEM_DRAFT":
        return player.draftedProblems.length;
      case "ROUND_TECH_ASSET_DRAFT":
        return player.draftedTech.length;
      default:
        return 0;
    }
  };

  const getMaxPicks = (): number => {
    switch (game.state) {
      case "ROUND_TREND_DRAFT":
        return game.settings.numTrendsPerPlayer;
      case "ROUND_PROBLEM_DRAFT":
        return game.settings.numProblemsPerPlayer;
      case "ROUND_TECH_ASSET_DRAFT":
        return game.settings.numTechPerPlayer;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-white board-text mb-4">
          {roundTitles[game.state] || game.state}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
          {roundInstructions[game.state]}
        </p>
      </div>

      {/* Progress Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl">
          {connectedPlayers.map((player) => {
            const picks = getPicksCount(player.id);
            const maxPicks = getMaxPicks();
            const progress = (picks / maxPicks) * 100;

            return (
              <div
                key={player.id}
                className={`
                  p-6 rounded-2xl border-2 transition-all
                  ${
                    player.hasLockedPicks
                      ? "bg-green-500/10 border-green-500"
                      : "bg-gray-800/50 border-gray-700"
                  }
                `}
              >
                <div className="text-2xl font-bold text-white mb-2">
                  {player.name}
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      player.hasLockedPicks ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {picks} / {maxPicks} picks
                  </span>
                  {player.hasLockedPicks && (
                    <span className="text-green-400 font-semibold flex items-center gap-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status & Controls */}
      <div className="text-center mt-8">
        {allLocked ? (
          <div className="text-2xl text-green-400 font-semibold mb-4 animate-pulse">
            All players locked! Advancing...
          </div>
        ) : (
          <div className="text-xl text-gray-500 mb-4">
            {lockedPlayers.length} / {connectedPlayers.length} players locked
          </div>
        )}

        {isHost && !allLocked && (
          <Button
            variant="secondary"
            size="lg"
            onClick={onAdvanceRound}
            className="text-xl"
          >
            Force Advance Round
          </Button>
        )}
      </div>
    </div>
  );
}
