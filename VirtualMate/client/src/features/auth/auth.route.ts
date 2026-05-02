import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../../router/root.route";
import { ensureAuthUser } from "../../router/guards";
import Authenticate from "./pages/Authenticate";

/**
 * Public route: /auth
 * Redirects already-authenticated users back to the main app.
 */
export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  beforeLoad: async () => {
    const user = await ensureAuthUser();
    if (user) throw redirect({ to: "/" });
  },
  component: Authenticate,
});
