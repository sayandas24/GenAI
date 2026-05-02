import { createRouter, createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import { authRoute } from "../features/auth/auth.route";
import { chatRoute } from "../features/chats/chats.route";

// ─── Catch-all ────────────────────────────────────────────────────────────────
// Kept here since it's a global concern, not tied to any single feature.
const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

// ─── Route Tree ───────────────────────────────────────────────────────────────
// Add new feature routes here as the app grows — this is the only file to touch.
const routeTree = rootRoute.addChildren([
  authRoute,
  chatRoute,
  catchAllRoute,
]);

// ─── Router ───────────────────────────────────────────────────────────────────
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// ─── TypeScript Global Registration ──────────────────────────────────────────
// Enables type-safe <Link to="..."> and useNavigate() across the entire app.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
