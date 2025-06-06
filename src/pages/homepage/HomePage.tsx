import { useQuery } from "@tanstack/react-query";
import { LaptopCard } from "../../components/LaptopCard";
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
import CategorySection from "@/pages/homepage/CategorySection";
import AnimatedStatsSection from "@/pages/homepage/AnimatedStatsSection";
import SpecialDealsSection from "@/pages/homepage/SpecialDealsSection";
import BrandShowcaseSection from "@/pages/homepage/BrandShowcaseSection";
import TestimonialsSection from "@/pages/homepage/TestimonialsSection";
import { PaginatedLaptops } from "@/interfaces/PaginatedLaptops";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  const categories = [
    {
      title: t("category.gaming"),
      description: t("category.gamingDesc"),
      icon: <Zap size={24} className="text-purple-400" />,
      gradient: "from-purple-500/20 to-blue-600/20",
      borderColor: "border-purple-500/30",
    },
    {
      title: t("category.business"),
      description: t("category.businessDesc"),
      icon: <Server size={24} className="text-blue-400" />,
      gradient: "from-blue-500/20 to-cyan-600/20",
      borderColor: "border-blue-500/30",
    },
    {
      title: t("category.creative"),
      description: t("category.creativeDesc"),
      icon: <Monitor size={24} className="text-pink-400" />,
      gradient: "from-pink-500/20 to-red-600/20",
      borderColor: "border-pink-500/30",
    },
    {
      title: t("category.budget"),
      description: t("category.budgetDesc"),
      icon: <Cpu size={24} className="text-green-400" />,
      gradient: "from-green-500/20 to-emerald-600/20",
      borderColor: "border-green-500/30",
    },
  ];

  const {
    data: paginated,
    isLoading,
    error,
  } = useQuery<PaginatedLaptops>({
    queryKey: ["laptops"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/laptops`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch laptops");
      }
      return response.json();
    },
  });

  const laptops = paginated?.data ?? [];
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <Landing />
      </div>

      {/* Featured Laptops Section */}
      <section className="container relative mx-auto px-4 py-10">
        <div className="bg-primary-500/5 absolute right-0 top-0 -z-10 h-1/2 w-1/3 rounded-full blur-[100px]"></div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center text-2xl font-bold text-white md:text-3xl">
            <Star className="mr-3 text-secondary-400" size={28} />
            {t("featured")}
          </h2>
          <Link
            to="/search"
            className="flex items-center text-neutral-400 transition-all duration-300 hover:text-neutral-300"
          >
            <span className="opacity-0 sm:opacity-100">{t("viewAll")}</span>
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
          ) : error ? (
            <div className="col-span-full p-4 text-center text-red-500">
              {t("errorLoadingLaptops")}: {error.toString()}
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

      <section className="container relative mx-auto mt-4 px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center text-2xl font-bold text-white md:text-3xl">
            <Trophy className="mr-3 text-amber-400" size={28} />
            {t("hotCakes")}
          </h2>
          <Link
            to="/search"
            className="flex items-center text-neutral-400 transition-all duration-300 hover:text-neutral-300"
          >
            <span className="opacity-0 sm:opacity-100">{t("viewAll")}</span>
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <SkeletonCard key={`hotcake-skeleton-${index}`} />
              ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {t("errorLoadingLaptops")}: {error.toString()}
          </div>
        ) : laptops && laptops.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {laptops.slice(0, 4).map((laptop) => (
              <LaptopCard
                key={laptop.id}
                isAuthenticated={isAuthenticated}
                {...laptop}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-neutral-400">
            {t("noLaptopsAvailable")}
          </div>
        )}
      </section>

      <AnimatedStatsSection />

      {/* New Arrivals */}
      <section className="bg-neutral-900 px-4 py-12">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center text-2xl font-bold text-white md:text-3xl">
              <TrendingUp className="mr-3 text-primary-400" size={28} />
              {t("newArrivals")}
            </h2>
            <Link
              to="/search"
              className="flex items-center text-neutral-400 transition-all duration-300 hover:text-neutral-300"
            >
              <span className="opacity-0 sm:opacity-100">{t("viewAll")}</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      <BrandShowcaseSection />

      <SpecialDealsSection />
      <TestimonialsSection />
    </div>
  );
}
