"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

export default function CreateGame() {
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const res = await fetch("/api/game/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: hostName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create game");
      }

      // Store player ID in session storage
      sessionStorage.setItem(`player_${data.roomCode}`, data.playerId);

      // Redirect to board view for host
      router.push(`/board/${data.roomCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game");
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="absolute top-8 left-8">
        <Logo size="small" />
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
          Host a Game
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Create a new game room and invite your fellow founders
        </p>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label
              htmlFor="hostName"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Your Name
            </label>
            <input
              id="hostName"
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              maxLength={30}
              disabled={isCreating}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-green-500/25 disabled:shadow-none"
          >
            {isCreating ? (
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
                Creating...
              </span>
            ) : (
              "Create Game Room"
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="font-medium mb-2 text-gray-300">As the host, you will:</h3>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Control when to start the game</li>
            <li>• Advance rounds when needed</li>
            <li>• Share the room code with players</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
