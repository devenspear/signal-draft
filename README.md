# Signal Draft: Founder Edition 🚀

A web-based multiplayer drafting game where founders draft cards (Trends, Problems, Tech, Assets) to create startup concepts, then score them collaboratively to surface the best ideas.

## 🎮 Live Demo

**Production:** https://signal-draft.vercel.app

| Page | URL |
|------|-----|
| Home | https://signal-draft.vercel.app |
| Game Guide | https://signal-draft.vercel.app/guide |
| Host a Game | https://signal-draft.vercel.app/create |
| Join a Game | https://signal-draft.vercel.app/join |
| Admin Panel | https://signal-draft.vercel.app/admin |

## 📖 How to Play

Check out the full interactive guide at [/guide](https://signal-draft.vercel.app/guide)!

**Quick Overview:**
1. **🏠 Host a Game** - One player creates a game room on a TV/monitor display
2. **📱 Join via QR Code** - Mobile players scan the QR code or enter the 6-character room code
3. **🎴 Draft Cards** - 3 rounds of drafting from ALL available cards: Trends (pick 3 from 20), Problems (pick 3 from 20), Tech (pick 1 from 14)
4. **🏗️ Build Concepts** - Combine drafted cards into 2 startup concepts each
5. **⭐ Score & Vote** - Rate each concept on Pain, Market Size, Founder Fit + Would Invest?
6. **🏆 See Results** - View rankings and superlative awards!

## ✨ Features

- **QR Code Join** - Board displays a dynamic QR code for instant mobile join
- **Host as Facilitator** - The game creator controls the flow but doesn't participate in drafting
- **Real-time Sync** - All players see updates instantly via Pusher WebSockets
- **Interactive Guide** - Beautiful game guide at `/guide` with emojis and visual hierarchy
- **Admin Panel** - Password-protected admin page to manage the card deck (`/admin`)
- **Mobile-First Player View** - Optimized touch interface for drafting and voting

## 🎯 Game Settings

| Setting | Value |
|---------|-------|
| Players | 2-6 |
| Duration | 45-75 minutes |
| Trends per player | All 20 available → Pick 3 |
| Problems per player | All 20 available → Pick 3 |
| Tech per player | All 14 available → Pick 1 |
| Concepts per player | 2 |

## 🃏 Card Types

| Type | Count | Description |
|------|-------|-------------|
| 📈 Trends | 20 | Macro trends shaping the future (AI, Climate, Creator Economy...) |
| 🔥 Problems | 20 | Painful problems worth solving |
| ⚡ Tech | 14 | Technologies to build solutions |
| 💎 Assets | 10 | Unique founder assets and expertise |
| 🎯 Markets | 10 | Target market segments |

## 🏆 Superlative Awards

At the end of each game, special awards are given:

- **🥇 Most Likely to Raise a Seed** - Highest Pain + Market Size
- **🎯 Best Founder Fit** - Highest Founder Fit score
- **🚀 Most Outrageous** - Big opportunity, low founder fit (the moonshot!)

## 🛠️ Tech Stack

- **Framework:** Next.js 16+ with App Router
- **Realtime:** Pusher (WebSocket communication)
- **State Storage:** Vercel KV (Upstash Redis)
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

## 📁 Project Structure

```
/src
├── /app
│   ├── page.tsx                    # Landing page
│   ├── /guide/page.tsx             # Interactive game guide
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
│   └── /ui/*                       # Shared UI components (Logo, Button, QR)
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

## 💻 Local Development

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

   # Admin
   ADMIN_PASSWORD=your_admin_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## 🎬 Game Flow

```
LOBBY → TREND_DRAFT → PROBLEM_DRAFT → TECH_ASSET_DRAFT → BUILD_CONCEPTS → SCORING → SUMMARY
```

| Phase | What Happens |
|-------|--------------|
| Lobby | Mobile players join via QR code, host starts when ready |
| Trend Draft | Each player picks 3 trends from all 20 available |
| Problem Draft | Each player picks 3 problems from all 20 available |
| Tech Draft | Each player picks 1 tech from all 14 available |
| Build Concepts | Players create 2 startup concepts using their cards |
| Scoring | Everyone rates every concept (1-5 scales + Would Invest) |
| Summary | Rankings revealed, superlatives awarded! |

## 📱 Views

| View | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page with Host/Join buttons |
| Guide | `/guide` | Interactive game instructions |
| Board | `/board/[roomCode]` | TV/monitor display with QR code |
| Player | `/play/[roomCode]` | Mobile interface for drafting & voting |
| Admin | `/admin` | Password-protected card management |

## ⚙️ Admin Panel

Access the admin panel at `/admin` to:

- **Import Cards** - Load default cards from JSON into KV storage
- **Edit Cards** - Modify card titles, descriptions, and attributes
- **Create Cards** - Add new cards to any category
- **Delete Cards** - Remove cards from the deck

Changes persist globally and affect all future games.

## 📄 License

Private project - All rights reserved
