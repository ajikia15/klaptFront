import React from "react";
import SimpleMarquee from "@/components/fancy/blocks/simple-marquee";
import { FeatureCard, featuresData } from "./FeatureCard";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const MarqueeItem = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 cursor-pointer overflow-hidden rounded duration-300 ease-in-out hover:scale-105">
    {children}
  </div>
);

export default function HeroMarqueeSection() {
  const firstThird = featuresData.slice(0, Math.floor(featuresData.length / 3));
  const secondThird = featuresData.slice(
    Math.floor(featuresData.length / 3),
    Math.floor((2 * featuresData.length) / 3)
  );
  const lastThird = featuresData.slice(
    Math.floor((2 * featuresData.length) / 3)
  );

  const easeFn = (x: number) => {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? Math.pow(2, 20 * x - 10) / 2
      : (2 - Math.pow(2, -20 * x + 10)) / 2;
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-800"
      // style={{ perspective: "1200px" }}
    >
      <div
        className="absolute inset-0 mr-5 flex origin-center flex-row items-center justify-end space-x-4 p-5 will-change-transform"
        style={{
          // transform: "rotateX(-20deg) rotateY(-30deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <SimpleMarquee
          className="h-full"
          baseVelocity={10}
          repeat={4}
          easing={easeFn}
          direction="up"
        >
          {firstThird.map((feature, i) => (
            <MarqueeItem key={i}>
              <FeatureCard feature={feature} />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          className="h-full"
          baseVelocity={10}
          repeat={4}
          easing={easeFn}
          direction="down"
        >
          {secondThird.map((feature, i) => (
            <MarqueeItem key={i}>
              <FeatureCard feature={feature} />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          className="h-full"
          baseVelocity={10}
          repeat={4}
          easing={easeFn}
          direction="up"
        >
          {lastThird.map((feature, i) => (
            <MarqueeItem key={i}>
              <FeatureCard feature={feature} />
            </MarqueeItem>
          ))}
        </SimpleMarquee>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-evenly gap-2 border-t border-neutral-600 bg-neutral-800 px-5 py-3">
        <div className="flex flex-1 items-center justify-between rounded-full bg-neutral-900 p-1 pl-4 font-semibold">
          SHOP NOW
          <Button variant="secondary" className="h-8 w-8 rounded-full">
            <ArrowRight className="" />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-between rounded-full border border-neutral-700 p-1 pl-4 font-semibold">
          CONTACT US
          <Button
            variant="ghost"
            className="h-8 w-8 rounded-full bg-neutral-900"
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}
