import useEmblaCarousel from "embla-carousel-react";
import "./emblaflashcards.css";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "@deemlol/next-icons";
import { FlashCard } from "./FlashCard";

const flashDeals = [
  {
    title: "Gaming Laptops",
    discount: 30,
    image: "/images/placeholder-gaming.jpg",
  },
  {
    title: "Business Laptops",
    discount: 25,
    image: "/images/placeholder-business.jpg",
  },
  {
    title: "Student Laptops",
    discount: 20,
    image: "/images/placeholder-student.jpg",
  },
  {
    title: "Workstation Laptops",
    discount: 15,
    image: "/images/placeholder-workstation.jpg",
  },
  {
    title: "Creative Workstations",
    discount: 10,
    image: "/images/placeholder-creative.jpg",
  },
  {
    title: "Creative Workstations",
    discount: 10,
    image: "/images/placeholder-creative.jpg",
  },
];

export default function FlashSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: false,
    containScroll: "trimSnaps",
    align: "start",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

  return (
    <div className="relative py-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {flashDeals.map((deal, index) => (
            <div
              key={index}
              className="flex-[0_0_280px] min-w-0 relative group"
            >
              <FlashCard
                title={deal.title}
                discount={deal.discount}
                image={deal.image}
              />
            </div>
          ))}
        </div>
      </div>

      {prevBtnEnabled && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-800 p-2 rounded-full border border-neutral-700 transition-opacity hover:bg-neutral-700"
          onClick={scrollPrev}
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
      )}

      {nextBtnEnabled && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-800 p-2 rounded-full border border-neutral-700 transition-opacity hover:bg-neutral-700"
          onClick={scrollNext}
        >
          <ArrowRight size={24} className="text-white" />
        </button>
      )}
    </div>
  );
}
