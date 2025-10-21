import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EmblaCarouselType } from "embla-carousel";

export default function BrandFilter() {
  const brandLogos = [
    { name: "Asus", logo: "/brands/asus.svg" },
    // { name: "Dell", logo: "/brands/dell.svg" },
    { name: "HP", logo: "/brands/hp.svg" },
    { name: "Lenovo", logo: "/brands/lenovo.svg" },
    // { name: "Apple", logo: "/brands/apple.svg" },
    { name: "MSI", logo: "/brands/msi.svg" },
    { name: "Acer", logo: "/brands/acer.svg" },
    { name: "Razer", logo: "/brands/razer.svg" },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    dragFree: false,
    skipSnaps: false,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (emblaApi) {
      onSelect(emblaApi);
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);
    }
  }, [emblaApi, onSelect]);

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 font-semibold">Featured Brands</h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {brandLogos.map((brand) => (
            <div key={brand.name} className="min-w-0 flex-[0_0_20%] px-2.5">
              <Link
                to="/search"
                search={{ brand: [brand.name] }}
                className="flex aspect-square cursor-pointer items-center justify-center rounded-full bg-neutral-800 p-2 transition hover:bg-neutral-700"
              >
                <img src={brand.logo} alt={brand.name} className="h-16 w-16" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows in bottom right */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          className={`p-2 rounded-full bg-neutral-800 text-white transition-all hover:bg-neutral-700 ${
            prevBtnDisabled ? "opacity-0" : ""
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          className={`p-2 rounded-full bg-neutral-800 text-white transition-all hover:bg-neutral-700 ${
            nextBtnDisabled ? "opacity-0" : ""
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
