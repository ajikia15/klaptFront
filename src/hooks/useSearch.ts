import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { LaptopT } from "../interfaces/laptopT";

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

export function useSearchLaptops(initialTerm: string = "") {
  const [searchTerm, setSearchTerm] = useState(initialTerm);

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
    queryKey: ["laptopSearch", searchTerm, JSON.stringify(selectedFilters)],
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

      console.log("Fetching with params:", params.toString());

      const response = await fetch(
        `http://localhost:3000/laptops/search?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to search laptops");
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

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

      return newFilters;
    });
  };

  // Refetch when filters change
  useEffect(() => {
    console.log("Filters changed, refetching...");
    queryClient.invalidateQueries({ queryKey: ["laptopSearch"] });
    refetch();
  }, [selectedFilters, refetch, queryClient]);

  // Update search term from external source if needed
  useEffect(() => {
    if (initialTerm !== searchTerm) {
      setSearchTerm(initialTerm);
    }
  }, [initialTerm]);

  return {
    // States
    searchTerm,
    setSearchTerm,
    selectedFilters,

    // Data
    filterOptions,
    laptops,

    // Loading and error states
    isLoadingFilters,
    filterError,
    isLoading,
    error,

    // Actions
    toggleFilter,
    refetch,
  };
}
