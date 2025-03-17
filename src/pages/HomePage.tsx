import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LaptopT } from "../interfaces/laptopT";

export default function HomePage() {
  const {
    data: laptops,
    isLoading,
    error,
  } = useQuery<LaptopT[]>({
    queryKey: ["laptops"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/laptops");
      if (!response.ok) {
        throw new Error("Failed to fetch laptops");
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
        Error loading laptops: {error.toString()}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Featured Laptops</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {laptops?.map((laptop) => (
          <Link
            key={laptop.id}
            to="/laptop/$laptopId"
            params={{ laptopId: laptop.id.toString() }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={laptop.images[0]}
                alt={laptop.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{laptop.title}</h2>
              <p className="text-gray-600">
                {laptop.brand} {laptop.model}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-blue-600 font-bold">
                  ${laptop.price.toLocaleString()}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
