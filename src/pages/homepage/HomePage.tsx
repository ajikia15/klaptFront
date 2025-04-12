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
import CategorySection from "@/components/sections/CategorySection";
import AnimatedStatsSection from "@/components/sections/AnimatedStatsSection";
import SpecialDealsSection from "@/components/sections/SpecialDealsSection";
import BrandShowcaseSection from "@/components/sections/BrandShowcaseSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import HorizontalLaptopCard from "@/components/HorizontalLaptopCard";

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
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Star className="mr-3 text-secondary-400" size={28} />
            Featured Laptops
          </h2>
          <div className="flex items-center justify-between mt-1">
            <p className="text-neutral-400">
              Our selection of top-rated laptops
            </p>
            <Link
              to="/search"
              className="text-secondary-400 hover:text-secondary-300 flex items-center"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8)
              .fill(0)
              .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
          ) : error ? (
            <div className="col-span-full text-red-500 text-center p-4">
              Error loading laptops: {error.toString()}
            </div>
          ) : (
            laptops
              ?.slice(0, 8)
              .map((laptop) => (
                <LaptopCard
                  key={laptop.id}
                  id={laptop.id}
                  title={laptop.title}
                  shortDesc={laptop.shortDesc}
                  price={laptop.price}
                  image={laptop.images[0]}
                  isAuthenticated={isAuthenticated}
                />
              ))
          )}
        </div>
      </section>

      {/* Categories Section - Now using component */}
      <CategorySection categories={categories} />

      {/* Hot Cakes Section */}
      <section className="container mx-auto py-10 relative mt-4">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Trophy className="mr-3 text-amber-400" size={28} />
            Hot Cakes
          </h2>
          <div className="flex items-center justify-between mt-1">
            <p className="text-neutral-400">Our fastest selling laptops</p>
            <Link
              to="/search"
              className="text-amber-400 hover:text-amber-300 flex items-center"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
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
                key={`hotcake-${laptop.id}`}
                id={laptop.id}
                title={laptop.title}
                shortDesc={laptop.shortDesc}
                price={laptop.price}
                image={laptop.images[0]}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-400">
            No laptops available
          </div>
        )}
      </section>

      {/* New Arrivals - Using HorizontalLaptopCard component */}
      <section className="py-10 bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 border-y border-neutral-800 mt-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <TrendingUp className="mr-3 text-green-400" size={28} />
              New Arrivals
            </h2>
            <div className="flex items-center justify-between mt-1">
              <p className="text-neutral-400">
                Latest additions to our collection
              </p>
              <Link
                to="/search"
                className="text-green-400 hover:text-green-300 flex items-center"
              >
                View All <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Grid layout with HorizontalLaptopCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-[140px] bg-neutral-800/50 animate-pulse rounded-xl flex-shrink-0 overflow-hidden"
                    >
                      <div className="flex h-full">
                        <div className="w-1/3 bg-neutral-700/50"></div>
                        <div className="w-2/3 p-4 space-y-2">
                          <div className="h-4 bg-neutral-700/50 rounded w-3/4"></div>
                          <div className="h-3 bg-neutral-700/50 rounded w-full"></div>
                          <div className="h-3 bg-neutral-700/50 rounded w-2/3"></div>
                          <div className="h-4 bg-neutral-700/50 rounded w-1/3 mt-4"></div>
                        </div>
                      </div>
                    </div>
                  ))
              : laptops
                  ?.slice(0, 6)
                  .map((laptop) => (
                    <HorizontalLaptopCard
                      key={`new-${laptop.id}`}
                      id={laptop.id}
                      title={laptop.title}
                      shortDesc={laptop.shortDesc}
                      price={laptop.price}
                      image={laptop.images[0]}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
          </div>
        </div>
      </section>

      {/* Animated Stats Section - Now using component */}
      <AnimatedStatsSection />

      {/* Special Deals Section - Now using component */}
      <SpecialDealsSection />

      {/* Brand Showcase - Now using component */}
      <BrandShowcaseSection brandLogos={brandLogos} />

      {/* Testimonials - Now using component */}
      <TestimonialsSection />

      {/* Newsletter CTA - Now using component */}
      <NewsletterSection />
    </div>
  );
}
