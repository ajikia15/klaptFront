import { useEffect, useRef, useState } from "react";

const AnimatedStatsSection = () => {
  // For animated stats
  const [animatedStats, setAnimatedStats] = useState({
    customers: 0,
    laptops: 0,
    brands: 0,
  });

  // For scroll animations
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Animation for stats when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);

          // Animate numbers counting up
          const animateStats = () => {
            const duration = 2000; // 2 seconds
            const startTime = Date.now();
            const endStats = { customers: 5000, laptops: 1200, brands: 25 };

            const updateStats = () => {
              const currentTime = Date.now();
              const elapsedTime = currentTime - startTime;
              const progress = Math.min(elapsedTime / duration, 1);

              setAnimatedStats({
                customers: Math.floor(progress * endStats.customers),
                laptops: Math.floor(progress * endStats.laptops),
                brands: Math.floor(progress * endStats.brands),
              });

              if (progress < 1) {
                requestAnimationFrame(updateStats);
              }
            };

            requestAnimationFrame(updateStats);
          };

          animateStats();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="container mx-auto py-10 overflow-hidden relative mt-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,58,183,0.07),transparent_70%)]"></div>
      <div ref={statsRef} className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`text-center transition-all duration-1000 ${
              statsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-5xl font-bold text-white mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                {animatedStats.customers.toLocaleString()}+
              </span>
            </div>
            <p className="text-neutral-300">Happy Customers</p>
          </div>

          <div
            className={`text-center transition-all duration-1000 delay-200 ${
              statsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-5xl font-bold text-white mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-primary-400">
                {animatedStats.laptops.toLocaleString()}+
              </span>
            </div>
            <p className="text-neutral-300">Laptops Sold</p>
          </div>

          <div
            className={`text-center transition-all duration-1000 delay-400 ${
              statsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-5xl font-bold text-white mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                {animatedStats.brands}+
              </span>
            </div>
            <p className="text-neutral-300">Premium Brands</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedStatsSection;
