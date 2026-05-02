import React from "react";
import AvatarSidebar from "./components/AvatarSidebar";
import ChatPanel from "./components/ChatPanel";

export default function AllChatsMain() {
  return (
    <main className="flex h-screen w-screen bg-[#0e1621] text-white overflow-hidden font-sans">
      <AvatarSidebar />
      <ChatPanel />
    </main>
  );
}
