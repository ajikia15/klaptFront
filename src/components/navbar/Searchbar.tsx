import { Search } from "@deemlol/next-icons";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTypingEffect } from "../../hooks/useTypingEffect";

export default function Searchbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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
    navigate({
      to: "/search",
      search: { term: searchTerm },
    });
    setSearchTerm("");
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full group">
      <div
        className={`absolute inset-0 bg-gradient-to-r from-purple-500/30 via-primary-500/30 to-pink-500/30 rounded-full blur-md transition-opacity duration-300 ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
      ></div>
      <div className="relative">
        <input
          type="text"
          placeholder={isFocused ? "" : placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full rounded-full border-[1.5px] border-neutral-700/80 bg-neutral-800/90 px-5 py-2.5 pr-12 text-white placeholder-neutral-400 transition-all duration-300 focus:border-primary-500/70 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:bg-neutral-800"
        />
        <button
          type="submit"
          className={`absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer transition-all duration-300 rounded-full h-8 w-8 flex items-center justify-center ${
            isFocused
              ? "bg-primary-500 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Search
            size={18}
            className={`transition-transform duration-300 ${
              isFocused ? "scale-90" : ""
            }`}
          />
        </button>
      </div>
    </form>
  );
}
