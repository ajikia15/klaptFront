import LaptopSlide from "./HeroLaptopSlide";
import HerooMarquee from "./HeroMarqueeSection";

export default function Hero() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-semibold">Featured Brands</h2>
          <ul className="grid grid-cols-5 gap-5">
            <li className="text grid aspect-square place-items-center rounded-full bg-yellow-400 p-2">
              Asus
            </li>
            <li className="text grid aspect-square place-items-center rounded-full bg-yellow-400 p-2">
              Lenovo
            </li>{" "}
            <li className="text grid aspect-square place-items-center rounded-full bg-yellow-400 p-2">
              MSI
            </li>{" "}
            <li className="text grid aspect-square place-items-center rounded-full bg-yellow-400 p-2">
              Gigabyte
            </li>{" "}
            <li className="text grid aspect-square place-items-center rounded-full bg-yellow-400 p-2">
              HP
            </li>
          </ul>
        </div>
        <LaptopSlide />
      </div>
      <HerooMarquee />
      <div className="grid grid-cols-2 gap-6">
        <div className="aspect-square rounded-xl bg-neutral-800"></div>
        <div className="aspect-square rounded-xl bg-neutral-800"></div>
      </div>
    </div>
  );
}
