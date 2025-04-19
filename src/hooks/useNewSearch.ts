import { useSearch, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LaptopT } from "../interfaces/laptopT";
import { searchRoute } from "../router";
import { useCallback, useMemo } from "react";

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

type FilterCategory =
  | "brand"
  | "gpuModel"
  | "processorModel"
  | "ramType"
  | "ram"
  | "storageType"
  | "storageCapacity"
  | "stockStatus"
  | "screenSize"
  | "screenResolution"
  | "processorBrand"
  | "gpuBrand"
  | "graphicsType"
  | "backlightType"
  | "refreshRate"
  | "vram"
  | "year"
  | "model"
  | "shortDesc"
  | "tags";

export function useNewSearch(userId?: number) {
  const search = useSearch({ from: searchRoute.id });
  const navigate = useNavigate({ from: searchRoute.id });

  // Extract term directly - much simpler
  const term = search.term || "";

  // Extract filters once and reuse - more efficient
  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(search).filter(
          ([key, value]) => key !== "term" && value !== undefined
        )
      ),
    [search]
  );

  // Helper function to get array values from search params
  const getArrayParam = useCallback(
    (key: FilterCategory): string[] => {
      return search[key] || [];
    },
    [search]
  );

  // Create memoized selected filters object
  const selectedFilters = useMemo(
    () => ({
      brand: getArrayParam("brand"),
      gpuModel: getArrayParam("gpuModel"),
      processorModel: getArrayParam("processorModel"),
      ramType: getArrayParam("ramType"),
      ram: getArrayParam("ram"),
      storageType: getArrayParam("storageType"),
      storageCapacity: getArrayParam("storageCapacity"),
      stockStatus: getArrayParam("stockStatus"),
      screenSize: getArrayParam("screenSize"),
      screenResolution: getArrayParam("screenResolution"),
      processorBrand: getArrayParam("processorBrand"),
      gpuBrand: getArrayParam("gpuBrand"),
      graphicsType: getArrayParam("graphicsType"),
      backlightType: getArrayParam("backlightType"),
      refreshRate: getArrayParam("refreshRate"),
      vram: getArrayParam("vram"),
      year: getArrayParam("year"),
      model: getArrayParam("model"),
      shortDesc: getArrayParam("shortDesc"),
      tags: getArrayParam("tags"),
    }),
    [getArrayParam]
  );

  // Function to toggle a filter value in or out
  const toggleFilter = useCallback(
    (category: FilterCategory, value: string) => {
      const currentValues = getArrayParam(category);

      // Create new array only once with a single operation
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      navigate({
        search: (prev) => ({
          ...prev,
          [category]: newValues.length > 0 ? newValues : undefined,
        }),
        replace: false,
      });
    },
    [getArrayParam, navigate]
  );

  // Function to set search term
  const setSearchTerm = useCallback(
    (term: string) => {
      navigate({
        search: (prev) => ({
          ...prev,
          term: term || undefined,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    navigate({
      search: {},
      replace: true,
    });
  }, [navigate]);

  // Prepare and memoize the query string for API calls
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    // Add search term
    if (term) {
      params.append("term", term);
    }

    // Add all filter parameters
    Object.entries(filters).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((value) => {
          params.append(key, value);
        });
      }
    });

    // Add userId if provided
    if (userId !== undefined) {
      params.append("userId", userId.toString());
    }

    return params.toString();
  }, [term, filters, userId]);

  // Simplified query keys - more efficient for React Query's cache comparison
  const filterQueryKey = useMemo(
    () => [
      "filterOptions",
      term,
      userId,
      Object.entries(filters).sort((a, b) => a[0].localeCompare(b[0])),
    ],
    [term, filters, userId]
  );

  const laptopQueryKey = useMemo(
    () => [
      "laptopSearch",
      term,
      userId,
      Object.entries(filters).sort((a, b) => a[0].localeCompare(b[0])),
    ],
    [term, filters, userId]
  );

  // Consistent caching settings for both queries
  const cacheConfig = {
    staleTime: 5000, // Keep data fresh for 5 seconds to prevent unnecessary refetches
  };

  // Query for filter options
  const {
    data: filterOptions,
    isLoading: isLoadingFilters,
    error: filterError,
    refetch: refetchFilters,
    isFetched: isFilterFetched,
    isPending: isFilterPending,
    isRefetching: isFilterRefetching,
  } = useQuery<FilterOptions, Error>({
    queryKey: filterQueryKey,
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/filters?${queryString}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }

      return response.json();
    },
    ...cacheConfig,
  });

  // Query for laptops
  const {
    data: laptops,
    isLoading,
    error,
    refetch,
    isFetched,
    isPending,
    isRefetching,
  } = useQuery<LaptopT[], Error>({
    queryKey: laptopQueryKey,
    queryFn: async (): Promise<LaptopT[]> => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/search?${queryString}`
      );

      if (!response.ok) {
        throw new Error("Failed to search laptops");
      }

      return response.json();
    },
    ...cacheConfig,
  });

  return {
    searchTerm: term,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    resetFilters,
    filterOptions,
    laptops,
    isLoadingFilters,
    filterError,
    isLoading,
    error,
    refetch,
    isFilterFetched,
    isFilterPending,
    isFilterRefetching,
    isFetched,
    isPending,
    isRefetching,
  };
}
