import { User, LogOut, Heart } from "@deemlol/next-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import { useListFavorites } from "@/hooks/useFavorites";
import Searchbar from "./Searchbar";
import { SpinnerSVG } from "@/assets/SpinnerSVG";

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
      <div className="container mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Kaido
          </Link>
        </div>

        <div className="flex items-center w-full justify-center">
          <Searchbar />
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/favorites"
            className="text-white hover:text-blue-400 relative cursor-pointer transition-colors"
          >
            <Heart size={24} />
            {isAuthenticated && (
              <span className="absolute -top-3 -right-3 bg-secondary-400 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center ">
                {isLoading ? <SpinnerSVG /> : favorites?.length ?? 0}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-white">
                <span className="text-sm mr-2">{user?.email}</span>
              </div>
              <Link
                to="/profile"
                className="text-white hover:text-blue-400 cursor-pointer transition-colors"
                aria-label="Profile"
              >
                <User size={24} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-400 cursor-pointer transition-colors"
                aria-label="Logout"
              >
                <LogOut size={24} />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-white hover:text-blue-400 cursor-pointer transition-colors"
            >
              <User size={24} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
