import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { LaptopT } from "../interfaces/laptopT";
import { ShoppingCart } from "@deemlol/next-icons";

export default function LaptopDetailPage() {
  const { laptopId } = useParams({ from: "/laptop/$laptopId" });

  const {
    data: laptop,
    isLoading,
    error,
  } = useQuery<LaptopT>({
    queryKey: ["laptop", laptopId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/laptops/${laptopId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch laptop details");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading laptop details: {error.toString()}
      </div>
    );
  }

  if (!laptop) {
    return <div className="text-center p-4">Laptop not found</div>;
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "in stock":
        return "bg-green-500/20 text-green-400";
      case "reserved":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-red-500/20 text-red-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-neutral-800 rounded-2xl overflow-hidden shadow-xl border border-neutral-700">
        <div className="md:grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="p-8 bg-neutral-900 flex items-center justify-center">
            <div className="relative group">
              <img
                src={laptop.images[0]}
                alt={laptop.title}
                className="w-full h-auto object-contain max-h-[400px] rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              {laptop.stockStatus === "in stock" && (
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  In Stock
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {laptop.title}
              </h1>
              <div className="flex items-center gap-3 text-neutral-400">
                <span>{laptop.brand}</span>
                <span>•</span>
                <span>{laptop.model}</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-neutral-300">{laptop.description}</p>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-purple-400">
                  ${laptop.price.toLocaleString()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(
                    laptop.stockStatus
                  )}`}
                >
                  {laptop.stockStatus}
                </span>
              </div>

              <button
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  laptop.stockStatus === "in stock"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                }`}
                disabled={laptop.stockStatus !== "in stock"}
              >
                <ShoppingCart size={20} />
                {laptop.stockStatus === "in stock"
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="border-t border-neutral-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Processor */}
            <div className="bg-neutral-900 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                Processor
              </h3>
              <div className="space-y-2 text-neutral-300">
                <p>
                  {laptop.processorBrand} {laptop.processorModel}
                </p>
                <p>
                  {laptop.cores} Cores, {laptop.threads} Threads
                </p>
              </div>
            </div>

            {/* Graphics */}
            <div className="bg-neutral-900 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                Graphics
              </h3>
              <div className="space-y-2 text-neutral-300">
                <p>
                  {laptop.gpuBrand} {laptop.gpuModel}
                </p>
                <p>{laptop.vram} VRAM</p>
              </div>
            </div>

            {/* Memory */}
            <div className="bg-neutral-900 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                Memory
              </h3>
              <div className="space-y-2 text-neutral-300">
                <p>
                  {laptop.ram} {laptop.ramType}
                </p>
              </div>
            </div>

            {/* Storage */}
            <div className="bg-neutral-900 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                Storage
              </h3>
              <div className="space-y-2 text-neutral-300">
                <p>
                  {laptop.storageCapacity} {laptop.storageType}
                </p>
              </div>
            </div>

            {/* Display */}
            <div className="bg-neutral-900 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                Display
              </h3>
              <div className="space-y-2 text-neutral-300">
                <p>
                  {laptop.screenSize}, {laptop.screenResolution}
                </p>
                <p>
                  {laptop.refreshRate}Hz, {laptop.backlightType} backlight
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-neutral-900 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                Additional Info
              </h3>
              <div className="space-y-2 text-neutral-300">
                <p>Year: {laptop.year}</p>
                {laptop.weight && <p>Weight: {laptop.weight}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
