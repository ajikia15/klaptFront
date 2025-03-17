import { useQuery } from "@tanstack/react-query";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LaptopT } from "../interfaces/laptopT";

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
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-gray-600">
            We couldn't find any laptops matching "{searchTerm}".
          </p>
          <p className="text-gray-600 mt-2">
            Try using different keywords or check for spelling errors.
          </p>
        </div>
      )}

      {/* Search Results */}
      {laptops && laptops.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            {laptops.length} result{laptops.length !== 1 ? "s" : ""} for "
            {searchTerm}"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {laptops.map((laptop) => (
              <Link
                key={laptop.id}
                to="/laptop/$laptopId"
                params={{ laptopId: laptop.id.toString() }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={laptop.images[0]}
                    alt={laptop.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{laptop.title}</h2>
                  <p className="text-gray-600">
                    {laptop.brand} {laptop.model}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-blue-600 font-bold">
                      ${laptop.price.toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        laptop.stockStatus === "in stock"
                          ? "bg-green-100 text-green-800"
                          : laptop.stockStatus === "reserved"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {laptop.stockStatus}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
