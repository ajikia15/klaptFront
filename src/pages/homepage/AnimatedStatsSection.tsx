import { useEffect, useRef, useState } from 'react';
import { Check, Shield, Clock, HeartHandshake, ThumbsUp } from 'lucide-react';

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
      { threshold: 0.3 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="bg-neutral-800 px-2 py-10">
      <h2 className="mb-8 text-center text-3xl font-bold text-white">
        But, why Kaido?
      </h2>
      <div ref={statsRef} className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            className={`text-center transition-all duration-1000 ${
              statsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-5xl font-bold text-white">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {animatedStats.customers.toLocaleString()}+
              </span>
            </div>
            <p className="text-neutral-300">Happy Customers</p>
          </div>

          <div
            className={`text-center transition-all duration-1000 delay-200 ${
              statsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-5xl font-bold text-white">
              <span className="bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent">
                {animatedStats.laptops.toLocaleString()}+
              </span>
            </div>
            <p className="text-neutral-300">Laptops Sold</p>
          </div>

          <div
            className={`text-center transition-all duration-1000 delay-400 ${
              statsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-5xl font-bold text-white">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {animatedStats.brands}+
              </span>
            </div>
            <p className="text-neutral-300">Premium Brands</p>
          </div>
        </div>

        <div className="mb-8 mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="hover:bg-neutral-850 group rounded-lg bg-neutral-900 p-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
              <div className="bg-primary-500/20 group-hover:bg-primary-500/30 mx-auto mb-6 flex h-12 w-12 transform items-center justify-center rounded-full text-primary-400 transition-all duration-300 group-hover:scale-110 group-hover:text-primary-300">
                <Check size={24} />
              </div>
              <h3 className="mb-3 text-center text-lg font-semibold text-white transition-colors duration-300 group-hover:text-primary-300">
                Quality Guaranteed
              </h3>
              <p className="text-center text-sm text-neutral-400">
                Every laptop is thoroughly tested before shipping
              </p>
            </div>

            <div className="hover:bg-neutral-850 group rounded-lg bg-neutral-900 p-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
              <div className="bg-secondary-500/20 group-hover:bg-secondary-500/30 mx-auto mb-6 flex h-12 w-12 transform items-center justify-center rounded-full text-secondary-400 transition-all duration-300 group-hover:scale-110 group-hover:text-secondary-300">
                <Shield size={24} />
              </div>
              <h3 className="mb-3 text-center text-lg font-semibold text-white transition-colors duration-300 group-hover:text-secondary-300">
                Extended Warranty
              </h3>
              <p className="text-center text-sm text-neutral-400">
                Get peace of mind with our industry-leading warranty coverage
              </p>
            </div>

            <div className="hover:bg-neutral-850 group rounded-lg bg-neutral-900 p-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-12 w-12 transform items-center justify-center rounded-full bg-purple-500/20 text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500/30 group-hover:text-purple-300">
                <Clock size={24} />
              </div>
              <h3 className="mb-3 text-center text-lg font-semibold text-white transition-colors duration-300 group-hover:text-purple-300">
                Fast Delivery
              </h3>
              <p className="text-center text-sm text-neutral-400">
                Most orders ship within 24 hours of purchase
              </p>
            </div>

            <div className="hover:bg-neutral-850 group rounded-lg bg-neutral-900 p-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-12 w-12 transform items-center justify-center rounded-full bg-blue-500/20 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500/30 group-hover:text-blue-300">
                <HeartHandshake size={24} />
              </div>
              <h3 className="mb-3 text-center text-lg font-semibold text-white transition-colors duration-300 group-hover:text-blue-300">
                Expert Support
              </h3>
              <p className="text-center text-sm text-neutral-400">
                Our tech specialists are available 24/7 for assistance
              </p>
            </div>

            <div className="hover:bg-neutral-850 group rounded-lg bg-neutral-900 p-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-12 w-12 transform items-center justify-center rounded-full bg-green-500/20 text-green-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500/30 group-hover:text-green-300">
                <ThumbsUp size={24} />
              </div>
              <h3 className="mb-3 text-center text-lg font-semibold text-white transition-colors duration-300 group-hover:text-green-300">
                Satisfaction Guarantee
              </h3>
              <p className="text-center text-sm text-neutral-400">
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
