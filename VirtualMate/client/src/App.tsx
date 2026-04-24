import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import ChatMain from "./features/chats/pages/ChatMain";
import SettingsPage from "./features/settings/pages/SettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 30, retry: 1 },
  },
});

type Page = "chat" | "settings";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("chat");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-slate-950 overflow-hidden">

        {/* ── Sidebar nav ────────────────────────────────────────────── */}
        <nav className="flex flex-col items-center gap-2 px-2 py-4 border-r border-white/5 bg-slate-900/80 backdrop-blur-xl w-14 flex-shrink-0">
          {/* Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-3 flex-shrink-0">
            <span className="text-white font-bold text-xs">VM</span>
          </div>

          {/* Chat */}
          <NavButton
            id="nav-chat"
            active={activePage === "chat"}
            tooltip="Chat"
            onClick={() => setActivePage("chat")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </NavButton>

          {/* Settings */}
          <NavButton
            id="nav-settings"
            active={activePage === "settings"}
            tooltip="Settings"
            onClick={() => setActivePage("settings")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </NavButton>
        </nav>

        {/* ── Page content ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden">
          {activePage === "chat" ? <ChatMain /> : <SettingsPage />}
        </div>
      </div>
    </QueryClientProvider>
  );
}

// ── NavButton helper ────────────────────────────────────────────────────────

interface NavButtonProps {
  id: string;
  active: boolean;
  tooltip: string;
  onClick: () => void;
  children: React.ReactNode;
}

function NavButton({ id, active, tooltip, onClick, children }: NavButtonProps) {
  return (
    <button
      id={id}
      title={tooltip}
      onClick={onClick}
      className={`
        relative group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
        ${active
          ? "bg-violet-600/20 text-violet-400 border border-violet-500/30 shadow-sm shadow-violet-500/20"
          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
        }
      `}
    >
      {children}
      {/* Active indicator dot */}
      {active && (
        <span className="absolute -right-px top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-400 rounded-full" />
      )}
    </button>
  );
}
