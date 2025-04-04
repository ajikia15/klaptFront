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
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import { useRequireAuth } from "./hooks/useRequireAuth";
import { ReactNode } from "react";
import AddListingPage from "./pages/AddListingPage";
import UserManagement from "./pages/admin/UserManagement";
import ContentModeration from "./pages/admin/ContentModeration";
import Statistics from "./pages/admin/Statistics";
import SystemSettings from "./pages/admin/SystemSettings";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import ProfileMain from "./pages/profile/ProfileMain";
import ProfilePosts from "./pages/profile/ProfilePosts";
import ProfileAdmin from "./pages/profile/ProfileAdmin";
import ProfileSettings from "./pages/profile/ProfileSettings";

// Protected route wrapper component
function ProtectedRoute({ children }: { children: ReactNode }) {
  // Update to redirect to /login instead of /auth
  useRequireAuth("/login");
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

// Keep auth route for backward compatibility
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

// Add login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Add registration route
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegistrationPage,
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

const addLaptopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-listing",
  component: () => (
    <ProtectedRoute>
      <AddListingPage />
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

// Profile tab routes
const profileMainRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/",
  component: ProfileMain,
});

const profilePostsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/posts",
  component: ProfilePosts,
});

const profileAdminRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/admin",
  component: ProfileAdmin,
});

const profileSettingsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/settings",
  component: ProfileSettings,
});

// Admin routes
const adminUserManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  component: () => (
    <AdminProtectedRoute>
      <UserManagement />
    </AdminProtectedRoute>
  ),
});

const adminContentModerationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/moderation",
  component: () => (
    <AdminProtectedRoute>
      <ContentModeration />
    </AdminProtectedRoute>
  ),
});

const adminStatisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/statistics",
  component: () => (
    <AdminProtectedRoute>
      <Statistics />
    </AdminProtectedRoute>
  ),
});

const adminSystemSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/system",
  component: () => (
    <AdminProtectedRoute>
      <SystemSettings />
    </AdminProtectedRoute>
  ),
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  laptopRoute,
  searchRoute,
  authRoute,
  loginRoute,
  registerRoute,
  favoritesRoute,
  addLaptopRoute,
  profileRoute.addChildren([
    profileMainRoute,
    profilePostsRoute,
    profileAdminRoute,
    profileSettingsRoute,
  ]),
  adminUserManagementRoute,
  adminContentModerationRoute,
  adminStatisticsRoute,
  adminSystemSettingsRoute,
]);

// Create the router using the route tree
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultViewTransition: true,
});

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
