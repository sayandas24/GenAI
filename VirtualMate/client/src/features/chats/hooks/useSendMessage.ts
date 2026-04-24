import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessageAPI } from "../services/chat.api";
import type { GetChatsResponse, Chat } from "../types/chat.types";

export const useSendMessage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: sendMessageAPI,

    /**
     * Optimistic update — runs BEFORE the request is sent.
     * Immediately injects the user message into the cache so it
     * appears in the UI without waiting for the server round-trip.
     */
    onMutate: async (message: string) => {
      // Cancel any in-flight refetches so they don't overwrite our optimistic entry
      await qc.cancelQueries({ queryKey: ["chats"] });

      // Snapshot current cache so we can roll back on error
      const previousChats = qc.getQueryData<GetChatsResponse>(["chats"]);

      // Build an optimistic chat entry that looks like a real DB document
      const optimisticMessage: Chat = {
        _id: `optimistic-${Date.now()}`,
        content: message,
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Inject it into the cache immediately
      qc.setQueryData<GetChatsResponse>(["chats"], (old) => ({
        message: old?.message ?? "",
        chats: [...(old?.chats ?? []), optimisticMessage],
      }));

      // Return snapshot for rollback in onError
      return { previousChats };
    },

    /**
     * Rollback — if the mutation fails, restore the previous cache
     * so the optimistic message disappears and nothing is corrupted.
     */
    onError: (_err, _message, context) => {
      if (context?.previousChats) {
        qc.setQueryData<GetChatsResponse>(["chats"], context.previousChats);
      }
    },

    /**
     * Always sync with the server after the mutation settles
     * (success or error) to replace the optimistic entry with
     * the real persisted data including the AI response.
     */
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
