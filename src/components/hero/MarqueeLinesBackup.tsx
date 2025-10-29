import { FeatureCard, featuresData } from "@/pages/homepage/hero/FeatureCard";
import FeatureItem from "./FeatureItem";
import SimpleMarquee from "../fancy/blocks/simple-marquee";

export default function MarqueeLinesBackup() {
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
    <>
      <div className="absolute inset-0 mr-5 flex origin-center flex-row items-center justify-end space-x-3 p-4 will-change-transform md:space-x-4 md:p-5">
        <SimpleMarquee
          className="h-full"
          baseVelocity={10}
          repeat={4}
          easing={easeFn}
          direction="up"
        >
          {firstThird.map((feature, i) => (
            <FeatureItem key={i}>
              <FeatureCard feature={feature} />
            </FeatureItem>
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
            <FeatureItem key={i}>
              <FeatureCard feature={feature} />
            </FeatureItem>
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
            <FeatureItem key={i}>
              <FeatureCard feature={feature} />
            </FeatureItem>
          ))}
        </SimpleMarquee>
      </div>
      <div className="flex h-full flex-col sm:hidden">
        {/* Mobile Header with Logo */}
        <div className="flex items-center justify-between p-4">
          <img src="/logo-white.svg" alt="Kaido Logo" className="h-6 w-auto" />
          <h2 className="text-lg font-bold text-white">Premium Laptops</h2>
        </div>

        {/* Mobile Horizontal Marquees */}
        <div className="flex flex-1 flex-col space-y-4 p-4">
          <SimpleMarquee
            className="h-32"
            baseVelocity={15}
            repeat={3}
            easing={easeFn}
            direction="left"
          >
            {firstThird.map((feature, i) => (
              <FeatureItem key={i}>
                <FeatureCard feature={feature} />
              </FeatureItem>
            ))}
          </SimpleMarquee>

          <SimpleMarquee
            className="h-32"
            baseVelocity={15}
            repeat={3}
            easing={easeFn}
            direction="right"
          >
            {secondThird.map((feature, i) => (
              <FeatureItem key={i}>
                <FeatureCard feature={feature} />
              </FeatureItem>
            ))}
          </SimpleMarquee>

          <SimpleMarquee
            className="h-32"
            baseVelocity={15}
            repeat={3}
            easing={easeFn}
            direction="left"
          >
            {lastThird.map((feature, i) => (
              <FeatureItem key={i}>
                <FeatureCard feature={feature} />
              </FeatureItem>
            ))}
          </SimpleMarquee>
        </div>
      </div>
    </>
  );
}
