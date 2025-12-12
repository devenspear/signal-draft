import { NextRequest, NextResponse } from "next/server";
import {
  transitionState,
  selectCard,
  lockPicks,
  submitConcept,
  submitScore,
  setPlayerReady,
  allPlayersLocked,
  allScoringComplete,
  calculateResults,
  removePlayer,
} from "@/lib/game-state";
import { getGame, saveGame } from "@/lib/kv";
import { broadcastStateChange, broadcastEvent, PUSHER_EVENTS } from "@/lib/pusher";
import { GameActionType, GameState } from "@/lib/types";

interface ActionPayload {
  type: GameActionType;
  playerId: string;
  roomCode: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: ActionPayload = await request.json();
    const { type, playerId, roomCode, payload } = body;

    if (!type || !playerId || !roomCode) {
      return NextResponse.json(
        { error: "type, playerId, and roomCode are required" },
        { status: 400 }
      );
    }

    // Get current game state
    let game = await getGame(roomCode.toUpperCase());

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    // Verify player exists in game
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return NextResponse.json(
        { error: "Player not in game" },
        { status: 403 }
      );
    }

    // Handle different action types
    switch (type) {
      case "START_GAME": {
        // Only host can start game
        if (!player.isHost) {
          return NextResponse.json(
            { error: "Only host can start game" },
            { status: 403 }
          );
        }
        if (game.state !== "LOBBY") {
          return NextResponse.json(
            { error: "Game already started" },
            { status: 400 }
          );
        }
        if (game.players.length < 2) {
          return NextResponse.json(
            { error: "Need at least 2 players to start" },
            { status: 400 }
          );
        }

        game = transitionState(game, "ROUND_TREND_DRAFT");
        await broadcastEvent(roomCode, PUSHER_EVENTS.PHASE_CHANGED, {
          newState: game.state,
        });
        break;
      }

      case "DRAFT_CARDS": {
        const { cardId, selected } = payload || {};
        if (!cardId || typeof selected !== "boolean") {
          return NextResponse.json(
            { error: "cardId and selected are required" },
            { status: 400 }
          );
        }

        game = selectCard(game, playerId, cardId, selected);
        await broadcastEvent(roomCode, PUSHER_EVENTS.DRAFT_PICK, {
          playerId,
          cardId,
          selected,
        });
        break;
      }

      case "LOCK_PICKS": {
        game = lockPicks(game, playerId);
        await broadcastEvent(roomCode, PUSHER_EVENTS.DRAFT_LOCKED, {
          playerId,
        });

        // Check if all players locked and auto-advance
        if (allPlayersLocked(game)) {
          const nextState = getNextDraftState(game.state);
          if (nextState) {
            game = transitionState(game, nextState);
            await broadcastEvent(roomCode, PUSHER_EVENTS.PHASE_CHANGED, {
              newState: game.state,
            });
          }
        }
        break;
      }

      case "ADVANCE_ROUND": {
        // Only host can force advance
        if (!player.isHost) {
          return NextResponse.json(
            { error: "Only host can advance round" },
            { status: 403 }
          );
        }

        const nextState = getNextState(game.state);
        if (nextState) {
          game = transitionState(game, nextState);

          // If moving to summary, calculate results
          if (game.state === "SUMMARY") {
            game = calculateResults(game);
          }

          await broadcastEvent(roomCode, PUSHER_EVENTS.PHASE_CHANGED, {
            newState: game.state,
          });
        }
        break;
      }

      case "SUBMIT_CONCEPT": {
        const { name, oneLiner, trendIds, problemIds, techIds, assetIds, marketId, marketDescription, businessModel } =
          payload || {};

        if (!name || !oneLiner || !trendIds || !problemIds || !techIds || !assetIds) {
          return NextResponse.json(
            { error: "Concept details are required" },
            { status: 400 }
          );
        }

        game = submitConcept(game, playerId, {
          name,
          oneLiner,
          trendIds,
          problemIds,
          techIds,
          assetIds,
          marketId,
          marketDescription,
          businessModel,
        });

        await broadcastEvent(roomCode, PUSHER_EVENTS.CONCEPT_SUBMITTED, {
          playerId,
          conceptCount: game.concepts.filter((c) => c.ownerPlayerId === playerId).length,
        });
        break;
      }

      case "SUBMIT_SCORE": {
        const { conceptId, pain, marketSize, founderFit, wouldInvest } = payload || {};

        if (
          !conceptId ||
          typeof pain !== "number" ||
          typeof marketSize !== "number" ||
          typeof founderFit !== "number" ||
          typeof wouldInvest !== "boolean"
        ) {
          return NextResponse.json(
            { error: "Score details are required" },
            { status: 400 }
          );
        }

        game = submitScore(game, playerId, conceptId, {
          pain,
          marketSize,
          founderFit,
          wouldInvest,
        });

        await broadcastEvent(roomCode, PUSHER_EVENTS.SCORE_SUBMITTED, {
          playerId,
          conceptId,
        });

        // Check if all scoring complete and auto-advance
        if (allScoringComplete(game)) {
          game = transitionState(game, "SUMMARY");
          game = calculateResults(game);
          await broadcastEvent(roomCode, PUSHER_EVENTS.PHASE_CHANGED, {
            newState: game.state,
          });
        }
        break;
      }

      case "END_GAME": {
        // Only host can end game
        if (!player.isHost) {
          return NextResponse.json(
            { error: "Only host can end game" },
            { status: 403 }
          );
        }

        if (game.state === "SUMMARY") {
          game = transitionState(game, "ENDED");
          await broadcastEvent(roomCode, PUSHER_EVENTS.PHASE_CHANGED, {
            newState: game.state,
          });
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown action type: ${type}` },
          { status: 400 }
        );
    }

    // Save updated game
    await saveGame(game);

    // Broadcast lightweight state change notification
    await broadcastStateChange(roomCode, game.state, type, game.players.length);

    return NextResponse.json({
      success: true,
      game,
    });
  } catch (error) {
    console.error("Error processing action:", error);
    const message = error instanceof Error ? error.message : "Failed to process action";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Helper to get next draft state
function getNextDraftState(currentState: GameState): GameState | null {
  switch (currentState) {
    case "ROUND_TREND_DRAFT":
      return "ROUND_PROBLEM_DRAFT";
    case "ROUND_PROBLEM_DRAFT":
      return "ROUND_TECH_ASSET_DRAFT";
    case "ROUND_TECH_ASSET_DRAFT":
      return "BUILD_CONCEPTS";
    default:
      return null;
  }
}

// Helper to get next state (for manual advancement)
function getNextState(currentState: GameState): GameState | null {
  switch (currentState) {
    case "LOBBY":
      return "ROUND_TREND_DRAFT";
    case "ROUND_TREND_DRAFT":
      return "ROUND_PROBLEM_DRAFT";
    case "ROUND_PROBLEM_DRAFT":
      return "ROUND_TECH_ASSET_DRAFT";
    case "ROUND_TECH_ASSET_DRAFT":
      return "BUILD_CONCEPTS";
    case "BUILD_CONCEPTS":
      return "SCORING";
    case "SCORING":
      return "SUMMARY";
    case "SUMMARY":
      return "ENDED";
    default:
      return null;
  }
}

// Handle player disconnect
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomCode = searchParams.get("roomCode");
    const playerId = searchParams.get("playerId");

    if (!roomCode || !playerId) {
      return NextResponse.json(
        { error: "roomCode and playerId are required" },
        { status: 400 }
      );
    }

    let game = await getGame(roomCode.toUpperCase());

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    game = removePlayer(game, playerId);
    await saveGame(game);

    await broadcastEvent(roomCode, PUSHER_EVENTS.PLAYER_LEFT, { playerId });
    await broadcastStateChange(roomCode, game.state, "PLAYER_LEFT", game.players.length);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing player:", error);
    return NextResponse.json(
      { error: "Failed to remove player" },
      { status: 500 }
    );
  }
}
