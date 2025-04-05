import { useAuth } from "@/context/AuthContext";
import { LaptopCard } from "@/components/LaptopCard";
import { Link } from "@tanstack/react-router";
import { Cpu, Plus } from "lucide-react";
import { useSearchLaptops } from "@/hooks/useSearch";

export default function ProfilePosts() {
  const { user } = useAuth();
  const {
    laptops: userLaptops,
    isLoading,
    error,
  } = useSearchLaptops("", user?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1 w-5 bg-secondary-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">
            Your Laptop Listings
          </h2>
        </div>
        <Link
          to="/add-listing"
          className="bg-secondary-500 hover:bg-secondary-600 font-bold transition-all duration-300 px-4 py-2 rounded-md text-white flex items-center gap-2"
        >
          <span>Add New</span>
          <Plus size={18} />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-8 text-center">
          <h3 className="text-red-300 font-semibold text-lg mb-2">
            Error Loading Your Laptops
          </h3>
          <p className="text-neutral-300">
            We encountered a problem while loading your listings. Please try
            again later.
          </p>
        </div>
      ) : userLaptops && userLaptops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userLaptops.map((laptop) => (
            <LaptopCard
              key={laptop.id}
              id={laptop.id}
              title={laptop.title}
              price={laptop.price}
              shortDesc={laptop.shortDesc}
              image={laptop.images[0]}
              isAuthenticated={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-10 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Cpu size={48} className="text-neutral-600" />
            <h3 className="text-xl font-semibold text-neutral-300">
              You haven't posted any laptops yet
            </h3>
            <p className="text-neutral-500 max-w-md mx-auto">
              Start by adding your first laptop listing. It's easy to get
              started and reach potential buyers.
            </p>
            <Link
              to="/add-listing"
              className="mt-4 bg-secondary-500 hover:bg-secondary-600 font-bold transition-all duration-300 px-6 py-3 rounded-md text-white flex items-center gap-2"
            >
              Create Your First Listing
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
