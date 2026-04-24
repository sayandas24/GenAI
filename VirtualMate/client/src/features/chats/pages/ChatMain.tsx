import React, { useEffect, useRef, useState } from "react";
import { useChats } from "../hooks/useChats";
import { useSendMessage } from "../hooks/useSendMessage";
import { useClearChat } from "../hooks/useClearChat";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";

export default function ChatMain() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading: isLoadingChats, isError } = useChats();
  const sendMessage = useSendMessage();
  const clearChat = useClearChat();

  const chats = data?.chats ?? [];
  const isTyping = sendMessage.isPending;

  // Auto-scroll to bottom whenever messages change or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isTyping]);

  // Auto-resize textarea as user types
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    setInput("");
    sendMessage.mutate(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white font-bold text-sm">VM</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">
              VirtualMate
            </h1>
            <p className="text-slate-400 text-xs">
              {isTyping ? (
                <span className="text-violet-400 animate-pulse">Typing…</span>
              ) : (
                "Your AI companion"
              )}
            </p>
          </div>
        </div>

        <button
          id="clear-chat-btn"
          onClick={() => clearChat.mutate()}
          disabled={clearChat.isPending || chats.length === 0}
          title="Clear conversation"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
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
          Clear
        </button>
      </header>

      {/* ── Messages ───────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin">
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

      {/* ── Input ──────────────────────────────────────────────── */}
      <footer className="px-4 py-4 border-t border-white/5 bg-slate-900/60 backdrop-blur-xl">
        {sendMessage.isError && (
          <p className="text-rose-400 text-xs mb-2 text-center">
            Something went wrong. Please try again.
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-violet-500/50 focus-within:bg-white/8 transition-all duration-200"
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
        <p className="text-slate-600 text-[10px] text-center mt-2">
          Press <kbd className="bg-white/5 px-1 rounded">Enter</kbd> to send ·{" "}
          <kbd className="bg-white/5 px-1 rounded">Shift+Enter</kbd> for new line
        </p>
      </footer>
    </div>
  );
}
