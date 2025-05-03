import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Flame } from "lucide-react";
import { Button } from "./ui/button";

const slides = [
  {
    id: 1,
    type: "deal",
    title: "🔥 RTX 4090 Gaming Beast",
    description: "Unleash 240Hz gaming with the latest RTX graphics.",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80",
    price: "$2,499",
    badge: "Deal of the Week",
    specs: ["Intel i9", "32GB RAM", "RTX 4090", "2TB SSD"],
    cta: "Shop Now",
    color: "from-blue-500/30 to-purple-700/30",
  },
  {
    id: 2,
    type: "compare",
    title: "Ultrabook vs Gaming",
    description: "Sleek productivity or raw power? Compare top picks below.",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
    color: "from-emerald-500/30 to-cyan-700/30",
    cta: "Compare Now",
  },
  {
    id: 3,
    type: "testimonial",
    title: "Top Streamer’s Pick",
    description: `"This laptop changed my streaming game. 165Hz and zero lag!"`,
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?auto=format&fit=crop&w=1200&q=80",
    reviewer: {
      name: "GamerKat",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      platform: "Twitch",
    },
    color: "from-violet-500/30 to-indigo-700/30",
  },
];

export default function LandingCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 20,
    skipSnaps: false,
    align: "center",
    watchDrag: false,
  });

  // Fix: useRef<number | undefined>(undefined)
  const autoplayIntervalRef = useRef<number | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Autoplay logic
  const startAutoplay = useCallback(() => {
    if (!emblaApi) return;
    if (autoplayIntervalRef.current !== undefined)
      clearInterval(autoplayIntervalRef.current);
    autoplayIntervalRef.current = window.setInterval(() => {
      const nextIndex = (emblaApi.selectedScrollSnap() + 1) % slides.length;
      emblaApi.scrollTo(nextIndex, true);
    }, 8000);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", startAutoplay);
    emblaApi.on("settle", startAutoplay);
    onSelect();
    startAutoplay();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", startAutoplay);
      emblaApi.off("settle", startAutoplay);
      if (autoplayIntervalRef.current)
        clearInterval(autoplayIntervalRef.current);
    };
  }, [emblaApi, onSelect, startAutoplay]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index, true);
      startAutoplay();
    },
    [emblaApi, startAutoplay]
  );

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex transition-transform">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="relative min-w-full">
              <div className="relative flex h-[340px] items-center justify-center overflow-hidden md:h-[400px]">
                {/* Background image */}
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply z-10 transition-colors duration-500`}
                />
                {/* Slide content */}
                <div className="relative z-20 max-w-lg p-8 text-center text-white transition-all duration-500">
                  {slide.badge && (
                    <span className="mb-2 inline-block rounded bg-amber-500 px-3 py-1 text-xs font-bold text-neutral-900">
                      {slide.badge}
                    </span>
                  )}
                  <h2 className="mb-2 flex items-center justify-center gap-2 text-3xl font-bold">
                    {slide.type === "deal" && (
                      <Flame className="text-amber-400" size={24} />
                    )}
                    {slide.title}
                  </h2>
                  <p className="mb-2 text-lg">{slide.description}</p>
                  {slide.type === "deal" && (
                    <>
                      <div className="mb-2 flex flex-wrap justify-center gap-2 text-sm text-neutral-200">
                        {slide.specs?.map((spec) => (
                          <span
                            key={spec}
                            className="bg-neutral-800/70 rounded px-2 py-1"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      <div className="mb-4 text-2xl font-semibold text-emerald-400">
                        {slide.price}
                      </div>
                    </>
                  )}
                  {slide.type === "testimonial" && slide.reviewer && (
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <img
                        src={slide.reviewer.avatar}
                        alt={slide.reviewer.name}
                        className="h-10 w-10 rounded-full border-2 border-primary-400"
                      />
                      <span className="text-sm text-neutral-200">
                        {slide.reviewer.name}{" "}
                        <span className="text-xs text-neutral-400">
                          ({slide.reviewer.platform})
                        </span>
                      </span>
                    </div>
                  )}
                  <Button className="mt-4 rounded-md bg-white px-6 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-200">
                    {slide.cta || "Learn More"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-0 right-0 mt-4 flex items-center justify-center">
        <div className="bg-neutral-700/20 flex items-center justify-center gap-2 rounded-xl p-2 backdrop-blur-xl">
          {slides.map((_, index) => (
            <Button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
