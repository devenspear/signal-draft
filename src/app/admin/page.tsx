"use client";

import { useState, useEffect, useCallback } from "react";
import { CardDeck, CardType } from "@/lib/types";
import {
  AdminLogin,
  CardTypeSelector,
  CardList,
  CardEditor,
  CardDeleteConfirm,
} from "@/components/admin";
import { Button } from "@/components/ui/Button";

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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [cards, setCards] = useState<CardDeck | null>(null);
  const [selectedType, setSelectedType] = useState<CardType | "all">("all");
  const [editingCard, setEditingCard] = useState<{ card: DeckCard; type: CardType } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createType, setCreateType] = useState<CardType>("trend");
  const [deletingCard, setDeletingCard] = useState<{ card: DeckCard; type: CardType } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("admin_token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch cards when authenticated
  const fetchCards = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/cards", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        // Token invalid, log out
        setIsAuthenticated(false);
        setToken(null);
        sessionStorage.removeItem("admin_token");
        return;
      }

      const data = await res.json();
      setCards(data.cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      showMessage("error", "Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCards();
    }
  }, [isAuthenticated, token, fetchCards]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAuthenticated = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleMigrate = async () => {
    if (!token) return;

    setMigrating(true);
    try {
      const res = await fetch("/api/admin/cards/migrate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ force: !cards }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Migration failed");
      }

      showMessage("success", `Migration complete! ${data.counts.trends + data.counts.problems + data.counts.tech + data.counts.assets + data.counts.markets} cards imported.`);
      await fetchCards();
    } catch (error) {
      showMessage("error", error instanceof Error ? error.message : "Migration failed");
    } finally {
      setMigrating(false);
    }
  };

  const handleCreateCard = () => {
    setCreateType(selectedType === "all" ? "trend" : selectedType);
    setIsCreating(true);
  };

  const handleSaveCard = async (card: DeckCard, cardType: CardType) => {
    if (!token) return;

    const isEditing = !!editingCard;
    const url = isEditing
      ? `/api/admin/cards/${card.id}`
      : "/api/admin/cards";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card, cardType }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to save card");
    }

    setCards(data.deck);
    setEditingCard(null);
    setIsCreating(false);
    showMessage("success", isEditing ? "Card updated!" : "Card created!");
  };

  const handleDeleteCard = async () => {
    if (!token || !deletingCard) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/cards/${deletingCard.card.id}?type=${deletingCard.type}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete card");
      }

      setCards(data.deck);
      setDeletingCard(null);
      showMessage("success", "Card deleted!");
    } catch (error) {
      showMessage("error", error instanceof Error ? error.message : "Failed to delete card");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setToken(null);
    setCards(null);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={handleAuthenticated} />;
  }

  // Loading state
  if (loading && !cards) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Card Deck Admin</h1>
          <p className="text-gray-500 mt-1">Manage the master card deck</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back to Game
          </a>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
            message.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Actions bar */}
      <div className="p-6 flex flex-wrap gap-4 items-center border-b border-gray-800">
        <CardTypeSelector
          selectedType={selectedType}
          onChange={setSelectedType}
          includeAll
        />
        <div className="flex-1" />
        <Button onClick={handleCreateCard}>+ New Card</Button>
        {!cards && (
          <Button
            variant="secondary"
            onClick={handleMigrate}
            disabled={migrating}
          >
            {migrating ? "Migrating..." : "Import from JSON"}
          </Button>
        )}
        {cards && (
          <Button
            variant="ghost"
            onClick={handleMigrate}
            disabled={migrating}
          >
            {migrating ? "Resetting..." : "Reset to JSON"}
          </Button>
        )}
      </div>

      {/* Card stats */}
      {cards && (
        <div className="px-6 py-4 border-b border-gray-800 flex flex-wrap gap-4">
          <div className="text-sm text-gray-500">
            <span className="text-blue-400 font-medium">{cards.trends.length}</span> Trends
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-red-400 font-medium">{cards.problems.length}</span> Problems
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-purple-400 font-medium">{cards.tech.length}</span> Tech
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-yellow-400 font-medium">{cards.assets.length}</span> Assets
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-green-400 font-medium">{cards.markets.length}</span> Markets
          </div>
        </div>
      )}

      {/* Card list or empty state */}
      {cards ? (
        <CardList
          cards={cards}
          selectedType={selectedType}
          onEditCard={(card, type) => setEditingCard({ card, type })}
          onDeleteCard={(card, type) => setDeletingCard({ card, type })}
        />
      ) : (
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Cards Yet</h2>
          <p className="text-gray-500 mb-6">
            Import cards from the JSON file to get started, or create new cards
            manually.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleMigrate} disabled={migrating}>
              {migrating ? "Importing..." : "Import from JSON"}
            </Button>
            <Button variant="secondary" onClick={handleCreateCard}>
              Create Manually
            </Button>
          </div>
        </div>
      )}

      {/* Editor modal */}
      {(editingCard || isCreating) && (
        <CardEditor
          card={editingCard?.card}
          cardType={editingCard?.type || createType}
          onSave={handleSaveCard}
          onCancel={() => {
            setEditingCard(null);
            setIsCreating(false);
          }}
        />
      )}

      {/* Delete confirmation */}
      {deletingCard && (
        <CardDeleteConfirm
          card={deletingCard.card}
          cardType={deletingCard.type}
          onConfirm={handleDeleteCard}
          onCancel={() => setDeletingCard(null)}
          isDeleting={isDeleting}
        />
      )}
    </main>
  );
}
