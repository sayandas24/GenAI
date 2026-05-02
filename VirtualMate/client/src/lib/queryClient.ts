import { QueryClient } from "@tanstack/react-query";

/**
 * Singleton QueryClient shared across the router (for auth guards)
 * and the React tree (via QueryClientProvider).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
