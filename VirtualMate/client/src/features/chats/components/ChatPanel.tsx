import React, { useEffect, useRef, useState } from "react";
import { useChats } from "../hooks/useChats";
import { useSendMessage } from "../hooks/useSendMessage";
import { useClearChat } from "../hooks/useClearChat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface ChatPanelProps {
  onOpenSettings: () => void;
}

export default function ChatPanel({ onOpenSettings }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data, isLoading: isLoadingChats, isError } = useChats();
  const sendMessage = useSendMessage();
  const clearChat = useClearChat();

  const chats = data?.chats ?? [];
  const isTyping = sendMessage.isPending;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  // Close kebab menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    setInput("");
    sendMessage.mutate(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleClearChat() {
    setMenuOpen(false);
    clearChat.mutate();
  }

  function handleOpenSettings() {
    setMenuOpen(false);
    onOpenSettings();
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
            <span className="text-white font-bold text-xs">VM</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-tight">
              VirtualMate
            </h1>
            <p className="text-xs">
              {isTyping ? (
                <span className="text-violet-400 animate-pulse">typing…</span>
              ) : (
                <span className="text-emerald-400">online</span>
              )}
            </p>
          </div>
        </div>

        {/* ── Kebab (⋮) menu ─────────────────────────────────────── */}
        <div className="relative" ref={menuRef}>
          <button
            id="kebab-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/8 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-50 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden">
              <button
                id="menu-settings-btn"
                onClick={handleOpenSettings}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors text-left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Settings
              </button>

              <div className="h-px bg-white/5 mx-3" />

              <button
                id="menu-clear-btn"
                onClick={handleClearChat}
                disabled={clearChat.isPending || chats.length === 0}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Clear conversation
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Messages ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {isLoadingChats && (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="flex justify-center items-center h-full">
            <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg">
              Failed to load messages. Is the server running?
            </p>
          </div>
        )}

        {!isLoadingChats && !isError && chats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <p className="text-slate-300 font-medium">Start a conversation</p>
              <p className="text-slate-500 text-sm mt-1">
                Ask me anything — I'm here to help.
              </p>
            </div>
          </div>
        )}

        {chats.map((chat) => (
          <MessageBubble key={chat._id} chat={chat} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </main>

      {/* ── Input ───────────────────────────────────────────────── */}
      <footer className="px-4 py-3 border-t border-white/5 bg-slate-900/60 backdrop-blur-xl flex-shrink-0">
        {sendMessage.isError && (
          <p className="text-rose-400 text-xs mb-2 text-center">
            Something went wrong. Please try again.
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-violet-500/50 transition-all duration-200"
        >
          <textarea
            id="chat-input"
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message VirtualMate…"
            disabled={isTyping}
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-sm resize-none outline-none leading-relaxed max-h-40 disabled:opacity-50"
          />
          <button
            id="send-btn"
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 flex items-center justify-center shadow-md shadow-violet-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
        <p className="text-slate-600 text-[10px] text-center mt-1.5">
          <kbd className="bg-white/5 px-1 rounded">Enter</kbd> to send ·{" "}
          <kbd className="bg-white/5 px-1 rounded">Shift+Enter</kbd> for new
          line
        </p>
      </footer>
    </div>
  );
}
