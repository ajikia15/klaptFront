import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { LaptopT } from "../interfaces/laptopT";

// Updated interfaces to match the new backend response
interface FilterOption {
  value: string;
  disabled: boolean;
}

interface FilterOptions {
  brands: FilterOption[];
  gpuModels: FilterOption[];
  processorModels: FilterOption[];
  ramTypes: FilterOption[];
  ram: FilterOption[];
  storageTypes: FilterOption[];
  storageCapacity: FilterOption[];
  stockStatuses: FilterOption[];
  screenSizes: FilterOption[];
  screenResolutions: FilterOption[];
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

  // Updated filter fetching query to include selected filters
  const {
    data: filterOptions,
    isLoading: isLoadingFilters,
    error: filterError,
    refetch: refetchFilters,
  } = useQuery<FilterOptions>({
    queryKey: ["filterOptions", JSON.stringify(selectedFilters)],
    queryFn: async () => {
      // Build query params for the filters endpoint
      const params = new URLSearchParams();

      // Add selected filters to query params
      Object.entries(selectedFilters).forEach(([key, values]) => {
        (values as string[]).forEach((value) => {
          params.append(key, value);
        });
      });

      console.log("Fetching filter options with params:", params.toString());

      const response = await fetch(
        `http://localhost:3000/laptops/filters?${params.toString()}`
      );

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

      console.log("Fetching laptops with params:", params.toString());

      const response = await fetch(
        `http://localhost:3000/laptops/search?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to search laptops");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  // Toggle filter and refetch both data and filter options
  const toggleFilter = (category: keyof SelectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = [...prev[category]];
      const index = currentFilters.indexOf(value);

      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }

      return {
        ...prev,
        [category]: currentFilters,
      };
    });
  };

  // Refetch everything when filters change
  useEffect(() => {
    console.log("Filters changed, refetching data...");
    refetch();
    refetchFilters();
  }, [selectedFilters, refetch, refetchFilters]);

  // Update search term from external source if needed
  useEffect(() => {
    if (initialTerm !== searchTerm) {
      setSearchTerm(initialTerm);
    }
  }, [initialTerm]);

  return {
    searchTerm,
    setSearchTerm,
    selectedFilters,
    filterOptions,
    laptops,
    isLoadingFilters,
    filterError,
    isLoading,
    error,
    toggleFilter,
    refetch,
  };
}
