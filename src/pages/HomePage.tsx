import { useQuery } from "@tanstack/react-query";
import { LaptopCard } from "../components/LaptopCard";
import { LaptopT } from "../interfaces/laptopT";
import Landing from "../components/Landing";

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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
      <Landing />
      <h1 className="text-3xl font-bold mb-6 text-primary-200">
        Featured Laptops
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {laptops?.map((laptop) => (
          <LaptopCard
            key={laptop.id}
            id={laptop.id}
            title={laptop.title}
            shortDesc={laptop.shortDesc}
            price={laptop.price}
            image={laptop.images[0]}
          />
        ))}
      </div>
    </div>
  );
}
