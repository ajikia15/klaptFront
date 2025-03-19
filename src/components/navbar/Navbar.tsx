import { Search, ShoppingCart, User, LogOut } from "@deemlol/next-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, user, logout } = useAuth();
  const [placeholder, setPlaceholder] = useState("");

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

  useEffect(() => {
    let currentPhase: "typing" | "waiting" | "deleting" | "final-typing" =
      "typing";
    let currentIndex = 0;
    let typingInterval: number;
    const initialText = "Search...";

    const animate = () => {
      switch (currentPhase) {
        case "typing":
          if (currentIndex <= initialText.length) {
            setPlaceholder(initialText.slice(0, currentIndex));
            currentIndex++;
          } else {
            currentPhase = "waiting";
            setTimeout(() => {
              currentPhase = "deleting";
            }, 1500); // Wait 1.5s before starting to delete
          }
          break;

        case "deleting":
          if (currentIndex > 0) {
            currentIndex--;
            setPlaceholder(initialText.slice(0, currentIndex));
          } else {
            currentPhase = "final-typing";
            currentIndex = 0;
          }
          break;

        case "final-typing":
          if (randomLaptopName && currentIndex <= randomLaptopName.length) {
            setPlaceholder(randomLaptopName.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(typingInterval);
          }
          break;
      }
    };

    typingInterval = setInterval(animate, 150);

    return () => {
      clearInterval(typingInterval);
    };
  }, [randomLaptopName]);

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
            placeholder={placeholder}
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
