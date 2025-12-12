"use client";

import { useState } from "react";
import { CardDeck, CardType } from "@/lib/types";

interface CardListProps {
  cards: CardDeck;
  selectedType: CardType | "all";
  onEditCard: (card: DeckCard, type: CardType) => void;
  onDeleteCard: (card: DeckCard, type: CardType) => void;
}

type DeckCard = {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  tags?: string[];
  timeHorizon?: string;
  category?: string;
  persona?: string;
  painLevelHint?: number;
  techCategory?: string;
  ownerPlayerName?: string;
};

const typeColors: Record<CardType, { bg: string; border: string; badge: string }> = {
  trend: { bg: "bg-blue-900/30", border: "border-blue-800", badge: "bg-blue-600" },
  problem: { bg: "bg-red-900/30", border: "border-red-800", badge: "bg-red-600" },
  tech: { bg: "bg-purple-900/30", border: "border-purple-800", badge: "bg-purple-600" },
  asset: { bg: "bg-yellow-900/30", border: "border-yellow-800", badge: "bg-yellow-600" },
  market: { bg: "bg-green-900/30", border: "border-green-800", badge: "bg-green-600" },
};

export function CardList({
  cards,
  selectedType,
  onEditCard,
  onDeleteCard,
}: CardListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Flatten all cards with their types
  const allCards: { card: DeckCard; type: CardType }[] = [
    ...cards.trends.map((c) => ({ card: c as DeckCard, type: "trend" as CardType })),
    ...cards.problems.map((c) => ({ card: c as DeckCard, type: "problem" as CardType })),
    ...cards.tech.map((c) => ({ card: c as DeckCard, type: "tech" as CardType })),
    ...cards.assets.map((c) => ({ card: c as DeckCard, type: "asset" as CardType })),
    ...cards.markets.map((c) => ({ card: c as DeckCard, type: "market" as CardType })),
  ];

  // Filter by type
  const typeFiltered =
    selectedType === "all"
      ? allCards
      : allCards.filter((c) => c.type === selectedType);

  // Filter by search
  const filtered = searchQuery
    ? typeFiltered.filter(
        ({ card }) =>
          card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : typeFiltered;

  return (
    <div className="p-6">
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Card count */}
      <p className="text-gray-500 mb-4">
        Showing {filtered.length} of {allCards.length} cards
      </p>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No cards found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ card, type }) => (
            <div
              key={card.id}
              className={`
                p-4 rounded-xl border
                ${typeColors[type].bg} ${typeColors[type].border}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[type].badge} text-white`}
                >
                  {type}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEditCard(card, type)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteCard(card, type)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-white font-semibold mb-1">{card.title}</h3>

              {/* Description */}
              {card.description && (
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {card.description}
                </p>
              )}

              {/* Type-specific fields */}
              <div className="text-xs text-gray-500 space-y-0.5">
                {type === "trend" && card.timeHorizon && (
                  <p>Horizon: {card.timeHorizon}</p>
                )}
                {type === "trend" && card.category && (
                  <p>Category: {card.category}</p>
                )}
                {type === "problem" && card.persona && (
                  <p>Persona: {card.persona}</p>
                )}
                {type === "problem" && card.painLevelHint && (
                  <p>Pain Level: {card.painLevelHint}/5</p>
                )}
                {type === "tech" && card.techCategory && (
                  <p>Tech Category: {card.techCategory}</p>
                )}
                {type === "asset" && card.ownerPlayerName && (
                  <p>Owner: {card.ownerPlayerName}</p>
                )}
              </div>

              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
