import { useQuery } from "@tanstack/react-query";
import getAllAvatarsAPI from "../services/avatar.api";

export const useAvatars = () => {
  return useQuery({
    queryKey: ["avatars"],
    queryFn: getAllAvatarsAPI,
    refetchOnWindowFocus: false,
  });
};
