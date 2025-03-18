import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import App from "./App";
import HomePage from "./pages/HomePage";
import LaptopDetailPage from "./pages/LaptopDetailPage";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";

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

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  laptopRoute,
  searchRoute,
  authRoute,
]);

// Create the router using the route tree
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
