import LaptopSlide from "./HeroLaptopSlider";
import HeroMarquee from "./HeroMarqueeSection";
import { LaptopT } from "@/interfaces/laptopT";
import { useAuth } from "@/context/AuthContext";
import BrandFilter from "./BrandFilter";

type Props = { laptops: LaptopT[] };

export default function Hero({ laptops }: Props) {
  const { isAuthenticated } = useAuth();
  return (
    <div className="my-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-5">
        <BrandFilter />
        <LaptopSlide laptops={laptops} isAuthenticated={isAuthenticated} />
      </div>
      <div className="min-h-0 min-w-0">
        <HeroMarquee />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="aspect-square rounded-xl bg-neutral-800"></div>
        <div className="aspect-square rounded-xl bg-neutral-800"></div>
      </div>
      <div className="flex flex-col rounded-xl bg-neutral-800">Our Sevices</div>
    </div>
  );
}
