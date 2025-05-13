import { Button } from "./ui/button";
import {
  ShieldCheck,
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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTranslation } from "react-i18next";

// Define proper TypeScript interface for features
interface FeatureCard {
  icon: React.ReactNode;
  label: string;
  color: string;
}

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
  const { t } = useTranslation();
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
                {t(feature.label)}
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
                {t(feature.label)}
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
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Move features array here so t is in scope
  const features: FeatureCard[] = [
    {
      icon: <Zap size={32} className="text-purple-400" />,
      label: t("rtx4090"),
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: <Monitor size={32} className="text-blue-400" />,
      label: t("display240hz"),
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <ShieldCheck size={32} className="text-green-400" />,
      label: t("warranty2year"),
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: <Cpu size={32} className="text-orange-400" />,
      label: t("intelI9"),
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: <Battery size={32} className="text-yellow-400" />,
      label: t("battery6h"),
      color: "from-yellow-400 to-amber-500",
    },
    {
      icon: <Wifi size={32} className="text-sky-400" />,
      label: t("wifi6e"),
      color: "from-sky-400 to-blue-500",
    },
    {
      icon: <HardDrive size={32} className="text-emerald-400" />,
      label: t("ssd2tb"),
      color: "from-emerald-500 to-green-400",
    },
    {
      icon: <Headphones size={32} className="text-indigo-400" />,
      label: t("hifiAudio"),
      color: "from-indigo-500 to-purple-400",
    },
  ];

  return (
    <section className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden px-0">
      <div className="relative z-20 mx-auto flex w-full flex-col-reverse items-center gap-8 md:flex-row md:items-start md:gap-0">
        <div className="flex flex-1 flex-col items-center py-24 md:items-start">
          {!isMobile ? (
            <>
              <h1 className="relative mb-4 text-center text-xl font-black leading-[1.05] tracking-tight sm:text-2xl md:text-left md:text-5xl">
                <span className="block font-light">{t("unlock")}</span>
                <span className="glitch layers" data-text="UNPARALLELED">
                  {t("unparalleled")}
                </span>
                <span className="glitch layers" data-text="PERFORMANCE">
                  <span>{t("performance")}</span>
                </span>
              </h1>
            </>
          ) : (
            <>
              <div className="logo-container relative">
                <img
                  src="/logo-white.svg"
                  className="floating-logo h-20 w-20"
                  alt="Kaido Logo"
                />
                <div className="logo-glow">
                  <div className="beam"></div>
                </div>
              </div>
            </>
          )}
          <p className="mb-8 mt-6 max-w-lg text-center text-lg text-neutral-200 md:text-left">
            {t("landingDesc")}
          </p>
          <Link to="/search">
            <Button className="relative z-20 text-lg">{t("getStarted")}</Button>
          </Link>
        </div>
        {!isMobile && (
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
        )}
      </div>
    </section>
  );
}
