"use client";

import React, { JSX, useEffect, useState } from "react";
import { LogOut, LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser, Session, AuthChangeEvent } from "@supabase/supabase-js";
import DownloadRubricButton from "../DownloadButton";

/**
 * 🧭 TopBar — Header bar with app title, user session, and login/logout controls.
 */
export default function TopBar(): JSX.Element {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  // 🔐 Fetch current user and subscribe to auth changes
  useEffect(() => {
    let active = true;

    const fetchUser = async (): Promise<void> => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && active) {
        setUser(data.user ?? null);
      }
    };

    fetchUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (active) setUser(session?.user ?? null);
      }
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  // 🚪 Logout handler
  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // 🔑 Login handler
  const handleLogin = (): void => {
    window.location.href = "/login";
  };

  return (
    <header className="h-14 sm:h-16 flex-shrink-0 bg-white border-b border-[#004854]/15 shadow-sm">
      <div className="max-w-[1800px] mx-auto h-full w-full px-3 sm:px-6 flex items-center justify-between">
        {/* === Left Logo Section === */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shadow-sm
                       bg-gradient-to-r from-[#004854] to-[#8ED1C1]"
          >
            <span className="text-white font-bold text-xs sm:text-sm tracking-wide">TN</span>
          </div>
          <div className="leading-tight">
            <h1 className="font-semibold text-[#004854] text-sm sm:text-lg">
              Teach the Nation
            </h1>
            <p className="text-xs sm:text-sm text-[#32353C]/70 hidden sm:block">
              Learner Competency Assessment Tool
            </p>
          </div>
        </div>

        {/* === Center Info === */}
        <div className="text-right leading-tight hidden md:block">
          <div className="font-medium text-[#32353C] text-sm">
            Conscious Leadership Development
          </div>
          <div className="text-xs text-[#838998] mt-0.5">Secure Assessment Portal</div>
        </div>

        {/* === Right Auth Section === */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <div className="hidden sm:block text-xs text-[#32353C]/80">
                <span className="font-medium text-[#004854]">
                  {user.email ?? "Unknown user"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-[#004854] hover:text-[#0A7369] transition"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 text-sm font-medium text-[#004854] hover:text-[#0A7369] transition"
              aria-label="Login"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
