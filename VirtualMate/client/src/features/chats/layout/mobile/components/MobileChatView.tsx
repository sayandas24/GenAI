import React, { useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { useAuthUser } from "../../../../auth/hooks/useAuth";
import { useCreateSession } from "../../../hooks/useSession";
import { useAvatars } from "../../../hooks/useAvatars";
import MobileChatHeader from "./MobileChatHeader";
import MessageList from "../../../components/MessageList";
import { chatRoute } from "../../../chats.route";
import MessageInput from "../../../components/MessageInput";

/**
 * Full-screen mobile chat view.
 * Handles session creation for the selected avatar then renders the
 * shared MessageList + MessageInput with its own MobileChatHeader.
 */
export default function MobileChatView() {
  const { avatarId } = useSearch({ from: chatRoute.id });
  const { data: user } = useAuthUser();
  const { data: avatarsData } = useAvatars();
  const {
    mutate: createSession,
    data: sessionData,
    isPending: isCreatingSession,
  } = useCreateSession();

  const avatar = avatarsData?.data?.find((a: any) => a._id === avatarId);

  // Create or retrieve the session whenever avatarId / userId changes
  useEffect(() => {
    if (user?.uid && avatarId) {
      createSession({ user_id: user.uid, avatar_id: avatarId });
    }
  }, [user?.uid, avatarId, createSession]);

  const sessionId: string | null = sessionData?.data?._id ?? null;

  // Loading state — show header immediately so back button is always accessible
  if (isCreatingSession || !sessionId) {
    return (
      <div className="flex flex-col h-[100dvh] w-full bg-[#0e1621] text-white font-sans overflow-hidden">
        <MobileChatHeader avatar={avatar} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#2b5278] border-t-transparent animate-spin" />
            <span className="text-[#7f91a4] text-sm">Connecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#0e1621] text-white font-sans overflow-hidden">
      <MobileChatHeader avatar={avatar} />
      <MessageList sessionId={sessionId} />
      <MessageInput sessionId={sessionId} />
    </div>
  );
}
