"use client";

import { useState, useEffect } from "react";
import { CardType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { nanoid } from "nanoid";

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

interface CardEditorProps {
  card?: DeckCard;
  cardType: CardType;
  onSave: (card: DeckCard, cardType: CardType) => Promise<void>;
  onCancel: () => void;
}

const timeHorizonOptions = ["1-3 yrs", "3-5 yrs", "5+ yrs"];

export function CardEditor({ card, cardType, onSave, onCancel }: CardEditorProps) {
  const isEditing = !!card;

  const [formData, setFormData] = useState<DeckCard>({
    id: card?.id || nanoid(12),
    type: cardType,
    title: card?.title || "",
    description: card?.description || "",
    tags: card?.tags || [],
    timeHorizon: card?.timeHorizon || "",
    category: card?.category || "",
    persona: card?.persona || "",
    painLevelHint: card?.painLevelHint || 3,
    techCategory: card?.techCategory || "",
    ownerPlayerName: card?.ownerPlayerName || "",
  });

  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Update form when card type changes (for new cards)
  useEffect(() => {
    if (!isEditing) {
      setFormData((prev) => ({ ...prev, type: cardType }));
    }
  }, [cardType, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePainLevelChange = (level: number) => {
    setFormData((prev) => ({ ...prev, painLevelHint: level }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);

    try {
      await onSave(formData, cardType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save card");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? "Edit Card" : "Create New Card"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isEditing ? `Editing ${cardType} card` : `Creating new ${cardType} card`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Card title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Card description"
            />
          </div>

          {/* Type-specific fields */}
          {cardType === "trend" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Time Horizon
                </label>
                <select
                  name="timeHorizon"
                  value={formData.timeHorizon}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select horizon</option>
                  {timeHorizonOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., AI, Climate, Health"
                />
              </div>
            </>
          )}

          {cardType === "problem" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Persona
                </label>
                <input
                  type="text"
                  name="persona"
                  value={formData.persona}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Solopreneur, Enterprise IT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Pain Level (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handlePainLevelChange(level)}
                      className={`
                        w-10 h-10 rounded-lg font-medium transition-all
                        ${
                          formData.painLevelHint === level
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }
                      `}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {cardType === "tech" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Tech Category
              </label>
              <input
                type="text"
                name="techCategory"
                value={formData.techCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., AI, Blockchain, Biotech"
              />
            </div>
          )}

          {cardType === "asset" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerPlayerName"
                value={formData.ownerPlayerName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Deven, Michael"
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Add a tag"
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-400"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Create Card"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
