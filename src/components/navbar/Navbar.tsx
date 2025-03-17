import { Search, ShoppingCart, User } from "@deemlol/next-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate({
        to: "/search",
        search: { term: searchTerm },
      });
      setSearchTerm(""); // Clear the search input after submitting
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Logo
        </Link>
      </div>

      <div className="flex items-center">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 py-2 px-4 pr-10 bg-gray-700 text-white rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <button className="text-white hover:text-blue-400 relative cursor-pointer">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center ">
            0
          </span>
        </button>
        <button className="text-white hover:text-blue-400 cursor-pointer">
          <User size={24} className="stroke-blue-400 " />
        </button>
      </div>
    </nav>
  );
}
