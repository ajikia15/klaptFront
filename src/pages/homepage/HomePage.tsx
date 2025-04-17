import { useQuery } from "@tanstack/react-query";
import { LaptopCard } from "../../components/LaptopCard";
import { LaptopT } from "../../interfaces/laptopT";
import Landing from "../../components/Landing";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Cpu,
  Monitor,
  Server,
  Zap,
  Trophy,
  Star,
  TrendingUp,
} from "lucide-react";
import { SkeletonCard } from "@/components/SkeletonCard";

// Import section components
import CategorySection from "@/pages/homepage/CategorySection";
import AnimatedStatsSection from "@/pages/homepage/AnimatedStatsSection";
import SpecialDealsSection from "@/pages/homepage/SpecialDealsSection";
import BrandShowcaseSection from "@/pages/homepage/BrandShowcaseSection";
import TestimonialsSection from "@/pages/homepage/TestimonialsSection";

// Brand logos - replace with actual brand logo paths
const brandLogos = [
  { name: "ASUS", logo: "/brands/asus.svg" },
  { name: "Dell", logo: "/brands/dell.svg" },
  { name: "HP", logo: "/brands/hp.svg" },
  { name: "Lenovo", logo: "/brands/lenovo.svg" },
  { name: "Apple", logo: "/brands/apple.svg" },
  { name: "MSI", logo: "/brands/msi.svg" },
  { name: "Acer", logo: "/brands/acer.svg" },
  { name: "Razer", logo: "/brands/razer.svg" },
];

const categories = [
  {
    title: "Gaming",
    description: "High performance laptops for intense gaming sessions",
    icon: <Zap size={24} className="text-purple-400" />,
    gradient: "from-purple-500/20 to-blue-600/20",
    borderColor: "border-purple-500/30",
  },
  {
    title: "Business",
    description: "Reliable laptops for productivity and business needs",
    icon: <Server size={24} className="text-blue-400" />,
    gradient: "from-blue-500/20 to-cyan-600/20",
    borderColor: "border-blue-500/30",
  },
  {
    title: "Creative",
    description: "Color-accurate displays for design and content creation",
    icon: <Monitor size={24} className="text-pink-400" />,
    gradient: "from-pink-500/20 to-red-600/20",
    borderColor: "border-pink-500/30",
  },
  {
    title: "Budget",
    description: "Affordable options without compromising on quality",
    icon: <Cpu size={24} className="text-green-400" />,
    gradient: "from-green-500/20 to-emerald-600/20",
    borderColor: "border-green-500/30",
  },
];

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

  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <div className="container mx-auto">
        <Landing />
      </div>

      {/* Featured Laptops Section */}
      <section className="container mx-auto py-10 relative">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary-500/5 rounded-full blur-[100px] -z-10"></div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Star className="mr-3 text-secondary-400" size={28} />
            Featured Laptops
          </h2>
          <Link
            to="/search"
            className="text-neutral-400 hover:text-neutral-300 flex items-center transition-all duration-300"
          >
            View All <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
          ) : error ? (
            <div className="col-span-full text-red-500 text-center p-4">
              Error loading laptops: {error.toString()}
            </div>
          ) : (
            laptops
              ?.slice(0, 4)
              .map((laptop) => (
                <LaptopCard
                  key={laptop.id}
                  isAuthenticated={isAuthenticated}
                  {...laptop}
                />
              ))
          )}
        </div>
      </section>

      <CategorySection categories={categories} />

      <section className="container mx-auto py-10 relative mt-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Trophy className="mr-3 text-amber-400" size={28} />
            Hot Cakes
          </h2>
          <Link
            to="/search"
            className="text-neutral-400 hover:text-neutral-300 flex items-center transition-all duration-300"
          >
            View All <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <SkeletonCard key={`hotcake-skeleton-${index}`} />
              ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">
            Error loading laptops: {error.toString()}
          </div>
        ) : laptops && laptops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {laptops.slice(0, 4).map((laptop) => (
              <LaptopCard
                key={laptop.id}
                isAuthenticated={isAuthenticated}
                {...laptop}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-400">
            No laptops available
          </div>
        )}
      </section>

      <AnimatedStatsSection />

      {/* New Arrivals */}
      <section className="py-12 bg-neutral-900">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <TrendingUp className="mr-3 text-primary-400" size={28} />
              New Arrivals
            </h2>
            <Link
              to="/search"
              className="text-neutral-400 hover:text-neutral-300 flex items-center transition-all duration-300"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonCard key={`new-arrival-skeleton-${index}`} />
                  ))
              : laptops
                  ?.slice(0, 4)
                  .map((laptop) => (
                    <LaptopCard
                      key={laptop.id}
                      isAuthenticated={isAuthenticated}
                      {...laptop}
                    />
                  ))}
          </div>
        </div>
      </section>

      <SpecialDealsSection />

      <BrandShowcaseSection brandLogos={brandLogos} />

      <TestimonialsSection />
    </div>
  );
}
