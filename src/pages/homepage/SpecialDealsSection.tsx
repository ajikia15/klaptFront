import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const SpecialDealsSection = () => {
  return (
    <section className="bg-neutral-900 px-4 py-12">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          <div className="lg:w-1/2">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Weekly Special Offers
            </h2>
            <p className="mb-6 text-neutral-400">
              Discover our exclusive limited-time deals with discounts of up to
              30% on selected premium laptops
            </p>
            <Link
              to="/search"
              className="inline-block rounded-lg bg-primary-600 px-6 py-2 font-medium text-white transition-colors hover:bg-primary-700"
            >
              Shop Deals
            </Link>
          </div>

          <div className="lg:w-1/2">
            <div className="rounded-lg bg-neutral-800 p-6 shadow-lg">
              <span className="mb-4 inline-block rounded-full bg-primary-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Limited Time
              </span>
              <h3 className="mb-2 text-2xl font-bold text-white">
                Premium Gaming Collection
              </h3>
              <p className="mb-4 text-neutral-300">
                High-performance laptops with RTX graphics for immersive gaming
                experiences
              </p>
              <p className="mb-6 text-xl font-bold text-primary-400">
                Save up to 20%
              </p>
              <Link
                to="/search"
                className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-2 font-medium text-white transition-all duration-300 hover:bg-primary-700"
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
