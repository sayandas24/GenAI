import { useQuery } from "@tanstack/react-query";
import { getAllChatsAPI } from "../services/chat.api";

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getAllChatsAPI,
    refetchOnWindowFocus: false,
  });
};
