import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const SpecialDealsSection = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-neutral-800/70 to-neutral-900/90  border-neutral-800 relative">
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
              Discover our exclusive limited-time deals with discounts of up to
              30% on selected premium laptops
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
  );
};

export default SpecialDealsSection;
