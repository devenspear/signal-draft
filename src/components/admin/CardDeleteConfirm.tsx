"use client";

import { CardType } from "@/lib/types";
import { Button } from "@/components/ui/Button";

type DeckCard = {
  id: string;
  type: CardType;
  title: string;
  description?: string;
};

interface CardDeleteConfirmProps {
  card: DeckCard;
  cardType: CardType;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function CardDeleteConfirm({
  card,
  cardType,
  onConfirm,
  onCancel,
  isDeleting = false,
}: CardDeleteConfirmProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Delete Card?</h2>
          <p className="text-gray-400 mb-4">
            Are you sure you want to delete this {cardType} card? This action cannot
            be undone.
          </p>

          <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-white font-semibold">{card.title}</p>
            {card.description && (
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {card.description}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Card"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
