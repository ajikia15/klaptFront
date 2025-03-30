import { useNavigate } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import { LaptopCard } from "../components/LaptopCard";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchLaptops } from "../hooks/useSearch";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function SearchPage() {
  const search = useSearch({ from: "/search" });
  const navigate = useNavigate();
  const [parent] = useAutoAnimate({ duration: 300 });

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
  } = useSearchLaptops(search.term || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
    navigate({
      to: "/search",
      search: { term: searchTerm },
      replace: true,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Search Laptops</h1>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Filters Panel */}
        <div className="w-full md:w-1/4">
          <div className="mb-4 rounded-md bg-neutral-900 p-4">
            <h2 className="mb-4 text-xl font-semibold">Filters</h2>

            {isLoadingFilters ? (
              <p>Loading filters...</p>
            ) : filterError ? (
              <p className="text-red-500">
                Error loading filters: {filterError.toString()}
              </p>
            ) : filterOptions ? (
              <div className="space-y-6">
                {/* Brand Filters */}
                <div>
                  <h3 className="mb-2 font-medium">Brands</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="max-h-[150px] space-y-2 overflow-y-auto">
                    {filterOptions.brands?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`brand-${option.value}`}
                          checked={selectedFilters.brand.includes(option.value)}
                          onCheckedChange={() =>
                            toggleFilter("brand", option.value)
                          }
                          disabled={option.disabled}
                          className={
                            option.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        />
                        <label
                          htmlFor={`brand-${option.value}`}
                          className={`text-sm font-medium leading-none ${
                            option.disabled ? "text-neutral-500" : ""
                          }`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processor Filters */}
                <div>
                  <h3 className="mb-2 font-medium">Processors</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="max-h-[150px] space-y-2 overflow-y-auto">
                    {filterOptions.processorModels?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`processor-${option.value}`}
                          checked={selectedFilters.processorModel.includes(
                            option.value
                          )}
                          onCheckedChange={() =>
                            toggleFilter("processorModel", option.value)
                          }
                          disabled={option.disabled}
                          className={
                            option.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        />
                        <label
                          htmlFor={`processor-${option.value}`}
                          className={`text-sm font-medium leading-none ${
                            option.disabled ? "text-neutral-500" : ""
                          }`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GPU Filters */}
                <div>
                  <h3 className="mb-2 font-medium">Graphics Cards</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="max-h-[150px] space-y-2 overflow-y-auto">
                    {filterOptions.gpuModels?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`gpu-${option.value}`}
                          checked={selectedFilters.gpuModel.includes(
                            option.value
                          )}
                          onCheckedChange={() =>
                            toggleFilter("gpuModel", option.value)
                          }
                          disabled={option.disabled}
                          className={
                            option.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        />
                        <label
                          htmlFor={`gpu-${option.value}`}
                          className={`text-sm font-medium leading-none ${
                            option.disabled ? "text-neutral-500" : ""
                          }`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RAM Filters */}
                <div>
                  <h3 className="mb-2 font-medium">RAM Size</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="space-y-2">
                    {filterOptions.ram?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`ram-${option.value}`}
                          checked={selectedFilters.ram.includes(option.value)}
                          onCheckedChange={() =>
                            toggleFilter("ram", option.value)
                          }
                          disabled={option.disabled}
                          className={
                            option.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        />
                        <label
                          htmlFor={`ram-${option.value}`}
                          className={`text-sm font-medium leading-none ${
                            option.disabled ? "text-neutral-500" : ""
                          }`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage Type Filters */}
                <div>
                  <h3 className="mb-2 font-medium">Storage Type</h3>
                  <div className="mb-3 border-b border-neutral-700"></div>
                  <div className="space-y-2">
                    {filterOptions.storageTypes?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`storage-${option.value}`}
                          checked={selectedFilters.storageType.includes(
                            option.value
                          )}
                          onCheckedChange={() =>
                            toggleFilter("storageType", option.value)
                          }
                          disabled={option.disabled}
                          className={
                            option.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        />
                        <label
                          htmlFor={`storage-${option.value}`}
                          className={`text-sm font-medium leading-none ${
                            option.disabled ? "text-neutral-500" : ""
                          }`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Search Form */}
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 text-center text-red-500">
              Error searching laptops: {error.toString()}
            </div>
          )}

          {/* No Results */}
          {!isLoading &&
            laptops &&
            laptops.length === 0 &&
            (searchTerm ||
              Object.values(selectedFilters).some((arr) => arr.length > 0)) && (
              <div className="rounded-lg bg-neutral-800 p-8 text-center">
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

          {/* Search Results */}
          {laptops && laptops.length > 0 && (
            <>
              <h2 className="mb-4 text-xl font-semibold text-white">
                {laptops.length} result{laptops.length !== 1 ? "s" : ""} found
              </h2>

              <div
                ref={parent}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {laptops.map((laptop) => (
                  <LaptopCard
                    key={laptop.id}
                    id={laptop.id}
                    title={laptop.title}
                    price={laptop.price}
                    shortDesc={laptop.shortDesc}
                    image={laptop.images[0]}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
