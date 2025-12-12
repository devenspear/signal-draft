"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Signal Draft"
            width={500}
            height={300}
            className="mx-auto"
            priority
          />
        </div>
        <p className="text-xl md:text-2xl text-gray-400 mb-2">
          Founder Edition
        </p>
        <p className="text-lg md:text-xl text-gray-500 mt-6 max-w-xl mx-auto">
          Draft the future, assemble the startup. A multiplayer game for founders
          to generate and validate startup ideas together.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Link
          href="/create"
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/25"
        >
          Host a Game
        </Link>
        <Link
          href="/join"
          className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-105 border border-gray-700"
        >
          Join a Game
        </Link>
      </div>

      {/* How It Works */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-300">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="font-semibold mb-2">Draft Trends</h3>
            <p className="text-sm text-gray-500">
              Pick the macro trends you believe will shape the future
            </p>
          </div>
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="font-semibold mb-2">Draft Problems</h3>
            <p className="text-sm text-gray-500">
              Select painful problems worth solving
            </p>
          </div>
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="font-semibold mb-2">Build Concepts</h3>
            <p className="text-sm text-gray-500">
              Combine your cards into startup ideas
            </p>
          </div>
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">4</span>
            </div>
            <h3 className="font-semibold mb-2">Score & Rank</h3>
            <p className="text-sm text-gray-500">
              Everyone votes to surface the best ideas
            </p>
          </div>
        </div>
      </div>

      {/* Game Guide CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/guide"
          className="inline-block px-10 py-5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-bold rounded-2xl text-xl transition-all transform hover:scale-105 border border-gray-600 shadow-lg animate-pulse"
        >
          📖 Read the Game Guide
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>2-6 players | 45-75 minutes | Best played in person</p>
      </footer>
    </main>
  );
}
