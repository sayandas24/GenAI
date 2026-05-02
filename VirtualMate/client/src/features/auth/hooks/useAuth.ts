import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../configs/firebaseConfig";
import { authenticateAPI } from "../services/auth.api";

export const AUTH_QUERY_KEY = ["authUser"];

/**
 * Shared query options for the auth user.
 * Used by both `useAuthUser` (React hook) and `ensureAuthUser` (router guard)
 * so they always point to the same cache entry and queryFn.
 */
export const authQueryOptions = queryOptions<User | null>({
  queryKey: AUTH_QUERY_KEY,
  queryFn: () =>
    new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Fire once for the initial load only

        if (user) {
          try {
            const token = await user.getIdToken();
            await authenticateAPI({
              username: user.displayName || user.email?.split("@")[0] || "User",
              email: user.email,
              token: token,
            });
            document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`;
            resolve(user);
          } catch (error) {
            console.error("Backend auth failed on initial load", error);
            await signOut(auth);
            document.cookie =
              "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            resolve(null);
          }
        } else {
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          resolve(null);
        }
      });
    }),
  staleTime: Infinity,
});

export const useAuthUser = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isInitialMount = true;

    // Handles auth state changes AFTER initial load (e.g. logout, login in another tab)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isInitialMount) {
        isInitialMount = false;
        return;
      }

      if (user) {
        try {
          const token = await user.getIdToken();
          await authenticateAPI({
            username: user.displayName || user.email?.split("@")[0] || "User",
            email: user.email,
            token: token,
          });
          document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`;
          queryClient.setQueryData(AUTH_QUERY_KEY, user);
        } catch (error) {
          console.error("Backend auth validation failed", error);
          await signOut(auth);
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          queryClient.setQueryData(AUTH_QUERY_KEY, null);
        }
      } else {
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  // Re-uses authQueryOptions so the hook and the guard share one cache entry
  return useQuery(authQueryOptions);
};
