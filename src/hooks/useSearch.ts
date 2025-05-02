import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { PaginatedLaptops } from "../interfaces/PaginatedLaptops";

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
  processorBrands: FilterOption[];
  gpuBrands: FilterOption[];
  graphicsTypes: FilterOption[];
  backlightTypes: FilterOption[];
  refreshRates: FilterOption[];
  vram: FilterOption[];
  years: FilterOption[];
  models: FilterOption[];
  tags: FilterOption[];
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
  processorBrand: string[];
  gpuBrand: string[];
  graphicsType: string[];
  backlightType: string[];
  refreshRate: string[];
  vram: string[];
  year: string[];
  model: string[];
  shortDesc: string[];
  tags: string[];
}

export function useSearchLaptops(initialTerm: string = "", userId?: number) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Default limit, adjust as needed

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
    processorBrand: [],
    gpuBrand: [],
    graphicsType: [],
    backlightType: [],
    refreshRate: [],
    vram: [],
    year: [],
    model: [],
    shortDesc: [],
    tags: [],
  });

  const {
    data: filterOptions,
    isLoading: isLoadingFilters,
    error: filterError,
    refetch: refetchFilters,
    isFetched: isFilterFetched,
    isPending: isFilterPending,
    isRefetching: isFilterRefetching,
  } = useQuery<any, Error, FilterOptions>({
    queryKey: ["filterOptions", JSON.stringify(selectedFilters), userId],
    queryFn: async () => {
      const params = new URLSearchParams();

      Object.entries(selectedFilters).forEach(([key, values]) => {
        values.forEach((value: any) => {
          params.append(key, value);
        });
      });

      if (searchTerm) {
        params.append("term", searchTerm);
      }

      // Only append userId if it's defined
      if (userId !== undefined) {
        params.append("userId", userId.toString());
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/filters?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }

      const data = await response.json();
      return data;
    },
    select: (data: FilterOptions): FilterOptions => {
      return data;
    },
    notifyOnChangeProps: ["data", "error", "isLoading"],
  });

  const {
    data: paginated,
    isLoading,
    error,
    refetch,
    isFetched,
    isPending,
    isRefetching,
  } = useQuery<PaginatedLaptops, Error>({
    queryKey: [
      "laptopSearch",
      searchTerm,
      JSON.stringify(selectedFilters),
      userId,
      page,
      limit,
    ],
    queryFn: async (): Promise<PaginatedLaptops> => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("term", searchTerm);

      Object.entries(selectedFilters).forEach(([key, values]) => {
        values.forEach((value: any) => {
          params.append(key, value);
        });
      });

      if (userId !== undefined) {
        params.append("userId", userId.toString());
      }
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/search?${params.toString()}`
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
    setPage(1); // Reset to first page on filter change
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
      processorBrand: [],
      gpuBrand: [],
      graphicsType: [],
      backlightType: [],
      refreshRate: [],
      vram: [],
      year: [],
      model: [],
      shortDesc: [],
      tags: [],
    });
    setSearchTerm("");
    setPage(1);
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
    laptops: paginated?.data ?? [],
    total: paginated?.total ?? 0,
    page: paginated?.page ?? page,
    setPage,
    limit,
    setLimit,
    pageCount: paginated?.pageCount ?? 1,
    isLoadingFilters,
    filterError,
    isLoading,
    error,
    toggleFilter,
    refetch,
    isFilterFetched,
    isFilterPending,
    isFilterRefetching,
    isFetched,
    isPending,
    isRefetching,
    resetFilters,
  };
}
