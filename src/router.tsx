import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "./App";
import HomePage from "./pages/homepage/HomePage";
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
import EditListingPage from "./pages/EditListingPage";
import UserManagement from "./pages/admin/UserManagement";
import ContentModeration from "./pages/admin/ContentModeration";
import Statistics from "./pages/admin/Statistics";
import SystemSettings from "./pages/admin/SystemSettings";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import ProfileMain from "./pages/profile/ProfileMain";
import ProfilePosts from "./pages/profile/ProfilePosts";
import ProfileAdmin from "./pages/profile/ProfileAdmin";
import ProfileSettings from "./pages/profile/ProfileSettings";
import UserPage from "./pages/UserPage";

// Protected route wrapper component
function ProtectedRoute({ children }: { children: ReactNode }) {
  // Update to redirect to /login instead of /auth
  useRequireAuth("/login");
  return <>{children}</>;
}

// Define search params for the search route
interface SearchRouteSearchParams {
  term?: string;
  brand?: string[];
  gpuModel?: string[];
  processorModel?: string[];
  ramType?: string[];
  ram?: string[];
  storageType?: string[];
  storageCapacity?: string[];
  stockStatus?: string[];
  screenSize?: string[];
  screenResolution?: string[];
  processorBrand?: string[];
  gpuBrand?: string[];
  graphicsType?: string[];
  backlightType?: string[];
  refreshRate?: string[];
  vram?: string[];
  year?: string[];
  model?: string[];
  shortDesc?: string[];
  tags?: string[];
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

// Add edit laptop route
const editLaptopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/edit-listing/$laptopId",
  component: () => (
    <ProtectedRoute>
      <EditListingPage />
    </ProtectedRoute>
  ),
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
      brand: search.brand
        ? Array.isArray(search.brand)
          ? search.brand.map(String)
          : [String(search.brand)]
        : undefined,
      gpuModel: search.gpuModel
        ? Array.isArray(search.gpuModel)
          ? search.gpuModel.map(String)
          : [String(search.gpuModel)]
        : undefined,
      processorModel: search.processorModel
        ? Array.isArray(search.processorModel)
          ? search.processorModel.map(String)
          : [String(search.processorModel)]
        : undefined,
      ramType: search.ramType
        ? Array.isArray(search.ramType)
          ? search.ramType.map(String)
          : [String(search.ramType)]
        : undefined,
      ram: search.ram
        ? Array.isArray(search.ram)
          ? search.ram.map(String)
          : [String(search.ram)]
        : undefined,
      storageType: search.storageType
        ? Array.isArray(search.storageType)
          ? search.storageType.map(String)
          : [String(search.storageType)]
        : undefined,
      storageCapacity: search.storageCapacity
        ? Array.isArray(search.storageCapacity)
          ? search.storageCapacity.map(String)
          : [String(search.storageCapacity)]
        : undefined,
      stockStatus: search.stockStatus
        ? Array.isArray(search.stockStatus)
          ? search.stockStatus.map(String)
          : [String(search.stockStatus)]
        : undefined,
      screenSize: search.screenSize
        ? Array.isArray(search.screenSize)
          ? search.screenSize.map(String)
          : [String(search.screenSize)]
        : undefined,
      screenResolution: search.screenResolution
        ? Array.isArray(search.screenResolution)
          ? search.screenResolution.map(String)
          : [String(search.screenResolution)]
        : undefined,
      processorBrand: search.processorBrand
        ? Array.isArray(search.processorBrand)
          ? search.processorBrand.map(String)
          : [String(search.processorBrand)]
        : undefined,
      gpuBrand: search.gpuBrand
        ? Array.isArray(search.gpuBrand)
          ? search.gpuBrand.map(String)
          : [String(search.gpuBrand)]
        : undefined,
      graphicsType: search.graphicsType
        ? Array.isArray(search.graphicsType)
          ? search.graphicsType.map(String)
          : [String(search.graphicsType)]
        : undefined,
      backlightType: search.backlightType
        ? Array.isArray(search.backlightType)
          ? search.backlightType.map(String)
          : [String(search.backlightType)]
        : undefined,
      refreshRate: search.refreshRate
        ? Array.isArray(search.refreshRate)
          ? search.refreshRate.map(String)
          : [String(search.refreshRate)]
        : undefined,
      vram: search.vram
        ? Array.isArray(search.vram)
          ? search.vram.map(String)
          : [String(search.vram)]
        : undefined,
      year: search.year
        ? Array.isArray(search.year)
          ? search.year.map(String)
          : [String(search.year)]
        : undefined,
      model: search.model
        ? Array.isArray(search.model)
          ? search.model.map(String)
          : [String(search.model)]
        : undefined,
      shortDesc: search.shortDesc
        ? Array.isArray(search.shortDesc)
          ? search.shortDesc.map(String)
          : [String(search.shortDesc)]
        : undefined,
      tags: search.tags
        ? Array.isArray(search.tags)
          ? search.tags.map(String)
          : [String(search.tags)]
        : undefined,
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

const userPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user/$userId",
  component: UserPage,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  laptopRoute,
  editLaptopRoute,
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
  userPageRoute, // <-- Add here
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

// Export searchRoute so it can be imported elsewhere
export { searchRoute };
export default router;
