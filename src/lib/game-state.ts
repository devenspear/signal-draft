import { customAlphabet } from "nanoid";
import {
  Game,
  GameState,
  Player,
  Card,
  StartupConcept,
  ConceptScore,
  DEFAULT_GAME_SETTINGS,
  GameSettings,
  CardDeck,
} from "./types";
import { getMasterCardDeck } from "./admin-kv";
import cardsData from "@/data/cards.json";

// Generate a 6-character room code (easy to read aloud)
const generateRoomCode = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  6
);

// Generate a unique ID
const generateId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  12
);

// Valid state transitions
const VALID_TRANSITIONS: Record<GameState, GameState[]> = {
  LOBBY: ["ROUND_TREND_DRAFT"],
  ROUND_TREND_DRAFT: ["ROUND_PROBLEM_DRAFT"],
  ROUND_PROBLEM_DRAFT: ["ROUND_TECH_ASSET_DRAFT"],
  ROUND_TECH_ASSET_DRAFT: ["BUILD_CONCEPTS"],
  BUILD_CONCEPTS: ["SCORING"],
  SCORING: ["SUMMARY"],
  SUMMARY: ["ENDED"],
  ENDED: [],
};

// Helper to load card deck from KV or fallback to JSON
async function getCardDeck(): Promise<CardDeck> {
  try {
    const kvDeck = await getMasterCardDeck();
    if (kvDeck) {
      return kvDeck;
    }
  } catch (error) {
    console.warn("Failed to load cards from KV, using JSON fallback:", error);
  }
  return cardsData as CardDeck;
}

// Create a new game
export async function createGame(hostName: string, settings?: Partial<GameSettings>): Promise<Game> {
  const roomCode = generateRoomCode();
  const hostPlayerId = generateId();
  const gameSettings = { ...DEFAULT_GAME_SETTINGS, ...settings };

  // Load cards from KV (with JSON fallback)
  const cardDeck = await getCardDeck();

  // Initialize cards for the game
  const cards: Card[] = [
    ...cardDeck.trends.map((c) => ({
      ...c,
      status: "available" as const,
      createdBy: "system" as const,
    })),
    ...cardDeck.problems.map((c) => ({
      ...c,
      status: "available" as const,
      createdBy: "system" as const,
    })),
    ...cardDeck.tech.map((c) => ({
      ...c,
      status: "available" as const,
      createdBy: "system" as const,
    })),
    ...cardDeck.assets.map((c) => ({
      ...c,
      status: "available" as const,
      createdBy: "system" as const,
    })),
    ...cardDeck.markets.map((c) => ({
      ...c,
      status: "available" as const,
      createdBy: "system" as const,
    })),
  ];

  const hostPlayer: Player = {
    id: hostPlayerId,
    name: hostName,
    isHost: true,
    isConnected: true,
    isReady: false,
    hand: [],
    draftedTrends: [],
    draftedProblems: [],
    draftedTech: [],
    hasLockedPicks: false,
  };

  return {
    id: generateId(),
    roomCode,
    createdAt: new Date().toISOString(),
    state: "LOBBY",
    hostPlayerId,
    players: [hostPlayer],
    settings: gameSettings,
    cards,
    playerHands: {},
    concepts: [],
    scoringComplete: [],
  };
}

// Add a player to a game
export function addPlayer(game: Game, playerName: string): { game: Game; playerId: string } {
  if (game.players.length >= game.settings.maxPlayers) {
    throw new Error("Game is full");
  }

  if (game.state !== "LOBBY" && game.state !== "ROUND_TREND_DRAFT") {
    throw new Error("Cannot join game after Round 1");
  }

  const playerId = generateId();
  const newPlayer: Player = {
    id: playerId,
    name: playerName,
    isHost: false,
    isConnected: true,
    isReady: false,
    hand: [],
    draftedTrends: [],
    draftedProblems: [],
    draftedTech: [],
    hasLockedPicks: false,
  };

  return {
    game: {
      ...game,
      players: [...game.players, newPlayer],
    },
    playerId,
  };
}

