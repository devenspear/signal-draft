Here we go: full PRD for **Signal Draft: Founder Edition** that you can hand straight to a designer/dev.

------

# Product Requirements Document

## Signal Draft: Founder Edition

------

## 1. Product Overview

**Name:** Signal Draft: Founder Edition
 **Tagline:** *Draft the future, assemble the startup.*
 **Form Factor:** Web-based multiplayer game, designed for:

- **Board View:** Shared screen (TV/monitor) in a room
- **Mobile Controllers:** Each player uses their phone’s browser

**Core Concept**

A facilitated drafting game where founders:

1. Draft **Trend**, **Problem**, **Tech**, and **Asset** cards
2. Combine them into **startup concepts**
3. Privately score each concept on venture-relevant dimensions
4. Walk away with the **top 1–2 ideas** to run through a deeper validation workshop

The game encodes your workshop flow into something playful, structured, and repeatable.

------

## 2. Goals & Success Criteria

### 2.1 Product Goals

- Help small groups of founders quickly **surface and shape startup ideas** based on shared convictions about the future.
- Provide a **repeatable, fun framework** for idea generation and initial venture filtering.
- Make sure the output is **practically useful**: startup concepts that can flow into a validation sprint / deck / memo.

### 2.2 Success Criteria (for v1)

- A complete game session (from lobby → summary) is playable by **2–6 players** in **45–75 minutes**.
- Output includes **at least 3 startup concepts** and clearly identified **top 1–2** with scores and a basic summary.
- Players report that:
  - The game helped them **see each other’s priorities** (trends/problems they care about).
  - They’d be **willing to run it again** with another group or at a retreat/workshop.

------

## 3. Target Users

- **Primary:** Founder groups / early-stage teams (2–6 people)
- **Secondary:**
  - Accelerators / incubators running cohort workshops
  - Angel syndicates / small funds running strategy offsites
  - Facilitators who want a structured “future → startup” game

Skill level: comfortable with basic startup concepts (TAM, pain, GTM, etc.). The game doesn’t need to teach fundamentals, but should lightly guide.

------

## 4. High-Level Experience

### 4.1 Session Flow (High-Level)

1. **Lobby / Room Setup**
   - Host creates a game room and shares the **room code**.
   - Players join from mobile, enter name, optionally select a role/avatar.
2. **Setup / Onboarding**
   - Host (or system) loads card sets:
     - Trends, Problems, Tech, Assets, Markets (optional).
   - Board shows the **draft grid** with card categories.
3. **Round 1 – Trend Draft**
   - Each player gets a **hand of Trend Cards** on mobile.
   - Players pick **N trends** (e.g., 3) they want to “own”.
   - Board animates picks and shows who drafted what.
4. **Round 2 – Problem Draft**
   - Players see **Problem Cards** (filtered or not) and pick problems they want to own.
   - Board updates problem column with ownership indicated.
5. **Round 3 – Tech & Asset Combo**
   - Players draft Tech Cards and assign Asset Cards (their own or shared) to build a **combo**.
   - Internally: each player is assembling ingredients for a startup skeleton.
6. **Build Phase – Startup Concept**
   - For each “combo”, players fill out a **one-liner** and pick:
     - Market (from Market Cards or custom)
     - Optional business model (SaaS, marketplace, etc.)
   - This creates **Startup Concept Cards**.
7. **Scoring Phase**
   - All startup concepts appear as **big tiles on the board**.
   - Each player privately scores each concept on mobile:
     - Pain / Urgency (1–5)
     - Market Size Potential (1–5)
     - Founder Fit (1–5)
     - “Would I invest?” (Yes/No)
   - Board shows aggregated scores, rankings, and fun **superlatives**.
8. **Summary**
   - Board highlights **Top 2 concepts** by combined score.
   - Show a simple summary (exportable) for each concept:
     - Ingredients (Trend, Problem, Tech, Assets, Market)
     - Scores breakdown
     - Superlatives won

------

## 5. Roles & Permissions

- **Host**
  - Creates game room
  - Controls advancing phases (Next Round, Start Scoring, etc.)
  - Can edit game settings (number of picks, scoring dimensions, timers)
- **Player**
  - Joins a room with a code
  - Drafts cards and builds concepts
  - Scores all concepts in Scoring Phase
- **Observer (optional, v2)**
  - Can view board but not participate

------

## 6. Platforms & Tech Assumptions

- **Frontend:** Next.js (React), hosted on Vercel
- **Realtime:** WebSockets (e.g., via a hosted service or a small Node server) or edge functions w/ web socket support
- **Storage:**
  - Session state in-memory or Redis-style store
  - Persistent storage for card templates / saved sessions (optional in v1)

