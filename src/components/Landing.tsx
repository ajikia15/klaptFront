import { Button } from "./ui/button";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Cpu,
  Monitor,
  Zap,
  Battery,
  Wifi,
  HardDrive,
  Headphones,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import "./Landing.css";

// Define proper TypeScript interface for features
interface FeatureCard {
  icon: React.ReactNode;
  label: string;
  color: string;
}

// Expanded list of features - add more options for variety
const features: FeatureCard[] = [
  {
    icon: <Zap size={32} className="text-purple-400" />,
    label: "RTX 4090",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: <Monitor size={32} className="text-blue-400" />,
    label: "240Hz Display",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <ShieldCheck size={32} className="text-green-400" />,
    label: "2-Year Warranty",
    color: "from-green-500 to-emerald-400",
  },
  {
    icon: <Cpu size={32} className="text-orange-400" />,
    label: "Intel i9 14th Gen",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: <Battery size={32} className="text-yellow-400" />,
    label: "6h Battery Life",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: <Wifi size={32} className="text-sky-400" />,
    label: "WiFi 6E",
    color: "from-sky-400 to-blue-500",
  },

  {
    icon: <HardDrive size={32} className="text-emerald-400" />,
    label: "2TB SSD",
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: <Headphones size={32} className="text-indigo-400" />,
    label: "Hi-Fi Audio",
    color: "from-indigo-500 to-purple-400",
  },
];

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Define proper types for MarqueeColumn props
interface MarqueeColumnProps {
  features: FeatureCard[];
  duration?: number;
  reverse?: boolean;
}

function MarqueeColumn({
  features,
  duration = 25,
  reverse = false,
  perspective = "rotateX(-30deg) rotateY(-30deg) rotateZ(0deg)",
  scale = 1,
}: MarqueeColumnProps & {
  perspective?: string;
  scale?: number;
}) {
  const shuffledFeatures = useMemo(() => shuffleArray(features), [features]);

  return (
    <div
      className={`marquee marquee--vertical relative ${
        reverse ? "marquee--reverse" : ""
      }`}
      style={
        {
          "--duration": `${duration}s`,
          height: "420px",
          width: "120px",
          perspective: "1200px",
          transformStyle: "preserve-3d", // Added transform-style
          backgroundColor: "transparent", // Ensure transparent background
        } as React.CSSProperties
      }
    >
      {/* This wrapper will be positioned absolutely and scroll behind the parent */}
      <div className="marquee__content-wrapper">
        <div className="marquee__group">
          {shuffledFeatures.map((feature, i) => (
            <div
              key={`card-${feature.label}-${i}`}
              className="feature-card bg-neutral-900/80 relative flex h-[120px] min-w-[90px] flex-col items-center justify-center rounded-2xl border border-neutral-700 px-4 py-4 shadow-xl"
              style={{
                transform:
                  perspective + (scale !== 1 ? ` scale(${scale})` : ""),
              }}
            >
              <div className="mb-2 flex items-center justify-center">
                {feature.icon}
              </div>
              <div className="flex h-[2.5em] items-center justify-center text-center text-base font-bold text-white">
                {feature.label}
              </div>
              <div
                className={`absolute -z-10 left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${feature.color} opacity-30 blur-2xl`}
              />
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="marquee__group">
          {shuffledFeatures.map((feature, i) => (
            <div
              key={`clone-${feature.label}-${i}`}
              className="feature-card bg-neutral-900/80 relative flex h-[120px] min-w-[90px] flex-col items-center justify-center rounded-2xl border border-neutral-700 px-4 py-4 shadow-xl"
              style={{
                transform:
                  perspective + (scale !== 1 ? ` scale(${scale})` : ""),
              }}
            >
              <div className="mb-2 flex items-center justify-center">
                {feature.icon}
              </div>
              <div className="flex h-[2.5em] items-center justify-center text-center text-base font-bold text-white">
                {feature.label}
              </div>
              <div
                className={`absolute -z-10 left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${feature.color} opacity-30 blur-2xl`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <section className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden px-0">
      <div className="relative z-20 mx-auto flex w-full flex-col-reverse items-center gap-8 md:flex-row md:items-start md:gap-0">
        <div className="flex flex-1 flex-col items-center py-24 md:items-start">
          <h1 className="relative mb-4 text-center text-5xl font-black leading-[1.05] tracking-tight md:text-left md:text-5xl lg:text-6xl">
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
            <Button className="relative z-20">
              <span className="relative z-10">SHOP NOW</span>
            </Button>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          {/* First column appears furthest away (smaller) */}
          <MarqueeColumn
            features={features}
            duration={35}
            perspective="rotateX(-30deg) rotateY(-30deg) rotateZ(0deg)" // Reverted to original value
            scale={0.85} // Keep the new scale
          />
          {/* Middle column has medium perspective */}
          <MarqueeColumn
            features={features}
            duration={40}
            reverse={true}
            perspective="rotateX(-30deg) rotateY(-30deg) rotateZ(0deg)" // This was already correct
            scale={0.92} // Keep the new scale
          />
          {/* Last column appears closest (larger) */}
          <MarqueeColumn
            features={features}
            duration={30}
            perspective="rotateX(-30deg) rotateY(-30deg) rotateZ(0deg)" // Reverted to original value
            scale={1.0} // Keep the new scale
          />
        </div>
      </div>
    </section>
  );
}
