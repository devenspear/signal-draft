"use client";

import { useState } from "react";
import { Game, Player, Card as CardType, GameState } from "@/lib/types";
import { Card } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";

interface CardSelectorProps {
  game: Game;
  currentPlayer: Player;
  onSelectCard: (cardId: string, selected: boolean) => Promise<void>;
  onLockPicks: () => Promise<void>;
}

const roundInfo: Record<string, { title: string; instruction: string }> = {
  ROUND_TREND_DRAFT: {
    title: "Draft Trends",
    instruction: "Select the macro trends you believe will shape the future",
  },
  ROUND_PROBLEM_DRAFT: {
    title: "Draft Problems",
    instruction: "Choose painful problems worth solving",
  },
  ROUND_TECH_ASSET_DRAFT: {
    title: "Draft Tech",
    instruction: "Select technologies to power your startup",
  },
};

export function CardSelector({
  game,
  currentPlayer,
  onSelectCard,
  onLockPicks,
}: CardSelectorProps) {
  const [isLocking, setIsLocking] = useState(false);

  // Get current round info
  const info = roundInfo[game.state] || { title: "Draft", instruction: "" };

  // Get cards in hand
  const handCardIds = currentPlayer.hand;
  const handCards = game.cards.filter((c) => handCardIds.includes(c.id));

  // Get selected cards based on round
  const getSelectedCardIds = (): string[] => {
    switch (game.state) {
      case "ROUND_TREND_DRAFT":
        return currentPlayer.draftedTrends;
      case "ROUND_PROBLEM_DRAFT":
        return currentPlayer.draftedProblems;
      case "ROUND_TECH_ASSET_DRAFT":
        return currentPlayer.draftedTech;
      default:
        return [];
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

  const selectedIds = getSelectedCardIds();
  const maxPicks = getMaxPicks();
  const canLock = selectedIds.length === maxPicks && !currentPlayer.hasLockedPicks;

  const handleCardClick = async (card: CardType) => {
    if (currentPlayer.hasLockedPicks) return;

    const isSelected = selectedIds.includes(card.id);

    // If selecting and already at max, don't allow
    if (!isSelected && selectedIds.length >= maxPicks) {
      return;
    }

    await onSelectCard(card.id, !isSelected);
  };

  const handleLock = async () => {
    setIsLocking(true);
    await onLockPicks();
    setIsLocking(false);
  };

  // If picks are locked, show waiting state
  if (currentPlayer.hasLockedPicks) {
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
          <h2 className="text-xl font-bold text-white mb-2">Picks Locked!</h2>
          <p className="text-gray-400">
            Waiting for other players to finish...
          </p>
        </div>

        {/* Show selected cards */}
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            Your Selections
          </h3>
          <div className="space-y-2">
            {selectedIds.map((id) => {
              const card = game.cards.find((c) => c.id === id);
              if (!card) return null;
              return (
                <div
                  key={id}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/30"
                >
                  <span className="text-white font-medium">{card.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-900/80 border-b border-gray-800 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">{info.title}</h1>
        <p className="text-sm text-gray-400">{info.instruction}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {selectedIds.length} / {maxPicks} selected
          </span>
          <div className="flex gap-1">
            {Array.from({ length: maxPicks }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < selectedIds.length ? "bg-green-500" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3">
          {handCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              selected={selectedIds.includes(card.id)}
              onClick={() => handleCardClick(card)}
              disabled={
                !selectedIds.includes(card.id) && selectedIds.length >= maxPicks
              }
            />
          ))}
        </div>
      </div>

      {/* Lock Button */}
      <div className="p-4 bg-gray-900/80 border-t border-gray-800 sticky bottom-0">
        <Button
          className="w-full"
          size="lg"
          disabled={!canLock || isLocking}
          onClick={handleLock}
        >
          {isLocking ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Locking...
            </span>
          ) : (
            `Lock ${selectedIds.length} / ${maxPicks} Picks`
          )}
        </Button>
        {selectedIds.length < maxPicks && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Select {maxPicks - selectedIds.length} more to lock
          </p>
        )}
      </div>
    </div>
  );
}
