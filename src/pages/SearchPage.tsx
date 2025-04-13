import { useNavigate } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import { LaptopCard } from "../components/LaptopCard";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchLaptops } from "../hooks/useSearch";
import { SkeletonCard } from "../components/SkeletonCard";
import { useState, useEffect, useDeferredValue } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshSVG } from "@/assets/RefreshSVG";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  ArrowDownAZ,
  ArrowUpAZ,
  Star,
  Filter,
  X,
  ChevronDown,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define useMediaQuery hook inline
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

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
  const search = useSearch({ from: "/search" });
  const navigate = useNavigate();
  const showMobileUI = useMediaQuery("(max-width: 768px)");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Type-safe filter configuration
  type FilterKey = keyof typeof selectedFilters;
  type OptionsKey = keyof typeof displayFilters;

  // Define the most important filters to show on desktop sidebar
  const primaryFilterKeys = ["brand", "processorBrand", "ram", "gpuBrand"];

  const filterSections = [
    {
      title: "Brands",
      filterKey: "brand" as FilterKey,
      optionsKey: "brands" as OptionsKey,
      isPrimary: true,
    },
    {
      title: "Processor Brands",
      filterKey: "processorBrand" as FilterKey,
      optionsKey: "processorBrands" as OptionsKey,
      isPrimary: true,
    },
    {
      title: "Processors",
      filterKey: "processorModel" as FilterKey,
      optionsKey: "processorModels" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "Graphics Type",
      filterKey: "graphicsType" as FilterKey,
      optionsKey: "graphicsTypes" as OptionsKey,
      isPrimary: false,
    },
    {
      title: "GPU Brands",
      filterKey: "gpuBrand" as FilterKey,
      optionsKey: "gpuBrands" as OptionsKey,
      isPrimary: true,
    },
    {
      title: "Graphics Cards",
      filterKey: "gpuModel" as FilterKey,
      optionsKey: "gpuModels" as OptionsKey,
      isPrimary: false,
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

  const hasOptions = (optionsKey: OptionsKey): boolean => {
    if (!displayFilters || !(optionsKey in displayFilters)) {
      return false;
    }

    const options = displayFilters[optionsKey] as unknown as any[];
    return Array.isArray(options) && options.length > 0;
  };

  // Get the number of options for each filter section
  const getOptionsCount = (optionsKey: OptionsKey): number => {
    if (!displayFilters || !(optionsKey in displayFilters)) {
      return 0;
    }

    const options = displayFilters[optionsKey] as unknown as any[];
    return Array.isArray(options) ? options.length : 0;
  };

  // Calculate appropriate scroll area height
  const getScrollHeight = (optionsKey: OptionsKey): string => {
    const count = getOptionsCount(optionsKey);
    if (count <= 3) return "auto";
    if (count <= 6) return `${count * 28}px`;
    return "168px";
  };

  useEffect(() => {
    setIsTransitioning(true);
    refetch().finally(() => {
      setTimeout(() => setIsTransitioning(false), 300);
    });
  }, [deferredSearchTerm, selectedFilters, refetch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate({
      to: "/search",
      search: { term: searchTerm },
      replace: true,
    });
  };

  // Sort laptops based on current sort option
  const sortedLaptops = laptops
    ? [...laptops].sort((a, b) => {
        if (sortOption === "priceLowToHigh") {
          return a.price - b.price;
        } else if (sortOption === "priceHighToLow") {
          return b.price - a.price;
        }
        return 0;
      })
    : [];

  const isPending = searchTerm !== deferredSearchTerm;
  const showSkeletons = isLoading || isTransitioning || isPending;
  const { isAuthenticated } = useAuth();

  // Count how many active filters we have
  const activeFiltersCount = Object.values(selectedFilters).reduce(
    (acc, filters) => acc + filters.length,
    0
  );

  // Check if any filter is applied
  const hasActiveFilters = activeFiltersCount > 0;

  // FILTER COMPONENT - Extracted for reusability
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
      <div className="filter-section">
        <ScrollArea
          className={getOptionsCount(optionsKey) > 5 ? "pr-1" : ""}
          style={{
            maxHeight: inAccordion ? "200px" : getScrollHeight(optionsKey),
          }}
        >
          <div>
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
                      checked={selectedFilters[filterKey].includes(
                        option.value
                      )}
                      onCheckedChange={() =>
                        toggleFilter(filterKey, option.value)
                      }
                      disabled={option.disabled}
                      className={`${
                        option.disabled ? "opacity-50 cursor-not-allowed" : ""
                      } ${
                        selectedFilters[filterKey].includes(option.value)
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
                          : selectedFilters[filterKey].includes(option.value)
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
                <div className="mt-1 pt-1 border-t border-neutral-700/30">
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
                      className="w-[400px] bg-neutral-900 border-neutral-700/50"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-white flex items-center justify-between">
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

  // Active filters component that can be reused
  const ActiveFiltersComponent = () => {
    if (!hasActiveFilters) return null;

    return (
      <div className="space-y-2">
        {Object.entries(selectedFilters).map(
          ([key, values]) =>
            values.length > 0 &&
            values.map((value: string) => (
              <div
                key={`${key}-${value}`}
                className="rounded-lg bg-neutral-800 border border-neutral-700/70 px-3 py-1.5 text-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <span className="text-neutral-400 text-xs truncate">
                    {filterSections.find((f) => f.filterKey === key)?.title}:
                  </span>
                  <span className="text-white truncate">{value}</span>
                </div>
                <button
                  onClick={() => toggleFilter(key as FilterKey, value)}
                  className="text-neutral-500 hover:text-white transition-colors flex-shrink-0"
                  aria-label={`Remove ${
                    filterSections.find((f) => f.filterKey === key)?.title
                  }: ${value} filter`}
                >
                  <X size={14} />
                </button>
              </div>
            ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200">
      {/* Header Area with Search & Filters */}
      <div className="bg-neutral-800/80 py-6 border-b border-neutral-700/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit} className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for laptops by brand, model, or specs..."
                  className="w-full h-12 rounded-lg bg-neutral-900/90 pl-10 pr-4 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-inner"
                />
              </form>
            </div>

            <div className="flex gap-2 items-center justify-between md:w-1/3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-neutral-900/90 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 flex-1"
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
                <DropdownMenuContent className="w-48 bg-neutral-800 border-neutral-700">
                  <DropdownMenuLabel className="text-neutral-400">
                    Sort By
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  <DropdownMenuItem
                    onClick={() => setSortOption("default")}
                    className={`${
                      sortOption === "default"
                        ? "bg-primary-900/20 text-primary-400"
                        : ""
                    } cursor-pointer hover:bg-neutral-700`}
                  >
                    Default
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("priceLowToHigh")}
                    className={`${
                      sortOption === "priceLowToHigh"
                        ? "bg-primary-900/20 text-primary-400"
                        : ""
                    } cursor-pointer hover:bg-neutral-700`}
                  >
                    <ArrowUpAZ size={16} className="mr-2" />
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("priceHighToLow")}
                    className={`${
                      sortOption === "priceHighToLow"
                        ? "bg-primary-900/20 text-primary-400"
                        : ""
                    } cursor-pointer hover:bg-neutral-700`}
                  >
                    <ArrowDownAZ size={16} className="mr-2" />
                    Price: High to Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter Button - Show on both mobile and desktop */}
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-neutral-900/90 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 relative"
                  >
                    <Filter size={16} className="mr-2" />
                    All Filters
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={showMobileUI ? "bottom" : "right"}
                  className={`bg-neutral-900 border-neutral-700 ${
                    showMobileUI ? "h-[85vh] rounded-t-xl" : "w-[400px]"
                  }`}
                >
                  <SheetHeader>
                    <SheetTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Filter size={16} className="mr-2 text-primary-400" />
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
                          className="text-neutral-400 hover:text-white border-neutral-700 hover:bg-neutral-800"
                        >
                          <X size={14} className="mr-1" />
                          Reset All
                        </Button>
                      )}
                    </SheetTitle>
                    <SheetDescription className="text-neutral-400">
                      Narrow down your search with these filters
                    </SheetDescription>
                  </SheetHeader>

                  <div className="h-[calc(100vh-170px)] overflow-y-auto py-4 pr-2">
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
                            className="border border-neutral-700/50 rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-2 hover:no-underline bg-neutral-800/50 hover:bg-neutral-800 data-[state=open]:bg-neutral-800">
                              <div className="flex items-center justify-between w-full">
                                <span className="text-neutral-200">
                                  {section.title}
                                </span>
                                {selectedFilters[section.filterKey].length >
                                  0 && (
                                  <span className="ml-2 bg-primary-600/20 text-primary-500 text-xs rounded-full px-2 py-0.5 mr-2">
                                    {selectedFilters[section.filterKey].length}
                                  </span>
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 py-3 bg-neutral-900">
                              <FilterSection
                                section={section}
                                inAccordion={true}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Active Filters in Sheet - Added below the filters list */}
                    {hasActiveFilters && (
                      <div className="mt-6 pt-6 border-t border-neutral-700/30">
                        <div className="px-1 mb-3">
                          <h3 className="text-sm font-medium text-white flex items-center">
                            <span className="h-1 w-4 bg-primary-500 rounded-full mr-2"></span>
                            Applied Filters
                          </h3>
                        </div>
                        <div className="px-1">
                          <ActiveFiltersComponent />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              resetFilters();
                              setSearchTerm("");
                            }}
                            className="mt-3 text-neutral-400 hover:text-white hover:bg-neutral-800/70 text-xs"
                          >
                            Clear All Filters
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <SheetFooter className="mt-4 flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsSheetOpen(false)}
                      className="flex-1 border-neutral-700 hover:bg-neutral-800 text-neutral-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setIsSheetOpen(false)}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      Apply Filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 pt-6 pb-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar Filters - Now with accordions */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl shadow-md overflow-hidden sticky top-[106px]">
              <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Filter size={16} className="text-primary-400" /> Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => resetFilters()}
                    className="h-8 px-2 text-xs text-neutral-400 hover:text-white"
                  >
                    Reset
                  </Button>
                )}
              </div>

              <div className="p-4 space-y-4">
                {/* Using accordions for the desktop sidebar filters */}
                {isLoadingFilters ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                    <span className="ml-2 text-sm text-neutral-400">
                      Loading filters...
                    </span>
                  </div>
                ) : (
                  <>
                    <Accordion
                      type="multiple"
                      defaultValue={primaryFilterKeys}
                      className="space-y-3"
                    >
                      {filterSections
                        .filter(
                          (section) =>
                            primaryFilterKeys.includes(section.filterKey) &&
                            hasOptions(section.optionsKey)
                        )
                        .map((section) => (
                          <AccordionItem
                            key={section.filterKey}
                            value={section.filterKey}
                            className="border border-neutral-700/30 rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-3 py-2 hover:no-underline bg-neutral-800/50 hover:bg-neutral-800 text-sm">
                              <div className="flex items-center justify-between w-full">
                                <span className="text-neutral-200">
                                  {section.title}
                                </span>
                                {selectedFilters[section.filterKey].length >
                                  0 && (
                                  <span className="ml-2 bg-primary-600/20 text-primary-500 text-xs rounded-full px-2 py-0.5 mr-1">
                                    {selectedFilters[section.filterKey].length}
                                  </span>
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-3 py-2 bg-neutral-800/20">
                              <FilterSection
                                section={section}
                                maxItems={5} // Only show top 5 options in each category
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Applied Filters Section - Below primary filters */}
                    {hasActiveFilters && (
                      <div className="pt-3 mt-3 border-t border-neutral-700/30 space-y-3">
                        <div className="px-1">
                          <h3 className="text-sm font-medium text-white flex items-center mb-2">
                            <span className="h-1 w-4 bg-primary-500 rounded-full mr-2"></span>
                            Applied Filters
                          </h3>
                          <ActiveFiltersComponent />
                        </div>
                      </div>
                    )}

                    {/* "See All Filters" button at the bottom */}
                    <div className="pt-2 mt-2 border-t border-neutral-700/30">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSheetOpen(true)}
                        className="w-full justify-center text-neutral-300 hover:text-white bg-neutral-800/40 hover:bg-neutral-800"
                      >
                        <span>See All Filters</span>
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Star className="mr-3 text-primary-400" size={24} />
                {searchTerm ? `Results for "${searchTerm}"` : "All Laptops"}
              </h2>

              {!isLoading &&
                !isTransitioning &&
                !isPending &&
                sortedLaptops &&
                sortedLaptops.length > 0 && (
                  <span className="ml-4 text-sm text-neutral-400">
                    {sortedLaptops.length} result
                    {sortedLaptops.length !== 1 ? "s" : ""}
                  </span>
                )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-900/20 border border-red-900/30 p-4 text-center text-red-400">
                Error searching laptops: {error.toString()}
              </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showSkeletons &&
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonCard key={`skeleton-${index}`} />
                  ))}

              {!showSkeletons &&
                sortedLaptops &&
                sortedLaptops.length > 0 &&
                sortedLaptops.map((laptop) => (
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
            </div>

            {/* No Results View */}
            {!showSkeletons &&
              laptops &&
              laptops.length === 0 &&
              (searchTerm ||
                Object.values(selectedFilters).some(
                  (arr) => arr.length > 0
                )) && (
                <div className="py-20 text-center">
                  <div className="inline-block p-4 rounded-full bg-neutral-800/50 mb-4">
                    <Search size={32} className="text-neutral-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    No results found
                  </h2>
                  <p className="text-neutral-400 max-w-md mx-auto mb-6">
                    We couldn't find any laptops matching your search criteria.
                    Try adjusting your filters or search term.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      resetFilters();
                      setSearchTerm("");
                    }}
                    className="border-neutral-700 hover:bg-neutral-800 hover:text-white"
                  >
                    <RefreshSVG className="mr-2" />
                    Reset all filters
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
