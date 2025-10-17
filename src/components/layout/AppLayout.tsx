"use client";

import React from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

/**
 * 🏗️ AppLayout
 * Full-screen authenticated layout:
 * - TopBar spans full width
 * - Sidebar extends full height (below TopBar)
 * - Main content scrolls independently
 */

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#F9FAFB] text-[#32353C] overflow-hidden">
      {/* === Top Navigation Bar (full width) === */}
      <header className="flex-shrink-0 w-full z-30">
        <TopBar />
      </header>

      {/* === Main Body (fills remaining height) === */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: fixed height stretch under TopBar */}
        <aside
          className="
            hidden md:flex 
            flex-col 
            w-64 
            bg-[#8ED1C1]/10 
            border-r border-[#004854]/15 
            overflow-y-auto 
          "
        >
          <Sidebar />
        </aside>

        {/* Main scrollable content */}
        <main
          className="
            flex-1 
            overflow-y-auto 
            bg-white md:bg-transparent 
            min-w-0 
          "
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
