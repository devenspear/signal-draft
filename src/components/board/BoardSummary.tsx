"use client";

import { Game, StartupConcept, Card } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { getRankedConcepts } from "@/lib/game-state";
import { formatScore, formatPercentage } from "@/lib/scoring";

interface BoardSummaryProps {
  game: Game;
  onEndGame: () => void;
  isHost: boolean;
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

export function BoardSummary({ game, onEndGame, isHost }: BoardSummaryProps) {
  const rankedConcepts = getRankedConcepts(game);
  const topTwo = rankedConcepts.slice(0, 2);

  const getCardById = (id: string): Card | undefined => {
    return game.cards.find((c) => c.id === id);
  };

  const getOwnerName = (playerId: string): string => {
    return game.players.find((p) => p.id === playerId)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-transparent bg-clip-text board-text mb-4">
          Results
        </h1>
        <p className="text-xl md:text-2xl text-gray-400">
          The top startup concepts from your session
        </p>
      </div>

      {/* Top 2 Concepts - Featured */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
        {topTwo.map((concept, index) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            rank={index + 1}
            getCardById={getCardById}
            ownerName={getOwnerName(concept.ownerPlayerId)}
            featured
          />
        ))}
      </div>

      {/* Other Concepts */}
      {rankedConcepts.length > 2 && (
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-gray-400 mb-6">
            Other Concepts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rankedConcepts.slice(2).map((concept, index) => (
              <ConceptCard
                key={concept.id}
                concept={concept}
                rank={index + 3}
                getCardById={getCardById}
                ownerName={getOwnerName(concept.ownerPlayerId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* End Game */}
      {isHost && game.state !== "ENDED" && (
        <div className="text-center">
          <Button variant="secondary" size="lg" onClick={onEndGame}>
            End Game
          </Button>
        </div>
      )}

      {game.state === "ENDED" && (
        <div className="text-center text-gray-500 text-xl">
          Game ended. Thanks for playing Signal Draft!
        </div>
      )}
    </div>
  );
}

interface ConceptCardProps {
  concept: StartupConcept;
  rank: number;
  getCardById: (id: string) => Card | undefined;
  ownerName: string;
  featured?: boolean;
}

function ConceptCard({
  concept,
  rank,
  getCardById,
  ownerName,
  featured = false,
}: ConceptCardProps) {
  const { aggregatedScore, superlatives = [] } = concept;

  return (
    <div
      className={`
        rounded-2xl border overflow-hidden
        ${
          featured
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600"
            : "bg-gray-800/50 border-gray-700"
        }
      `}
    >
      {/* Header */}
      <div
        className={`
        p-6 border-b border-gray-700
        ${featured ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10" : ""}
      `}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <span
              className={`
              ${featured ? "text-4xl" : "text-2xl"} font-bold
              ${rank === 1 ? "text-yellow-400" : rank === 2 ? "text-gray-300" : "text-gray-500"}
            `}
            >
              #{rank}
            </span>
            <h3
              className={`font-bold text-white ${featured ? "text-2xl" : "text-lg"}`}
            >
              {concept.name}
            </h3>
          </div>
          <span className="text-sm text-gray-500">by {ownerName}</span>
        </div>

        <p className={`text-gray-400 ${featured ? "text-lg" : "text-sm"}`}>
          {concept.oneLiner}
        </p>

        {/* Superlatives */}
        {superlatives.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {superlatives.map((sup) => {
              const badge = superlativeBadges[sup];
              return (
                <span
                  key={sup}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${badge?.bg} ${badge?.text}`}
                >
                  {badge?.icon} {sup}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Scores */}
      {aggregatedScore && (
        <div className={`p-6 ${featured ? "" : "py-4"}`}>
          <div className="grid grid-cols-2 gap-4">
            <ScoreBar
              label="Pain"
              value={aggregatedScore.avgPain}
              max={5}
              color="red"
            />
            <ScoreBar
              label="Market Size"
              value={aggregatedScore.avgMarketSize}
              max={5}
              color="blue"
            />
            <ScoreBar
              label="Founder Fit"
              value={aggregatedScore.avgFounderFit}
              max={5}
              color="green"
            />
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Would Invest</span>
              <span className="text-xl font-bold text-white">
                {formatPercentage(aggregatedScore.investYesRate)}
              </span>
            </div>
          </div>

          {/* Total Score */}
          <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
            <span className="text-gray-400">Total Score</span>
            <span className="text-3xl font-bold text-white">
              {aggregatedScore.totalScore.toFixed(1)}
              <span className="text-lg text-gray-500"> / 15</span>
            </span>
          </div>
        </div>
      )}

      {/* Ingredients */}
      {featured && (
        <div className="p-6 bg-gray-900/50 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">
            Ingredients
          </h4>
          <div className="flex flex-wrap gap-2">
            {concept.trendIds.map((id) => {
              const card = getCardById(id);
              return (
                <span
                  key={id}
                  className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300"
                >
                  {card?.title || id}
                </span>
              );
            })}
            {concept.problemIds.map((id) => {
              const card = getCardById(id);
              return (
                <span
                  key={id}
                  className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300"
                >
                  {card?.title || id}
                </span>
              );
            })}
            {concept.techIds.map((id) => {
              const card = getCardById(id);
              return (
                <span
                  key={id}
                  className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300"
                >
                  {card?.title || id}
                </span>
              );
            })}
            {concept.assetIds.map((id) => {
              const card = getCardById(id);
              return (
                <span
                  key={id}
                  className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300"
                >
                  {card?.title || id}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
  color: "red" | "blue" | "green" | "yellow";
}

const colorClasses = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
};

function ScoreBar({ label, value, max, color }: ScoreBarProps) {
  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="text-white font-medium">{formatScore(value, max)}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} animate-score-fill`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
