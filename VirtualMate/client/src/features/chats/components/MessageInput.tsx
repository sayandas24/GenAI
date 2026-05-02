import React, { useState, useRef } from "react";
import { Send, Smile } from "lucide-react";
import { useSendMessage } from "../hooks/useSendMessage";

interface MessageInputProps {
  sessionId: string;
}

export default function MessageInput({ sessionId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isPending) return;

    sendMessage({ content: trimmed, session_id: sessionId });
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    // Auto-grow textarea up to ~5 rows
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="shrink-0 bg-[#17212b] border-t border-[#0e1621] px-4 py-3">
      <div className="flex items-end gap-3 bg-[#242f3d] rounded-2xl px-4 py-2.5">
        {/* Emoji button */}
        <button className="text-[#7f91a4] hover:text-white transition-colors shrink-0 mb-0.5">
          <Smile size={22} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Message"
          rows={1}
          disabled={isPending}
          className="flex-1 bg-transparent text-white text-[14px] placeholder-[#7f91a4] outline-none resize-none leading-relaxed max-h-[120px] disabled:opacity-50"
        />

        {/* Send button — only visible when there's text */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || isPending}
          className={`shrink-0 mb-0.5 rounded-full p-1.5 transition-all duration-200 ${
            message.trim() && !isPending
              ? "text-[#5b9bd5] hover:text-white hover:bg-[#5b9bd5]/20 scale-100"
              : "text-[#4a5568] scale-90"
          }`}
        >
          <Send size={20} />
        </button>
      </div>

      <p className="text-[10px] text-[#4a5568] text-center mt-1.5">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
