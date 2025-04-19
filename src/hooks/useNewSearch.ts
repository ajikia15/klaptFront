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

  // Helper function to get array values from search params - memoize to maintain stable references
  const getArrayParam = useCallback(
    (key: FilterCategory): string[] => {
      return search[key] || [];
    },
    [search]
  );

  // Create memoized selected filters object to avoid recreating on each render
  const selectedFilters = useMemo(() => {
    return {
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
    };
  }, [getArrayParam]);

  // Function to toggle a filter value in or out - wrapped in useCallback to maintain reference stability
  const toggleFilter = useCallback(
    (category: FilterCategory, value: string) => {
      const currentValues = getArrayParam(category);
      let newValues: string[];

      if (currentValues.includes(value)) {
        // Remove value if it exists
        newValues = currentValues.filter((v) => v !== value);
      } else {
        // Add value if it doesn't exist
        newValues = [...currentValues, value];
      }

      // Update search params with new values
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

  // Function to set search term - wrapped in useCallback
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

  // Reset all filters - wrapped in useCallback
  const resetFilters = useCallback(() => {
    navigate({
      search: {},
      replace: true,
    });
  }, [navigate]);

  // Prepare search params for API calls - memoized to avoid recreation on each render
  const prepareSearchParams = useCallback(() => {
    const params = new URLSearchParams();

    if (search.term) params.append("term", search.term);

    // Add all filter parameters
    Object.entries(search).forEach(([key, values]) => {
      // Skip term as it's already handled
      if (key === "term") return;

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

    return params;
  }, [search, userId]);

  // Memoize query key objects to prevent unnecessary refetches
  const filterOptionsQueryKey = useMemo(() => {
    return [
      "filterOptions",
      {
        term: search.term,
        filters: Object.fromEntries(
          Object.entries(search).filter(
            ([key, value]) => key !== "term" && value !== undefined
          )
        ),
        userId,
      },
    ];
  }, [search, userId]);

  const laptopSearchQueryKey = useMemo(() => {
    return [
      "laptopSearch",
      {
        term: search.term,
        filters: Object.fromEntries(
          Object.entries(search).filter(
            ([key, value]) => key !== "term" && value !== undefined
          )
        ),
        userId,
      },
    ];
  }, [search, userId]);

  // Query for filter options - removed no-op select transformation
  const {
    data: filterOptions,
    isLoading: isLoadingFilters,
    error: filterError,
    refetch: refetchFilters,
    isFetched: isFilterFetched,
    isPending: isFilterPending,
    isRefetching: isFilterRefetching,
  } = useQuery<FilterOptions, Error>({
    queryKey: filterOptionsQueryKey,
    queryFn: async () => {
      const params = prepareSearchParams();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/filters?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }

      return response.json();
    },
    // Removed no-op select transformation
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
    queryKey: laptopSearchQueryKey,
    queryFn: async (): Promise<LaptopT[]> => {
      const params = prepareSearchParams();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to search laptops");
      }

      return response.json();
    },
  });

  return {
    // Search term
    searchTerm: search.term || "",
    setSearchTerm,

    // Filters
    selectedFilters,
    toggleFilter,
    resetFilters,

    // Data and status
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
