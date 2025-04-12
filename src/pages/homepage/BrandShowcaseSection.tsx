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
    <section className="py-12 bg-neutral-900">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Shop by Brand
        </h2>
        <p className="text-neutral-400 text-center max-w-2xl mx-auto mb-8">
          Explore our wide range of laptops from the world's leading
          manufacturers
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {brandLogos.map((brand) => (
            <Link
              to="/search"
              key={brand.name}
              className="bg-neutral-800 hover:bg-neutral-700 rounded-lg p-4 flex items-center justify-center h-20 transition-colors"
            >
              <span className="text-neutral-300 hover:text-white text-lg font-medium">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcaseSection;
