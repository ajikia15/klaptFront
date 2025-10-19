import LaptopSlide from "./HeroLaptopSlide";
import HeroMarquee from "./HeroMarqueeSection";

export default function Hero() {
  return (
    <div className="my-4 grid grid-cols-2 gap-5">
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-semibold">Featured Brands</h2>
          <ul className="grid grid-cols-5 gap-5">
            <li className="text grid aspect-square cursor-pointer place-items-center rounded-full bg-neutral-800 p-2 transition hover:bg-neutral-700">
              Asus
            </li>
            <li className="text grid aspect-square cursor-pointer place-items-center rounded-full bg-neutral-800 p-2 transition hover:bg-neutral-700">
              Lenovo
            </li>
            <li className="text grid aspect-square cursor-pointer place-items-center rounded-full bg-neutral-800 p-2 transition hover:bg-neutral-700">
              MSI
            </li>
            <li className="text grid aspect-square cursor-pointer place-items-center rounded-full bg-neutral-800 p-2 transition hover:bg-neutral-700">
              Gigabyte
            </li>
            <li className="text grid aspect-square cursor-pointer place-items-center rounded-full bg-neutral-800 p-2 transition hover:bg-neutral-700">
              HP
            </li>
          </ul>
        </div>
        <LaptopSlide />
      </div>
      <div className="min-w-0 min-h-0 overflow-hidden">
        <HeroMarquee />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="aspect-square rounded-xl bg-neutral-800"></div>
        <div className="aspect-square rounded-xl bg-neutral-800"></div>
      </div>
      <div className="flex flex-col rounded-xl bg-neutral-800">Our Sevices</div>
    </div>
  );
}
