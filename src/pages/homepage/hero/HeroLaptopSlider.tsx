import { ChevronLeft, ChevronRight } from "lucide-react";
import HorizontalCard from "./HorizontalLaptopCard";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { LaptopT } from "@/interfaces/laptopT";

type Props = {
  laptops: LaptopT[];
  isAuthenticated: boolean;
};

export default function LaptopSlide({ laptops, isAuthenticated }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {laptops.map((laptop) => (
            <div key={laptop.id} className="min-w-0 flex-[0_0_100%]">
              <HorizontalCard {...laptop} isAuthenticated={isAuthenticated} />
            </div>
          ))}
        </div>
      </div>

      {prevBtnEnabled && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-neutral-800 p-2 text-white shadow hover:bg-neutral-700"
          onClick={scrollPrev}
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {nextBtnEnabled && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-neutral-800 p-2 text-white shadow hover:bg-neutral-700"
          onClick={scrollNext}
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
