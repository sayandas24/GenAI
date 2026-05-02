import React, { useEffect, useRef } from "react";
import { useChats } from "../hooks/useChats";
import type { Chat } from "../types/chat.types";

interface MessageListProps {
  sessionId: string;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({ chat }: { chat: Chat }) {
  const isUser = chat.role === "user";
  const isOptimistic = chat._id.startsWith("optimistic-");

  if (isUser) {
    return (
      <div className="flex justify-end mb-1 px-4">
        <div className={`max-w-[65%] bg-[#2b5278] rounded-2xl rounded-tr-sm px-4 py-2 ${isOptimistic ? "opacity-70" : ""}`}>
          <p className="text-white text-[14px] leading-relaxed whitespace-pre-wrap break-words">
            {chat.content}
          </p>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-[11px] text-[#a0bcdc]">{formatTime(chat.createdAt)}</span>
            <span className="text-[#a0bcdc]">
              {isOptimistic ? (
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" opacity="0.5"/></svg>
              ) : (
                <svg className="w-4 h-3" viewBox="0 0 16 10" fill="none"><path d="M1 5l3.5 3.5L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 5l3.5 3.5L16 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-1 px-4">
      <div className="max-w-[65%] bg-[#17212b] rounded-2xl rounded-tl-sm px-4 py-2 border border-[#202b36]">
        <p className="text-white text-[14px] leading-relaxed whitespace-pre-wrap break-words">
          {chat.content}
        </p>
        <div className="flex justify-end mt-0.5">
          <span className="text-[11px] text-[#7f91a4]">{formatTime(chat.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-1 px-4">
      <div className="bg-[#17212b] rounded-2xl rounded-tl-sm px-4 py-3 border border-[#202b36]">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-[#7f91a4] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MessageList({ sessionId }: MessageListProps) {
  const { data: chats = [], isLoading, isFetching } = useChats(sessionId);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check if there's an optimistic message (user sent, waiting for AI)
  const hasOptimistic = chats.some((c) => c._id.startsWith("optimistic-"));

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats.length, hasOptimistic]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : ""}`}>
            <div className={`h-10 rounded-2xl bg-[#17212b] animate-pulse ${i % 2 === 0 ? "w-48" : "w-64"}`} />
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#7f91a4] text-sm">No messages yet</p>
          <p className="text-[#4a5568] text-xs mt-1">Say hello! 👋</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#7f91a4]/20 [&::-webkit-scrollbar-thumb]:rounded">
      {chats.map((chat) => (
        <MessageBubble key={chat._id} chat={chat} />
      ))}
      {/* Show typing indicator while waiting for AI response */}
      {hasOptimistic && !isFetching && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
