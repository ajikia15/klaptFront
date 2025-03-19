import { ArrowRight } from "@deemlol/next-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function Landing() {
  // Initialize Embla Carousel with smoother/slower animation options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 50, // Slower animation duration (default is 20)
    dragFree: false,
    skipSnaps: false,
    align: "center",
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
    <section className="grid grid-cols-4 w-full gap-4">
      <div className="col-span-1 bg-neutral-800 rounded-lg p-4 box-border border-neutral-700 border">
        <ul className="flex flex-col gap-4">
          <li className="flex justify-between items-center">
            <span>Asus</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>Lenovo</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>MSI</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>Acer</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>HP</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>Dell</span>
            <ArrowRight size={18} />
          </li>
        </ul>
      </div>
      <div className="col-span-3 relative overflow-hidden rounded-lg">
        {/* Embla Carousel Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex transition-transform">
            {slides.map((slide) => (
              <div key={slide.id} className="relative min-w-full">
                {/* Slide content */}
                <div
                  className={`h-[400px] flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply z-10 transition-colors duration-500`}
                  />

                  {/* Text content */}
                  <div className="relative z-20 text-white text-center p-8 max-w-lg transition-all duration-500">
                    <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-lg">{slide.description}</p>
                    <button className="mt-6 px-6 py-3 bg-white text-neutral-900 font-medium rounded-md hover:bg-neutral-200 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-4 absolute bottom-4 left-0 right-0">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-white w-6" // Make active dot wider for better visual indication
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
