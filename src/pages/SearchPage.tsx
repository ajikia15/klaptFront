import { useNavigate } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import { LaptopCard } from "../components/LaptopCard";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchLaptops } from "../hooks/useSearch";
import { SkeletonCard } from "../components/SkeletonCard";
import { useState, useEffect, useDeferredValue, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshSVG } from "@/assets/RefreshSVG";
import { SpinnerSVG } from "@/assets/SpinnerSVG";
import { useAuth } from "@/context/AuthContext";

interface FilterOption {
  value: string;
  disabled?: boolean;
  count?: number;
}

interface FilterOptionsType {
  brands?: FilterOption[];
  processorModels?: FilterOption[];
  gpuModels?: FilterOption[];
  ram?: FilterOption[];
  screenSizes?: FilterOption[];
  storageTypes?: FilterOption[];
  storageCapacity?: FilterOption[];
  ramType?: FilterOption[];
  screenResolution?: FilterOption[];
  stockStatus?: FilterOption[];
  priceRange?: { min: number; max: number };
  gpuBrands?: FilterOption[];
  processorBrands?: FilterOption[];
  graphicsTypes?: FilterOption[];
  backlightTypes?: FilterOption[];
  refreshRates?: FilterOption[];
  vram?: FilterOption[];
  years?: FilterOption[];
  models?: FilterOption[];
}

