import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { JSX } from "react";

export interface CategoryItem {
  title: string;
  description: string;
  icon: JSX.Element;
  gradient: string;
  borderColor: string;
}

interface CategorySectionProps {
  categories: CategoryItem[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
  return (
    <section className="bg-neutral-800 px-4 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="relative mb-2 inline-block text-3xl font-bold text-white">
            Browse by Category
            <span className="absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"></span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
            Find the perfect laptop for your specific needs, whether you're a
            gamer, professional, or student
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              to="/search"
              key={category.title}
              className={`bg-gradient-to-br ${category.gradient} rounded-xl border ${category.borderColor} p-6 transition-transform duration-300 hover:scale-[1.02] group shadow-lg`}
            >
              {/* Icon - No outline */}
              <div className="mb-4">{category.icon}</div>

              {/* Title */}
              <h3 className="mb-2 text-xl font-bold text-white">
                {category.title}
              </h3>

              {/* Description */}
              <p className="mb-4 text-sm text-neutral-300">
                {category.description}
              </p>

              {/* Simple link */}
              <div className="group flex items-center text-sm font-medium text-white/80">
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
  );
};

export default CategorySection;
