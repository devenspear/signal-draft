"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface AdminLoginProps {
  onAuthenticated: (token: string) => void;
}

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      sessionStorage.setItem("admin_token", data.token);
      onAuthenticated(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-950">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
          Admin Access
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Enter the admin password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !password}
            className="w-full"
          >
            {isLoading ? "Authenticating..." : "Access Admin"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          <a href="/" className="hover:text-gray-400 transition-colors">
            Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
