import { useQuery } from "@tanstack/react-query";
import { LaptopCard } from "../components/LaptopCard";
import { LaptopT } from "../interfaces/laptopT";
import Landing from "../components/Landing";
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
  Clock,
} from "lucide-react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useEffect, useRef, useState } from "react";

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

  // For animated stats
  const [animatedStats, setAnimatedStats] = useState({
    customers: 0,
    laptops: 0,
    brands: 0,
  });

  // For scroll animations
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Animation for stats when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);

          // Animate numbers counting up
          const animateStats = () => {
            const duration = 2000; // 2 seconds
            const startTime = Date.now();
            const endStats = { customers: 5000, laptops: 1200, brands: 25 };

            const updateStats = () => {
              const currentTime = Date.now();
              const elapsedTime = currentTime - startTime;
              const progress = Math.min(elapsedTime / duration, 1);

              setAnimatedStats({
                customers: Math.floor(progress * endStats.customers),
                laptops: Math.floor(progress * endStats.laptops),
                brands: Math.floor(progress * endStats.brands),
              });

              if (progress < 1) {
                requestAnimationFrame(updateStats);
              }
            };

            requestAnimationFrame(updateStats);
          };

          animateStats();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <div className="container mx-auto">
        <Landing />
      </div>

      {/* Featured Laptops Section - Reduced vertical padding */}
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

      {/* Categories Section - Simplified Clean Design */}
      <section className="py-12 bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 border-y border-neutral-800 mt-4">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2 relative inline-block">
              Browse by Category
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto mt-4">
              Find the perfect laptop for your specific needs, whether you're a
              gamer, professional, or student
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                to="/search"
                key={category.title}
                className={`bg-gradient-to-br ${category.gradient} rounded-xl border ${category.borderColor} p-6 transition-transform duration-300 hover:scale-[1.02] group`}
              >
                {/* Icon - No outline */}
                <div className="mb-4">{category.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-300 text-sm mb-4">
                  {category.description}
                </p>

                {/* Simple link */}
                <div className="flex items-center text-sm text-white/80 font-medium group">
                  <span>Explore</span>
                  <ArrowRight
                    size={14}
                    className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Cakes Section - Reduced padding */}
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

      {/* New Arrivals - Improved Card Design Without Scroll */}
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

          {/* Grid layout instead of scroll */}
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
              : laptops?.slice(0, 6).map((laptop, index) => (
                  <Link to={`/`} key={`new-${laptop.id}`} className="w-full">
                    <div className="bg-gradient-to-r from-neutral-800/80 to-neutral-800/60 rounded-xl overflow-hidden border border-neutral-700/50 h-[140px] relative">
                      <div className="flex h-full">
                        {/* Image area */}
                        <div className="w-1/3 bg-gradient-to-br from-neutral-900/70 to-neutral-800/70 p-2 relative overflow-hidden">
                          <img
                            src={laptop.images[0]}
                            alt={laptop.title}
                            className="w-full h-full object-contain rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://placehold.co/200x200/201E30/444?text=No+Image";
                            }}
                          />

                          {/* New badge - no glow effect */}
                          <div className="absolute top-2 right-2">
                            <div className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center shadow-md">
                              <Clock size={10} className="mr-1" /> New
                            </div>
                          </div>
                        </div>

                        {/* Content area */}
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
                              {laptop.title}
                            </h3>
                            <p className="text-neutral-300 text-xs mb-1 line-clamp-2">
                              {laptop.shortDesc}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-base font-bold text-green-400">
                              ₾{laptop.price.toLocaleString()}
                            </span>
                            <div className="flex items-center">
                              <span className="text-xs text-neutral-400 mr-1">
                                Details
                              </span>
                              <ArrowRight
                                size={12}
                                className="text-green-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Animated Stats Section - Reduced padding */}
      <section className="container mx-auto py-10 overflow-hidden relative mt-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,58,183,0.07),transparent_70%)]"></div>
        <div ref={statsRef} className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`text-center transition-all duration-1000 ${
                statsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-5xl font-bold text-white mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                  {animatedStats.customers.toLocaleString()}+
                </span>
              </div>
              <p className="text-neutral-300">Happy Customers</p>
            </div>

            <div
              className={`text-center transition-all duration-1000 delay-200 ${
                statsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-5xl font-bold text-white mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-primary-400">
                  {animatedStats.laptops.toLocaleString()}+
                </span>
              </div>
              <p className="text-neutral-300">Laptops Sold</p>
            </div>

            <div
              className={`text-center transition-all duration-1000 delay-400 ${
                statsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-5xl font-bold text-white mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  {animatedStats.brands}+
                </span>
              </div>
              <p className="text-neutral-300">Premium Brands</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Deals Section - Reduced padding */}
      <section className="py-12 bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 border-y border-neutral-800 mt-4 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary-700/10 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary-700/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0 lg:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">
                Weekly Special Offers
              </h2>
              <p className="text-neutral-400 mb-6 max-w-lg">
                Discover our exclusive limited-time deals with discounts of up
                to 30% on selected premium laptops
              </p>
              <Link
                to="/search"
                className="inline-block bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Shop Deals
              </Link>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/90 rounded-2xl p-6 shadow-lg border border-neutral-700/50 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(147,112,219,0.15),transparent_70%)] animate-pulse"></div>
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-secondary-500/10 rounded-full blur-[80px]"></div>
                </div>

                <div className="relative z-10">
                  <span className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4 inline-block shadow-lg">
                    Limited Time
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Premium Gaming Collection
                  </h3>
                  <p className="text-neutral-300 mb-4">
                    High-performance laptops with RTX graphics for immersive
                    gaming experiences
                  </p>
                  <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-primary-400 mb-6">
                    Save up to 20%
                  </p>
                  <Link
                    to="/search"
                    className="text-white bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 px-6 py-2 rounded-lg inline-flex items-center transition-all duration-300 font-medium relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      Explore Collection{" "}
                      <ArrowRight
                        size={16}
                        className="ml-2 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Showcase - Reduced padding and margins */}
      <section className="container mx-auto py-10 mt-4">
        <h2 className="text-3xl font-bold text-white mb-2 text-center relative inline-block">
          Shop by Brand
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
        </h2>
        <p className="text-neutral-400 text-center max-w-2xl mx-auto mb-8">
          Explore our wide range of laptops from the world's leading
          manufacturers
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {brandLogos.map((brand, index) => (
            <Link
              to="/search"
              key={brand.name}
              className="bg-neutral-800/30 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg p-4 flex items-center justify-center h-24 transition-all duration-300 hover:border-secondary-500/30 group hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-900/10"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Replace with actual brand logos */}
              <div className="text-center relative overflow-hidden">
                <span className="text-neutral-300 group-hover:text-white transition-colors text-lg font-medium">
                  {brand.name}
                </span>
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-0 bg-secondary-500 group-hover:w-full transition-all duration-300"></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials - Reduced padding */}
      <section className="py-10 bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 border-y border-neutral-800 mt-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50 relative"
              >
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex mb-4">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <svg
                          key={j}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>
                  <p className="text-neutral-300 mb-4 italic">
                    "
                    {
                      [
                        "Amazing selection of gaming laptops with competitive prices.",
                        "The support team was incredibly helpful in helping me choose the right laptop for my needs.",
                        "Fast shipping and the laptop was exactly as described. Highly recommend!",
                      ][i - 1]
                    }
                    "
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-bold">
                      {["JD", "AM", "RK"][i - 1]}
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">
                        {["John D.", "Alex M.", "Rachel K."][i - 1]}
                      </p>
                      <p className="text-neutral-500 text-sm">
                        {
                          [
                            "Gaming Enthusiast",
                            "Designer",
                            "Software Developer",
                          ][i - 1]
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA - Reduced padding */}
      <section className="container mx-auto py-10 mt-4">
        <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-2xl p-6 md:p-8 border border-primary-700/30 relative overflow-hidden">
          <div className="absolute inset-0">
            {/* Animated particles/dots background */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-10 w-20 h-20 bg-secondary-500/20 rounded-full blur-[40px] animate-pulse"></div>
              <div
                className="absolute bottom-20 left-20 w-16 h-16 bg-primary-500/20 rounded-full blur-[30px] animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-500/20 rounded-full blur-[20px] animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated on Latest Tech
            </h2>
            <p className="text-neutral-300 mb-8">
              Subscribe to our newsletter and be the first to know about new
              laptop releases, exclusive deals and tech tips
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-lg bg-neutral-800/80 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-300 focus:bg-neutral-800"
              />
              <button
                type="submit"
                className="py-3 px-6 bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-secondary-900/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
