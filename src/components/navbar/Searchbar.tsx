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
    if (searchTerm.trim()) {
      navigate({
        to: "/search",
        search: { term: searchTerm },
      });
      setSearchTerm("");
    }
  };

  return (
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
  );
}
/* 
<div class="grid"></div>
<div id="poda">
  <div class="glow"></div>
  <div class="darkBorderBg"></div>
  <div class="darkBorderBg"></div>
  <div class="darkBorderBg"></div>
  <div class="white"></div>
  <div class="border"></div>
  <div id="main">
    <input placeholder="Search..." type="text" name="text" class="input" />
    <div id="input-mask"></div>
    <div id="pink-mask"></div>

  </div>
</div>

*/
