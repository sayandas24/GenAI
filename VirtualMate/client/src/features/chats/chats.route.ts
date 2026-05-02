import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../../router/root.route";
import { ensureAuthUser } from "../../router/guards";
import AllChatsMain from "./layout/desktop/AllChatsMain";

/**
 * Type-safe search params schema for the chat route.
 * avatarId drives which chat is open — stored in the URL so it's
 * bookmarkable, refresh-proof, and shareable.
 */
export const chatSearchSchema = z.object({
  avatarId: z.string().optional(),
});

/**
 * Protected route: /
 * Redirects unauthenticated users to /auth.
 */
export const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: chatSearchSchema,
  beforeLoad: async () => {
    const user = await ensureAuthUser();
    if (!user) throw redirect({ to: "/auth" });
  },
  component: AllChatsMain,
});
