"use client";

import { Game } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface BoardBuildViewProps {
  game: Game;
  onAdvanceToScoring: () => void;
  isHost: boolean;
}

export function BoardBuildView({
  game,
  onAdvanceToScoring,
  isHost,
}: BoardBuildViewProps) {
  const connectedPlayers = game.players.filter((p) => p.isConnected);

  // Get concept count per player
  const getConceptCount = (playerId: string): number => {
    return game.concepts.filter((c) => c.ownerPlayerId === playerId).length;
  };

  const totalConcepts = game.concepts.length;
  const minConcepts = connectedPlayers.length; // At least 1 per player
  const canAdvance = totalConcepts >= minConcepts;

  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-white board-text mb-4">
          Build Your Concepts
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
          Combine your drafted cards into startup concepts. Give each one a name
          and a compelling one-liner.
        </p>
      </div>

      {/* Concepts Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Show submitted concepts */}
          {game.concepts.map((concept, index) => {
            const owner = game.players.find((p) => p.id === concept.ownerPlayerId);

            return (
              <div
                key={concept.id}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white">{concept.name}</h3>
                  <span className="text-sm text-gray-500 px-2 py-1 bg-gray-800 rounded">
                    {owner?.name}
                  </span>
                </div>
                <p className="text-gray-400">{concept.oneLiner}</p>

                {/* Ingredients summary */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                    {concept.trendIds.length} Trend{concept.trendIds.length !== 1 && "s"}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300">
                    {concept.problemIds.length} Problem{concept.problemIds.length !== 1 && "s"}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                    {concept.techIds.length} Tech
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300">
                    {concept.assetIds.length} Asset{concept.assetIds.length !== 1 && "s"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Empty placeholder slots */}
          {totalConcepts === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4 opacity-20">🚀</div>
              <p className="text-gray-500 text-xl">
                Waiting for players to submit concepts...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Player Progress */}
      <div className="max-w-4xl mx-auto w-full mt-8 mb-4">
        <div className="flex flex-wrap justify-center gap-4">
          {connectedPlayers.map((player) => {
            const count = getConceptCount(player.id);
            const max = game.settings.numConceptsPerPlayer;

            return (
              <div
                key={player.id}
                className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <span className="text-white font-medium">{player.name}</span>
                <span className="text-gray-500 ml-2">
                  {count} / {max} concepts
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="text-center mt-4">
        <div className="text-xl text-gray-500 mb-4">
          {totalConcepts} concept{totalConcepts !== 1 && "s"} submitted
        </div>

        {isHost && (
          <Button
            size="lg"
            onClick={onAdvanceToScoring}
            disabled={!canAdvance}
            className="text-xl"
          >
            Start Scoring Phase
          </Button>
        )}

        {isHost && !canAdvance && (
          <p className="text-gray-500 mt-2">
            Need at least {minConcepts} concepts to start scoring
          </p>
        )}
      </div>
    </div>
  );
}
