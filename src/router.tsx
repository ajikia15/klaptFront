import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "./App";
import HomePage from "./pages/HomePage";
import LaptopDetailPage from "./pages/LaptopDetailPage";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import { useRequireAuth } from "./hooks/useRequireAuth";
import { ReactNode } from "react";

// Protected route wrapper component
function ProtectedRoute({ children }: { children: ReactNode }) {
  // This hook will redirect to /auth if not authenticated
  useRequireAuth();
  return <>{children}</>;
}

// Define search params for the search route
interface SearchRouteSearchParams {
  term?: string;
}

// Create a root route
const rootRoute = createRootRoute({
  component: App,
});

// Create routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const laptopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/laptop/$laptopId",
  component: LaptopDetailPage,
});

// Add search route
const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
  validateSearch: (
    search: Record<string, unknown>
  ): SearchRouteSearchParams => {
    return {
      term: search.term ? String(search.term) : undefined,
    };
  },
});

// Add auth route
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: () => (
    <ProtectedRoute>
      <FavoritesPage />
    </ProtectedRoute>
  ),
});

// Add profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  laptopRoute,
  searchRoute,
  authRoute,
  favoritesRoute,
  profileRoute,
]);

// Create the router using the route tree
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
