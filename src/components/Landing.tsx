import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import FlashSection from "./FlashSection";
import { Button } from "./ui/button";

export default function Landing() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 20,
    skipSnaps: false,
    align: "center",
    watchDrag: false,
  });

  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slides] = useState([
    {
      id: 1,
      title: "Powerful Gaming Laptops",
      description: "Experience top-tier gaming performance on the go",
      image:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      color: "from-blue-500/30 to-purple-700/30",
    },
    {
      id: 2,
      title: "Ultrabook Excellence",
      description: "Sleek, lightweight and powerful for professionals",
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      color: "from-emerald-500/30 to-cyan-700/30",
    },
    {
      id: 3,
      title: "Budget-Friendly Options",
      description: "High quality laptops that won't break the bank",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      color: "from-amber-500/30 to-red-700/30",
    },
    {
      id: 4,
      title: "Creative Workstations",
      description: "Designed for creators with color-accurate displays",
      image:
        "https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      color: "from-violet-500/30 to-indigo-700/30",
    },
  ]);

  // Function to start autoplay
  const startAutoplay = useCallback(() => {
    if (!emblaApi) return;

    // Clear any existing interval
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }

    // Set up new autoplay interval
    autoplayIntervalRef.current = setInterval(() => {
      const nextIndex = (emblaApi.selectedScrollSnap() + 1) % slides.length;
      emblaApi.scrollTo(nextIndex, true);
    }, 10000);
  }, [emblaApi, slides.length]);

  // Track the current slide index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Set up event listeners and autoplay
  useEffect(() => {
    if (!emblaApi) return;

    // Add onSelect listener
    emblaApi.on("select", onSelect);
    // Add interaction listeners to reset autoplay
    emblaApi.on("pointerDown", startAutoplay);
    emblaApi.on("settle", startAutoplay);

    // Initialize the index
    onSelect();
    // Start initial autoplay
    startAutoplay();

    // Cleanup
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", startAutoplay);
      emblaApi.off("settle", startAutoplay);
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [emblaApi, onSelect, startAutoplay]);

  // Scroll to a specific slide when clicking a dot
  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index, true);
      startAutoplay(); // Reset autoplay timer when manually changing slides
    },
    [emblaApi, startAutoplay]
  );

  return (
    <section className="w-full">
      {/* Sidebar DISABLED grid-cols-4 col-span-3 */}
      {/* <div className="col-span-1 box-border rounded-lg border border-neutral-700 bg-neutral-800 p-4">
        <ul className="flex flex-col gap-4">
          <li className="flex items-center justify-between">
            <span>Asus</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex items-center justify-between">
            <span>Lenovo</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex items-center justify-between">
            <span>MSI</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex items-center justify-between">
            <span>Acer</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex items-center justify-between">
            <span>HP</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex items-center justify-between">
            <span>Dell</span>
            <ArrowRight size={18} />
          </li>
        </ul>
      </div> */}
      <div className="relative overflow-hidden rounded-lg">
        {/* Embla Carousel Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex transition-transform">
            {slides.map((slide) => (
              <div key={slide.id} className="relative min-w-full">
                {/* Slide content */}
                <div
                  className={`relative flex h-[400px] items-center justify-center overflow-hidden`}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply z-10 transition-colors duration-500`}
                  />

                  {/* Text content */}
                  <div className="relative z-20 max-w-lg p-8 text-center text-white transition-all duration-500">
                    <h2 className="mb-4 text-3xl font-bold">{slide.title}</h2>
                    <p className="text-lg">{slide.description}</p>
                    <Button className="mt-6 rounded-md bg-white px-6 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-200">
                      Learn More
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
      {/* <FlashSection /> TODO */}
    </section>
  );
}
