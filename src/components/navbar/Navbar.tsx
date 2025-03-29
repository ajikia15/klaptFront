import { Search, User, LogOut, Heart } from "@deemlol/next-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useTypingEffect } from "../../hooks/useTypingEffect";
import { useListFavorites } from "@/hooks/useFavorites";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const { data: randomLaptopName } = useQuery({
    queryKey: ["randomLaptop"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/laptops/random");
      if (!response.ok) {
        throw new Error("Failed to fetch random laptop");
      }
      const data = await response.json();
      return data.title;
    },
  });

  const placeholder = useTypingEffect("Search...", randomLaptopName, {
    typingSpeed: 150,
    deletingSpeed: 100,
    delayBeforeDeleting: 2000,
  });

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

  const { data: favorites, isLoading } = useListFavorites();

  return (
    <nav className="sticky bg-neutral-900 top-0 z-50 flex justify-between items-center px-8 py-4  shadow-lg">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Kaido
        </Link>
      </div>

      <div className="flex items-center w-full justify-center">
        <form onSubmit={handleSearch} className="relative w-3/5">
          <input
            type="text"
            placeholder={isFocused ? "" : placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full py-2 px-4 pr-10 bg-neutral-800 text-white rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <Link
          to="/favorites"
          className="text-white hover:text-blue-400 relative cursor-pointer transition-colors"
        >
          <Heart size={24} />
          <span className="absolute -top-3 -right-3 bg-secondary-400 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center ">
            {isLoading ? "asdf" : favorites?.length ?? 0}
          </span>
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
    </nav>
  );
}
