import { ArrowRight } from "lucide-react";

export default function LaptopSlide() {
  return (
    <div className="min-h-56 relative grid aspect-[2/1] grid-cols-2 gap-2 rounded-xl bg-neutral-800">
      <div>Image</div>
      <div className="">RTX NIGGA CORES 5050</div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-accent/80 p-1.5 hover:bg-accent/100">
        <ArrowRight size={18} />
      </div>
    </div>
  );
}
