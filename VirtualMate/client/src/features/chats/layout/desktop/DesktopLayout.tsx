import React from "react";
import AvatarSidebar from "./components/AvatarSidebar";
import ChatPanel from "./components/ChatPanel";

/**
 * Pure 2-column desktop layout.
 * No responsive logic here — AllChatsMain decides when to render this.
 */
export default function DesktopLayout() {
  return (
    <main className="flex h-[100dvh] w-screen bg-[#0e1621] text-white overflow-hidden font-sans">
      {/* Fixed-width sidebar */}
      <div className="w-[320px] min-w-[320px] bg-[#17212b] border-r border-[#0e1621] flex flex-col h-full">
        <AvatarSidebar />
      </div>

      {/* Remaining width for the chat panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatPanel />
      </div>
    </main>
  );
}
