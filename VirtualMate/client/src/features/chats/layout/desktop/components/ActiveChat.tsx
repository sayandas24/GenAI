import React, { useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { chatRoute } from "../../../chats.route";
import { useAuthUser } from "../../../../auth/hooks/useAuth";
import { useCreateSession } from "../../../hooks/useSession";
import { useAvatars } from "../../../hooks/useAvatars";
import ChatHeader from "./ChatHeader";
import MessageList from "../../../components/MessageList";
import MessageInput from "../../../components/MessageInput";

export default function ActiveChat() {
  const { avatarId } = useSearch({ from: chatRoute.id });
  const { data: user } = useAuthUser();
  const { data: avatarsData } = useAvatars();
  const { mutate: createSession, data: sessionData, isPending: isCreatingSession } = useCreateSession();

  // Find the selected avatar from already-loaded avatars cache
  const avatar = avatarsData?.data?.find((a: any) => a._id === avatarId);

  // Create or retrieve the session whenever the avatarId or userId changes
  useEffect(() => {
    if (user?.uid && avatarId) {
      createSession({ user_id: user.uid, avatar_id: avatarId });
    }
  }, [user?.uid, avatarId, createSession]);

  const sessionId: string | null = sessionData?.data?._id ?? null;

  if (isCreatingSession || !sessionId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#2b5278] border-t-transparent animate-spin" />
          <span className="text-[#7f91a4] text-sm">Connecting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <ChatHeader avatar={avatar} />
      <MessageList sessionId={sessionId} />
      <MessageInput sessionId={sessionId} />
    </div>
  );
}
