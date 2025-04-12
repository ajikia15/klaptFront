import { Link } from "@tanstack/react-router";

interface BrandLogo {
  name: string;
  logo: string;
}

interface BrandShowcaseSectionProps {
  brandLogos: BrandLogo[];
}

const BrandShowcaseSection = ({ brandLogos }: BrandShowcaseSectionProps) => {
  return (
    <section className="container mx-auto py-10 mt-4">
      <h2 className="text-3xl font-bold text-white mb-2 text-center relative inline-block">
        Shop by Brand
        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
      </h2>
      <p className="text-neutral-400 text-center max-w-2xl mx-auto mb-8">
        Explore our wide range of laptops from the world's leading manufacturers
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
  );
};

export default BrandShowcaseSection;
