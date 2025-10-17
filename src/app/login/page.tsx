"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, LogIn } from "lucide-react";

/**
 * 🎓 Fellow Login Page
 * Authenticates fellows via Supabase Auth (email + password)
 * On success: redirects to main assessment dashboard
 */

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ Login failed: ${error.message}`);
    } else if (data?.user) {
      setMessage("✅ Login successful! Redirecting...");
      // redirect to your dashboard or assessment page
      window.location.href = "/dashboard"; // adjust route
    } else {
      setMessage("Unexpected response. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#004854] to-[#0A7369] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#004854]">Fellow Login</h1>
          <p className="text-sm text-slate-600 mt-1">
            Sign in using your registered email and password.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004854]"
              placeholder="fellow@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004854]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#004854] hover:bg-[#0A7369] text-white font-medium py-2.5 rounded-lg transition"
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        {message && (
          <p
            className={`text-sm text-center mt-3 ${
              message.startsWith("✅")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-xs text-center text-slate-500 mt-6">
          Need help? Contact your TTN Coach or Administrator.
        </p>
      </div>
    </div>
  );
}
