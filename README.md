# Signal Draft: Founder Edition

A web-based multiplayer drafting game where founders draft cards (Trends, Problems, Tech, Assets) to create startup concepts, then score them collaboratively.

## Live Demo

**Production:** https://signal-draft.vercel.app

## How to Play

1. **Host a Game** - One player creates a game room and shares the 6-character room code
2. **Join the Game** - Other players join using the room code on their mobile devices
3. **Draft Cards** - Take turns drafting Trend, Problem, and Tech/Asset cards
4. **Build Concepts** - Combine your drafted cards into startup concepts
5. **Score & Vote** - Rate each other's concepts on innovation, feasibility, and excitement
6. **See Results** - View rankings and superlative awards

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Realtime:** Pusher (WebSocket communication)
- **State Storage:** Vercel KV (Upstash Redis)
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

## Project Structure

```
/src
├── /app
│   ├── page.tsx                    # Landing page
│   ├── /create/page.tsx            # Host creates room
│   ├── /join/page.tsx              # Player joins with code
│   ├── /board/[roomCode]/page.tsx  # TV/monitor display
│   ├── /play/[roomCode]/page.tsx   # Mobile player view
│   └── /api/game/*                 # Game API routes
├── /components
│   ├── /board/*                    # Board view components
│   ├── /player/*                   # Mobile player components
│   └── /ui/*                       # Shared UI components
├── /lib
│   ├── game-state.ts               # State machine & transitions
│   ├── scoring.ts                  # Score aggregation
│   ├── pusher.ts                   # Pusher client/server setup
│   ├── kv.ts                       # Vercel KV helpers
│   └── types.ts                    # TypeScript types
├── /data
│   └── cards.json                  # Card decks
└── /hooks
    └── useGameState.ts             # React hook for realtime state
```

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Pusher account (free tier works)
- Vercel account with KV database

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/devenspear/signal-draft.git
   cd signal-draft
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with your credentials:
   ```env
   # Pusher
   PUSHER_APP_ID=your_app_id
   PUSHER_KEY=your_key
   PUSHER_SECRET=your_secret
   PUSHER_CLUSTER=us2
   NEXT_PUBLIC_PUSHER_KEY=your_key
   NEXT_PUBLIC_PUSHER_CLUSTER=us2

   # Vercel KV
   KV_REST_API_URL=your_kv_url
   KV_REST_API_TOKEN=your_kv_token
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Game Flow

```
LOBBY → TREND_DRAFT → PROBLEM_DRAFT → TECH_ASSET_DRAFT → BUILD_CONCEPTS → SCORING → SUMMARY
```

- **Lobby:** Players join, host starts when ready
- **Draft Rounds:** Snake draft order, each player picks cards
- **Build Phase:** Players create startup concepts from their cards
- **Scoring:** Players rate each concept 1-5 on multiple criteria
- **Summary:** Final rankings and superlative awards displayed

## Views

- **Board View** (`/board/[roomCode]`) - Display on TV/monitor, large typography for visibility
- **Player View** (`/play/[roomCode]`) - Mobile-optimized for individual players

## License

Private project - All rights reserved
