"use client";

import { Game } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface BoardLobbyProps {
  game: Game;
  onStartGame: () => void;
  isHost: boolean;
}

export function BoardLobby({ game, onStartGame, isHost }: BoardLobbyProps) {
  const connectedPlayers = game.players.filter((p) => p.isConnected);
  const canStart = connectedPlayers.length >= 2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Room Code Display */}
      <div className="text-center mb-12">
        <p className="text-gray-500 text-xl mb-2">Room Code</p>
        <div className="text-6xl md:text-8xl font-mono font-bold tracking-widest text-white board-text">
          {game.roomCode}
        </div>
        <p className="text-gray-500 mt-4">
          Share this code with players to join on their phones
        </p>
      </div>

      {/* Players List */}
      <div className="w-full max-w-2xl mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-300">
          Players ({connectedPlayers.length}/{game.settings.maxPlayers})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {game.players.map((player) => (
            <div
              key={player.id}
              className={`
                p-4 rounded-xl border text-center
                ${
                  player.isConnected
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-900/50 border-gray-800 opacity-50"
                }
              `}
            >
              <div className="text-xl font-semibold text-white">{player.name}</div>
              <div className="text-sm text-gray-500 mt-1">
                {player.isHost && <span className="text-green-400">Host</span>}
                {!player.isConnected && <span className="text-red-400">Disconnected</span>}
              </div>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: game.settings.maxPlayers - game.players.length }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="p-4 rounded-xl border border-dashed border-gray-800 text-center"
              >
                <div className="text-gray-600 animate-pulse-soft">
                  Waiting for player...
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Start Button (Host Only) */}
      {isHost && (
        <div className="text-center">
          <Button
            size="lg"
            onClick={onStartGame}
            disabled={!canStart}
            className="text-2xl px-12 py-6"
          >
            Start Game
          </Button>
          {!canStart && (
            <p className="text-gray-500 mt-4">
              Need at least 2 players to start
            </p>
          )}
        </div>
      )}

      {!isHost && (
        <div className="text-center text-gray-500 text-xl animate-pulse-soft">
          Waiting for host to start the game...
        </div>
      )}
    </div>
  );
}
