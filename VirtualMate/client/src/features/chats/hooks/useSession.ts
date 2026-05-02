import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNewSessionAPI,
  getUserSessionsAPI,
} from "../services/session.api";

export const useSession = (userId: string | null) => {
  return useQuery({
    queryKey: ["session", userId],
    queryFn: () => getUserSessionsAPI(userId as string),
    enabled: !!userId, // Only fetch if userId is provided
  });
};

export const useCreateSession = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createNewSessionAPI,
    
    // When a session is successfully created, we just invalidate the user's session list
    // so it fetches the fresh list of sessions.
    onSuccess: (newSession, variables) => {
      // variables contains the { user_id, avatar_id } passed to mutate()
      // You can aggressively update the cache here if you want, but invalidating is usually safer!
      qc.invalidateQueries({ queryKey: ["session", variables.user_id] });
    },
  });
};
