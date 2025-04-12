import { useEffect, useRef, useState } from "react";
import { Check, Shield, Clock, HeartHandshake, ThumbsUp } from "lucide-react";

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
    <section className="py-10 bg-neutral-800">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        But, why Kaido?
      </h2>
      <div ref={statsRef} className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`text-center transition-all duration-1000 ${
              statsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-5xl font-bold text-white">
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
            <div className="text-5xl font-bold text-white ">
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
            <div className="text-5xl font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                {animatedStats.brands}+
              </span>
            </div>
            <p className="text-neutral-300">Premium Brands</p>
          </div>
        </div>

        <div className="mt-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg hover:bg-neutral-850 hover:scale-105 hover:shadow-xl group transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/20 text-primary-400 mb-6 mx-auto group-hover:bg-primary-500/30 group-hover:text-primary-300 transform group-hover:scale-110 transition-all duration-300">
                <Check size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-3 group-hover:text-primary-300 transition-colors duration-300">
                Quality Guaranteed
              </h3>
              <p className="text-neutral-400 text-center text-sm">
                Every laptop is thoroughly tested before shipping
              </p>
            </div>

            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg hover:bg-neutral-850 hover:scale-105 hover:shadow-xl group transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-500/20 text-secondary-400 mb-6 mx-auto group-hover:bg-secondary-500/30 group-hover:text-secondary-300 transform group-hover:scale-110 transition-all duration-300">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-3 group-hover:text-secondary-300 transition-colors duration-300">
                Extended Warranty
              </h3>
              <p className="text-neutral-400 text-center text-sm">
                Get peace of mind with our industry-leading warranty coverage
              </p>
            </div>

            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg hover:bg-neutral-850 hover:scale-105 hover:shadow-xl group transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 mb-6 mx-auto group-hover:bg-purple-500/30 group-hover:text-purple-300 transform group-hover:scale-110 transition-all duration-300">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-3 group-hover:text-purple-300 transition-colors duration-300">
                Fast Delivery
              </h3>
              <p className="text-neutral-400 text-center text-sm">
                Most orders ship within 24 hours of purchase
              </p>
            </div>

            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg hover:bg-neutral-850 hover:scale-105 hover:shadow-xl group transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 mb-6 mx-auto group-hover:bg-blue-500/30 group-hover:text-blue-300 transform group-hover:scale-110 transition-all duration-300">
                <HeartHandshake size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-3 group-hover:text-blue-300 transition-colors duration-300">
                Expert Support
              </h3>
              <p className="text-neutral-400 text-center text-sm">
                Our tech specialists are available 24/7 for assistance
              </p>
            </div>

            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg hover:bg-neutral-850 hover:scale-105 hover:shadow-xl group transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-400 mb-6 mx-auto group-hover:bg-green-500/30 group-hover:text-green-300 transform group-hover:scale-110 transition-all duration-300">
                <ThumbsUp size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-3 group-hover:text-green-300 transition-colors duration-300">
                Satisfaction Guarantee
              </h3>
              <p className="text-neutral-400 text-center text-sm">
                30-day money-back guarantee on all purchases
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedStatsSection;
