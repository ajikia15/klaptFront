import { LaptopCard } from "../components/LaptopCard";
import { Checkbox } from "@/components/ui/checkbox";
import { SkeletonCard } from "../components/SkeletonCard";
import {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  useCallback,
  useRef,
} from "react";
import { SpinnerSVG } from "@/assets/SpinnerSVG";
import { useAuth } from "@/context/AuthContext";
import { useNewSearch } from "../hooks/useNewSearch";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
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
import React from "react";

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

// DebouncedInput component to handle search with debounce
function DebouncedInput({
  value: initialValue,
  onChange,
  debounceMs = 300,
  showClearButton = true,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  showClearButton?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value);
      }
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [value, initialValue, onChange, debounceMs]);

  return (
    <div className="relative">
      <input
        {...props}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
      />
      {showClearButton && value && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-neutral-700"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            onChange("");
          }}
          tabIndex={0}
        >
          <X size={16} className="text-neutral-400" />
        </button>
      )}
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  maxItems?: number;
  isLoading: boolean;
}

const FilterSection = React.memo(
  ({
    title,
    options,
    selected,
    onToggle,
    maxItems = 3,
    isLoading,
  }: FilterSectionProps) => {
    const [open, setOpen] = useState(false);
    const hasMore = options.length > maxItems;
    return (
      <div className="py-1">
        {isLoading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : options.length === 0 ? (
          <p className="text-neutral-500">No options</p>
        ) : (
          <div>
            {options
              .slice(0, open ? options.length : maxItems)
              .map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 py-1"
                >
                  <Checkbox
                    id={`${title}-${option.value}`}
                    checked={selected.has(String(option.value))}
                    onCheckedChange={() => onToggle(option.value)}
                    disabled={option.disabled}
                  />
                  <label
                    htmlFor={`${title}-${option.value}`}
                    className={`text-sm ${
                      option.disabled
                        ? "text-neutral-500"
                        : selected.has(String(option.value))
                        ? "text-primary-400"
                        : "text-neutral-200"
                    } cursor-pointer hover:text-primary-300 transition-colors`}
                  >
                    {option.value}
                  </label>
                </div>
              ))}
            {hasMore && (
              <button
                type="button"
                className="mt-1 text-xs text-primary-400 hover:underline"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default function SearchPage() {
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
    resetFilters,
    isFilterRefetching,
    isFetched,
    setPriceRange,
  } = useNewSearch();

  const isMobile = useMediaQuery("(max-width: 768px)");

  type FilterKey = keyof typeof selectedFilters;
  type OptionsKey = keyof FilterOptionsType;

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
      optionsKey: "ramType" as OptionsKey,
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
      optionsKey: "screenResolution" as OptionsKey,
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
      optionsKey: "stockStatus" as OptionsKey,
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

  const [sortOption, setSortOption] = useState<
    "default" | "priceLowToHigh" | "priceHighToLow"
  >("default");

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

  const showSkeletons = !isFetched;
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

  // Memoize sets for fast lookup
  const selectedFilterSets = useMemo(() => {
    const sets: Record<FilterKey, Set<string>> = {} as any;
    (Object.keys(selectedFilters) as FilterKey[]).forEach((key) => {
      sets[key] = new Set(selectedFilters[key].map(String));
    });
    return sets;
  }, [selectedFilters]);

  const handleToggle = useCallback(
    (filterKey: FilterKey, value: string) => toggleFilter(filterKey, value),
    [toggleFilter]
  );

  const [tagAnimationParent] = useAutoAnimate();

  // --- Price Range Constants ---
  const PRICE_MIN = 500;
  const PRICE_MAX = 5000;

  // Read initial values from selectedFilters (if present)
  const initialMin =
    selectedFilters.minPrice && selectedFilters.minPrice[0]
      ? Number(selectedFilters.minPrice[0])
      : PRICE_MIN;
  const initialMax =
    selectedFilters.maxPrice && selectedFilters.maxPrice[0]
      ? Number(selectedFilters.maxPrice[0])
      : PRICE_MAX;

  const [rangeValues, setRangeValues] = useState([initialMin, initialMax]);
  const [minInput, setMinInput] = useState(initialMin);
  const [maxInput, setMaxInput] = useState(initialMax);

  // Update local state if filters change (e.g. after reset)
  useEffect(() => {
    setRangeValues([initialMin, initialMax]);
    setMinInput(initialMin);
    setMaxInput(initialMax);
  }, [initialMin, initialMax]);

  // Handler to update price range in filters
  const handlePriceRangeChange = (min: number, max: number) => {
    setRangeValues([min, max]);
    setMinInput(min);
    setMaxInput(max);
    // Update filters in URL
    setPriceRange(min, max);
  };

  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(PRICE_MIN, Math.min(Number(e.target.value), maxInput));
    setMinInput(val);
    handlePriceRangeChange(val, maxInput);
  };
  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(PRICE_MAX, Math.max(Number(e.target.value), minInput));
    setMaxInput(val);
    handlePriceRangeChange(minInput, val);
  };

  // Debounce for slider
  const sliderTimeout = useRef<NodeJS.Timeout | null>(null);

  const debouncedSliderChange = (min: number, max: number) => {
    setRangeValues([min, max]);
    setMinInput(min);
    setMaxInput(max);
    if (sliderTimeout.current) clearTimeout(sliderTimeout.current);
    sliderTimeout.current = setTimeout(() => {
      setPriceRange(min, max);
    }, 300); // match your DebouncedInput debounceMs
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200">
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          {!isMobile && (
            <aside className="hidden md:block md:w-1/4 xl:w-1/5">
              <div className="sticky top-4 p-0">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="py-2 text-lg font-bold">Filters</h2>
                  <div className="flex items-center space-x-2">
                    {/* Clear Filters Button for Desktop */}
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
                        Clear Filters
                      </Button>
                    )}
                    {isFilterRefetching || isLoading ? (
                      <>
                        <p className="text-xs text-neutral-500">Updating...</p>
                        <SpinnerSVG className="animate-spin" />
                      </>
                    ) : null}
                  </div>
                </div>
                {/* Add scrollbar style here */}
                <div className="scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-900 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
                  {/* Price Range */}
                  <section className="mb-4">
                    <h3 className="mb-2 text-sm font-medium text-neutral-300">
                      Price Range
                    </h3>
                    <DualRangeSlider
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={100}
                      value={rangeValues}
                      onValueChange={(value) =>
                        debouncedSliderChange(value[0], value[1])
                      }
                      className="mb-2 w-full"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <DebouncedInput
                        type="number"
                        min={PRICE_MIN}
                        max={maxInput}
                        value={minInput.toString()}
                        onChange={(val) => {
                          const num = Math.max(
                            PRICE_MIN,
                            Math.min(Number(val), maxInput)
                          );
                          setMinInput(num);
                          handlePriceRangeChange(num, maxInput);
                        }}
                        className="w-16 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-white focus:border-primary-500 focus:outline-none"
                        aria-label="Minimum price"
                        debounceMs={300}
                        showClearButton={false}
                      />
                      <span className="mx-1 text-neutral-400">–</span>
                      <DebouncedInput
                        type="number"
                        min={minInput}
                        max={PRICE_MAX}
                        value={maxInput.toString()}
                        onChange={(val) => {
                          const num = Math.min(
                            PRICE_MAX,
                            Math.max(Number(val), minInput)
                          );
                          setMaxInput(num);
                          handlePriceRangeChange(minInput, num);
                        }}
                        className="w-16 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-white focus:border-primary-500 focus:outline-none"
                        aria-label="Maximum price"
                        debounceMs={300}
                        showClearButton={false}
                      />
                    </div>
                  </section>
                  {/* Filter Sections */}
                  <div>
                    {filterSections
                      .filter((section) => hasOptions(section.optionsKey))
                      .map((section, idx) => (
                        <section
                          key={section.filterKey}
                          className={
                            idx !== 0
                              ? "mt-4 pt-4 border-t border-neutral-800"
                              : ""
                          }
                        >
                          <header className="mb-1">
                            <span className="text-sm font-medium text-neutral-300">
                              {section.title}
                            </span>
                          </header>
                          <FilterSection
                            title={section.title}
                            options={
                              (displayFilters[
                                section.optionsKey
                              ] as FilterOption[]) || []
                            }
                            selected={selectedFilterSets[section.filterKey]}
                            onToggle={(value) =>
                              handleToggle(section.filterKey, value)
                            }
                            maxItems={3}
                            isLoading={!!filterError}
                          />
                        </section>
                      ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          <div className="w-full md:w-3/4">
            <div className="border-neutral-700/50 mb-4 rounded-lg border p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-3 z-20 flex items-center">
                      <Search size={18} className="text-neutral-400" />
                    </div>
                    <DebouncedInput
                      type="text"
                      value={searchTerm}
                      onChange={setSearchTerm}
                      placeholder="Search for laptops by brand, model, or specs..."
                      className="bg-neutral-900/90 h-10 w-full rounded-lg border border-neutral-700 pl-10 pr-10 text-white shadow-inner focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                      debounceMs={300}
                    />
                    {/* X button to clear searchTerm */}
                    {searchTerm && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-neutral-700"
                        aria-label="Clear search"
                        onClick={() => setSearchTerm("")}
                        tabIndex={0}
                      >
                        <X size={16} className="text-neutral-400" />
                      </button>
                    )}
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
                  {isMobile && (
                    <Drawer>
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
                        <DrawerHeader>
                          <DrawerTitle className="flex items-center justify-between text-white">
                            <div className="flex items-center">
                              <Filter
                                size={16}
                                className="mr-2 text-primary-400"
                              />
                              All Filters
                            </div>
                          </DrawerTitle>
                          <DrawerDescription className="text-neutral-400">
                            Narrow down your search with these filters
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="overflow-y-auto pb-20">
                          <Accordion
                            type="multiple"
                            defaultValue={["brand"]}
                            className="space-y-2"
                          >
                            {filterSections
                              .filter(({ optionsKey }) =>
                                hasOptions(optionsKey)
                              )
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
                                      title={section.title}
                                      options={
                                        (displayFilters[
                                          section.optionsKey
                                        ] as FilterOption[]) || []
                                      }
                                      selected={
                                        selectedFilterSets[section.filterKey]
                                      }
                                      onToggle={(value) =>
                                        handleToggle(section.filterKey, value)
                                      }
                                      isLoading={!!filterError}
                                    />
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                          </Accordion>
                        </div>
                        <DrawerFooter className="border-neutral-700/30 mt-4 flex flex-col gap-2 border-t pt-4">
                          {activeFiltersCount > 0 && (
                            <Button
                              variant="outline"
                              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                              onClick={() => {
                                resetFilters();
                                setSearchTerm("");
                              }}
                            >
                              <X size={14} className="mr-1" />
                              Reset All
                            </Button>
                          )}
                          <DrawerClose asChild>
                            <Button
                              variant="outline"
                              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                            >
                              Close
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  )}
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
                        values.map((value: string) => {
                          // Special formatting for minPrice and maxPrice
                          if (key === "minPrice" || key === "maxPrice") {
                            const label = key === "minPrice" ? "min" : "max";
                            return (
                              <Badge
                                key={`${key}-${value}`}
                                className="border-neutral-700/50 inline-flex items-center bg-neutral-800 !py-1 px-1.5 text-white transition-all hover:bg-neutral-700 hover:shadow-md"
                                variant="outline"
                                onClick={() =>
                                  toggleFilter(key as FilterKey, value)
                                }
                              >
                                <X
                                  size={10}
                                  className="mr-0.5 text-neutral-400"
                                />
                                <span className="mr-0.5 text-xs text-neutral-400">
                                  {label}:
                                </span>
                                <span className="text-xs">{value}</span>
                              </Badge>
                            );
                          }
                          // Default for other filters
                          return (
                            <Badge
                              key={`${key}-${value}`}
                              className="border-neutral-700/50 inline-flex items-center bg-neutral-800 !py-1 px-1.5 text-white transition-all hover:bg-neutral-700 hover:shadow-md"
                              variant="outline"
                              onClick={() =>
                                toggleFilter(key as FilterKey, value)
                              }
                            >
                              <X
                                size={10}
                                className="mr-0.5 text-neutral-400"
                              />
                              <span className="mr-0.5 text-xs text-neutral-400">
                                {
                                  filterSections.find(
                                    (f) => f.filterKey === key
                                  )?.title
                                }
                                :
                              </span>
                              <span className="text-xs">{value}</span>
                            </Badge>
                          );
                        })
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
            <div className="min-h-50 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
