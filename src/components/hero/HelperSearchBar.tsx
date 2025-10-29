import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HelperSearchBar() {
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const brands = [
    "Apple",
    "ASUS",
    "Acer",
    "Dell",
    "HP",
    "Lenovo",
    "MSI",
    "Razer",
  ];
  const types = ["Gaming", "Rendering", "Design", "Browsing"];

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
                  Select brands
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
                <div className="max-h-60 space-y-2 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {brands.map((brand) => (
                      <div
                        key={brand}
                        className="rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-200 transition-colors hover:bg-neutral-700"
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-neutral-500">
                  (Design only — checkboxes coming next)
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
                  Select type
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
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {types.map((type) => (
                      <div
                        key={type}
                        className="rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-200 transition-colors hover:bg-neutral-700"
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-neutral-500">
                  (Design only — checkboxes coming next)
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
                  Select price range
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
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-neutral-400">
                        Min
                      </label>
                      <Input
                        type="text"
                        placeholder="$"
                        className="w-16 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-white focus:border-primary-500 focus:outline-none"
                        readOnly
                      />
                    </div>
                    <span className="mx-1 text-neutral-400">–</span>
                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-neutral-400">
                        Max
                      </label>
                      <Input
                        type="text"
                        placeholder="$"
                        className="w-16 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-white focus:border-primary-500 focus:outline-none"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-neutral-800" />
                  <div className="mt-3 text-xs text-neutral-500">
                    (Design only — interactions coming next)
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <div className="flex items-center px-8">
            <button
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
