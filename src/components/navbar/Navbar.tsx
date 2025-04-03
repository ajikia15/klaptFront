import { Heart } from "@deemlol/next-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import { useListFavorites } from "@/hooks/useFavorites";
import Searchbar from "./Searchbar";
import { SpinnerSVG } from "@/assets/SpinnerSVG";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const { data: favorites, isLoading } = useListFavorites();

  return (
    <nav className="sticky bg-neutral-900 top-0 z-50 w-full shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-white mr-4 flex-shrink-0"
        >
          Kaido
        </Link>

        {/* Search - Center of navbar */}
        <div className="flex-grow max-w-md mx-auto">
          <Searchbar />
        </div>

        {/* Right side icons and actions */}
        <div className="flex items-center ml-4 md:ml-6 flex-shrink-0">
          {/* Create Post Button - Same icon for both states, less prominent */}
          <div className="mr-2">
            <Link
              to={isAuthenticated ? "/add-listing" : "/login"}
              className="flex items-center justify-center px-4  h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 transition-all"
              aria-label={
                isAuthenticated ? "Create Post" : "Login to create a post"
              }
              title={isAuthenticated ? "Create Post" : "Login to create a post"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span className="pl-2">Create post</span>
            </Link>
          </div>

          {isAuthenticated && (
            <Link
              to="/favorites"
              className="text-neutral-100 hover:text-secondary-400 grid place-items-center relative cursor-pointer transition-colors mx-2 bg-neutral-800 hover:bg-neutral-700 rounded-full p-1.5"
              title="Favorites"
            >
              <Heart size={24} />
              {favorites && favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-400 text-xs text-neutral-100 rounded-full h-4 w-4 flex items-center justify-center">
                  {isLoading ? <SpinnerSVG /> : favorites?.length ?? 0}
                </span>
              )}
            </Link>
          )}

          {/* User Account Section */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-primary-600 flex items-center justify-center text-white font-medium cursor-pointer transition-transform hover:scale-105"
                    title={user?.email}
                  >
                    {user?.email ? user.email[0].toUpperCase() : "?"}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[200px] bg-neutral-800 border-neutral-700 text-white">
                  <div className="px-2 py-1.5 text-sm text-neutral-400">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-neutral-700 focus:text-white"
                  >
                    <Link to="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer focus:bg-neutral-700 focus:text-white"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-white hover:text-secondary-300 px-4 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-white px-4 py-2.5 text-sm font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
