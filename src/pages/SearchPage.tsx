import { useQuery } from "@tanstack/react-query";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LaptopT } from "../interfaces/laptopT";
import { LaptopCard } from "../components/LaptopCard";

export default function SearchPage() {
  // Get search parameters from the URL
  const search = useSearch({ from: "/search" });
  const [searchTerm, setSearchTerm] = useState(search.term || "");

  // Query for search results
  const {
    data: laptops,
    isLoading,
    error,
    refetch,
  } = useQuery<LaptopT[]>({
    queryKey: ["laptopSearch", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];

      const response = await fetch(
        `http://localhost:3000/laptops/search?term=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to search laptops");
      }
      return response.json();
    },
    enabled: !!searchTerm, // Only run the query if we have a search term
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
    // Update URL with search term
    navigate({
      to: "/search",
      search: { term: searchTerm },
      replace: true,
    });
  };

  // Initialize search from URL params
  useEffect(() => {
    if (search.term) {
      setSearchTerm(search.term);
    }
  }, [search.term]);

  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Laptops</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex w-full max-w-2xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for laptops by brand, model, or specs..."
            className="flex-grow px-4 py-2 bg-neutral-800 text-white rounded-l-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 transition-colors duration-300"
          >
            Search
          </button>
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-red-500 text-center p-4">
          Error searching laptops: {error.toString()}
        </div>
      )}

      {/* No Results */}
      {!isLoading && laptops && laptops.length === 0 && searchTerm && (
        <div className="text-center p-8 bg-neutral-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-white">
            No results found
          </h2>
          <p className="text-neutral-400">
            We couldn't find any laptops matching "{searchTerm}".
          </p>
          <p className="text-neutral-400 mt-2">
            Try using different keywords or check for spelling errors.
          </p>
        </div>
      )}

      {/* Search Results */}
      {laptops && laptops.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-white">
            {laptops.length} result{laptops.length !== 1 ? "s" : ""} for "
            {searchTerm}"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {laptops.map((laptop) => (
              <LaptopCard
                key={laptop.id}
                id={laptop.id}
                title={laptop.title}
                price={laptop.price}
                description={laptop.description}
                image={laptop.images[0]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
