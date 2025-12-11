// ============================================
// Signal Draft: Founder Edition - Type Definitions
// ============================================

// Game States
export type GameState =
  | "LOBBY"
  | "ROUND_TREND_DRAFT"
  | "ROUND_PROBLEM_DRAFT"
  | "ROUND_TECH_ASSET_DRAFT"
  | "BUILD_CONCEPTS"
  | "SCORING"
  | "SUMMARY"
  | "ENDED";

// Card Types
export type CardType = "trend" | "problem" | "tech" | "asset" | "market";
export type CardStatus = "available" | "in_hand" | "drafted" | "locked";

// Base Card interface
export interface BaseCard {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  tags?: string[];
  createdBy: "system" | "host" | "player";
  ownerPlayerId?: string;
  status: CardStatus;
}

// Trend Card
export interface TrendCard extends BaseCard {
  type: "trend";
  timeHorizon?: "1-3 yrs" | "3-5 yrs" | "5+ yrs";
  category?: string;
}

// Problem Card
export interface ProblemCard extends BaseCard {
  type: "problem";
  persona?: string;
  painLevelHint?: number;
}

// Tech Card
export interface TechCard extends BaseCard {
  type: "tech";
  techCategory?: string;
}

// Asset Card
export interface AssetCard extends BaseCard {
  type: "asset";
  ownerPlayerName?: string;
}

// Market Card
export interface MarketCard extends BaseCard {
  type: "market";
}

// Union type for all cards
export type Card = TrendCard | ProblemCard | TechCard | AssetCard | MarketCard;

// Player
export interface Player {
  id: string;
  name: string;
  role?: string;
  isHost: boolean;
  isConnected: boolean;
  isReady: boolean;
  // Cards in hand for current round
  hand: string[];
  // Drafted cards across all rounds
  draftedTrends: string[];
  draftedProblems: string[];
  draftedTech: string[];
  // Locked status for current round
  hasLockedPicks: boolean;
}

// Concept Score from a single player
export interface ConceptScore {
  playerId: string;
  pain: number; // 1-5
  marketSize: number; // 1-5
  founderFit: number; // 1-5
  wouldInvest: boolean;
}

// Aggregated scores for a concept
export interface AggregatedScore {
  avgPain: number;
  avgMarketSize: number;
  avgFounderFit: number;
  investYesRate: number;
  totalScore: number;
}

// Business model options
export type BusinessModel =
  | "saas"
  | "marketplace"
  | "transaction_fee"
  | "licensing"
  | "hybrid"
  | "other";

// Startup Concept
export interface StartupConcept {
  id: string;
  ownerPlayerId: string;
  name: string;
  oneLiner: string;
  marketDescription?: string;
  businessModel?: BusinessModel;
  // Ingredient IDs
  trendIds: string[];
  problemIds: string[];
  techIds: string[];
  assetIds: string[];
  marketId?: string;
  // Scores
  scores: ConceptScore[];
  aggregatedScore?: AggregatedScore;
  superlatives?: string[];
}

// Superlative types
export type Superlative =
  | "Most Likely to Raise a Seed"
  | "Best Founder Fit"
  | "Most Outrageous";

// Game Settings
export interface GameSettings {
  maxPlayers: number;
  numTrendsPerPlayer: number;
  numProblemsPerPlayer: number;
  numTechPerPlayer: number;
  numConceptsPerPlayer: number;
  allowDuplicateDrafts: boolean;
  // Cards dealt to hand each round
  trendsDealtPerPlayer: number;
  problemsDealtPerPlayer: number;
  techDealtPerPlayer: number;
}

// Default game settings
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  maxPlayers: 6,
  numTrendsPerPlayer: 3,
  numProblemsPerPlayer: 3,
  numTechPerPlayer: 1,
  numConceptsPerPlayer: 2,
  allowDuplicateDrafts: true,
  trendsDealtPerPlayer: 6,
  problemsDealtPerPlayer: 6,
  techDealtPerPlayer: 5,
};

// Main Game object
export interface Game {
  id: string;
  roomCode: string;
  createdAt: string;
  state: GameState;
  hostPlayerId: string;
  players: Player[];
  settings: GameSettings;
  // All cards in the game
  cards: Card[];
  // Player's hands for current round (playerId -> cardIds)
  playerHands: Record<string, string[]>;
  // Created startup concepts
  concepts: StartupConcept[];
  // Track which players have finished scoring
  scoringComplete: string[];
}

// API Action types
export type GameActionType =
  | "START_GAME"
  | "DRAFT_CARDS"
  | "LOCK_PICKS"
  | "ADVANCE_ROUND"
  | "SUBMIT_CONCEPT"
  | "SUBMIT_SCORE"
  | "END_GAME";

export interface GameAction {
  type: GameActionType;
  playerId: string;
  roomCode: string;
  payload?: Record<string, unknown>;
}

// Pusher event types
export type PusherEventType =
  | "game:state-update"
  | "player:joined"
  | "player:left"
  | "player:ready"
  | "draft:pick"
  | "draft:locked"
  | "concept:submitted"
  | "score:submitted"
  | "phase:changed";

// Card deck structure (for JSON import)
export interface CardDeck {
  trends: Omit<TrendCard, "status" | "createdBy" | "ownerPlayerId">[];
  problems: Omit<ProblemCard, "status" | "createdBy" | "ownerPlayerId">[];
  tech: Omit<TechCard, "status" | "createdBy" | "ownerPlayerId">[];
  assets: Omit<AssetCard, "status" | "createdBy">[];
  markets: Omit<MarketCard, "status" | "createdBy" | "ownerPlayerId">[];
}