export default function SearchPage() {
  const search = useSearch({ from: "/search" });
  const navigate = useNavigate();
  // Type-safe filter configuration
  type FilterKey = keyof typeof selectedFilters;
  type OptionsKey = keyof typeof displayFilters;

  const filterSections = [
    {
      title: "Brands",
      filterKey: "brand" as FilterKey,
      optionsKey: "brands" as OptionsKey,
    },
    {
      title: "Processors",
      filterKey: "processorModel" as FilterKey,
      optionsKey: "processorModels" as OptionsKey,
    },
    {
      title: "Processor Brands",
      filterKey: "processorBrand" as FilterKey,
      optionsKey: "processorBrands" as OptionsKey,
    },
    {
      title: "Graphics Cards",
      filterKey: "gpuModel" as FilterKey,
      optionsKey: "gpuModels" as OptionsKey,
    },
    {
      title: "GPU Brands",
      filterKey: "gpuBrand" as FilterKey,
      optionsKey: "gpuBrands" as OptionsKey,
    },
    {
      title: "Graphics Type",
      filterKey: "graphicsType" as FilterKey,
      optionsKey: "graphicsTypes" as OptionsKey,
    },
    {
      title: "RAM Size",
      filterKey: "ram" as FilterKey,
      optionsKey: "ram" as OptionsKey,
    },
    {
      title: "RAM Type",
      filterKey: "ramType" as FilterKey,
      optionsKey: "ramTypes" as OptionsKey,
    },
    {
      title: "VRAM",
      filterKey: "vram" as FilterKey,
      optionsKey: "vram" as OptionsKey,
    },
    {
      title: "Screen Size",
      filterKey: "screenSize" as FilterKey,
      optionsKey: "screenSizes" as OptionsKey,
    },
    {
      title: "Screen Resolution",
      filterKey: "screenResolution" as FilterKey,
      optionsKey: "screenResolutions" as OptionsKey,
    },
    {
      title: "Storage Type",
      filterKey: "storageType" as FilterKey,
      optionsKey: "storageTypes" as OptionsKey,
    },
    {
      title: "Storage Capacity",
      filterKey: "storageCapacity" as FilterKey,
      optionsKey: "storageCapacity" as OptionsKey,
    },
    {
      title: "Refresh Rate",
      filterKey: "refreshRate" as FilterKey,
      optionsKey: "refreshRates" as OptionsKey,
    },
    {
      title: "Backlight Type",
      filterKey: "backlightType" as FilterKey,
      optionsKey: "backlightTypes" as OptionsKey,
    },
    {
      title: "Year",
      filterKey: "year" as FilterKey,
      optionsKey: "years" as OptionsKey,
    },
    {
      title: "Stock Status",
      filterKey: "stockStatus" as FilterKey,
      optionsKey: "stockStatuses" as OptionsKey, // Change to match useSearch.ts
    },
  ];

  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
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
    isFetched,
    isRefetching,
    resetFilters,
  } = useSearchLaptops(search.term || "");

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const [cachedFilters, setCachedFilters] = useState<FilterOptionsType | null>(
    null
  );

  useEffect(() => {
    if (filterOptions) {
      setCachedFilters(filterOptions);
    }
  }, [filterOptions]);

  const displayFilters = filterOptions || cachedFilters;

  useEffect(() => {
    setIsTransitioning(true);
    refetch().finally(() => {
      setTimeout(() => setIsTransitioning(false), 300);
    });
  }, [deferredSearchTerm, selectedFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate({
      to: "/search",
      search: { term: searchTerm },
      replace: true,
    });
  };

  const isPending = searchTerm !== deferredSearchTerm;

  const showSkeletons = isLoading || isTransitioning || isPending;

  const { isAuthenticated } = useAuth();
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Search Laptops</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/4 xl:w-1/5">
          <div className="mb-4 rounded-md bg-neutral-900 py-4 relative">
            <div className="flex mb-4 items-center justify-between">
              <h2 className="text-xl font-semibold">Filters</h2>
              <div className="flex items-center space-x-2">
                {displayFilters?.brands && !isFilterRefetching && !isLoading ? (
                  <button
                    className="grid place-items-center"
                    type="button"
                    disabled={isLoadingFilters || isFilterRefetching}
                    aria-label="Reset filters"
                    onClick={() => {
                      resetFilters();
                      setSearchTerm("");
                    }}
                  >
                    <RefreshSVG />
                  </button>
                ) : (
                  <>
                    <p className="text-neutral-500">Updating...</p>
                    <SpinnerSVG className="animate-spin" />
                  </>
                )}
              </div>
            </div>
            <div className="space-y-6">
              {filterSections.map(({ title, filterKey, optionsKey }) => (
                <div key={filterKey}>
                  <h3 className="mb-2 font-medium">{title}</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <ScrollArea className="h-18">
                    <div>
                      {filterError ? (
                        <p className="text-red-500">
                          Error loading filters: {filterError.toString()}
                        </p>
                      ) : displayFilters &&
                        optionsKey in displayFilters &&
                        displayFilters[optionsKey] ? (
                        (displayFilters[optionsKey] as FilterOption[]).map(
                          (option) => (
                            <div
                              key={option.value}
                              className="flex items-center space-x-2 py-1"
                            >
                              <Checkbox
                                id={`${filterKey}-${option.value}`}
                                checked={selectedFilters[filterKey].includes(
                                  option.value
                                )}
                                onCheckedChange={() =>
                                  toggleFilter(filterKey, option.value)
                                }
                                disabled={option.disabled}
                                className={
                                  option.disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }
                              />
                              <label
                                htmlFor={`${filterKey}-${option.value}`}
                                className={`text-sm font-medium leading-none ${
                                  option.disabled ? "text-neutral-500" : ""
                                }`}
                              >
                                {option.value}
                              </label>
                            </div>
                          )
                        )
                      ) : null}
                    </div>
                  </ScrollArea>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
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

          {!isLoading && laptops && laptops.length > 0 && (
            <h2 className="mb-4 text-xl font-semibold text-white">
              {laptops.length} result{laptops.length !== 1 ? "s" : ""} found
            </h2>
          )}

          {error && (
            <div className="mb-4 p-4 text-center text-red-500">
              Error searching laptops: {error.toString()}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-[200px]">
            {showSkeletons &&
              Array(6)
                .fill(0)
                .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)}

            {!showSkeletons &&
              laptops &&
              laptops.length > 0 &&
              laptops.map((laptop) => (
                <LaptopCard
                  key={`laptop-${laptop.id}`}
                  id={laptop.id}
                  title={laptop.title}
                  price={laptop.price}
                  shortDesc={laptop.shortDesc}
                  image={laptop.images[0]}
                  isAuthenticated={isAuthenticated}
                />
              ))}

            <div
              className="opacity-0 pointer-events-none h-0 md:col-span-2 lg:col-span-3"
              aria-hidden="true"
              key="ghost-element"
            />
          </div>

          {!showSkeletons &&
            laptops &&
            laptops.length === 0 &&
            (searchTerm ||
              Object.values(selectedFilters).some((arr) => arr.length > 0)) && (
              <div className="mt-6 rounded-lg bg-neutral-800 p-8 text-center">
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
        </div>
      </div>
    </div>
  );
}
