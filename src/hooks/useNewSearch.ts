import { useSearch, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { PaginatedLaptops } from '../interfaces/PaginatedLaptops';
import { searchRoute } from '../router';
import { useCallback, useMemo, useState } from 'react';
import { apiRequest } from "@/services/api";

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
  | 'brand'
  | 'gpuModel'
  | 'processorModel'
  | 'ramType'
  | 'ram'
  | 'storageType'
  | 'storageCapacity'
  | 'stockStatus'
  | 'screenSize'
  | 'screenResolution'
  | 'processorBrand'
  | 'gpuBrand'
  | 'graphicsType'
  | 'backlightType'
  | 'refreshRate'
  | 'vram'
  | 'year'
  | 'model'
  | 'shortDesc'
  | 'tags'
  | 'minPrice'
  | 'maxPrice';

export function useNewSearch(userId?: number) {
  const search = useSearch({ from: searchRoute.id });
  const navigate = useNavigate({ from: searchRoute.id });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9); // Set limit to 9

  // Extract term directly - much simpler
  const term = search.term || '';

  // Extract filters once and reuse - more efficient
  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(search).filter(
          ([key, value]) => key !== 'term' && value !== undefined,
        ),
      ),
    [search],
  );

  // Hoist the sorted filter entries to avoid duplicate sorting
  const sortedFilterEntries = useMemo(
    () => Object.entries(filters).sort((a, b) => a[0].localeCompare(b[0])),
    [filters],
  );

  // Flatten sorted entries to a stable string for query keys
  const filterEntriesKey = useMemo(
    () =>
      sortedFilterEntries
        .map(([k, v]) =>
          Array.isArray(v) ? `${k}:${v.join(',')}` : `${k}:${v}`,
        )
        .join('|'),
    [sortedFilterEntries],
  );

  // Helper function to get array values from search params - now uses filters
  const getArrayParam = useCallback(
    (key: FilterCategory): string[] => {
      const value = filters[key];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value];
      return [];
    },
    [filters],
  );

  // Create memoized selected filters object - DRY approach using FilterCategory type
  const selectedFilters = useMemo(() => {
    // Create an empty result object with default empty arrays for all categories
    const result: Record<FilterCategory, string[]> = {
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
      minPrice: [], // <-- changed
      maxPrice: [], // <-- changed
    };

    if (filters && Object.keys(filters).length > 0) {
      // Safely populate with available filter values
      Object.keys(filters).forEach((key) => {
        // Only set values for valid filter categories
        if (key in result) {
          result[key as FilterCategory] = getArrayParam(key as FilterCategory);
        }
      });
    }

    return result;
  }, [filters, getArrayParam]);

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
    [getArrayParam, navigate],
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
    [navigate],
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    navigate({
      search: {},
      replace: true,
    });
  }, [navigate]);

  // Add this function inside useNewSearch:
  const setPriceRange = useCallback(
    (min: number, max: number) => {
      navigate({
        search: (prev) => ({
          ...prev,
          minPrice: min !== 500 ? String(min) : undefined,
          maxPrice: max !== 5000 ? String(max) : undefined,
        }),
        replace: false,
      });
    },
    [navigate],
  );

  // Prepare and memoize the query string for API calls
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    // Add search term
    if (term) {
      params.append('term', term);
    }

    // Add all filter parameters - use sortedFilterEntries to avoid recomputing
    sortedFilterEntries.forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((value) => {
          params.append(key, value);
        });
      }
    });

    // Add userId if provided
    if (userId !== undefined) {
      params.append('userId', userId.toString());
    }

    // Use minPrice/maxPrice instead of priceMin/priceMax
    if (filters.minPrice) params.set('minPrice', filters.minPrice as string);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice as string);

    params.set('page', String(page));
    params.set('limit', String(limit));

    return params.toString();
  }, [term, sortedFilterEntries, userId, filters, page, limit]);

  // Simplified and flattened query keys - more efficient for React Query's cache comparison
  const filterQueryKey = useMemo(
    () => ['filterOptions', term, userId, filterEntriesKey],
    [term, userId, filterEntriesKey],
  );

  const laptopQueryKey = useMemo(
    () => ['laptopSearch', term, userId, filterEntriesKey],
    [term, userId, filterEntriesKey],
  );

  // Consistent caching settings for both queries
  const cacheConfig = {
    staleTime: 5000, // Keep data fresh for 5 seconds to prevent unnecessary refetches
    // keepPreviousData: true, // Keep displaying previous results while fetching new ones
  };

  // Query for filter options
  const {
    data: filterOptions,
    isLoading: isLoadingFilters,
    error: filterError,
    isFetched: isFilterFetched,
    isPending: isFilterPending,
    isRefetching: isFilterRefetching,
  } = useQuery<FilterOptions, Error>({
    queryKey: filterQueryKey,
    queryFn: async () => {
      const response = await apiRequest(`/laptops/filters?${queryString}`);
      if (response.error) {
        throw new Error('Failed to fetch filter options: ' + response.error);
      }
      return response.data as FilterOptions;
    },
    ...cacheConfig,
  });

  // Query for laptops (now paginated)
  const {
    data: paginated,
    isLoading,
    error,
    refetch,
    isFetched,
    isPending,
    isRefetching,
  } = useQuery<PaginatedLaptops, Error>({
    queryKey: laptopQueryKey.concat([page, limit]),
    queryFn: async (): Promise<PaginatedLaptops> => {
      const response = await apiRequest(`/laptops/search?${queryString}`);
      if (response.error) {
        throw new Error('Failed to search laptops: ' + response.error);
      }
      return response.data as PaginatedLaptops;
    },
    ...cacheConfig,
  });

  const laptops = paginated?.data ?? [];
  const total = paginated?.total ?? 0;
  const pageCount = paginated?.pageCount ?? 1;

  return {
    searchTerm: term,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    resetFilters,
    filterOptions,
    laptops,
    total,
    page,
    setPage,
    limit,
    setLimit,
    pageCount,
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
    setPriceRange,
  };
}
