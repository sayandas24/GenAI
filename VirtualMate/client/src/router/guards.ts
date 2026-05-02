import type { User } from "firebase/auth";
import { queryClient } from "../lib/queryClient";
import { authQueryOptions } from "../features/auth/hooks/useAuth";

/**
 * Async auth guard — awaits the Firebase auth state if the cache is cold.
 *
 * Uses `ensureQueryData` instead of `getQueryData` so that on a hard refresh,
 * the guard waits for `useAuthUser`'s queryFn to resolve before redirecting.
 * Without this, `beforeLoad` fires synchronously before Firebase has responded,
 * causing a false redirect to /auth even for logged-in users.
 */
export const ensureAuthUser = (): Promise<User | null> =>
  queryClient.ensureQueryData(authQueryOptions);
