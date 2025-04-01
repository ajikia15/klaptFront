import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { LaptopT } from "../interfaces/laptopT";

// Helper function to compare arrays
function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every(
    (item, index) => JSON.stringify(item) === JSON.stringify(arr2[index])
  );
}

// Make sure these interfaces match what the backend returns
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

  // Initialize selected filters
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

  // Get filter options - make sure to pass the current selected filters
  const {
    data: filterOptions,
    isLoading: isLoadingFilters,
    error: filterError,
    refetch: refetchFilters,
    isFetched: isFilterFetched,
    isPending: isFilterPending,
    isRefetching: isFilterRefetching,
  } = useQuery<any, Error, FilterOptions>({
    queryKey: ["filterOptions", JSON.stringify(selectedFilters)],
    queryFn: async () => {
      // Build query params for the filters endpoint
      const params = new URLSearchParams();

      Object.entries(selectedFilters).forEach(([key, values]) => {
        values.forEach((value: any) => {
          params.append(key, value);
        });
      });

      if (searchTerm) {
        params.append("term", searchTerm);
      }

      console.log("Fetching filter options with params:", params.toString());

      const response = await fetch(
        `http://localhost:3000/laptops/filters?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }

      const data = await response.json();
      console.log("Received filter options:", data);
      return data;
    },
    select: (data: FilterOptions): FilterOptions => {
      return data;
    },
    notifyOnChangeProps: ["data", "error", "isLoading"],
  });

  // Get laptops with filters
  const {
    data: laptops,
    isLoading,
    error,
    refetch,
    isFetched, // Add this
    isPending, // Add this
    isRefetching, // Add this
  } = useQuery<LaptopT[], Error>({
    queryKey: ["laptopSearch", searchTerm, JSON.stringify(selectedFilters)],
    queryFn: async (): Promise<LaptopT[]> => {
      // Build query params
      const params = new URLSearchParams();
      if (searchTerm) params.append("term", searchTerm);

      // Add selected filters to query params
      Object.entries(selectedFilters).forEach(([key, values]) => {
        values.forEach((value: any) => {
          params.append(key, value);
        });
      });

      const response = await fetch(
        `http://localhost:3000/laptops/search?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to search laptops");
      }
      return response.json();
    },
    notifyOnChangeProps: ["data", "error", "isLoading"],
  });

  // Toggle filter - add delay before refetching to allow for UI updates
  const toggleFilter = (category: keyof SelectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      const index = newFilters[category].indexOf(value);

      if (index === -1) {
        // Add the filter
        newFilters[category] = [...newFilters[category], value];
      } else {
        // Remove the filter
        newFilters[category] = newFilters[category].filter((v) => v !== value);
      }

      return newFilters;
    });
  };

  const resetFilters = () => {
    setSelectedFilters({
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
    setSearchTerm("");
  };

  // This is critical - we need to refetch when filters change
  useEffect(() => {
    // Important: This ensures consistency between filters and results
    Promise.all([refetch(), refetchFilters()]);
  }, [selectedFilters, refetch, refetchFilters]);

  // Update search term from URL
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
    isFilterFetched,
    isFilterPending,
    isFilterRefetching,
    isFetched, // from the laptops query
    isPending, // from the laptops query
    isRefetching, // from the laptops query
    resetFilters,
  };
}
