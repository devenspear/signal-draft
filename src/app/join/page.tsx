"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function JoinGameForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setRoomCode(codeParam.toUpperCase());
    }
  }, [searchParams]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      const res = await fetch("/api/game/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: roomCode.trim().toUpperCase(),
          playerName: playerName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to join game");
      }

      // Store player ID in session storage
      const code = roomCode.trim().toUpperCase();
      sessionStorage.setItem(`player_${code}`, data.playerId);

      // Redirect to player view
      router.push(`/play/${code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join game");
      setIsJoining(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
        Join a Game
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Enter the room code shared by your host
      </p>

      <form onSubmit={handleJoin} className="space-y-6">
        <div>
          <label
            htmlFor="roomCode"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Room Code
          </label>
          <input
            id="roomCode"
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="e.g., ABC123"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
            maxLength={6}
            disabled={isJoining}
          />
        </div>

        <div>
          <label
            htmlFor="playerName"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Your Name
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            maxLength={30}
            disabled={isJoining}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isJoining}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-green-500/25 disabled:shadow-none"
        >
          {isJoining ? (
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
              Joining...
            </span>
          ) : (
            "Join Game"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Ask your host for the 6-character room code
      </p>
    </div>
  );
}

export default function JoinGame() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <Link
        href="/"
        className="absolute top-8 left-8 text-gray-500 hover:text-gray-300 transition-colors"
      >
        ← Back
      </Link>

      <Suspense
        fallback={
          <div className="w-full max-w-md text-center">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <JoinGameForm />
      </Suspense>
    </main>
  );
}
