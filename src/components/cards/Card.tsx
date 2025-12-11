"use client";

import { Card as CardType } from "@/lib/types";

interface CardProps {
  card: CardType;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showOwner?: boolean;
  disabled?: boolean;
}

const typeColors: Record<string, string> = {
  trend: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  problem: "from-red-500/20 to-red-600/20 border-red-500/30",
  tech: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
  asset: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
  market: "from-green-500/20 to-green-600/20 border-green-500/30",
};

const typeLabels: Record<string, string> = {
  trend: "Trend",
  problem: "Problem",
  tech: "Tech",
  asset: "Asset",
  market: "Market",
};

export function Card({
  card,
  selected = false,
  onClick,
  size = "md",
  showOwner = false,
  disabled = false,
}: CardProps) {
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const titleSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        relative rounded-xl border bg-gradient-to-br ${typeColors[card.type]}
        ${sizeClasses[size]}
        ${onClick && !disabled ? "cursor-pointer card-hover" : ""}
        ${selected ? "ring-2 ring-green-400 ring-offset-2 ring-offset-gray-950" : ""}
        ${disabled ? "opacity-50" : ""}
        transition-all
      `}
    >
      {/* Type badge */}
      <div className="absolute top-2 right-2">
        <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-gray-400">
          {typeLabels[card.type]}
        </span>
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-white mb-2 pr-16 ${titleSizes[size]}`}>
        {card.title}
      </h3>

      {/* Description */}
      {card.description && (
        <p className={`text-gray-400 ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-black/20 text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Owner (for assets) */}
      {showOwner && card.type === "asset" && "ownerPlayerName" in card && (
        <div className="mt-2 text-xs text-gray-500">
          Owner: {card.ownerPlayerName}
        </div>
      )}

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
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
      )}
    </div>
  );
}
