import { useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../configs/firebaseConfig";
import { authenticateAPI } from "../services/auth.api";

export const AUTH_QUERY_KEY = ["authUser"];

export const useAuthUser = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isInitialMount = true;

    // This listener handles events AFTER the initial page load (e.g. clicking "Logout" or "Login" in another tab)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isInitialMount) {
        isInitialMount = false;
        return;
      }

      if (user) {
        // Just in case this fires from another tab, we sync the backend
        try {
          await authenticateAPI({
            username: user.displayName || user.email?.split("@")[0] || "User",
            email: user.email,
          });

          const token = await user.getIdToken();
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

  return useQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    // This handles the INITIAL load of the application
    queryFn: () =>
      new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          unsubscribe(); // We only need this to fire once for the initial load

          if (user) {
            try {
              // 1. Verify user exists in the backend DB
              await authenticateAPI({
                username:
                  user.displayName || user.email?.split("@")[0] || "User",
                email: user.email,
              });

              // 2. Set the cookie if verification succeeds
              const token = await user.getIdToken();
              document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`;
              resolve(user);
            } catch (error) {
              console.error("Backend auth failed on initial load", error);
              await signOut(auth); // Log them out of Firebase if backend rejects them
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
};
