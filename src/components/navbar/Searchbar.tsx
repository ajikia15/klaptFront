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
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        placeholder={isFocused ? "" : placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full rounded-md border-none bg-neutral-800 px-4 py-2 pr-10 text-white focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-700"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-white"
      >
        <Search size={24} />
      </button>
    </form>
  );
}
/* 

*/
