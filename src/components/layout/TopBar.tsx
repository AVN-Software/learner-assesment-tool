'use client';

import React, { JSX, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogIn, LogOut, X, Loader2, Shield, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * 🧭 TopBar — Header bar with app title, user session, and login/logout controls.
 */
export default function TopBar(): JSX.Element {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check initial session
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const goToAdminPanel = () => {
    router.push('/admin');
  };

  return (
    <>
      <header className="h-14 flex-shrink-0 border-b border-[#004854]/15 bg-white shadow-sm sm:h-16">
        <div className="h-16 flex-shrink-0 border-b border-[#004854]/15 bg-white shadow-sm">
          <div className="mx-auto flex h-full w-full max-w-[1800px] items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#004854] to-[#8ED1C1] shadow-sm">
                <span className="text-sm font-bold tracking-wide text-white">TN</span>
              </div>
              <div className="leading-tight">
                <h1 className="text-lg font-semibold text-[#004854]">Teach the Nation</h1>
                <p className="text-sm text-[#32353C]/70">Learner Competency Assessment Tool</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right leading-tight">
                <div className="text-sm font-medium text-[#32353C]">
                  Conscious Leadership Development
                </div>
                <div className="mt-0.5 text-xs text-[#838998]">Secure Assessment Portal</div>
              </div>

              {/* Auth Button */}
              {loading ? (
                <div className="flex h-9 w-24 items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-[#004854]" />
                </div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#004854]">{user.email}</p>
                    <p className="text-xs text-[#838998]">Admin</p>
                  </div>

                  {/* Admin Panel Button */}
                  <button
                    onClick={goToAdminPanel}
                    className="flex items-center gap-2 rounded-lg border border-[#004854]/20 bg-white px-3 py-2 text-sm font-medium text-[#004854] transition hover:bg-[#004854]/5"
                  >
                    <UserCog className="h-4 w-4" />
                    Admin Panel
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg border border-[#004854]/20 bg-white px-3 py-2 text-sm font-medium text-[#004854] transition hover:bg-[#004854]/5"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#004854] to-[#0a5e6c] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
                >
                  <Shield className="h-4 w-4" />
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          supabase={supabase}
          onLoginSuccess={() => {
            // Redirect to admin panel after successful login
            router.push('/admin');
          }}
        />
      )}
    </>
  );
}

/* ---------------------------------------------------------------------------
   Login Modal Component
--------------------------------------------------------------------------- */

interface LoginModalProps {
  onClose: () => void;
  supabase: ReturnType<typeof createClient>;
  onLoginSuccess?: () => void;
}

function LoginModal({ onClose, supabase, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Success - close modal and trigger success callback
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-gradient-to-r from-[#004854] to-[#0a5e6c] p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Admin Login</h3>
          </div>
          <button onClick={onClose} className="rounded p-1 transition hover:bg-white/20">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#004854]/20 focus:outline-none"
              placeholder="admin@teachthenation.org"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#004854]/20 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#004854] to-[#0a5e6c] px-4 py-2.5 text-sm font-medium text-white transition hover:shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="rounded-b-xl border-t border-slate-200 bg-slate-50 px-6 py-3">
          <p className="text-center text-xs text-slate-500">
            Secure access for authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
