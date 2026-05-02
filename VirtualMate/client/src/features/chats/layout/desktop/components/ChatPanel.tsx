import React from "react";
import { useSearch } from "@tanstack/react-router";
import { chatRoute } from "../../../chats.route";
import ActiveChat from "./ActiveChat";

export default function ChatPanel() {
  const { avatarId } = useSearch({ from: chatRoute.id });

  if (avatarId) {
    return (
      <div className="flex-1 bg-[#0e1621] flex flex-col h-full overflow-hidden">
        <ActiveChat />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0e1621] flex items-center justify-center">
      <div className="px-4 py-2 bg-[#17212b]/70 rounded-2xl text-[#7f91a4] text-sm">
        Select a chat to start messaging
      </div>
    </div>
  );
}
