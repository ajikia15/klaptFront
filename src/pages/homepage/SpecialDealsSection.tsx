import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const SpecialDealsSection = () => {
  return (
    <section className="py-12 bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-white mb-4">
              Weekly Special Offers
            </h2>
            <p className="text-neutral-400 mb-6">
              Discover our exclusive limited-time deals with discounts of up to
              30% on selected premium laptops
            </p>
            <Link
              to="/search"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Shop Deals
            </Link>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-neutral-800 rounded-lg p-6 shadow-lg">
              <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4 inline-block">
                Limited Time
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                Premium Gaming Collection
              </h3>
              <p className="text-neutral-300 mb-4">
                High-performance laptops with RTX graphics for immersive gaming
                experiences
              </p>
              <p className="text-xl font-bold text-primary-400 mb-6">
                Save up to 20%
              </p>
              <Link
                to="/search"
                className="text-white bg-primary-600 hover:bg-primary-700 px-6 py-2 rounded-lg inline-flex items-center transition-all duration-300 font-medium"
              >
                <span className="flex items-center">
                  Explore Collection <ArrowRight size={16} className="ml-2" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialDealsSection;
