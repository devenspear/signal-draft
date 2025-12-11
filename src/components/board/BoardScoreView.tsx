"use client";

import { Game } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface BoardScoreViewProps {
  game: Game;
  onAdvanceToSummary: () => void;
  isHost: boolean;
}

export function BoardScoreView({
  game,
  onAdvanceToSummary,
  isHost,
}: BoardScoreViewProps) {
  const connectedPlayers = game.players.filter((p) => p.isConnected);
  const totalConcepts = game.concepts.length;

  // Calculate scoring progress for each player
  const getScoringProgress = (playerId: string): number => {
    return game.concepts.filter((c) =>
      c.scores.some((s) => s.playerId === playerId)
    ).length;
  };

  const allComplete = connectedPlayers.every(
    (p) => game.scoringComplete.includes(p.id)
  );

  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-white board-text mb-4">
          Scoring Phase
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
          Rate each concept on Pain, Market Size, and Founder Fit. Would you invest?
        </p>
      </div>

      {/* Concepts to Score */}
      <div className="flex-1 mb-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-300">
          {totalConcepts} Concepts to Score
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {game.concepts.map((concept) => {
            const owner = game.players.find((p) => p.id === concept.ownerPlayerId);
            const scoresCount = concept.scores.length;
            const progress = (scoresCount / connectedPlayers.length) * 100;

            return (
              <div
                key={concept.id}
                className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
              >
                <h3 className="font-semibold text-white mb-1 truncate">
                  {concept.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">by {owner?.name}</p>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {scoresCount} / {connectedPlayers.length} scores
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Player Progress */}
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-400">
          Player Progress
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {connectedPlayers.map((player) => {
            const scored = getScoringProgress(player.id);
            const complete = game.scoringComplete.includes(player.id);
            const progress = (scored / totalConcepts) * 100;

            return (
              <div
                key={player.id}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${
                    complete
                      ? "bg-green-500/10 border-green-500"
                      : "bg-gray-800/50 border-gray-700"
                  }
                `}
              >
                <div className="text-lg font-semibold text-white mb-2">
                  {player.name}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      complete ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {scored} / {totalConcepts}
                  </span>
                  {complete && (
                    <span className="text-green-400 text-sm font-semibold">
                      Done!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="text-center mt-8">
        {allComplete ? (
          <div className="text-2xl text-green-400 font-semibold mb-4 animate-pulse">
            All scoring complete! Calculating results...
          </div>
        ) : (
          <div className="text-xl text-gray-500 mb-4">
            {game.scoringComplete.length} / {connectedPlayers.length} players
            finished
          </div>
        )}

        {isHost && !allComplete && (
          <Button
            variant="secondary"
            size="lg"
            onClick={onAdvanceToSummary}
            className="text-xl"
          >
            Force Show Results
          </Button>
        )}
      </div>
    </div>
  );
}
