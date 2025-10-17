"use client";

import React, { JSX, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { User as UserIcon } from "lucide-react";
import StepIndicator from "../wizard/StepIndicator";

/**
 * 📘 Sidebar — Step indicator panel + user context display
 * Shows logged-in user's email at the top when authenticated
 */
export default function Sidebar(): JSX.Element {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  // 🔐 Fetch current user and listen for auth changes
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
        setUser(session?.user ?? null);
      }
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <aside
      className="
        flex-shrink-0 
        border-b md:border-b-0 md:border-r 
        border-[#004854]/15 
        bg-[#8ED1C1]/10 
        overflow-x-auto md:overflow-y-auto md:overflow-x-visible
        md:w-64
        max-h-20 md:max-h-none
        flex flex-col
      "
    >
      {/* === Top User Header (shown if logged in) === */}
      {user && (
        <div className="hidden md:flex items-center gap-2 px-4 py-3 border-b border-[#004854]/10 bg-white/80 backdrop-blur-sm">
          <div className="h-8 w-8 rounded-full bg-[#004854]/10 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-[#004854]" />
          </div>
          <div className="flex-1 leading-tight">
            <p className="text-xs font-medium text-[#004854] truncate">
              {user.email ?? "Unknown user"}
            </p>
            <p className="text-[10px] text-[#32353C]/60">Fellow Account</p>
          </div>
        </div>
      )}

      {/* === Step Indicator === */}
      <div className="flex-1 overflow-y-auto">
        <StepIndicator />
      </div>
    </aside>
  );
}
