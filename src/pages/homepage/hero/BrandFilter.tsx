import { Link } from "@tanstack/react-router";
import { useMemo } from "react";

export default function BrandFilter() {
  const brandLogos = useMemo(
    () => [
      { name: "Asus", logo: "/brands/asus.svg" },
      // { name: "Dell", logo: "/brands/dell.svg" },
      { name: "Lenovo", logo: "/brands/lenovo.svg" },
      // { name: "Apple", logo: "/brands/apple.svg" },
      { name: "MSI", logo: "/brands/msi.svg" },
      { name: "Acer", logo: "/brands/acer.svg" },
      { name: "Razer", logo: "/brands/razer.svg" },
      { name: "HP", logo: "/brands/hp.svg" },
    ],
    []
  );

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 font-semibold">Featured Brands</h2>
      <div className="-mx-3 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-3">
          {brandLogos.map((brand) => (
            <Link
              to="/search"
              search={{ brand: [brand.name] }}
              key={brand.name}
              aria-label={`Filter by ${brand.name}`}
              className="md:size-32 size-24 mt-px flex-none snap-center rounded-full bg-neutral-800 p-3 ring-1 ring-neutral-700 transition-colors hover:bg-neutral-700 hover:ring-neutral-600"
            >
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="md:size-20 size-16 object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
