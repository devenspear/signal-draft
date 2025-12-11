"use client";

import { useState, useMemo } from "react";
import { Game, Player, StartupConcept } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface ScoringFormProps {
  game: Game;
  currentPlayer: Player;
  onSubmitScore: (
    conceptId: string,
    score: {
      pain: number;
      marketSize: number;
      founderFit: number;
      wouldInvest: boolean;
    }
  ) => Promise<void>;
}

export function ScoringForm({
  game,
  currentPlayer,
  onSubmitScore,
}: ScoringFormProps) {
  // Find concepts not yet scored by this player
  const unscoredConcepts = useMemo(() => {
    return game.concepts.filter(
      (c) => !c.scores.some((s) => s.playerId === currentPlayer.id)
    );
  }, [game.concepts, currentPlayer.id]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [pain, setPain] = useState(3);
  const [marketSize, setMarketSize] = useState(3);
  const [founderFit, setFounderFit] = useState(3);
  const [wouldInvest, setWouldInvest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentConcept = unscoredConcepts[currentIndex];
  const totalConcepts = game.concepts.length;
  const scoredCount = totalConcepts - unscoredConcepts.length;

  // If all scored, show completion
  if (!currentConcept) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
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
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Scoring Complete!</h2>
          <p className="text-gray-400">
            You've scored all {totalConcepts} concepts. Waiting for results...
          </p>
        </div>
      </div>
    );
  }

  const owner = game.players.find((p) => p.id === currentConcept.ownerPlayerId);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmitScore(currentConcept.id, {
      pain,
      marketSize,
      founderFit,
      wouldInvest,
    });

    // Reset form for next concept
    setPain(3);
    setMarketSize(3);
    setFounderFit(3);
    setWouldInvest(false);
    setCurrentIndex((prev) => prev + 1);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-900/80 border-b border-gray-800 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Score Concepts</h1>
          <span className="text-sm text-gray-400">
            {scoredCount + 1} of {totalConcepts}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${((scoredCount + 1) / totalConcepts) * 100}%` }}
          />
        </div>
      </div>

      {/* Concept Card */}
      <div className="p-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-2xl font-bold text-white">
              {currentConcept.name}
            </h2>
            <span className="text-sm text-gray-500 px-2 py-1 bg-gray-800 rounded">
              {owner?.name}
            </span>
          </div>
          <p className="text-gray-300 text-lg">{currentConcept.oneLiner}</p>

          {/* Ingredients */}
          <div className="flex flex-wrap gap-2 mt-4">
            {currentConcept.trendIds.map((id) => {
              const card = game.cards.find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300"
                >
                  {card?.title || id}
                </span>
              );
            })}
            {currentConcept.problemIds.map((id) => {
              const card = game.cards.find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300"
                >
                  {card?.title || id}
                </span>
              );
            })}
            {currentConcept.techIds.map((id) => {
              const card = game.cards.find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300"
                >
                  {card?.title || id}
                </span>
              );
            })}
          </div>

          {currentConcept.marketDescription && (
            <p className="text-sm text-gray-500 mt-3">
              Target: {currentConcept.marketDescription}
            </p>
          )}
        </div>
      </div>

      {/* Scoring Inputs */}
      <div className="flex-1 p-4 space-y-6">
        {/* Pain */}
        <ScoreSlider
          label="Pain / Urgency"
          description="How painful is this problem?"
          value={pain}
          onChange={setPain}
          color="red"
        />

        {/* Market Size */}
        <ScoreSlider
          label="Market Size Potential"
          description="How big is the opportunity?"
          value={marketSize}
          onChange={setMarketSize}
          color="blue"
        />

        {/* Founder Fit */}
        <ScoreSlider
          label="Founder Fit"
          description="Can this team build it?"
          value={founderFit}
          onChange={setFounderFit}
          color="green"
        />

        {/* Would Invest */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Would you invest?
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setWouldInvest(true)}
              className={`flex-1 py-4 rounded-xl text-lg font-semibold transition-all ${
                wouldInvest
                  ? "bg-green-500/30 border-2 border-green-500 text-green-300"
                  : "bg-gray-800 border-2 border-gray-700 text-gray-400"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setWouldInvest(false)}
              className={`flex-1 py-4 rounded-xl text-lg font-semibold transition-all ${
                !wouldInvest
                  ? "bg-red-500/30 border-2 border-red-500 text-red-300"
                  : "bg-gray-800 border-2 border-gray-700 text-gray-400"
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 bg-gray-900/80 border-t border-gray-800 sticky bottom-0">
        <Button
          className="w-full"
          size="lg"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting
            ? "Submitting..."
            : scoredCount + 1 === totalConcepts
            ? "Submit Final Score"
            : "Next Concept"}
        </Button>
      </div>
    </div>
  );
}

interface ScoreSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  color: "red" | "blue" | "green";
}

const colorClasses = {
  red: {
    active: "bg-red-500 border-red-500 text-white",
    inactive: "bg-gray-800 border-gray-700 text-gray-500",
  },
  blue: {
    active: "bg-blue-500 border-blue-500 text-white",
    inactive: "bg-gray-800 border-gray-700 text-gray-500",
  },
  green: {
    active: "bg-green-500 border-green-500 text-white",
    inactive: "bg-gray-800 border-gray-700 text-gray-500",
  },
};

function ScoreSlider({
  label,
  description,
  value,
  onChange,
  color,
}: ScoreSliderProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 py-3 rounded-lg text-lg font-semibold border-2 transition-all ${
              value === n
                ? colorClasses[color].active
                : colorClasses[color].inactive
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
