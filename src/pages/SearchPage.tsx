import { useNavigate } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import { LaptopCard } from "../components/LaptopCard";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchLaptops } from "../hooks/useSearch";
import { SkeletonCard } from "../components/SkeletonCard";
import { useState, useEffect, useDeferredValue, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import autoAnimate from "@formkit/auto-animate";

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
}

const SkeletonCheckbox = () => (
  <div className="flex items-center space-x-2 py-1">
    <Checkbox disabled className="opacity-50 cursor-not-allowed" />
    <div className="h-4 w-24 rounded bg-neutral-700 animate-pulse" />
  </div>
);

export default function SearchPage() {
  const search = useSearch({ from: "/search" });
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setIsTransitioning(false), 100);
    } else {
      setIsTransitioning(true);
    }
  }, [isLoading]);

  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const showSkeletons = isLoading || isTransitioning || isPending;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Search Laptops</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/4">
          <div className="mb-4 rounded-md bg-neutral-900 p-4 relative">
            <h2 className="mb-4 text-xl font-semibold">Filters</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium">Brands</h3>
                <div className="mb-3 border-b border-neutral-700"></div>
                <div className="relative">
                  <ScrollArea className="h-18" ref={parent}>
                    {filterError ? (
                      <p className="text-red-500">
                        Error loading filters: {filterError.toString()}
                      </p>
                    ) : displayFilters?.brands ? (
                      displayFilters.brands.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 py-1"
                        >
                          <Checkbox
                            id={`brand-${option.value}`}
                            checked={selectedFilters.brand.includes(
                              option.value
                            )}
                            onCheckedChange={() =>
                              toggleFilter("brand", option.value)
                            }
                            disabled={option.disabled || isFilterRefetching}
                            className={
                              option.disabled || isFilterRefetching
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          />
                          <label
                            htmlFor={`brand-${option.value}`}
                            className={`text-sm font-medium leading-none ${
                              option.disabled || isFilterRefetching
                                ? "text-neutral-500"
                                : ""
                            }`}
                          >
                            {option.value}
                          </label>
                        </div>
                      ))
                    ) : null}
                  </ScrollArea>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Processors</h3>
                <div className="mb-3 border-b border-neutral-700"></div>
                <ScrollArea className="h-18" ref={parent}>
                  {displayFilters?.processorModels?.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`processor-${option.value}`}
                        checked={selectedFilters.processorModel.includes(
                          option.value
                        )}
                        onCheckedChange={() =>
                          toggleFilter("processorModel", option.value)
                        }
                        disabled={option.disabled || isFilterRefetching}
                        className={
                          option.disabled || isFilterRefetching
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      />
                      <label
                        htmlFor={`processor-${option.value}`}
                        className={`text-sm font-medium leading-none ${
                          option.disabled || isFilterRefetching
                            ? "text-neutral-500"
                            : ""
                        }`}
                      >
                        {option.value}
                      </label>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Graphics Cards</h3>
                <div className="mb-3 border-b border-neutral-700"></div>
                <ScrollArea className="h-18" ref={parent}>
                  {filterError ? (
                    <p className="text-red-500">
                      Error loading filters: {filterError.toString()}
                    </p>
                  ) : displayFilters?.gpuModels ? (
                    displayFilters.gpuModels.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`gpu-${option.value}`}
                          checked={selectedFilters.gpuModel.includes(
                            option.value
                          )}
                          onCheckedChange={() =>
                            toggleFilter("gpuModel", option.value)
                          }
                          disabled={option.disabled || isFilterRefetching}
                          className={
                            option.disabled || isFilterRefetching
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        />
                        <label
                          htmlFor={`gpu-${option.value}`}
                          className={`text-sm font-medium leading-none ${
                            option.disabled || isFilterRefetching
                              ? "text-neutral-500"
                              : ""
                          }`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))
                  ) : null}
                </ScrollArea>
              </div>

              <div>
                <h3 className="mb-2 font-medium">RAM Size</h3>
                <div className="mb-3 border-b border-neutral-700"></div>
                <ScrollArea className="h-18" ref={parent}>
                  {filterError ? (
                    <p className="text-red-500">
                      Error loading filters: {filterError.toString()}
                    </p>
                  ) : displayFilters?.ram ? (
                    displayFilters.ram.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`ram-${option.value}`}
                          checked={selectedFilters.ram.includes(option.value)}
                          onCheckedChange={() =>
                            toggleFilter("ram", option.value)
                          }
                          disabled={option.disabled || isFilterRefetching}
                          className={
                            option.disabled || isFilterRefetching
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        />
                        <label
                          htmlFor={`ram-${option.value}`}
                          className={`text-sm font-medium leading-none ${
                            option.disabled || isFilterRefetching
                              ? "text-neutral-500"
                              : ""
                          }`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))
                  ) : null}
                </ScrollArea>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Screen Size</h3>
                <div className="mb-3 border-b border-neutral-700"></div>
                <ScrollArea className="h-18" ref={parent}>
                  {filterError ? (
                    <p className="text-red-500">
                      Error loading filters: {filterError.toString()}
                    </p>
                  ) : displayFilters?.screenSizes ? (
                    displayFilters.screenSizes.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`screen-${option.value}`}
                          checked={selectedFilters.screenSize.includes(
                            option.value
                          )}
                          onCheckedChange={() =>
                            toggleFilter("screenSize", option.value)
                          }
                          disabled={option.disabled || isFilterRefetching}
                          className={
                            option.disabled || isFilterRefetching
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        />
                        <label
                          htmlFor={`screen-${option.value}`}
                          className={`text-sm font-medium leading-none ${
                            option.disabled || isFilterRefetching
                              ? "text-neutral-500"
                              : ""
                          }`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))
                  ) : null}
                </ScrollArea>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Storage Type</h3>
                <div className="mb-3 border-b border-neutral-700"></div>
                <ScrollArea className="h-18" ref={parent}>
                  {filterError ? (
                    <p className="text-red-500">
                      Error loading filters: {filterError.toString()}
                    </p>
                  ) : displayFilters?.storageTypes ? (
                    displayFilters.storageTypes.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`storage-${option.value}`}
                          checked={selectedFilters.storageType.includes(
                            option.value
                          )}
                          onCheckedChange={() =>
                            toggleFilter("storageType", option.value)
                          }
                          disabled={option.disabled || isFilterRefetching}
                          className={
                            option.disabled || isFilterRefetching
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        />
                        <label
                          htmlFor={`storage-${option.value}`}
                          className={`text-sm font-medium leading-none ${
                            option.disabled || isFilterRefetching
                              ? "text-neutral-500"
                              : ""
                          }`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))
                  ) : null}
                </ScrollArea>
              </div>
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
