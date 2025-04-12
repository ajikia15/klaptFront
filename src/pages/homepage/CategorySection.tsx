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
    <section className="py-16  bg-neutral-800  border-neutral-800 mt-4">
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
  );
};

export default CategorySection;
