import { LaptopCard } from "../components/LaptopCard";
import { Checkbox } from "@/components/ui/checkbox";
import { SkeletonCard } from "../components/SkeletonCard";
import { useState, useEffect, useDeferredValue, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpinnerSVG } from "@/assets/SpinnerSVG";
import { useAuth } from "@/context/AuthContext";
import { useNewSearch } from "../hooks/useNewSearch";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  X,
  Search,
  Filter,
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

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
  tags?: FilterOption[];
}

export default function SearchPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Use the new URL-based search hook instead of the old one
  const {
    searchTerm,
    setSearchTerm,
    selectedFilters,
    filterOptions,
    laptops,
    filterError,
    isLoading,
    error,
    toggleFilter,
    refetch,
    resetFilters,
    isFilterRefetching,
    isFetched,
    isPending,
  } = useNewSearch();

  // Type-safe filter configuration
  type FilterKey = keyof typeof selectedFilters;
  type OptionsKey = keyof FilterOptionsType;

  // Define the most important filters to show on desktop sidebar

  const filterSections = [
    {
      title: "Brands",
      filterKey: "brand" as FilterKey,
      optionsKey: "brands" as OptionsKey,
      isPrimary: true,
    },
    {
      title: "Processors",
      filterKey: "processorModel" as FilterKey,
      optionsKey: "processorModels" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Graphics Cards",
      filterKey: "gpuModel" as FilterKey,
      optionsKey: "gpuModels" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "GPU Brands",
      filterKey: "gpuBrand" as FilterKey,
      optionsKey: "gpuBrands" as OptionsKey,
      isPrimary: true,
    },

    {
      title: "VRAM",
      filterKey: "vram" as FilterKey,
      optionsKey: "vram" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "RAM Size",
      filterKey: "ram" as FilterKey,
      optionsKey: "ram" as OptionsKey,
      isPrimary: true,
    },
    {
      title: "RAM Type",
      filterKey: "ramType" as FilterKey,
      optionsKey: "ramTypes" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Graphics Type",
      filterKey: "graphicsType" as FilterKey,
      optionsKey: "graphicsTypes" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Processor Brands",
      filterKey: "processorBrand" as FilterKey,
      optionsKey: "processorBrands" as OptionsKey,
      isPrimary: true,
    },
    {
      title: "Storage Type",
      filterKey: "storageType" as FilterKey,
      optionsKey: "storageTypes" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Storage Capacity",
      filterKey: "storageCapacity" as FilterKey,
      optionsKey: "storageCapacity" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Screen Size",
      filterKey: "screenSize" as FilterKey,
      optionsKey: "screenSizes" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Screen Resolution",
      filterKey: "screenResolution" as FilterKey,
      optionsKey: "screenResolutions" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Refresh Rate",
      filterKey: "refreshRate" as FilterKey,
      optionsKey: "refreshRates" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Stock Status",
      filterKey: "stockStatus" as FilterKey,
      optionsKey: "stockStatuses" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Year",
      filterKey: "year" as FilterKey,
      optionsKey: "years" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Backlight Type",
      filterKey: "backlightType" as FilterKey,
      optionsKey: "backlightTypes" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Tags",
      filterKey: "tags" as FilterKey,
      optionsKey: "tags" as OptionsKey,
      isPrimary: false,
    },
  ];

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sortOption, setSortOption] = useState<
    "default" | "priceLowToHigh" | "priceHighToLow"
  >("default");

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const debouncedSearchTerm = useDebounce(deferredSearchTerm, 300); // 300ms delay

  const [cachedFilters, setCachedFilters] = useState<FilterOptionsType | null>(
    null
  );

  useEffect(() => {
    if (filterOptions) {
      setCachedFilters(filterOptions);
    }
  }, [filterOptions]);

  const displayFilters: FilterOptionsType =
    filterOptions || cachedFilters || {};

  const hasOptions = (optionsKey: OptionsKey): boolean => {
    const options = displayFilters[optionsKey];
    return Array.isArray(options) && options.length > 0;
  };

  // Get the number of options for each filter section
  const getOptionsCount = (optionsKey: OptionsKey): number => {
    const options = displayFilters[optionsKey];
    return Array.isArray(options) ? options.length : 0;
  };

  // Refetch data when search term changes
  useEffect(() => {
    if (debouncedSearchTerm === "" || debouncedSearchTerm.length >= 2) {
      setIsTransitioning(true);
      refetch().finally(() => {
        setIsTransitioning(false);
      });
    }
  }, [debouncedSearchTerm, refetch]);

  // Sort laptops based on current sort option - now memoized
  const sortedLaptops = useMemo(() => {
    if (!laptops) return [];

    return [...laptops].sort((a, b) => {
      if (sortOption === "priceLowToHigh") {
        return a.price - b.price;
      } else if (sortOption === "priceHighToLow") {
        return b.price - a.price;
      }
      return 0;
    });
  }, [laptops, sortOption]);

  const showSkeletons = isLoading || isTransitioning || isPending || !isFetched;
  const { isAuthenticated } = useAuth();

  // Memoize derived values for better performance
  const activeFiltersCount = useMemo(
    () =>
      Object.values(selectedFilters).reduce(
        (acc, filters) => acc + filters.length,
        0
      ),
    [selectedFilters]
  );

  // Check if any filter is applied - now memoized
  const hasActiveFilters = useMemo(
    () => activeFiltersCount > 0,
    [activeFiltersCount]
  );

  const isValueSelected = (
    filterKey: FilterKey,
    optionValue: string
  ): boolean => {
    const selectedValues = selectedFilters[filterKey];
    return selectedValues.map(String).includes(String(optionValue));
  };

  const FilterSection = ({
    section,
    inAccordion = false,
    maxItems = 1000,
  }: {
    section: (typeof filterSections)[0];
    inAccordion?: boolean;
    maxItems?: number;
  }) => {
    const { filterKey, optionsKey } = section;

    return (
      <div className="transition-opacity duration-150 ease-in-out">
        <ScrollArea className={getOptionsCount(optionsKey) > 5 ? "pr-1" : ""}>
          <div className="py-1">
            {filterError ? (
              <p className="text-red-500">Error loading filters</p>
            ) : displayFilters &&
              optionsKey in displayFilters &&
              displayFilters[optionsKey] ? (
              (displayFilters[optionsKey] as FilterOption[])
                .slice(0, maxItems) // Limit number of items shown
                .map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 py-1.5"
                  >
                    <Checkbox
                      id={`${filterKey}-${option.value}${
                        inAccordion ? "-sheet" : ""
                      }`}
                      // Use our helper function to ensure consistent type comparison
                      checked={isValueSelected(filterKey, option.value)}
                      onCheckedChange={() =>
                        toggleFilter(filterKey, option.value)
                      }
                      disabled={option.disabled}
                      className={`${
                        option.disabled ? "opacity-50 cursor-not-allowed" : ""
                      } ${
                        isValueSelected(filterKey, option.value)
                          ? "border-primary-500"
                          : ""
                      }`}
                    />
                    <label
                      htmlFor={`${filterKey}-${option.value}${
                        inAccordion ? "-sheet" : ""
                      }`}
                      className={`text-sm leading-none ${
                        option.disabled
                          ? "text-neutral-500"
                          : isValueSelected(filterKey, option.value)
                          ? "text-white"
                          : "text-neutral-400"
                      } cursor-pointer hover:text-white transition-colors`}
                    >
                      {option.value}
                    </label>
                  </div>
                ))
            ) : null}

            {/* "Show more" link if needed */}
            {displayFilters &&
              optionsKey in displayFilters &&
              displayFilters[optionsKey] &&
              (displayFilters[optionsKey] as FilterOption[]).length >
                maxItems &&
              !inAccordion && (
                <div className="border-neutral-700/30 mt-1 border-t pt-1">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-6 p-0 text-xs text-neutral-400 hover:text-primary-400"
                      >
                        Show all{" "}
                        {(displayFilters[optionsKey] as FilterOption[]).length}{" "}
                        options...
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="border-neutral-700/50 w-[400px] bg-neutral-900"
                    >
                      <SheetHeader>
                        <SheetTitle className="flex items-center justify-between text-white">
                          <span>{section.title}</span>
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-4">
                        <FilterSection section={section} inAccordion={true} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const [tagAnimationParent] = useAutoAnimate();
  const [cardAnimationParent] = useAutoAnimate();
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200">
      {/* Header Area with page title and basic info */}

      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="hidden md:block md:w-1/4 xl:w-1/5">
            <div className="sticky top-4 rounded-md bg-neutral-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filters</h2>
                <div className="flex items-center space-x-2">
                  {isFilterRefetching || isLoading ? (
                    <>
                      <p className="text-neutral-500">Updating...</p>
                      <SpinnerSVG className="animate-spin" />
                    </>
                  ) : null}
                </div>
              </div>

              {/* Scrollable filters area */}
              <div className="scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
                <Accordion
                  type="multiple"
                  defaultValue={filterSections.map(
                    (section) => section.filterKey
                  )}
                  className="space-y-1.5"
                >
                  {filterSections
                    .filter((section) => hasOptions(section.optionsKey))
                    .map((section) => (
                      <AccordionItem
                        key={section.filterKey}
                        value={section.filterKey}
                        className="border-neutral-800/50 overflow-hidden border-b"
                      >
                        <AccordionTrigger className="group px-1 py-2 hover:no-underline">
                          <div className="flex w-full items-center justify-between">
                            <span className="text-sm font-medium text-neutral-300 transition-colors group-hover:text-white">
                              {section.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-1 pb-2 pt-1">
                          <FilterSection section={section} maxItems={5} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            {/* Search, sort and filter controls */}
            <div className="border-neutral-700/50 bg-neutral-800/50 mb-4 rounded-lg border p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="relative"
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <Search size={18} className="text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for laptops by brand, model, or specs..."
                      className="bg-neutral-900/90 h-10 w-full rounded-lg border border-neutral-700 pl-10 pr-4 text-white shadow-inner focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </form>
                </div>

                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-neutral-900/90 border-neutral-600 text-white hover:bg-neutral-700"
                      >
                        <ArrowDownAZ size={16} className="mr-2" />
                        {sortOption === "default"
                          ? "Sort: Default"
                          : sortOption === "priceLowToHigh"
                          ? "Price: Low to High"
                          : "Price: High to Low"}
                        <ChevronDown size={16} className="ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 border-neutral-600 bg-neutral-800">
                      <DropdownMenuLabel className="text-neutral-200">
                        Sort By
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-neutral-600" />
                      <DropdownMenuItem
                        onClick={() => setSortOption("default")}
                        className={`${
                          sortOption === "default"
                            ? "bg-primary-800/40 text-primary-300"
                            : "text-white"
                        } cursor-pointer hover:bg-neutral-700`}
                      >
                        Default
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortOption("priceLowToHigh")}
                        className={`${
                          sortOption === "priceLowToHigh"
                            ? "bg-primary-800/40 text-primary-300"
                            : "text-white"
                        } cursor-pointer hover:bg-neutral-700`}
                      >
                        <ArrowUpAZ size={16} className="mr-2" />
                        Price: Low to High
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortOption("priceHighToLow")}
                        className={`${
                          sortOption === "priceHighToLow"
                            ? "bg-primary-800/40 text-primary-300"
                            : "text-white"
                        } cursor-pointer hover:bg-neutral-700`}
                      >
                        <ArrowDownAZ size={16} className="mr-2" />
                        Price: High to Low
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile-only filter button - replaced Sheet with Drawer */}
                  <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-neutral-900/90 relative border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white lg:hidden"
                      >
                        <Filter size={16} className="mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="border-t border-neutral-700 bg-neutral-900 px-2">
                      {/* Mobile filter drawer content */}
                      <DrawerHeader>
                        <DrawerTitle className="flex items-center justify-between text-white">
                          <div className="flex items-center">
                            <Filter
                              size={16}
                              className="mr-2 text-primary-400"
                            />
                            All Filters
                          </div>
                          {activeFiltersCount > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                resetFilters();
                                setSearchTerm("");
                              }}
                              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                            >
                              <X size={14} className="mr-1" />
                              Reset All
                            </Button>
                          )}
                        </DrawerTitle>
                        <DrawerDescription className="text-neutral-400">
                          Narrow down your search with these filters
                        </DrawerDescription>
                      </DrawerHeader>

                      {/* Copy of the filter sheet content */}
                      <div className="overflow-y-auto pb-20">
                        <Accordion
                          type="multiple"
                          defaultValue={["brand"]}
                          className="space-y-2"
                        >
                          {filterSections
                            .filter(({ optionsKey }) => hasOptions(optionsKey))
                            .map((section) => (
                              <AccordionItem
                                key={section.filterKey}
                                value={section.filterKey}
                                className="border-neutral-700/50 overflow-hidden rounded-lg border"
                              >
                                <AccordionTrigger className="bg-neutral-800/50 px-4 py-2 hover:bg-neutral-800 hover:no-underline data-[state=open]:bg-neutral-800">
                                  <div className="flex w-full items-center justify-between">
                                    <span className="font-bold text-neutral-200">
                                      {section.title}
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-neutral-900 px-4 py-3">
                                  <FilterSection
                                    section={section}
                                    inAccordion={true}
                                  />
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                        </Accordion>
                      </div>

                      <DrawerFooter className="border-neutral-700/30 mt-4 border-t pt-4">
                        <Button
                          onClick={() => setIsDrawerOpen(false)}
                          className="bg-primary-600 text-white hover:bg-primary-700"
                        >
                          Apply Filters
                        </Button>
                        <DrawerClose asChild>
                          <Button
                            variant="outline"
                            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                          >
                            Cancel
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            </div>

            <div className="mb-5 px-1">
              <div
                className="flex flex-wrap items-center gap-1 text-sm text-neutral-400"
                ref={tagAnimationParent}
              >
                <p className="py-1">Showing results for </p>
                {hasActiveFilters ? (
                  <>
                    filter options:
                    {Object.entries(selectedFilters).map(
                      ([key, values]) =>
                        values.length > 0 &&
                        values.map((value: string) => (
                          <Badge
                            key={`${key}-${value}`}
                            className="border-neutral-700/50 inline-flex items-center bg-neutral-800 !py-1 px-1.5 text-white transition-all hover:bg-neutral-700 hover:shadow-md"
                            variant="outline"
                            onClick={() =>
                              toggleFilter(key as FilterKey, value)
                            }
                          >
                            <X size={10} className="mr-0.5 text-neutral-400" />
                            <span className="mr-0.5 text-xs text-neutral-400">
                              {
                                filterSections.find((f) => f.filterKey === key)
                                  ?.title
                              }
                              :
                            </span>
                            <span className="text-xs">{value}</span>
                          </Badge>
                        ))
                    )}
                  </>
                ) : (
                  "all laptops"
                )}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 text-center text-red-500">
                Error searching laptops: {error.toString()}
              </div>
            )}

            <div
              className="min-h-50 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              // ref={cardAnimationParent}
            >
              {showSkeletons &&
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonCard key={`skeleton-${index}`} />
                  ))}

              {!showSkeletons &&
                laptops &&
                laptops.length > 0 &&
                sortedLaptops.map((laptop) => (
                  <LaptopCard
                    key={laptop.id}
                    isAuthenticated={isAuthenticated}
                    {...laptop}
                  />
                ))}

              <div
                className="pointer-events-none h-0 opacity-0 md:col-span-2 lg:col-span-3"
                aria-hidden="true"
                key="ghost-element"
              />
            </div>

            {!showSkeletons &&
              laptops &&
              laptops.length === 0 &&
              (searchTerm ||
                Object.values(selectedFilters).some(
                  (arr) => arr.length > 0
                )) && (
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resetFilters();
                      setSearchTerm("");
                    }}
                    className="mt-4 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
