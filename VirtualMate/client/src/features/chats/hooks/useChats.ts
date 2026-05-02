import { useQuery } from "@tanstack/react-query";
import { getAllChatsAPI } from "../services/chat.api";
import type { Chat } from "../types/chat.types";

/**
 * Fetches all messages for a given session in chronological order.
 * The query key includes sessionId so each session has its own cache entry.
 */
export const useChats = (sessionId: string | null) => {
  return useQuery({
    queryKey: ["chats", sessionId],
    queryFn: () => getAllChatsAPI(sessionId as string),
    enabled: !!sessionId,
    select: (res): Chat[] => res.data ?? [],
  });
};
