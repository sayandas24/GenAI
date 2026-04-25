import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import SidePanel from "./features/chats/components/SidePanel";
import ChatPanel from "./features/chats/components/ChatPanel";
import SettingsPage from "./features/settings/pages/SettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 30, retry: 1 },
  },
});

type RightView = "chat" | "settings";

export default function App() {
  const [activeChatId, setActiveChatId] = useState("virtualmate");
  const [rightView, setRightView] = useState<RightView>("chat");

  function handleSelectChat(id: string) {
    setActiveChatId(id);
    setRightView("chat");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-[#0e1621] overflow-hidden">
        {/* ── Left panel ──────────────────────────────────────────── */}
        <SidePanel
          activeId={activeChatId}
          onSelectChat={handleSelectChat}
          onOpenSettings={() => setRightView("settings")}
        />

        {/* ── Right panel ─────────────────────────────────────────── */}
        <div className="flex flex-1 min-w-0 overflow-hidden">
          {rightView === "chat" ? (
            <ChatPanel onOpenSettings={() => setRightView("settings")} />
          ) : (
            <div className="flex flex-col flex-1 min-w-0 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl flex-shrink-0">
                <button
                  id="back-to-chat-btn"
                  onClick={() => setRightView("chat")}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back to chat
                </button>
              </div>
              <SettingsPage />
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}
