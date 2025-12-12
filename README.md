# Signal Draft: Founder Edition

A web-based multiplayer drafting game where founders draft cards (Trends, Problems, Tech, Assets) to create startup concepts, then score them collaboratively.

## Live Demo

**Production:** https://signal-draft.vercel.app

## How to Play

1. **Host a Game** - One player creates a game room on a TV/monitor display
2. **Join via QR Code** - Mobile players scan the QR code or enter the 6-character room code
3. **Draft Cards** - Mobile players draft Trend, Problem, and Tech/Asset cards (host facilitates)
4. **Build Concepts** - Combine drafted cards into startup concepts
5. **Score & Vote** - Rate each other's concepts on pain, market size, and founder fit
6. **See Results** - View rankings and superlative awards

## Features

- **QR Code Join** - Board displays a dynamic QR code for instant mobile join
- **Host as Facilitator** - The game creator controls the flow but doesn't participate in drafting
- **Admin Panel** - Password-protected admin page to manage the card deck (`/admin`)
- **Real-time Sync** - All players see updates instantly via WebSocket

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
│   ├── /admin/page.tsx             # Admin panel for card management
│   ├── /create/page.tsx            # Host creates room
│   ├── /join/page.tsx              # Player joins with code
│   ├── /board/[roomCode]/page.tsx  # TV/monitor display (with QR code)
│   ├── /play/[roomCode]/page.tsx   # Mobile player view
│   └── /api
│       ├── /game/*                 # Game API routes
│       └── /admin/*                # Admin API routes
├── /components
│   ├── /admin/*                    # Admin panel components
│   ├── /board/*                    # Board view components
│   ├── /player/*                   # Mobile player components
│   └── /ui/*                       # Shared UI components
├── /lib
│   ├── game-state.ts               # State machine & transitions
│   ├── admin-kv.ts                 # Admin card deck KV operations
│   ├── pusher.ts                   # Pusher client/server setup
│   ├── kv.ts                       # Vercel KV helpers
│   └── types.ts                    # TypeScript types
├── /data
│   └── cards.json                  # Default card decks (74 cards)
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

   # Admin (optional for local dev)
   ADMIN_PASSWORD=your_admin_password
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

- **Lobby:** Mobile players join via QR code, host starts when ready
- **Draft Rounds:** Mobile players pick cards (host doesn't draft)
- **Build Phase:** Players create startup concepts from their drafted cards
- **Scoring:** Players rate each concept 1-5 on multiple criteria
- **Summary:** Final rankings and superlative awards displayed

## Views

| View | URL | Purpose |
|------|-----|---------|
| Board | `/board/[roomCode]` | TV/monitor display with QR code, shows all player progress |
| Player | `/play/[roomCode]` | Mobile-optimized for card selection and concept building |
| Admin | `/admin` | Password-protected card deck management |

## Card Types

| Type | Count | Description |
|------|-------|-------------|
| Trends | 20 | Macro trends shaping the future (AI, Climate, etc.) |
| Problems | 20 | Painful problems worth solving |
| Tech | 14 | Technologies to build solutions |
| Assets | 10 | Unique founder assets and expertise |
| Markets | 10 | Target market segments |

## Admin Panel

Access the admin panel at `/admin` to:

- **Import Cards** - Load default cards from JSON into KV storage
- **Edit Cards** - Modify card titles, descriptions, and attributes
- **Create Cards** - Add new cards to any category
- **Delete Cards** - Remove cards from the deck

Changes persist globally and affect all future games.

## License

Private project - All rights reserved
