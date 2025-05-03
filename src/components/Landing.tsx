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
  return (
    <section className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div className="relative z-20 mx-auto flex w-full flex-col-reverse items-center gap-8 md:flex-row md:items-end md:gap-0">
        {/* Left: Headline & CTA */}
        <div className="flex flex-1 flex-col items-center p-8 md:items-start">
          <h1 className="relative mb-4 text-center text-5xl font-black leading-[1.05] tracking-tight md:text-left md:text-6xl lg:text-7xl">
            <span className="block font-light">UNLOCK</span>
            <span className="glitch layers" data-text="UNPARALLELED">
              {" "}
              UNPARALLELED{" "}
            </span>
            <span className="glitch layers" data-text="PERFORMANCE">
              <span>PERFORMANCE</span>
            </span>
          </h1>
          <p className="mb-8 mt-6 max-w-lg text-center text-lg text-neutral-200 md:text-left">
            Experience gaming and creation like never before. Power, style, and
            speed—beyond ordinary.
          </p>
          <Link to="/search">
            <Button className="relative z-20 flex cursor-pointer select-none items-center justify-center gap-3 overflow-hidden rounded-2xl bg-neutral-900 px-10 py-5 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-neutral-800 hover:shadow-[0_0_24px_0_rgba(236,72,153,0.18)] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60">
              <span className="relative z-10">SHOP NOW</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="relative z-10 ml-4 h-7 w-7"
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
        {/* Right: Feature Cards (no animation, just 3D rotation) */}
        <div className="flex flex-1 items-center justify-center gap-6 p-8">
          <div className="flex flex-col gap-8" style={{ perspective: "900px" }}>
            {features.map((feature, i) => (
              <div
                key={feature.label}
                className={`bg-neutral-900/80 relative flex flex-col items-center rounded-2xl border border-neutral-700 px-8 py-6 shadow-xl transition-transform duration-300 hover:scale-105`}
                style={{
                  minWidth: 180,
                  transform: "rotateY(-18deg) rotateX(4deg)", // All cards same rotation
                }}
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
