import { Button } from "./ui/button";
import { Sparkles, ShieldCheck, Truck, Cpu, Monitor, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import "./Landing.css";
const features = [
  {
    icon: <Zap size={32} className="text-purple-400" />, // RTX 4090
    label: "RTX 4090",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: <Monitor size={32} className="text-blue-400" />, // 240Hz
    label: "240Hz Display",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <ShieldCheck size={32} className="text-green-400" />, // Warranty
    label: "2-Year Warranty",
    color: "from-green-500 to-emerald-400",
  },
];

export default function Landing() {
  // Floating animation for feature cards
  const cardRefs = [useRef(null), useRef(null), useRef(null)];
  useEffect(() => {
    cardRefs.forEach((ref, i) => {
      if (!ref.current) return;
      ref.current.animate(
        [
          { transform: "translateY(0px) rotate(-2deg)" },
          { transform: `translateY(-12px) rotate(${i === 1 ? 2 : -2}deg)` },
          { transform: "translateY(0px) rotate(-2deg)" },
        ],
        {
          duration: 3200 + i * 300,
          iterations: Infinity,
          direction: "alternate",
          easing: "ease-in-out",
          delay: i * 200,
        }
      );
    });
  }, [cardRefs]);

  return (
    <section className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-col-reverse items-center gap-8 md:flex-row md:items-end md:gap-0">
        {/* Left: Headline & CTA */}
        <div className="flex flex-1 flex-col items-center p-8 md:items-start">
          <h1 className="relative mb-4 text-center text-5xl font-black leading-[1.05] tracking-tight md:text-left md:text-6xl lg:text-7xl">
            <span className="glitch layers" data-text="UNLOCK">
              <span>UNLOCK</span>
            </span>
            <span className="block"> UNPARALLELED </span>
            <span className="glitch layers" data-text="PERFORMANCE">
              <span>PERFORMANCE</span>
            </span>
          </h1>
          <p className="mb-8 mt-6 max-w-lg text-center text-lg text-neutral-200 md:text-left">
            Experience gaming and creation like never before. Power, style, and
            speed—beyond ordinary.
          </p>
          <Link to="/search">
            <Button
              className="relative mt-6 flex items-center justify-center gap-3 rounded-xl border border-fuchsia-500/40 bg-neutral-900 px-10 py-4 text-lg font-extrabold uppercase tracking-wider text-fuchsia-200 shadow-[0_2px_24px_0_rgba(236,72,153,0.10)] transition-all duration-300 hover:border-fuchsia-400 hover:bg-fuchsia-900/20 hover:text-fuchsia-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
              style={{ boxShadow: "0 0 16px 0 #e0287d55, 0 0 2px 0 #1bc7fb55" }}
            >
              Shop Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 12H6.75m0 0l4.5-4.5m-4.5 4.5l4.5 4.5"
                />
              </svg>
            </Button>
          </Link>
        </div>
        {/* Right: Floating Feature Cards */}
        <div className="flex flex-1 items-center justify-center gap-6 p-8">
          <div className="flex flex-col gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.label}
                ref={cardRefs[i]}
                className={`bg-neutral-900/80 relative flex flex-col items-center rounded-2xl border border-neutral-700 px-8 py-6 shadow-xl transition-transform duration-300 hover:scale-105`}
                style={{ minWidth: 180 }}
              >
                <div className="mb-3 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="mb-1 text-center text-lg font-bold text-white">
                  {feature.label}
                </div>
                <div
                  className={`absolute -z-10 left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${feature.color} opacity-30 blur-2xl`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Trust row */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-90">
        <div className="flex items-center gap-2 text-sm text-neutral-200">
          <ShieldCheck size={18} className="text-blue-400" />
          Secure Payments
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-200">
          <Truck size={18} className="text-fuchsia-400" />
          Fast Delivery
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-200">
          <Sparkles size={18} className="text-purple-400" />
          Trusted by Gamers
        </div>
      </div>
    </section>
  );
}
