"use client";

import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="small" />
          <Link
            href="/"
            className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg transition-colors"
          >
            Play Now
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
          How to Play Signal Draft
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          A multiplayer game where founders draft cards to create and validate startup ideas together.
        </p>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400">2-6</div>
                <div className="text-sm text-gray-500">Players</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">45-75</div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">4</div>
                <div className="text-sm text-gray-500">Rounds</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">2</div>
                <div className="text-sm text-gray-500">Concepts Each</div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Need */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">What You Need</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">●</span>
              <span><strong>One large screen</strong> (TV, monitor, or laptop) to display the Board View - this shows the room code, player list, and game progress</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">●</span>
              <span><strong>Mobile devices</strong> for each player - this is where you'll draft cards, build concepts, and vote</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">●</span>
              <span><strong>2-6 players</strong> ready to think like founders</span>
            </li>
          </ul>
        </section>

        {/* Roles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Roles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-green-400 mb-2">Host</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Creates the game room</li>
                <li>• Displays the Board View on the main screen</li>
                <li>• Controls when to start the game</li>
                <li>• Can advance rounds if needed</li>
                <li>• Does NOT draft cards (facilitator role)</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-emerald-400 mb-2">Players</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Join using the room code</li>
                <li>• Draft cards on their mobile device</li>
                <li>• Build startup concepts</li>
                <li>• Vote on all concepts</li>
                <li>• Compete for the highest score</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Game Phases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Game Phases</h2>

          {/* Phase 1: Setup */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400">1</div>
              <h3 className="text-xl font-bold text-white">Lobby & Setup</h3>
            </div>
            <div className="ml-13 pl-8 border-l-2 border-gray-800">
              <p className="text-gray-400 mb-3">
                The host creates a game and shares the 6-character room code. Players join by entering the code on their phones. A QR code is also displayed for easy joining.
              </p>
              <div className="bg-gray-900/30 rounded-lg p-4 text-sm">
                <div className="text-gray-500 mb-1">Host Action:</div>
                <div className="text-white">Click "Start Game" when all players have joined</div>
              </div>
            </div>
          </div>

          {/* Phase 2: Trend Draft */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl font-bold text-blue-400">2</div>
              <h3 className="text-xl font-bold text-white">Draft Trends</h3>
            </div>
            <div className="ml-13 pl-8 border-l-2 border-blue-500/30">
              <p className="text-gray-400 mb-3">
                Each player receives 6 Trend cards and must select 3 to keep. Trends represent macro forces shaping the future (AI, Climate, Demographics, etc.).
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">6 cards dealt</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Pick 3</span>
              </div>
              <div className="bg-gray-900/30 rounded-lg p-4 text-sm">
                <div className="text-gray-500 mb-1">Player Action:</div>
                <div className="text-white">Tap cards to select, then tap "Lock Picks" when ready</div>
              </div>
            </div>
          </div>

          {/* Phase 3: Problem Draft */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-xl font-bold text-red-400">3</div>
              <h3 className="text-xl font-bold text-white">Draft Problems</h3>
            </div>
            <div className="ml-13 pl-8 border-l-2 border-red-500/30">
              <p className="text-gray-400 mb-3">
                Each player receives 6 Problem cards and must select 3 to keep. Problems represent painful challenges faced by specific personas.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">6 cards dealt</span>
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">Pick 3</span>
              </div>
              <div className="bg-gray-900/30 rounded-lg p-4 text-sm">
                <div className="text-gray-500 mb-1">Strategy Tip:</div>
                <div className="text-white">Choose problems that pair well with your drafted trends</div>
              </div>
            </div>
          </div>

          {/* Phase 4: Tech Draft */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl font-bold text-purple-400">4</div>
              <h3 className="text-xl font-bold text-white">Draft Tech</h3>
            </div>
            <div className="ml-13 pl-8 border-l-2 border-purple-500/30">
              <p className="text-gray-400 mb-3">
                Each player receives 5 Tech cards and must select 1 to keep. Tech cards represent the core technology that will power your startup.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">5 cards dealt</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Pick 1</span>
              </div>
              <div className="bg-gray-900/30 rounded-lg p-4 text-sm">
                <div className="text-gray-500 mb-1">Why only 1?</div>
                <div className="text-white">Constraints breed creativity - build around your core technology</div>
              </div>
            </div>
          </div>

          {/* Phase 5: Build Concepts */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-xl font-bold text-green-400">5</div>
              <h3 className="text-xl font-bold text-white">Build Concepts</h3>
            </div>
            <div className="ml-13 pl-8 border-l-2 border-green-500/30">
              <p className="text-gray-400 mb-3">
                Using your drafted cards, create 2 startup concepts. For each concept, you'll provide:
              </p>
              <ul className="text-gray-400 text-sm space-y-2 mb-4">
                <li>• <strong className="text-white">Startup Name</strong> - A catchy name for your venture</li>
                <li>• <strong className="text-white">One-Liner</strong> - "We help [who] do [what] by [how]"</li>
                <li>• <strong className="text-white">Card Selection</strong> - Which of your drafted cards to use</li>
                <li>• <strong className="text-white">Assets</strong> - Unique advantages you bring (shared pool)</li>
                <li>• <strong className="text-white">Business Model</strong> - How you'll make money</li>
              </ul>
              <div className="bg-gray-900/30 rounded-lg p-4 text-sm">
                <div className="text-gray-500 mb-1">Pro Tip:</div>
                <div className="text-white">You can use the same cards in multiple concepts</div>
              </div>
            </div>
          </div>

          {/* Phase 6: Scoring */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-xl font-bold text-yellow-400">6</div>
              <h3 className="text-xl font-bold text-white">Scoring</h3>
            </div>
            <div className="ml-13 pl-8 border-l-2 border-yellow-500/30">
              <p className="text-gray-400 mb-3">
                Every player votes on every concept (including their own). Rate each concept on:
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-yellow-400 font-bold text-sm">Pain (1-5)</div>
                  <div className="text-gray-500 text-xs">How painful is this problem?</div>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-yellow-400 font-bold text-sm">Market Size (1-5)</div>
                  <div className="text-gray-500 text-xs">How big is the opportunity?</div>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-yellow-400 font-bold text-sm">Founder Fit (1-5)</div>
                  <div className="text-gray-500 text-xs">Is this founder right for it?</div>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-yellow-400 font-bold text-sm">Would Invest?</div>
                  <div className="text-gray-500 text-xs">Yes or No</div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 7: Results */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-xl font-bold text-cyan-400">7</div>
              <h3 className="text-xl font-bold text-white">Results & Superlatives</h3>
            </div>
            <div className="ml-13 pl-8 border-l-2 border-cyan-500/30">
              <p className="text-gray-400 mb-3">
                Concepts are ranked by total score. Special awards are given:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-white font-medium">Most Likely to Raise a Seed</span>
                  <span className="text-gray-500 text-sm">- Highest Pain + Market Size</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-white font-medium">Best Founder Fit</span>
                  <span className="text-gray-500 text-sm">- Highest Founder Fit score</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <span className="text-white font-medium">Most Outrageous</span>
                  <span className="text-gray-500 text-sm">- Big opportunity, low founder fit</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Card Types</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-5">
              <h3 className="text-lg font-bold text-blue-400 mb-2">Trends</h3>
              <p className="text-gray-400 text-sm">
                Macro forces shaping the future. Examples: AI-Native Work, Climate Adaptation, Creator Economy, Longevity Tech.
              </p>
            </div>
            <div className="bg-red-500/10 rounded-xl border border-red-500/30 p-5">
              <h3 className="text-lg font-bold text-red-400 mb-2">Problems</h3>
              <p className="text-gray-400 text-sm">
                Painful challenges faced by specific personas. Examples: AI Overwhelm for Solopreneurs, Compliance Burden for Startups.
              </p>
            </div>
            <div className="bg-purple-500/10 rounded-xl border border-purple-500/30 p-5">
              <h3 className="text-lg font-bold text-purple-400 mb-2">Tech</h3>
              <p className="text-gray-400 text-sm">
                Technologies that power solutions. Examples: AI Agents, Knowledge Graphs, Edge Computing, AR/Spatial Computing.
              </p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl border border-yellow-500/30 p-5">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Assets</h3>
              <p className="text-gray-400 text-sm">
                Unique advantages brought by founders. Examples: Domain expertise, network access, proprietary data, GTM playbooks.
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Tips for Great Concepts</h2>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">1.</span>
                <span><strong>Start with the problem.</strong> The best startups solve real pain. Lead with the problem, not the technology.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">2.</span>
                <span><strong>Be specific.</strong> "We help mid-market SaaS CFOs" beats "We help businesses".</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">3.</span>
                <span><strong>Leverage your assets.</strong> What unique advantage can you bring that others can't easily replicate?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">4.</span>
                <span><strong>Think about timing.</strong> Is the trend accelerating? Is the problem becoming more acute?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">5.</span>
                <span><strong>Have fun.</strong> Some of the best ideas come from unexpected combinations.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30 p-6">
            <ol className="space-y-3 text-gray-300">
              <li><strong className="text-green-400">1.</strong> Host goes to <span className="text-white font-mono">/create</span> and creates a game room</li>
              <li><strong className="text-green-400">2.</strong> Host displays the Board View on a shared screen</li>
              <li><strong className="text-green-400">3.</strong> Players scan the QR code or enter the room code at <span className="text-white font-mono">/join</span></li>
              <li><strong className="text-green-400">4.</strong> Host clicks "Start Game" when everyone has joined</li>
              <li><strong className="text-green-400">5.</strong> Players draft cards on their phones through 3 rounds</li>
              <li><strong className="text-green-400">6.</strong> Players build 2 startup concepts each</li>
              <li><strong className="text-green-400">7.</strong> Everyone votes on all concepts</li>
              <li><strong className="text-green-400">8.</strong> See the results and discuss!</li>
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <Link
            href="/create"
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/25"
          >
            Host a Game Now
          </Link>
          <p className="text-gray-500 mt-4">
            Or <Link href="/join" className="text-green-400 hover:underline">join an existing game</Link>
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        <p>Signal Draft: Founder Edition</p>
      </footer>
    </main>
  );
}
