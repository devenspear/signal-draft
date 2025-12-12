"use client";

import { CardType } from "@/lib/types";

interface CardTypeSelectorProps {
  selectedType: CardType | "all";
  onChange: (type: CardType | "all") => void;
  includeAll?: boolean;
}

const typeColors: Record<CardType | "all", string> = {
  all: "bg-gray-700 border-gray-600",
  trend: "bg-blue-900/50 border-blue-700",
  problem: "bg-red-900/50 border-red-700",
  tech: "bg-purple-900/50 border-purple-700",
  asset: "bg-yellow-900/50 border-yellow-700",
  market: "bg-green-900/50 border-green-700",
};

const typeLabels: Record<CardType | "all", string> = {
  all: "All",
  trend: "Trends",
  problem: "Problems",
  tech: "Tech",
  asset: "Assets",
  market: "Markets",
};

export function CardTypeSelector({
  selectedType,
  onChange,
  includeAll = true,
}: CardTypeSelectorProps) {
  const types: (CardType | "all")[] = includeAll
    ? ["all", "trend", "problem", "tech", "asset", "market"]
    : ["trend", "problem", "tech", "asset", "market"];

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`
            px-4 py-2 rounded-lg border text-sm font-medium transition-all
            ${typeColors[type]}
            ${
              selectedType === type
                ? "ring-2 ring-white/50 text-white"
                : "text-gray-300 hover:text-white"
            }
          `}
        >
          {typeLabels[type]}
        </button>
      ))}
    </div>
  );
}