// Remove a player from a game
export function removePlayer(game: Game, playerId: string): Game {
  return {
    ...game,
    players: game.players.map((p) =>
      p.id === playerId ? { ...p, isConnected: false } : p
    ),
  };
}

// Mark player as ready
export function setPlayerReady(game: Game, playerId: string, ready: boolean): Game {
  return {
    ...game,
    players: game.players.map((p) =>
      p.id === playerId ? { ...p, isReady: ready } : p
    ),
  };
}

// Check if state transition is valid
export function canTransition(from: GameState, to: GameState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// Transition game state
export function transitionState(game: Game, newState: GameState): Game {
  if (!canTransition(game.state, newState)) {
    throw new Error(`Invalid transition from ${game.state} to ${newState}`);
  }

  let updatedGame = { ...game, state: newState };

  // Handle state-specific setup
  switch (newState) {
    case "ROUND_TREND_DRAFT":
      updatedGame = dealCards(updatedGame, "trend");
      break;
    case "ROUND_PROBLEM_DRAFT":
      updatedGame = dealCards(updatedGame, "problem");
      // Reset lock status for new round
      updatedGame.players = updatedGame.players.map((p) => ({
        ...p,
        hasLockedPicks: false,
      }));
      break;
    case "ROUND_TECH_ASSET_DRAFT":
      updatedGame = dealCards(updatedGame, "tech");
      updatedGame.players = updatedGame.players.map((p) => ({
        ...p,
        hasLockedPicks: false,
      }));
      break;
    case "BUILD_CONCEPTS":
      updatedGame.players = updatedGame.players.map((p) => ({
        ...p,
        hasLockedPicks: false,
      }));
      break;
    case "SCORING":
      updatedGame.scoringComplete = [];
      break;
  }

  return updatedGame;
}

// Deal cards to players for a round (excludes host - they don't draft)
function dealCards(game: Game, cardType: "trend" | "problem" | "tech"): Game {
  const availableCards = game.cards.filter(
    (c) => c.type === cardType && c.status === "available"
  );

  // Shuffle available cards
  const shuffled = [...availableCards].sort(() => Math.random() - 0.5);

  const cardsPerPlayer =
    cardType === "trend"
      ? game.settings.trendsDealtPerPlayer
      : cardType === "problem"
      ? game.settings.problemsDealtPerPlayer
      : game.settings.techDealtPerPlayer;

  const playerHands: Record<string, string[]> = {};
  const updatedCards = [...game.cards];

  // Only deal cards to non-host players (mobile users)
  const mobilePlayers = game.players.filter((p) => !p.isHost);

  mobilePlayers.forEach((player, index) => {
    const startIdx = index * cardsPerPlayer;
    const hand = shuffled.slice(startIdx, startIdx + cardsPerPlayer);
    playerHands[player.id] = hand.map((c) => c.id);

    // Mark cards as in_hand
    hand.forEach((card) => {
      const cardIndex = updatedCards.findIndex((c) => c.id === card.id);
      if (cardIndex >= 0) {
        updatedCards[cardIndex] = {
          ...updatedCards[cardIndex],
          status: "in_hand",
          ownerPlayerId: player.id,
        };
      }
    });
  });

  // Host gets empty hand but is auto-locked
  const hostPlayer = game.players.find((p) => p.isHost);
  if (hostPlayer) {
    playerHands[hostPlayer.id] = [];
  }

  return {
    ...game,
    playerHands,
    cards: updatedCards,
    players: game.players.map((p) => ({
      ...p,
      hand: playerHands[p.id] || [],
      // Auto-lock host since they don't participate in drafting
      hasLockedPicks: p.isHost ? true : p.hasLockedPicks,
    })),
  };
}

// Draft a card (select it for drafting, not yet locked)
export function selectCard(
  game: Game,
  playerId: string,
  cardId: string,
  selected: boolean
): Game {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  // Determine which draft array to modify based on game state
  let draftKey: "draftedTrends" | "draftedProblems" | "draftedTech";
  let maxPicks: number;

  switch (game.state) {
    case "ROUND_TREND_DRAFT":
      draftKey = "draftedTrends";
      maxPicks = game.settings.numTrendsPerPlayer;
      break;
    case "ROUND_PROBLEM_DRAFT":
      draftKey = "draftedProblems";
      maxPicks = game.settings.numProblemsPerPlayer;
      break;
    case "ROUND_TECH_ASSET_DRAFT":
      draftKey = "draftedTech";
      maxPicks = game.settings.numTechPerPlayer;
      break;
    default:
      throw new Error("Not in a draft round");
  }

  const currentPicks = player[draftKey];

  if (selected) {
    // Adding a card
    if (currentPicks.length >= maxPicks) {
      throw new Error(`Cannot pick more than ${maxPicks} cards`);
    }
    if (!player.hand.includes(cardId)) {
      throw new Error("Card not in player hand");
    }

    return {
      ...game,
      players: game.players.map((p) =>
        p.id === playerId
          ? { ...p, [draftKey]: [...currentPicks, cardId] }
          : p
      ),
    };
  } else {
    // Removing a card
    return {
      ...game,
      players: game.players.map((p) =>
        p.id === playerId
          ? { ...p, [draftKey]: currentPicks.filter((id) => id !== cardId) }
          : p
      ),
    };
  }
}

// Lock picks for the current round
export function lockPicks(game: Game, playerId: string): Game {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  // Mark cards as drafted
  let draftKey: "draftedTrends" | "draftedProblems" | "draftedTech";

  switch (game.state) {
    case "ROUND_TREND_DRAFT":
      draftKey = "draftedTrends";
      break;
    case "ROUND_PROBLEM_DRAFT":
      draftKey = "draftedProblems";
      break;
    case "ROUND_TECH_ASSET_DRAFT":
      draftKey = "draftedTech";
      break;
    default:
      throw new Error("Not in a draft round");
  }

  const draftedCardIds = player[draftKey];

  return {
    ...game,
    cards: game.cards.map((c) =>
      draftedCardIds.includes(c.id)
        ? { ...c, status: "drafted", ownerPlayerId: playerId }
        : c
    ),
    players: game.players.map((p) =>
      p.id === playerId ? { ...p, hasLockedPicks: true } : p
    ),
  };
}

// Check if all players have locked their picks (excludes host)
export function allPlayersLocked(game: Game): boolean {
  return game.players
    .filter((p) => p.isConnected && !p.isHost)
    .every((p) => p.hasLockedPicks);
}

// Submit a startup concept
export function submitConcept(
  game: Game,
  playerId: string,
  concept: Omit<StartupConcept, "id" | "ownerPlayerId" | "scores" | "aggregatedScore" | "superlatives">
): Game {
  if (game.state !== "BUILD_CONCEPTS") {
    throw new Error("Not in build phase");
  }

  const playerConcepts = game.concepts.filter((c) => c.ownerPlayerId === playerId);
  if (playerConcepts.length >= game.settings.numConceptsPerPlayer) {
    throw new Error("Maximum concepts reached");
  }

  const newConcept: StartupConcept = {
    ...concept,
    id: generateId(),
    ownerPlayerId: playerId,
    scores: [],
  };

  return {
    ...game,
    concepts: [...game.concepts, newConcept],
  };
}

// Submit a score for a concept
export function submitScore(
  game: Game,
  playerId: string,
  conceptId: string,
  score: Omit<ConceptScore, "playerId">
): Game {
  if (game.state !== "SCORING") {
    throw new Error("Not in scoring phase");
  }

  const conceptIndex = game.concepts.findIndex((c) => c.id === conceptId);
  if (conceptIndex < 0) {
    throw new Error("Concept not found");
  }

  const concept = game.concepts[conceptIndex];

  // Check if player already scored this concept
  if (concept.scores.some((s) => s.playerId === playerId)) {
    throw new Error("Already scored this concept");
  }

  const newScore: ConceptScore = {
    ...score,
    playerId,
  };

  const updatedConcept = {
    ...concept,
    scores: [...concept.scores, newScore],
  };

  const updatedConcepts = [...game.concepts];
  updatedConcepts[conceptIndex] = updatedConcept;

  // Check if player has scored all concepts
  const totalConcepts = game.concepts.length;
  const playerScoreCount = updatedConcepts.filter((c) =>
    c.scores.some((s) => s.playerId === playerId)
  ).length;

  let scoringComplete = game.scoringComplete;
  if (playerScoreCount === totalConcepts && !scoringComplete.includes(playerId)) {
    scoringComplete = [...scoringComplete, playerId];
  }

  return {
    ...game,
    concepts: updatedConcepts,
    scoringComplete,
  };
}

// Check if all players have finished scoring (excludes host)
export function allScoringComplete(game: Game): boolean {
  return game.players
    .filter((p) => p.isConnected && !p.isHost)
    .every((p) => game.scoringComplete.includes(p.id));
}

// Calculate aggregated scores and superlatives
export function calculateResults(game: Game): Game {
  if (game.state !== "SUMMARY" && game.state !== "SCORING") {
    return game;
  }

  const updatedConcepts = game.concepts.map((concept) => {
    if (concept.scores.length === 0) {
      return concept;
    }

    const avgPain =
      concept.scores.reduce((sum, s) => sum + s.pain, 0) / concept.scores.length;
    const avgMarketSize =
      concept.scores.reduce((sum, s) => sum + s.marketSize, 0) /
      concept.scores.length;
    const avgFounderFit =
      concept.scores.reduce((sum, s) => sum + s.founderFit, 0) /
      concept.scores.length;
    const investYesRate =
      concept.scores.filter((s) => s.wouldInvest).length / concept.scores.length;
    const totalScore = avgPain + avgMarketSize + avgFounderFit;

    return {
      ...concept,
      aggregatedScore: {
        avgPain: Math.round(avgPain * 10) / 10,
        avgMarketSize: Math.round(avgMarketSize * 10) / 10,
        avgFounderFit: Math.round(avgFounderFit * 10) / 10,
        investYesRate: Math.round(investYesRate * 100) / 100,
        totalScore: Math.round(totalScore * 10) / 10,
      },
    };
  });

  // Calculate superlatives
  const withScores = updatedConcepts.filter((c) => c.aggregatedScore);

  if (withScores.length > 0) {
    // Most Likely to Raise a Seed: highest avgPain + avgMarketSize
    const seedSort = [...withScores].sort(
      (a, b) =>
        (b.aggregatedScore!.avgPain + b.aggregatedScore!.avgMarketSize) -
        (a.aggregatedScore!.avgPain + a.aggregatedScore!.avgMarketSize)
    );
    const seedWinner = seedSort[0];

    // Best Founder Fit: highest avgFounderFit
    const fitSort = [...withScores].sort(
      (a, b) => b.aggregatedScore!.avgFounderFit - a.aggregatedScore!.avgFounderFit
    );
    const fitWinner = fitSort[0];

    // Most Outrageous: highest (avgPain + avgMarketSize) - avgFounderFit
    const outrageousSort = [...withScores].sort((a, b) => {
      const aScore =
        a.aggregatedScore!.avgPain +
        a.aggregatedScore!.avgMarketSize -
        a.aggregatedScore!.avgFounderFit;
      const bScore =
        b.aggregatedScore!.avgPain +
        b.aggregatedScore!.avgMarketSize -
        b.aggregatedScore!.avgFounderFit;
      return bScore - aScore;
    });
    const outrageousWinner = outrageousSort[0];

    // Apply superlatives
    const finalConcepts = updatedConcepts.map((c) => {
      const superlatives: string[] = [];
      if (c.id === seedWinner?.id) superlatives.push("Most Likely to Raise a Seed");
      if (c.id === fitWinner?.id) superlatives.push("Best Founder Fit");
      if (c.id === outrageousWinner?.id) superlatives.push("Most Outrageous");
      return { ...c, superlatives };
    });

    return { ...game, concepts: finalConcepts };
  }

  return { ...game, concepts: updatedConcepts };
}

// Get ranked concepts
export function getRankedConcepts(game: Game): StartupConcept[] {
  return [...game.concepts]
    .filter((c) => c.aggregatedScore)
    .sort((a, b) => b.aggregatedScore!.totalScore - a.aggregatedScore!.totalScore);
}
