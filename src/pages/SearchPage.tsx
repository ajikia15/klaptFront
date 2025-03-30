import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LaptopT } from "../interfaces/laptopT";
import { LaptopCard } from "../components/LaptopCard";
import { Checkbox } from "@/components/ui/checkbox";

// Update FilterOptions interface to match the backend response
interface FilterOptions {
  brands: string[];
  gpuModels: string[];
  processorModels: string[];
  ramTypes: string[];
  ram: string[];
  storageTypes: string[];
  storageCapacity: string[];
  stockStatuses: string[];
  screenSizes: string[];
  screenResolutions: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

// Define selected filters interface
interface SelectedFilters {
  brand: string[];
  gpuModel: string[];
  processorModel: string[];
  ramType: string[];
  ram: string[];
  storageType: string[];
  storageCapacity: string[];
  stockStatus: string[];
  screenSize: string[];
  screenResolution: string[];
}

export default function SearchPage() {
  // Same state and hooks as before
  const search = useSearch({ from: "/search" });
  const [searchTerm, setSearchTerm] = useState(search.term || "");

  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    brand: [],
    gpuModel: [],
    processorModel: [],
    ramType: [],
    ram: [],
    storageType: [],
    storageCapacity: [],
    stockStatus: [],
    screenSize: [],
    screenResolution: [],
  });

  const queryClient = useQueryClient();

  // Filter fetching query
  const {
    data: filterOptions,
    isLoading: isLoadingFilters,
    error: filterError,
  } = useQuery<FilterOptions>({
    queryKey: ["filterOptions"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/laptops/filters");
      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }
      return response.json();
    },
  });

  // Query for search results with filters
  const {
    data: laptops,
    isLoading,
    error,
    refetch,
  } = useQuery<LaptopT[], Error>({
    queryKey: ["laptopSearch", searchTerm, JSON.stringify(selectedFilters)], // Stringify the filters object
    queryFn: async (): Promise<LaptopT[]> => {
      // Build query params
      const params = new URLSearchParams();
      if (searchTerm) params.append("term", searchTerm);

      // Add selected filters to query params
      Object.entries(selectedFilters).forEach(([key, values]) => {
        (values as string[]).forEach((value) => {
          params.append(key, value);
        });
      });

      console.log("Fetching with params:", params.toString()); // Debug log

      const response = await fetch(
        `http://localhost:3000/laptops/search?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to search laptops");
      }
      const data = await response.json();
      console.log("Fetched data:", data); // Debug log
      return data;
    },
    refetchOnWindowFocus: false, // Prevent unwanted refetches
    staleTime: 0, // Consider data immediately stale
  });

  // Same handlers as before
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
    navigate({
      to: "/search",
      search: { term: searchTerm },
      replace: true,
    });
  };

  useEffect(() => {
    if (search.term) {
      setSearchTerm(search.term);
    }
  }, [search.term]);

  const toggleFilter = (category: keyof SelectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = [...prev[category]];
      const index = currentFilters.indexOf(value);

      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }

      const newFilters = {
        ...prev,
        [category]: currentFilters,
      };

      // Schedule a refetch after state update is complete
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["laptopSearch"] });
      }, 0);

      return newFilters;
    });
  };

  // Add this useEffect to refetch when filters change
  useEffect(() => {
    console.log("Filters changed, refetching...");

    // Forcefully invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["laptopSearch"] });
    refetch();
  }, [selectedFilters, refetch, queryClient]);

  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Search Laptops</h1>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Filters Panel - Simplified with only shadcn checkboxes */}
        <div className="w-full md:w-1/4">
          <div className="mb-4 rounded-md bg-neutral-900 p-4">
            <h2 className="mb-4 text-xl font-semibold">Filters</h2>

            {isLoadingFilters ? (
              <p>Loading filters...</p>
            ) : filterError ? (
              <p className="text-red-500">
                Error loading filters: {filterError.toString()}
              </p>
            ) : filterOptions ? (
              <div className="space-y-6">
                {/* Brand Filters */}
                <div>
                  <h3 className="mb-2 font-medium">Brands</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="max-h-[150px] space-y-2 overflow-y-auto">
                    {filterOptions.brands?.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedFilters.brand.includes(brand)}
                          onCheckedChange={() => toggleFilter("brand", brand)}
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="text-sm font-medium leading-none"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processor Filters */}
                <div>
                  <h3 className="mb-2 font-medium">Processors</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="max-h-[150px] space-y-2 overflow-y-auto">
                    {filterOptions.processorModels?.map((model) => (
                      <div key={model} className="flex items-center space-x-2">
                        <Checkbox
                          id={`processor-${model}`}
                          checked={selectedFilters.processorModel.includes(
                            model
                          )}
                          onCheckedChange={() =>
                            toggleFilter("processorModel", model)
                          }
                        />
                        <label
                          htmlFor={`processor-${model}`}
                          className="text-sm font-medium leading-none"
                        >
                          {model}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GPU Filters */}
                <div>
                  <h3 className="mb-2 font-medium">Graphics Cards</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="max-h-[150px] space-y-2 overflow-y-auto">
                    {filterOptions.gpuModels?.map((model) => (
                      <div key={model} className="flex items-center space-x-2">
                        <Checkbox
                          id={`gpu-${model}`}
                          checked={selectedFilters.gpuModel.includes(model)}
                          onCheckedChange={() =>
                            toggleFilter("gpuModel", model)
                          }
                        />
                        <label
                          htmlFor={`gpu-${model}`}
                          className="text-sm font-medium leading-none"
                        >
                          {model}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RAM Filters */}
                <div>
                  <h3 className="mb-2 font-medium">RAM Size</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="space-y-2">
                    {filterOptions.ram?.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ram-${size}`}
                          checked={selectedFilters.ram.includes(size)}
                          onCheckedChange={() => toggleFilter("ram", size)}
                        />
                        <label
                          htmlFor={`ram-${size}`}
                          className="text-sm font-medium leading-none"
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage Type Filters */}
                <div>
                  <h3 className="mb-2 font-medium">Storage Type</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="space-y-2">
                    {filterOptions.storageTypes?.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`storage-${type}`}
                          checked={selectedFilters.storageType.includes(type)}
                          onCheckedChange={() =>
                            toggleFilter("storageType", type)
                          }
                        />
                        <label
                          htmlFor={`storage-${type}`}
                          className="text-sm font-medium leading-none"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Main Content - Same as before */}
        <div className="w-full md:w-3/4">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mx-auto flex w-full max-w-2xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for laptops by brand, model, or specs..."
                className="flex-grow rounded-l-md border-none bg-neutral-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-r-md bg-blue-500 px-6 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </form>

          {/* Loading State */}
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 text-center text-red-500">
              Error searching laptops: {error.toString()}
            </div>
          )}

          {/* No Results */}
          {!isLoading &&
            laptops &&
            laptops.length === 0 &&
            (searchTerm ||
              Object.values(selectedFilters).some((arr) => arr.length > 0)) && (
              <div className="rounded-lg bg-neutral-800 p-8 text-center">
                <h2 className="mb-2 text-xl font-semibold text-white">
                  No results found
                </h2>
                <p className="text-neutral-400">
                  We couldn't find any laptops matching your criteria.
                </p>
                <p className="mt-2 text-neutral-400">
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}

          {/* Search Results */}
          {laptops && laptops.length > 0 && (
            <>
              <h2 className="mb-4 text-xl font-semibold text-white">
                {laptops.length} result{laptops.length !== 1 ? "s" : ""} found
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {laptops.map((laptop) => (
                  <LaptopCard
                    key={laptop.id}
                    id={laptop.id}
                    title={laptop.title}
                    price={laptop.price}
                    shortDesc={laptop.shortDesc}
                    image={laptop.images[0]}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
