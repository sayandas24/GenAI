import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessageAPI } from "../services/chat.api";
import type { Chat, GetChatsResponse } from "../types/chat.types";

interface SendMessagePayload {
  content: string;
  session_id: string;
}

export const useSendMessage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: sendMessageAPI,

    /**
     * Optimistic update — runs BEFORE the request is sent.
     * Immediately injects the user message into the cache so it
     * appears in the UI without waiting for the server round-trip.
     */
    onMutate: async ({ content, session_id }: SendMessagePayload) => {
      const queryKey = ["chats", session_id];

      // Cancel in-flight refetches so they don't overwrite our optimistic entry
      await qc.cancelQueries({ queryKey });

      // Snapshot current cache for rollback on error
      const previousData = qc.getQueryData<GetChatsResponse>(queryKey);

      // Build an optimistic message that looks like a real DB document
      const optimisticMessage: Chat = {
        _id: `optimistic-${Date.now()}`,
        content,
        role: "user",
        session_id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Inject it into the cache immediately
      qc.setQueryData<GetChatsResponse>(queryKey, (old) => ({
        ...(old ?? { statusCode: 200, message: "", success: true }),
        data: [...(old?.data ?? []), optimisticMessage],
      }));

      return { previousData, queryKey };
    },

    /**
     * Rollback — if the mutation fails, restore the previous cache
     * so the optimistic message disappears and nothing is corrupted.
     */
    onError: (_err, _payload, context) => {
      if (context?.previousData) {
        qc.setQueryData(context.queryKey, context.previousData);
      }
    },

    /**
     * Always sync with the server after the mutation settles
     * (success or error) to replace the optimistic entry with
     * the real persisted data including the AI response.
     */
    onSettled: (_data, _err, payload) => {
      qc.invalidateQueries({ queryKey: ["chats", payload.session_id] });
    },
  });
};
