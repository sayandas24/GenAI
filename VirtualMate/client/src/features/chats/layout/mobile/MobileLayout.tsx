import React from "react";
import { useSearch } from "@tanstack/react-router";
import { chatRoute } from "../../chats.route";
import MobileChatView from "./components/MobileChatView";
import MobileAvatarList from "./components/MobileAvatarList";

export default function MobileLayout() {
  const { avatarId } = useSearch({ from: chatRoute.id });

  if (avatarId) {
    return <MobileChatView />;
  }

  return <MobileAvatarList />;
}
