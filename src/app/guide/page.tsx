"use client";

import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="small" />
          <Link
            href="/"
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors text-lg"
          >
            🎮 Play Now
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-transparent bg-clip-text leading-tight">
            🎯 How to Play
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Draft cards. Build startups. Vote on the best ideas. Let's go! 🚀
          </p>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">📊 The Basics</h2>
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="text-5xl md:text-6xl font-black text-green-400">2-6</div>
                <div className="text-lg md:text-xl text-gray-400 mt-2">Players</div>
              </div>
              <div className="p-4">
                <div className="text-5xl md:text-6xl font-black text-green-400">45-75</div>
                <div className="text-lg md:text-xl text-gray-400 mt-2">Minutes</div>
              </div>
              <div className="p-4">
                <div className="text-5xl md:text-6xl font-black text-green-400">4</div>
                <div className="text-lg md:text-xl text-gray-400 mt-2">Rounds</div>
              </div>
              <div className="p-4">
                <div className="text-5xl md:text-6xl font-black text-green-400">2</div>
                <div className="text-lg md:text-xl text-gray-400 mt-2">Concepts Each</div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Need */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">🛠️ What You Need</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-gray-900/30 rounded-xl p-5 border border-gray-800">
              <span className="text-3xl">📺</span>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">One Big Screen</div>
                <div className="text-lg text-gray-400 mt-1">TV, monitor, or laptop for the Board View — shows room code & game progress</div>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-gray-900/30 rounded-xl p-5 border border-gray-800">
              <span className="text-3xl">📱</span>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">Phones for Everyone</div>
                <div className="text-lg text-gray-400 mt-1">Each player uses their phone to draft cards, build concepts, and vote</div>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-gray-900/30 rounded-xl p-5 border border-gray-800">
              <span className="text-3xl">👥</span>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">2-6 Players</div>
                <div className="text-lg text-gray-400 mt-1">Grab your friends, co-founders, or team — the more perspectives, the better!</div>
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">🎭 Two Roles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/30 p-8">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-2xl md:text-3xl font-black text-green-400 mb-4">The Host</h3>
              <ul className="text-lg text-gray-300 space-y-3">
                <li>✓ Creates the game room</li>
                <li>✓ Shows Board View on the big screen</li>
                <li>✓ Controls when to start & advance</li>
                <li>✓ Does NOT draft (you're the MC!)</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/30 p-8">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-2xl md:text-3xl font-black text-emerald-400 mb-4">The Players</h3>
              <ul className="text-lg text-gray-300 space-y-3">
                <li>✓ Join with the room code</li>
                <li>✓ Draft cards on your phone</li>
                <li>✓ Build startup concepts</li>
                <li>✓ Vote & compete for the win!</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Game Phases */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-8">🎬 The 7 Phases</h2>

          {/* Phase 1: Setup */}
          <div className="mb-10 bg-gray-900/30 rounded-2xl p-6 md:p-8 border border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl md:text-3xl font-black text-white">1</div>
              <h3 className="text-2xl md:text-3xl font-black text-white">🏠 Lobby & Setup</h3>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
              Host creates a room and shares the <strong className="text-green-400">6-character code</strong>. Players join by scanning the QR code or typing it in. Easy!
            </p>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
              <div className="text-green-400 font-bold text-lg mb-1">👑 Host Action:</div>
              <div className="text-xl text-white">Hit "Start Game" when everyone's in!</div>
            </div>
          </div>

          {/* Phase 2: Trend Draft */}
          <div className="mb-10 bg-gray-900/30 rounded-2xl p-6 md:p-8 border border-blue-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl md:text-3xl font-black text-blue-400">2</div>
              <h3 className="text-2xl md:text-3xl font-black text-white">📈 Draft Trends</h3>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
              You get <strong className="text-blue-400">6 Trend cards</strong> — pick your favorite <strong className="text-blue-400">3</strong>! Trends are big forces shaping the future: AI, Climate, Creator Economy...
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-lg font-bold">6 cards dealt</span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-lg font-bold">Pick 3 ✨</span>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
              <div className="text-blue-400 font-bold text-lg mb-1">📱 How to Play:</div>
              <div className="text-xl text-white">Tap cards to select → Hit "Lock Picks" when done!</div>
            </div>
          </div>

          {/* Phase 3: Problem Draft */}
          <div className="mb-10 bg-gray-900/30 rounded-2xl p-6 md:p-8 border border-red-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-500/20 flex items-center justify-center text-2xl md:text-3xl font-black text-red-400">3</div>
              <h3 className="text-2xl md:text-3xl font-black text-white">🔥 Draft Problems</h3>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
              You get <strong className="text-red-400">6 Problem cards</strong> — pick <strong className="text-red-400">3</strong> painful challenges worth solving. Think: real frustrations people pay to fix!
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-lg font-bold">6 cards dealt</span>
              <span className="px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-lg font-bold">Pick 3 🎯</span>
            </div>
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
              <div className="text-red-400 font-bold text-lg mb-1">💡 Pro Tip:</div>
              <div className="text-xl text-white">Pick problems that pair well with your trends!</div>
            </div>
          </div>

          {/* Phase 4: Tech Draft */}
          <div className="mb-10 bg-gray-900/30 rounded-2xl p-6 md:p-8 border border-purple-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl md:text-3xl font-black text-purple-400">4</div>
              <h3 className="text-2xl md:text-3xl font-black text-white">⚡ Draft Tech</h3>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
              You get <strong className="text-purple-400">5 Tech cards</strong> — but you can only keep <strong className="text-purple-400">1</strong>! This is your startup's secret weapon. Choose wisely!
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-lg font-bold">5 cards dealt</span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-lg font-bold">Pick just 1! 🔮</span>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
              <div className="text-purple-400 font-bold text-lg mb-1">🤔 Why only 1?</div>
              <div className="text-xl text-white">Constraints = Creativity. Build around your core tech!</div>
            </div>
          </div>

          {/* Phase 5: Build Concepts */}
          <div className="mb-10 bg-gray-900/30 rounded-2xl p-6 md:p-8 border border-green-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-500/20 flex items-center justify-center text-2xl md:text-3xl font-black text-green-400">5</div>
              <h3 className="text-2xl md:text-3xl font-black text-white">🏗️ Build Concepts</h3>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
              Time to get creative! Combine your cards into <strong className="text-green-400">2 startup ideas</strong>. For each one, you'll fill in:
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-xl font-bold text-white">💼 Startup Name</div>
                <div className="text-gray-400">Something catchy!</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-xl font-bold text-white">✍️ One-Liner</div>
                <div className="text-gray-400">"We help [who] do [what]"</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-xl font-bold text-white">🎴 Your Cards</div>
                <div className="text-gray-400">Mix & match your picks</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-xl font-bold text-white">💰 Business Model</div>
                <div className="text-gray-400">How you make money</div>
              </div>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
              <div className="text-green-400 font-bold text-lg mb-1">🔄 Fun Fact:</div>
              <div className="text-xl text-white">You can use the same cards in both concepts!</div>
            </div>
          </div>

          {/* Phase 6: Scoring */}
          <div className="mb-10 bg-gray-900/30 rounded-2xl p-6 md:p-8 border border-yellow-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl md:text-3xl font-black text-yellow-400">6</div>
              <h3 className="text-2xl md:text-3xl font-black text-white">⭐ Scoring Time</h3>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
              Everyone votes on <strong className="text-yellow-400">every concept</strong> (yes, even your own!). Rate each idea on 4 dimensions:
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">😫</div>
                <div className="text-yellow-400 font-bold text-lg">Pain</div>
                <div className="text-gray-400">1-5 scale</div>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-yellow-400 font-bold text-lg">Market Size</div>
                <div className="text-gray-400">1-5 scale</div>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-yellow-400 font-bold text-lg">Founder Fit</div>
                <div className="text-gray-400">1-5 scale</div>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💵</div>
                <div className="text-yellow-400 font-bold text-lg">Would Invest?</div>
                <div className="text-gray-400">Yes or No</div>
              </div>
            </div>
          </div>

          {/* Phase 7: Results */}
          <div className="mb-10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 md:p-8 border border-cyan-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-2xl md:text-3xl font-black text-cyan-400">7</div>
              <h3 className="text-2xl md:text-3xl font-black text-white">🏆 Results & Awards!</h3>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
              The votes are in! See how every concept ranked, plus special awards:
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-900/50 rounded-xl p-4">
                <span className="text-4xl">🥇</span>
                <div>
                  <div className="text-xl font-bold text-white">Most Likely to Raise a Seed</div>
                  <div className="text-lg text-gray-400">Highest Pain + Market Size</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-900/50 rounded-xl p-4">
                <span className="text-4xl">🎯</span>
                <div>
                  <div className="text-xl font-bold text-white">Best Founder Fit</div>
                  <div className="text-lg text-gray-400">This founder was born for this!</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-900/50 rounded-xl p-4">
                <span className="text-4xl">🚀</span>
                <div>
                  <div className="text-xl font-bold text-white">Most Outrageous</div>
                  <div className="text-lg text-gray-400">Big swing, wild idea energy</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Types */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">🃏 The 4 Card Types</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-500/10 rounded-2xl border border-blue-500/30 p-6">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-2xl font-black text-blue-400 mb-3">Trends</h3>
              <p className="text-lg text-gray-300">
                Big forces shaping the future. AI revolution, climate tech, creator economy, longevity...
              </p>
            </div>
            <div className="bg-red-500/10 rounded-2xl border border-red-500/30 p-6">
              <div className="text-3xl mb-3">🔥</div>
              <h3 className="text-2xl font-black text-red-400 mb-3">Problems</h3>
              <p className="text-lg text-gray-300">
                Real pain points people face. The stuff they'd pay money to fix!
              </p>
            </div>
            <div className="bg-purple-500/10 rounded-2xl border border-purple-500/30 p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-2xl font-black text-purple-400 mb-3">Tech</h3>
              <p className="text-lg text-gray-300">
                Your startup's superpower. AI agents, blockchain, AR/VR, and more.
              </p>
            </div>
            <div className="bg-yellow-500/10 rounded-2xl border border-yellow-500/30 p-6">
              <div className="text-3xl mb-3">💎</div>
              <h3 className="text-2xl font-black text-yellow-400 mb-3">Assets</h3>
              <p className="text-lg text-gray-300">
                Your unfair advantages. Expertise, networks, data, GTM playbooks.
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">💡 Pro Tips</h2>
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700 p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl font-black text-green-400 flex-shrink-0">1</div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">Start with the problem 🎯</div>
                  <div className="text-lg text-gray-400 mt-1">The best startups solve real pain. Lead with the problem, not the tech.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl font-black text-green-400 flex-shrink-0">2</div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">Be super specific 🔍</div>
                  <div className="text-lg text-gray-400 mt-1">"We help mid-market SaaS CFOs" beats "We help businesses".</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl font-black text-green-400 flex-shrink-0">3</div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">Use your unfair advantages 💪</div>
                  <div className="text-lg text-gray-400 mt-1">What can YOU bring that others can't easily copy?</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl font-black text-green-400 flex-shrink-0">4</div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">Timing is everything ⏰</div>
                  <div className="text-lg text-gray-400 mt-1">Is the trend accelerating? Is the problem getting worse?</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl font-black text-green-400 flex-shrink-0">5</div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">Have FUN! 🎉</div>
                  <div className="text-lg text-gray-400 mt-1">The wildest combos often spark the best ideas.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">⚡ Quick Start Checklist</h2>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/30 p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-2xl">1️⃣</span>
                <span className="text-gray-200">Host creates a game at <span className="text-green-400 font-mono font-bold">/create</span></span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-2xl">2️⃣</span>
                <span className="text-gray-200">Put the Board View on the big screen 📺</span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-2xl">3️⃣</span>
                <span className="text-gray-200">Players scan QR or enter code at <span className="text-green-400 font-mono font-bold">/join</span></span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-2xl">4️⃣</span>
                <span className="text-gray-200">Host hits "Start Game" 🚀</span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-2xl">5️⃣</span>
                <span className="text-gray-200">Draft cards through 3 rounds 🎴</span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-2xl">6️⃣</span>
                <span className="text-gray-200">Build 2 startup concepts each 🏗️</span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-2xl">7️⃣</span>
                <span className="text-gray-200">Vote on everything ⭐</span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-2xl">8️⃣</span>
                <span className="text-gray-200">See results & celebrate! 🏆</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <Link
            href="/create"
            className="inline-block px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-black rounded-2xl text-2xl md:text-3xl transition-all transform hover:scale-105 shadow-2xl shadow-green-500/30 animate-pulse"
          >
            🎮 Start Playing Now!
          </Link>
          <p className="text-xl text-gray-400 mt-6">
            Or <Link href="/join" className="text-green-400 hover:text-green-300 font-bold underline underline-offset-4">join an existing game →</Link>
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-center">
        <p className="text-xl text-gray-500">Signal Draft: Founder Edition 🚀</p>
        <p className="text-gray-600 mt-2">Made for founders who think big</p>
      </footer>
    </main>
  );
}
