"use client";

import { Game, Player } from "@/lib/types";

interface PlayerLobbyProps {
  game: Game;
  currentPlayer: Player;
}

export function PlayerLobby({ game, currentPlayer }: PlayerLobbyProps) {
  const connectedPlayers = game.players.filter((p) => p.isConnected);

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-gray-500 text-sm mb-1">Room Code</p>
        <div className="text-3xl font-mono font-bold tracking-widest text-white">
          {game.roomCode}
        </div>
      </div>

      {/* Welcome Message */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome, {currentPlayer.name}!
        </h1>
        <p className="text-gray-400">
          {currentPlayer.isHost
            ? "You are the host. Start the game from the board screen."
            : "Waiting for the host to start the game..."}
        </p>
      </div>

      {/* Players List */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-400 mb-4">
          Players ({connectedPlayers.length}/{game.settings.maxPlayers})
        </h2>
        <div className="space-y-2">
          {game.players.map((player) => (
            <div
              key={player.id}
              className={`
                p-4 rounded-xl border flex items-center justify-between
                ${
                  player.id === currentPlayer.id
                    ? "bg-green-500/10 border-green-500/30"
                    : player.isConnected
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-900/50 border-gray-800 opacity-50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                  ${
                    player.id === currentPlayer.id
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {player.name}
                    {player.id === currentPlayer.id && (
                      <span className="text-green-400 text-sm ml-2">(You)</span>
                    )}
                  </div>
                  {player.isHost && (
                    <div className="text-xs text-green-400">Host</div>
                  )}
                </div>
              </div>
              {!player.isConnected && (
                <span className="text-xs text-red-400">Disconnected</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Waiting indicator */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-2 text-gray-500">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span>Waiting to start</span>
        </div>
      </div>
    </div>
  );
}
