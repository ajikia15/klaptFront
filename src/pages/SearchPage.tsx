import { useNavigate } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import { LaptopCard } from "../components/LaptopCard";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchLaptops } from "../hooks/useSearch";

export default function SearchPage() {
  const search = useSearch({ from: "/search" });
  const navigate = useNavigate();

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
                    {filterOptions.brands?.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedFilters.brand.includes(brand)}
                          onCheckedChange={() => toggleFilter("brand", brand)}
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="text-sm font-medium leading-none"
                        >
                          {brand}
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
                    {filterOptions.processorModels?.map((model) => (
                      <div key={model} className="flex items-center space-x-2">
                        <Checkbox
                          id={`processor-${model}`}
                          checked={selectedFilters.processorModel.includes(
                            model
                          )}
                          onCheckedChange={() =>
                            toggleFilter("processorModel", model)
                          }
                        />
                        <label
                          htmlFor={`processor-${model}`}
                          className="text-sm font-medium leading-none"
                        >
                          {model}
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
                    {filterOptions.gpuModels?.map((model) => (
                      <div key={model} className="flex items-center space-x-2">
                        <Checkbox
                          id={`gpu-${model}`}
                          checked={selectedFilters.gpuModel.includes(model)}
                          onCheckedChange={() =>
                            toggleFilter("gpuModel", model)
                          }
                        />
                        <label
                          htmlFor={`gpu-${model}`}
                          className="text-sm font-medium leading-none"
                        >
                          {model}
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
                    {filterOptions.ram?.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ram-${size}`}
                          checked={selectedFilters.ram.includes(size)}
                          onCheckedChange={() => toggleFilter("ram", size)}
                        />
                        <label
                          htmlFor={`ram-${size}`}
                          className="text-sm font-medium leading-none"
                        >
                          {size}
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
                    {filterOptions.storageTypes?.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`storage-${type}`}
                          checked={selectedFilters.storageType.includes(type)}
                          onCheckedChange={() =>
                            toggleFilter("storageType", type)
                          }
                        />
                        <label
                          htmlFor={`storage-${type}`}
                          className="text-sm font-medium leading-none"
                        >
                          {type}
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
