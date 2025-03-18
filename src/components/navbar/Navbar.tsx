import { Search, ShoppingCart, User, LogOut } from "@deemlol/next-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate({
        to: "/search",
        search: { term: searchTerm },
      });
      setSearchTerm("");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky bg-neutral-900 top-0 z-50 flex justify-between items-center px-8 py-4  shadow-lg">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Kaido
        </Link>
      </div>

      <div className="flex items-center">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 py-2 px-4 pr-10 bg-neutral-800 text-white rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <Search size={24} />
          </button>
        </form>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-white hover:text-blue-400 relative cursor-pointer transition-colors">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center ">
            0
          </span>
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="text-white">
              <span className="text-sm mr-2">{user?.email}</span>
            </div>
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
    </nav>
  );
}