------

## 7. Game Mechanics (Detailed)

### 7.1 Card Types

Each card type shares some common fields:

- `id`
- `type` (`trend`, `problem`, `tech`, `asset`, `market`)
- `title`
- `description`
- `tags` (array of strings)
- `createdBy` (system/user)
- `ownerPlayerId` (when drafted)
- `status` (`available`, `in_hand`, `drafted`, `locked`)

**Trend Cards**

- Example: “AI-native work”, “Climate adaptation”
- Additional fields:
  - `timeHorizon` (1–3 yrs, 3–5 yrs, 5+ yrs)
  - `category` (AI, Climate, Bio, Work, etc.)

**Problem Cards**

- Example: “AI overwhelm for solopreneurs”
- Additional fields:
  - `persona` (who experiences this)
  - `painLevelHint` (optional numeric hint)

**Tech Cards**

- Example: “AI agents”, “Biometrics”, “On-chain RWAs”
- Additional:
  - `techCategory` (AI, blockchain, hardware, etc.)

**Asset Cards**

- Represent founder strengths:
  - `ownerPlayerId` (fixed; each card belongs to a specific player)
  - Example: “Deven – Regenerative real estate”, “Michael – SaaS GTM”

**Market Cards (Optional v1)**

- Example: “Independent creators”, “Boutique developers”
- Might be system-generated or user-entered.

------

### 7.2 Draft Rules

Assume 4 players as the primary case, but support 2–6.

**Round 1 – Trend Draft**

- Each player is dealt **X Trend Cards** to their hand (e.g., 6).
- Each player must pick **N Trends** to draft (e.g., 3).
- Draft style:
  - v1: **Simple simultaneous pick** – everyone chooses independently, duplicates allowed **or** restricted by game setting.
  - (Optional future: serpentine, no duplicates.)

**Round 2 – Problem Draft**

Two options (configure via settings, default in bold):

1. **Default:** All players see a **global pool** of Problem Cards and pick N each.
2. Alternative: Each player sees Problems **related to their drafted Trends** (tag match).

Draft again is simultaneous pick; duplicates allowed or prevented via setting.

**Round 3 – Tech & Asset Combo**

- Each player:
  - Receives a hand of Tech Cards (e.g., 5).
  - Automatically has access to their **Asset Cards**.
  - May also be allowed to use **shared assets** or request other players’ assets (v2).
- Composition rules for each “combo”:
  - 1+ Trend Card (must be one they drafted in Round 1)
  - 1+ Problem Card (they drafted in Round 2)
  - 1 Tech Card
  - 1 Asset Card (their own; option to allow another’s in v2)

Each player can create **1–2 combos** → 1–2 startup concepts.

------

### 7.3 Startup Concept Structure

Each **Startup Concept** has:

- `id`
- `ownerPlayerId` (who created it)
- **Ingredients:**
  - `trendIds` (array)
  - `problemIds` (array)
  - `techIds` (array, usually 1)
  - `assetIds` (array, at least 1)
  - `marketId` (optional, or free-text)
- **Concept Fields (from Build Phase):**
  - `name` (short working title)
  - `oneLiner` (string, e.g., “We help X do Y by Z…”)
  - `marketDescription` (free-text or from Market Card)
  - `businessModel` (`saas`, `marketplace`, `transaction_fee`, `licensing`, `hybrid`, `other`)
- **Scoring:**
  - `scoresByPlayer`:
    - `playerId`
    - `pain` (1–5)
    - `marketSize` (1–5)
    - `founderFit` (1–5)
    - `wouldInvest` (boolean)
  - `aggregatedScore` (see below)
  - `superlatives` (calculated at the end)

------

### 7.4 Scoring Algorithm

Each player scores **each concept** (including their own) on four dimensions:

- Pain / Urgency: 1–5
- Market Size Potential: 1–5
- Founder Fit: 1–5
- Would I Invest?: Yes/No

**Per Concept Aggregations:**

- `avgPain = mean(all pain scores)`
- `avgMarketSize = mean(all market size scores)`
- `avgFounderFit = mean(all founder fit scores)`
- `investYesRate = (# of Yes votes) / (total votes)`

**Total Score (for ranking):**

A simple starting formula (tweakable later):

```text
totalScore = avgPain + avgMarketSize + avgFounderFit
```

Range: 3–15
 Board can rescale to 0–25 by multiplying by e.g., 1.6 for display (or just show the raw total with breakdown).

**Superlatives:**

