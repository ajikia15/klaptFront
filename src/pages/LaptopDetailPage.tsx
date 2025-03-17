import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { LaptopT } from "../interfaces/laptopT";

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={laptop.images[0]}
              alt={laptop.title}
              className="w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold mb-2">{laptop.title}</h1>
            <p className="text-gray-600 mb-4">
              {laptop.brand} {laptop.model}
            </p>
            <p className="text-blue-600 text-2xl font-bold mb-4">
              ${laptop.price.toLocaleString()}
            </p>

            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  laptop.stockStatus === "in stock"
                    ? "bg-green-100 text-green-800"
                    : laptop.stockStatus === "reserved"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {laptop.stockStatus}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{laptop.description}</p>

            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-400"
              disabled={laptop.stockStatus !== "in stock"}
            >
              {laptop.stockStatus === "in stock"
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Processor</h3>
              <p>
                {laptop.processorBrand} {laptop.processorModel}
              </p>
              <p>
                {laptop.cores} Cores, {laptop.threads} Threads
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Graphics</h3>
              <p>
                {laptop.gpuBrand} {laptop.gpuModel}
              </p>
              <p>{laptop.vram} VRAM</p>
            </div>
            <div>
              <h3 className="font-semibold">Memory</h3>
              <p>
                {laptop.ram} {laptop.ramType}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Storage</h3>
              <p>
                {laptop.storageCapacity} {laptop.storageType}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Display</h3>
              <p>
                {laptop.screenSize}, {laptop.screenResolution}
              </p>
              <p>
                {laptop.refreshRate}Hz, {laptop.backlightType} backlight
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Other</h3>
              <p>Year: {laptop.year}</p>
              {laptop.weight && <p>Weight: {laptop.weight}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
