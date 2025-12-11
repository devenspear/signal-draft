"use client";

import { useState } from "react";
import { Game, Player, BusinessModel } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface ConceptBuilderProps {
  game: Game;
  currentPlayer: Player;
  onSubmitConcept: (concept: {
    name: string;
    oneLiner: string;
    trendIds: string[];
    problemIds: string[];
    techIds: string[];
    assetIds: string[];
    marketDescription?: string;
    businessModel?: BusinessModel;
  }) => Promise<void>;
}

const businessModels: { value: BusinessModel; label: string }[] = [
  { value: "saas", label: "SaaS" },
  { value: "marketplace", label: "Marketplace" },
  { value: "transaction_fee", label: "Transaction Fee" },
  { value: "licensing", label: "Licensing" },
  { value: "hybrid", label: "Hybrid" },
  { value: "other", label: "Other" },
];

export function ConceptBuilder({
  game,
  currentPlayer,
  onSubmitConcept,
}: ConceptBuilderProps) {
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [marketDescription, setMarketDescription] = useState("");
  const [businessModel, setBusinessModel] = useState<BusinessModel>("saas");
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get player's drafted cards
  const draftedTrends = game.cards.filter(
    (c) => c.type === "trend" && currentPlayer.draftedTrends.includes(c.id)
  );
  const draftedProblems = game.cards.filter(
    (c) => c.type === "problem" && currentPlayer.draftedProblems.includes(c.id)
  );
  const draftedTech = game.cards.filter(
    (c) => c.type === "tech" && currentPlayer.draftedTech.includes(c.id)
  );
  const assetCards = game.cards.filter((c) => c.type === "asset");

  // Count existing concepts by this player
  const existingConcepts = game.concepts.filter(
    (c) => c.ownerPlayerId === currentPlayer.id
  );
  const canSubmitMore = existingConcepts.length < game.settings.numConceptsPerPlayer;

  // Validation
  const canSubmit =
    name.trim().length > 0 &&
    oneLiner.trim().length > 0 &&
    selectedTrends.length > 0 &&
    selectedProblems.length > 0 &&
    selectedTech.length > 0 &&
    selectedAssets.length > 0 &&
    canSubmitMore;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    await onSubmitConcept({
      name: name.trim(),
      oneLiner: oneLiner.trim(),
      trendIds: selectedTrends,
      problemIds: selectedProblems,
      techIds: selectedTech,
      assetIds: selectedAssets,
      marketDescription: marketDescription.trim() || undefined,
      businessModel,
    });

    // Reset form for next concept
    setName("");
    setOneLiner("");
    setMarketDescription("");
    setSelectedTrends([]);
    setSelectedProblems([]);
    setSelectedTech([]);
    setSelectedAssets([]);
    setIsSubmitting(false);
  };

  const toggleSelection = (
    id: string,
    list: string[],
    setList: (ids: string[]) => void
  ) => {
    if (list.includes(id)) {
      setList(list.filter((i) => i !== id));
    } else {
      setList([...list, id]);
    }
  };

  // If max concepts reached, show summary
  if (!canSubmitMore) {
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
          <h2 className="text-xl font-bold text-white mb-2">
            Concepts Submitted!
          </h2>
          <p className="text-gray-400">
            You've created {existingConcepts.length} concept
            {existingConcepts.length !== 1 && "s"}. Waiting for other players...
          </p>
        </div>

        {/* Show submitted concepts */}
        <div className="mt-8 w-full max-w-md space-y-4">
          {existingConcepts.map((concept) => (
            <div
              key={concept.id}
              className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
            >
              <h3 className="font-bold text-white">{concept.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{concept.oneLiner}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-900/80 border-b border-gray-800 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">Build Your Concept</h1>
        <p className="text-sm text-gray-400">
          Concept {existingConcepts.length + 1} of {game.settings.numConceptsPerPlayer}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Startup Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., ClimateSync"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            maxLength={50}
          />
        </div>

        {/* One-liner */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            One-Liner *
          </label>
          <textarea
            value={oneLiner}
            onChange={(e) => setOneLiner(e.target.value)}
            placeholder="We help [who] do [what] by [how]..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={3}
            maxLength={200}
          />
        </div>

        {/* Select Trends */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Select Trends * ({selectedTrends.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {draftedTrends.map((card) => (
              <button
                key={card.id}
                onClick={() =>
                  toggleSelection(card.id, selectedTrends, setSelectedTrends)
                }
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedTrends.includes(card.id)
                    ? "bg-blue-500/30 border-blue-500 text-blue-300"
                    : "bg-gray-800 border-gray-700 text-gray-400"
                } border`}
              >
                {card.title}
              </button>
            ))}
          </div>
        </div>

        {/* Select Problems */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Select Problems * ({selectedProblems.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {draftedProblems.map((card) => (
              <button
                key={card.id}
                onClick={() =>
                  toggleSelection(card.id, selectedProblems, setSelectedProblems)
                }
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedProblems.includes(card.id)
                    ? "bg-red-500/30 border-red-500 text-red-300"
                    : "bg-gray-800 border-gray-700 text-gray-400"
                } border`}
              >
                {card.title}
              </button>
            ))}
          </div>
        </div>

        {/* Select Tech */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Select Tech * ({selectedTech.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {draftedTech.map((card) => (
              <button
                key={card.id}
                onClick={() =>
                  toggleSelection(card.id, selectedTech, setSelectedTech)
                }
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedTech.includes(card.id)
                    ? "bg-purple-500/30 border-purple-500 text-purple-300"
                    : "bg-gray-800 border-gray-700 text-gray-400"
                } border`}
              >
                {card.title}
              </button>
            ))}
          </div>
        </div>

        {/* Select Assets */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Select Assets * ({selectedAssets.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {assetCards.map((card) => (
              <button
                key={card.id}
                onClick={() =>
                  toggleSelection(card.id, selectedAssets, setSelectedAssets)
                }
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedAssets.includes(card.id)
                    ? "bg-yellow-500/30 border-yellow-500 text-yellow-300"
                    : "bg-gray-800 border-gray-700 text-gray-400"
                } border`}
              >
                {card.title}
              </button>
            ))}
          </div>
        </div>

        {/* Business Model */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Business Model
          </label>
          <div className="flex flex-wrap gap-2">
            {businessModels.map((model) => (
              <button
                key={model.value}
                onClick={() => setBusinessModel(model.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  businessModel === model.value
                    ? "bg-green-500/30 border-green-500 text-green-300"
                    : "bg-gray-800 border-gray-700 text-gray-400"
                } border`}
              >
                {model.label}
              </button>
            ))}
          </div>
        </div>

        {/* Market Description */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Target Market (optional)
          </label>
          <input
            type="text"
            value={marketDescription}
            onChange={(e) => setMarketDescription(e.target.value)}
            placeholder="e.g., Mid-market SaaS companies"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            maxLength={100}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 bg-gray-900/80 border-t border-gray-800 sticky bottom-0">
        <Button
          className="w-full"
          size="lg"
          disabled={!canSubmit || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit Concept"}
        </Button>
        {!canSubmit && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Fill in all required fields and select at least one of each card type
          </p>
        )}
      </div>
    </div>
  );
}