- **Most Likely to Raise a Seed**
  - Highest `avgPain + avgMarketSize` (top composite of demand).
  - Tie-breaker: higher `investYesRate`.
- **Best Founder Fit**
  - Highest `avgFounderFit`.
- **Most Outrageous**
  - Highest variance in scores OR largest spread between `avgPain + avgMarketSize` and `avgFounderFit`.
  - Formula example:
    - `outrageousScore = (avgPain + avgMarketSize) - avgFounderFit`
    - Highest value wins.

These labels are computed once **all votes are submitted**.

------

## 8. UX / UI Requirements

### 8.1 Shared Board View (TV/Monitor)

**States:**

1. **Lobby**
   - Shows:
     - Game title and room code
     - Joined players list with names and “Ready” state
   - Host can:
     - Start game
     - Choose basic settings (# of picks per round, etc.)
2. **Round Views**
   - Each round shows a **big header**:
     - “Round 1 – Trend Draft”
     - Short instructions
   - Visual feedback:
     - For Trend/Problem/Tech rounds: show card columns filling as players draft.
     - Indicate players’ progress: e.g., small dots next to names, “3/3 picks locked”.
3. **Build Phase**
   - Show existing combos as they’re being named.
   - Once players lock in, show **Startup Concept tiles**.
4. **Scoring Phase**
   - Board shows:
     - List/grid of startups to be scored.
     - Real-time progress: “Sean: 4/4 concepts scored”.
   - After all players finish, animate reveal of scores.
5. **Summary**
   - Show ranked list of concepts with:
     - Name
     - One-liner
     - Key ingredients
     - Score breakdown
     - Superlatives badges

**Design Principles:**

- High contrast, large type readable from across a room.
- Minimal clickable elements; the host is the only one interacting with controls on this screen.

------

### 8.2 Mobile Player View

**Screens / States:**

1. **Join Room**
   - Fields:
     - Room code
     - Name
   - Optional: select role avatar (e.g., “Product”, “Capital”, “Tech”, “Wild Card”).
2. **Waiting / Lobby**
   - Shows:
     - List of players
     - “Waiting for host to start…” message
3. **Draft Screens (Rounds 1–3)**
   - Show:
     - Round title + instructions at top.
     - Card list / grid with:
       - Title
       - Short description
       - Tags
     - Selected card count: “2 / 3 picked”.
   - Actions:
     - Tap card to select/deselect.
     - “Lock Picks” button to finalize.
4. **Build Phase – Concept Builder**
   - Show:
     - Selected Trend(s), Problem(s), Tech, Asset(s)
     - Editable fields:
       - Name (short text input)
       - One-liner (single text area with prefilled template)
       - Market (dropdown from Market Cards or free-text)
       - Business model (radio buttons)
     - “Save Concept” button.
   - Option: limit each player to **1 or 2 concepts**.
5. **Scoring Phase**
   - For each concept:
     - Show concept card summary:
       - Name
       - One-liner
       - Key ingredients
     - Four scoring inputs:
       - Pain (1–5) – slider or discrete buttons
       - Market Size (1–5)
       - Founder Fit (1–5)
       - Would I Invest? (Yes/No toggle)
     - “Next Concept” button.
   - Progress indicator:
     - “Concept 2 of 4”
6. **End of Game**
   - Show:
     - Summary of top concepts (same as board)
     - Player’s own created concepts highlighted
   - Optional: “Export summary link” (v2).

------

## 9. Game State & Transitions

### 9.1 High-Level State Machine

- `LOBBY`
- `ROUND_TREND_DRAFT`
- `ROUND_PROBLEM_DRAFT`
- `ROUND_TECH_ASSET_DRAFT`
- `BUILD_CONCEPTS`
- `SCORING`
- `SUMMARY`
- `ENDED`

**Transitions:**

- `LOBBY` → `ROUND_TREND_DRAFT` (triggered by host)
- `ROUND_TREND_DRAFT` → `ROUND_PROBLEM_DRAFT`
  - All players have locked picks **or** host forces advance.
- `ROUND_PROBLEM_DRAFT` → `ROUND_TECH_ASSET_DRAFT`
  - Same condition.
- `ROUND_TECH_ASSET_DRAFT` → `BUILD_CONCEPTS`
- `BUILD_CONCEPTS` → `SCORING`
  - Triggered by host, with min required concepts present.
- `SCORING` → `SUMMARY`
  - All scoring complete **or** host forces advance.
- `SUMMARY` → `ENDED`
  - Host ends game (or time-out after some period).

------

## 10. Data Model (v1)

Simplified shape (not strict schema, but conceptual):

```ts
type Player = {
  id: string;
  name: string;
  role?: string;
  isHost: boolean;
  isConnected: boolean;
};

type CardType = "trend" | "problem" | "tech" | "asset" | "market";

type Card = {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  tags?: string[];
  meta?: Record<string, any>;
  createdBy: "system" | "host" | "player";
  ownerPlayerId?: string;    // for drafted or asset cards
  status: "available" | "in_hand" | "drafted" | "locked";
};

type ConceptScore = {
  playerId: string;
  pain: number;         // 1–5
  marketSize: number;   // 1–5
  founderFit: number;   // 1–5
  wouldInvest: boolean;
};

type StartupConcept = {
  id: string;
  ownerPlayerId: string;
  name: string;
  oneLiner: string;
  marketDescription?: string;
  businessModel?: string;
  trendIds: string[];
  problemIds: string[];
  techIds: string[];
  assetIds: string[];
  marketId?: string;
  scores: ConceptScore[];
  aggregatedScore?: {
    avgPain: number;
    avgMarketSize: number;
    avgFounderFit: number;
    investYesRate: number;
    totalScore: number;
  };
  superlatives?: string[];
};

type GameState =
  | "LOBBY"
  | "ROUND_TREND_DRAFT"
  | "ROUND_PROBLEM_DRAFT"
  | "ROUND_TECH_ASSET_DRAFT"
  | "BUILD_CONCEPTS"
  | "SCORING"
  | "SUMMARY"
  | "ENDED";

type Game = {
  id: string;
  createdAt: string;
  state: GameState;
  hostPlayerId: string;
  players: Player[];
  settings: {
    maxPlayers: number;
    numTrendsPerPlayer: number;
    numProblemsPerPlayer: number;
    numConceptsPerPlayer: number;
    allowDuplicateDrafts: boolean;
  };
  cards: Card[];
  concepts: StartupConcept[];
};
```

------

## 11. Realtime & Networking

### 11.1 Requirements

- Low latency for:
  - Draft picks appearing on board
  - Progress updates for scoring
- Support **2–6 concurrent players** per room.
- Handle reconnects (e.g., player refreshes page).

### 11.2 Patterns

- Rooms are identified by a short **code** (e.g., `DS-MWSH-01`).
- When a player joins:
  - They subscribe to the room’s state via WebSocket.
- Client-side:
  - React components listen to room state updates and rerender.

------

## 12. Edge Cases & Error Handling

- Player disconnects mid-round:
  - Keep their drafted cards and scores that are already registered.
  - If a player has not finished scoring after X time, host gets an option:
    - “Advance anyway (missing scores ignored)”
- Player joins late:
  - Allowed in LOBBY and Round 1.
  - Block join after Build Phase starts (v1).
- Host disconnects:
  - If host reconnects within X minutes, keep game running.
  - Option (v2): auto-assign a new host.
- Duplicate picks:
  - If `allowDuplicateDrafts = false`, and two players try to draft same card:
    - First one wins; second sees an error and must choose a different card.

------

## 13. Non-functional Requirements

- **Performance:** Board should update within ~300ms of events.
- **Availability:** v1 is workshop/tool, so “best effort” is acceptable; no strict SLA.
- **Security:**
  - Room codes should be unguessable enough to prevent random collision (e.g., 6–8 characters).
  - No sensitive data; treat as low-risk.
- **Privacy:** No PII beyond names; no login required in v1.

------

## 14. v1 Scope vs Future Enhancements

### In-Scope for v1

- Create and join game rooms

- Predefined card sets (seeded JSON in the codebase)

- Simple settings:

  - # of cards per round

  - Allow/disallow duplicate drafts

- Full flow:

  - Trend, Problem, Tech & Asset drafts
  - 1–2 concepts per player
  - Scoring with 3 numeric dimensions + Yes/No

- Aggregated scoring + superlatives

- Summary view on board (no persistent export required; screenshot is fine)

### Potential v2 / v3 Features

- Card editor: customize cards pre-game (add your own Trends/Problems/etc.).
- Persistent storage of sessions and export:
  - PDF / Notion / Google Doc export.
- Support for **Observers** (board-only viewers).
- Additional scoring dimensions (e.g., “Speed to revenue”, “Team excitement”).
- AI assistants:
  - Suggest card combinations
  - Auto-generate one-liners
  - Cluster concepts across multiple sessions.

------

If you’d like, next step is to:

- Turn this into **tickets / tasks** for dev (e.g., broken down by page/feature), or
- Layer in an **AI-assisted mode** (e.g., LLM that suggests Trends/Problems or helps players refine their one-liners) to make Signal Draft even more “Deven-coded.”