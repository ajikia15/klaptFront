import { useAuth } from "@/context/AuthContext";
import { LaptopCard } from "@/components/LaptopCard";
import { Link } from "@tanstack/react-router";
import { Cpu, Plus } from "lucide-react";
import { useSearchLaptops } from "@/hooks/useSearch";
import { Button } from "@/components/ui/button";

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
          <div className="h-1 w-5 rounded-full bg-secondary-500"></div>
          <h2 className="text-2xl font-bold text-white">My Laptops</h2>
        </div>

        <Link to="/add-listing" className="">
          <Button variant={"outline"}>
            <span>Add New</span>
            <Plus size={18} />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-700/30 bg-red-900/20 p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-red-300">
            Error Loading Your Laptops
          </h3>
          <p className="text-neutral-300">
            We encountered a problem while loading your listings. Please try
            again later.
          </p>
        </div>
      ) : userLaptops && userLaptops.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userLaptops.map((laptop) => (
            <LaptopCard key={laptop.id} isAuthenticated={true} {...laptop} />
          ))}
        </div>
      ) : (
        <div className="from-neutral-800/70 to-neutral-900/90 border-neutral-700/50 rounded-2xl border bg-gradient-to-br p-10 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Cpu size={48} className="text-neutral-600" />
            <h3 className="text-xl font-semibold text-neutral-300">
              You haven't posted any laptops yet
            </h3>
            <p className="mx-auto max-w-md text-neutral-500">
              Start by adding your first laptop listing. It's easy to get
              started and reach potential buyers.
            </p>
            <Link
              to="/add-listing"
              className="mt-4 flex items-center gap-2 rounded-md bg-secondary-500 px-6 py-3 font-bold text-white transition-all duration-300 hover:bg-secondary-600"
            >
              Create Your First Listing
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
