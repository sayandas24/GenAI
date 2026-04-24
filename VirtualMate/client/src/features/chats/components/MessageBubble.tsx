import React from "react";
import type { Chat } from "../types/chat.types";

interface MessageBubbleProps {
  chat: Chat;
}

/** Formats an ISO date string into a readable time like "2:35 PM" */
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ chat }: MessageBubbleProps) {
  const isUser = chat.role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 shadow-md">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
            ${
              isUser
                ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm"
                : "bg-white/10 backdrop-blur-sm border border-white/10 text-slate-200 rounded-tl-sm"
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words">{chat.content}</p>
        </div>
        <span className="text-[10px] text-slate-500 mt-1 px-1">
          {formatTime(chat.createdAt)}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center ml-2 mt-1 shadow-md">
          <span className="text-white text-xs font-bold">You</span>
        </div>
      )}
    </div>
  );
}
