import { Link } from "@tanstack/react-router";

const BrandShowcaseSection = () => {
  const brandLogos = [
    { name: "Asus", logo: "/brands/asus.svg" },
    { name: "Dell", logo: "/brands/dell.svg" },
    { name: "HP", logo: "/brands/hp.svg" },
    { name: "Lenovo", logo: "/brands/lenovo.svg" },
    { name: "Apple", logo: "/brands/apple.svg" },
    { name: "MSI", logo: "/brands/msi.svg" },
    { name: "Acer", logo: "/brands/acer.svg" },
    { name: "Razer", logo: "/brands/razer.svg" },
  ];
  return (
    <section className="bg-neutral-900 py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-white">
          Shop by Brand
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-neutral-400">
          Explore our wide range of laptops from the world's leading
          manufacturers
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {brandLogos.map((brand) => (
            <Link
              to="/search"
              key={brand.name}
              search={{ brand: [brand.name] }}
              className="flex h-20 items-center justify-center rounded-lg bg-neutral-800 p-4 shadow-md transition-colors hover:bg-neutral-700"
            >
              <span className="text-lg font-medium text-neutral-300 hover:text-white">
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
