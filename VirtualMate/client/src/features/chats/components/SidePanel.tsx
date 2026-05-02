import React from "react";
import { useChats } from "../hooks/useAvatars";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Represents a single conversation entry in the sidebar.
 * When you add more chat types in future, extend this list.
 */
interface Conversation {
  id: string;
  name: string;
  /** First letter(s) shown in the avatar circle */
  initials: string;
  /** Tailwind gradient classes for the avatar */
  avatarGradient: string;
}

/**
 * Static list of conversations.
 * In the future, replace this with a DB-driven list.
 */
const CONVERSATIONS: Conversation[] = [
  {
    id: "virtualmate",
    name: "VirtualMate",
    initials: "VM",
    avatarGradient: "from-violet-500 to-indigo-600",
  },
  // Add more conversations here as you build them:
  // { id: "helper", name: "Study Helper", initials: "SH", avatarGradient: "from-emerald-500 to-teal-600" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface SidePanelProps {
  activeId: string;
  onSelectChat: (id: string) => void;
  onOpenSettings: () => void;
}

export default function SidePanel({
  activeId,
  onSelectChat,
  onOpenSettings,
}: SidePanelProps) {
  const { data, isLoading } = useChats();
  const chats = data?.chats ?? [];

  // Last message for "VirtualMate" preview
  const lastMsg = chats[chats.length - 1];
  const lastTime = lastMsg
    ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  function getPreview(convId: string) {
    if (convId === "virtualmate") {
      if (isLoading) return "Loading…";
      if (!lastMsg) return "No messages yet";
      const raw = lastMsg.content;
      return raw.length > 40 ? raw.slice(0, 40) + "…" : raw;
    }
    return "Coming soon";
  }

  function getUnread(convId: string) {
    if (convId === "virtualmate") return chats.length;
    return 0;
  }

  return (
    <aside className="flex flex-col w-[280px] flex-shrink-0 border-r border-white/5 bg-[#0e1621]">
      {/* ── Chat list ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pt-1">
        {CONVERSATIONS.map((conv) => {
          const isActive = activeId === conv.id;
          const unread = getUnread(conv.id);

          return (
            <button
              key={conv.id}
              onClick={() => onSelectChat(conv.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 transition-colors text-left
                ${isActive ? "bg-[#2b5278]" : "hover:bg-white/5"}
              `}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${conv.avatarGradient} flex items-center justify-center shadow-sm`}
                >
                  <span className="text-white font-semibold text-sm">
                    {conv.initials}
                  </span>
                </div>
                {/* Online dot — only for active AI */}
                {conv.id === "virtualmate" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0e1621] rounded-full" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white font-medium text-sm truncate">
                    {conv.name}
                  </span>
                  {lastTime && conv.id === "virtualmate" && (
                    <span className="text-slate-500 text-[11px] flex-shrink-0 ml-2">
                      {lastTime}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs truncate leading-snug">
                  {getPreview(conv.id)}
                </p>
              </div>

              {/* Unread badge */}
              {unread > 0 && (
                <div className="flex-shrink-0 min-w-[20px] h-5 px-1 rounded-full bg-violet-500 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">
                    {unread > 99 ? "99+" : unread}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Settings — pinned at bottom ──────────────────────────── */}
      <div className="border-t border-white/5">
        <button
          id="sidebar-settings-btn"
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[18px] h-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </button>
      </div>
    </aside>
  );
}
