import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearChatAPI } from "../services/chat.api";

export const useClearChat = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: clearChatAPI,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["chats"],
      });
    },
  });
};
