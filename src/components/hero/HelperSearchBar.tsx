import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

const PRICE_MIN = 500;
const PRICE_MAX = 5000;

export default function HelperSearchBar() {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);
  const [minInput, setMinInput] = useState(PRICE_MIN);
  const [maxInput, setMaxInput] = useState(PRICE_MAX);
  const navigate = useNavigate();

  const brands = [
    "Apple",
    "Asus",
    "Acer",
    "Dell",
    "HP",
    "Lenovo",
    "MSI",
    "Razer",
  ];
  const types = ["Gaming", "Rendering", "Design", "Browsing"];

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(brand)) {
        newSet.delete(brand);
      } else {
        newSet.add(brand);
      }
      return newSet;
    });
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const handlePriceRangeChange = (values: number[]) => {
    const [min, max] = values;
    setPriceRange([min, max]);
    setMinInput(min);
    setMaxInput(max);
  };

  const handleSearch = () => {
    const searchParams: {
      brand?: string[];
      minPrice?: string;
      maxPrice?: string;
    } = {};

    if (selectedBrands.size > 0) {
      searchParams.brand = Array.from(selectedBrands);
    }

    if (priceRange[0] !== PRICE_MIN) {
      searchParams.minPrice = String(priceRange[0]);
    }

    if (priceRange[1] !== PRICE_MAX) {
      searchParams.maxPrice = String(priceRange[1]);
    }

    navigate({ to: "/search", search: searchParams, replace: false });
  };

  const getBrandDisplay = () => {
    if (selectedBrands.size === 0) return "Select brands";
    if (selectedBrands.size === 1) return Array.from(selectedBrands)[0];
    return `${selectedBrands.size} brands selected`;
  };

  const getTypeDisplay = () => {
    if (selectedTypes.size === 0) return "Select type";
    if (selectedTypes.size === 1) return Array.from(selectedTypes)[0];
    return `${selectedTypes.size} types selected`;
  };

  const getPriceDisplay = () => {
    if (priceRange[0] === PRICE_MIN && priceRange[1] === PRICE_MAX) {
      return "Select price range";
    }
    return `$${priceRange[0]} - $${priceRange[1]}`;
  };

  return (
    <div className="w-full">
      <Card className="bg-neutral-900/90 overflow-hidden rounded-lg border-0 py-0">
        <div className="flex divide-x divide-neutral-700">
          {/* Brands Section */}
          <Popover
            open={openPopover === "brands"}
            onOpenChange={(open: boolean) =>
              setOpenPopover(open ? "brands" : null)
            }
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-neutral-800 cursor-pointer text-white bg-neutral-900"
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-100">
                    Brands
                  </span>
                  <ChevronDown className="ml-auto h-4 w-4 text-neutral-300" />
                </div>
                <div className="truncate text-xs text-neutral-300">
                  {getBrandDisplay()}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 border-neutral-700 bg-neutral-900"
              align="start"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-neutral-200">
                    Select Brands
                  </h4>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex cursor-pointer items-center justify-between space-x-2 rounded border border-neutral-700 bg-neutral-800 p-2 hover:bg-neutral-700"
                      >
                        <span
                          className={`text-sm flex-1 ${
                            selectedBrands.has(brand)
                              ? "text-primary-400"
                              : "text-neutral-200"
                          }`}
                        >
                          {brand}
                        </span>
                        <Checkbox
                          checked={selectedBrands.has(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Type Section */}
          <Popover
            open={openPopover === "type"}
            onOpenChange={(open: boolean) =>
              setOpenPopover(open ? "type" : null)
            }
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-neutral-800 cursor-pointer text-white bg-neutral-900"
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-100">
                    Type
                  </span>
                  <ChevronDown className="ml-auto h-4 w-4 text-neutral-300" />
                </div>
                <div className="truncate text-xs text-neutral-300">
                  {getTypeDisplay()}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 border-neutral-700 bg-neutral-900"
              align="start"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-neutral-200">Select Type</h4>
                </div>
                <div className="max-h-60 space-y-2 overflow-y-auto">
                  <div className="space-y-2">
                    {types.map((type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center justify-between space-x-2 rounded border border-neutral-700 bg-neutral-800 p-2 hover:bg-neutral-700"
                      >
                        <span
                          className={`text-sm flex-1 ${
                            selectedTypes.has(type)
                              ? "text-primary-400"
                              : "text-neutral-200"
                          }`}
                        >
                          {type}
                        </span>
                        <Checkbox
                          checked={selectedTypes.has(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Price Section */}
          <Popover
            open={openPopover === "price"}
            onOpenChange={(open: boolean) =>
              setOpenPopover(open ? "price" : null)
            }
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-1 pl-6 pr-4 py-3 text-left transition-colors hover:bg-neutral-800 cursor-pointer text-white bg-neutral-900"
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-100">
                    Price
                  </span>
                  <ChevronDown className="ml-auto h-4 w-4 text-neutral-300" />
                </div>
                <div className="truncate text-xs text-neutral-300">
                  {getPriceDisplay()}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto border-neutral-700 bg-neutral-900"
              align="start"
            >
              <div className="space-y-3 p-0">
                <div className="p-4">
                  <div className="mb-3 text-sm text-neutral-300">
                    Price range
                  </div>
                  <DualRangeSlider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={100}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    className="mb-2 w-full"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      type="number"
                      min={PRICE_MIN}
                      max={maxInput}
                      value={minInput.toString()}
                      onChange={(e) => {
                        const num = Math.max(
                          PRICE_MIN,
                          Math.min(Number(e.target.value), maxInput)
                        );
                        setMinInput(num);
                        setPriceRange([num, priceRange[1]]);
                      }}
                      className="w-16 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-white focus:border-primary-500 focus:outline-none"
                      aria-label="Minimum price"
                    />
                    <span className="mx-1 text-neutral-400">–</span>
                    <Input
                      type="number"
                      min={minInput}
                      max={PRICE_MAX}
                      value={maxInput.toString()}
                      onChange={(e) => {
                        const num = Math.min(
                          PRICE_MAX,
                          Math.max(Number(e.target.value), minInput)
                        );
                        setMaxInput(num);
                        setPriceRange([priceRange[0], num]);
                      }}
                      className="w-16 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-white focus:border-primary-500 focus:outline-none"
                      aria-label="Maximum price"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <div className="flex items-center px-8">
            <button
              onClick={handleSearch}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-500"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
