import HelperSearchBar from "./HelperSearchBar";
import ServiceCard from "./ServiceCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export default function HeroTestimonial() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    align: "start",
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div className="relative flex h-full w-full flex-col justify-around gap-4 overflow-hidden rounded-xl bg-neutral-800 p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="logo-text text-2xl font-semibold">Kaido's Services</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={scrollPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={scrollNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex flex-row gap-4">
          <div className="min-w-64 flex-[0_0_auto]">
            <ServiceCard
              title="Testing"
              description="Kaido offers on-site testing of the verified and unverified systems. We provide free support on the Kaido verified items. For unverified systems, you can arrange a visit from our technicians - ANYWHERE in Tbilisi."
              image="/static/testing2.jpg"
            />
          </div>
          <div className="min-w-64 flex-[0_0_auto]">
            <ServiceCard
              title="Repair"
              description="Our qualified technicians are ready to help you with any hardware or software issues you may have."
              image="/static/repairv1.png"
            />
          </div>
          <div className="min-w-64 flex-[0_0_auto]">
            <ServiceCard
              title="Software Installation"
              description="Our qualified technicians are ready to set up systems with any software/games you want. You can also bring your own hardware and we will install it for you."
              image="/static/software1.png"
            />
          </div>
          <div className="min-w-64 flex-[0_0_auto]">
            <ServiceCard
              title="Upgrade"
              description="You may request upgrade of your an item for more RAM and SSD storage, at the best prices."
              image="/static/ram.png"
            />
          </div>
        </div>
      </div>

      <HelperSearchBar />
    </div>
  );
}
