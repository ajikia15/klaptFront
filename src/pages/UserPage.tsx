import { useQuery } from "@tanstack/react-query";
import { LaptopCard } from "@/components/LaptopCard";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { LaptopT } from "@/interfaces/laptopT";

interface UserLaptopsResponse {
  user: {
    id: number;
    username: string;
    avatar?: string;
    joinDate?: string;
  };
  laptops: LaptopT[];
}

export default function UserPage() {
  const { userId } = useParams({ from: "/user/$userId" });
  const { isAuthenticated } = useAuth?.() || { isAuthenticated: false };

  const { data, isLoading, error } = useQuery<UserLaptopsResponse>({
    queryKey: ["userLaptops", userId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user-laptops?userId=${userId}`,
        { credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user laptops");
      }
      return response.json();
    },
    enabled: !!userId,
  });

  const user = data?.user;
  const laptops = data?.laptops ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 py-10 text-neutral-200">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/" className="mr-2">
            <Button
              variant="ghost"
              className="text-neutral-400 hover:text-white"
            >
              ← Back to Marketplace
            </Button>
          </Link>
          <div className="bg-neutral-800/70 relative flex w-full items-center gap-4 rounded-2xl p-6 shadow-lg">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-secondary-600 to-purple-700 text-4xl font-bold text-white">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.username?.[0]?.toUpperCase() || "?"
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.username || "User"}
              </h1>
              {user?.joinDate && (
                <p className="mt-1 text-sm text-neutral-400">
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {user?.username ? `${user.username}'s` : "User"} Listings
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="text-neutral-400">Loading...</span>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-900/30 p-6 text-center text-red-200">
            Failed to load user or listings.
          </div>
        ) : laptops.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <svg
              width="48"
              height="48"
              fill="none"
              className="mb-4 text-neutral-500"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M7 17v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2M9 21h6M12 3v4m0 0-2-2m2 2 2-2"
              />
            </svg>
            <p className="text-lg text-neutral-400">No listings yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {laptops.map((laptop) => (
              <LaptopCard
                key={laptop.id}
                isAuthenticated={isAuthenticated}
                {...laptop}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
