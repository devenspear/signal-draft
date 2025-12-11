"use client";

import { Game, Player } from "@/lib/types";
import { getRankedConcepts } from "@/lib/game-state";
import { formatScore, formatPercentage } from "@/lib/scoring";

interface PlayerSummaryProps {
  game: Game;
  currentPlayer: Player;
}

const superlativeBadges: Record<string, { bg: string; text: string; icon: string }> = {
  "Most Likely to Raise a Seed": {
    bg: "bg-green-500/20",
    text: "text-green-400",
    icon: "💰",
  },
  "Best Founder Fit": {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    icon: "🎯",
  },
  "Most Outrageous": {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    icon: "🚀",
  },
};

export function PlayerSummary({ game, currentPlayer }: PlayerSummaryProps) {
  const rankedConcepts = getRankedConcepts(game);

  // Find player's concepts
  const playerConcepts = rankedConcepts.filter(
    (c) => c.ownerPlayerId === currentPlayer.id
  );

  // Find best rank for player's concepts
  const bestRank = rankedConcepts.findIndex(
    (c) => c.ownerPlayerId === currentPlayer.id
  );

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text mb-2">
          Game Complete!
        </h1>
        <p className="text-gray-400">
          {rankedConcepts.length} concepts were created and scored
        </p>
      </div>

      {/* Player's Results */}
      {playerConcepts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-400 mb-4">
            Your Concepts
          </h2>
          <div className="space-y-4">
            {playerConcepts.map((concept) => {
              const rank = rankedConcepts.findIndex((c) => c.id === concept.id) + 1;
              const { aggregatedScore, superlatives = [] } = concept;

              return (
                <div
                  key={concept.id}
                  className="p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${
                          rank === 1
                            ? "text-yellow-400"
                            : rank === 2
                            ? "text-gray-300"
                            : rank === 3
                            ? "text-orange-400"
                            : "text-gray-500"
                        }`}
                      >
                        #{rank}
                      </span>
                      <h3 className="font-bold text-white">{concept.name}</h3>
                    </div>
                    {aggregatedScore && (
                      <span className="text-lg font-bold text-white">
                        {aggregatedScore.totalScore.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-3">{concept.oneLiner}</p>

                  {/* Superlatives */}
                  {superlatives.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {superlatives.map((sup) => {
                        const badge = superlativeBadges[sup];
                        return (
                          <span
                            key={sup}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.bg} ${badge?.text}`}
                          >
                            {badge?.icon} {sup}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Score breakdown */}
                  {aggregatedScore && (
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-500">Pain</div>
                        <div className="font-bold text-red-400">
                          {aggregatedScore.avgPain.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-500">Market</div>
                        <div className="font-bold text-blue-400">
                          {aggregatedScore.avgMarketSize.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-500">Fit</div>
                        <div className="font-bold text-green-400">
                          {aggregatedScore.avgFounderFit.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-500">Invest</div>
                        <div className="font-bold text-yellow-400">
                          {formatPercentage(aggregatedScore.investYesRate)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Rankings */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-400 mb-4">
          All Rankings
        </h2>
        <div className="space-y-2">
          {rankedConcepts.map((concept, index) => {
            const owner = game.players.find((p) => p.id === concept.ownerPlayerId);
            const isOwn = concept.ownerPlayerId === currentPlayer.id;

            return (
              <div
                key={concept.id}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  isOwn
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-gray-800/50 border border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold w-8 ${
                      index === 0
                        ? "text-yellow-400"
                        : index === 1
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-white">{concept.name}</div>
                    <div className="text-xs text-gray-500">{owner?.name}</div>
                  </div>
                </div>
                <span className="font-bold text-white">
                  {concept.aggregatedScore?.totalScore.toFixed(1) || "-"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* End message */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Thanks for playing Signal Draft!
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
        >
          Play Again
        </a>
      </div>
    </div>
  );
}
