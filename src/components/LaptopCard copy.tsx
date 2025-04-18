import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Maximize2 } from "@deemlol/next-icons";
import { Badge } from "@/components/ui/badge";
import HeartBtn from "./HeartBtn";
import { LaptopT } from "@/interfaces/laptopT";
import { Button } from "./ui/button";

interface LaptopCardProps extends LaptopT {
  isAuthenticated: boolean;
  tags?: string[];
}

export const LaptopCard: FC<LaptopCardProps> = (laptop) => {
  return (
    <div className="group/card border-neutral-700/30 group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 transition-all duration-300">
      <div className="relative w-full px-6 pb-4 pt-6">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent"></div>
        {/* overlay is behind the image */}
        <div className="z-5 absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40"></div>

        {laptop.images ? (
          <div className="relative z-10 flex h-36 items-center justify-center transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
            <img
              src={laptop.images[0]}
              alt={laptop.title}
              className="h-full object-contain drop-shadow-[0_10px_10px_rgba(138,43,226,0.15)]"
            />
          </div>
        ) : (
          <div className="flex h-36 w-full items-center justify-center rounded-lg border border-dashed border-neutral-700 text-neutral-500">
            <span>No image available</span>
          </div>
        )}

        <div className="absolute right-3 top-3 z-20 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button className="bg-neutral-800/70 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg p-2 shadow-lg transition-all hover:bg-purple-800/90">
            <Maximize2 size={20} className="text-white" />
          </Button>
          <HeartBtn
            laptopId={laptop.id}
            className="bg-neutral-800/70 rounded-lg p-2 shadow-lg transition-all hover:bg-purple-800/90"
            isAuthenticated={laptop.isAuthenticated}
          />
        </div>
      </div>

      <div className="bg-neutral-800/60 relative flex flex-grow flex-col p-5 before:absolute before:left-[10%] before:right-[10%] before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-purple-500/30 before:to-transparent">
        <div className="flex flex-grow flex-col">
          <Link
            to="/laptop/$laptopId"
            params={{ laptopId: laptop.id.toString() }}
            className="inline-block"
          >
            <h3 className="mb-2 line-clamp-1 text-xl font-bold text-white transition-colors hover:text-purple-400">
              {laptop.title}
            </h3>
          </Link>

          <div className="mb-4 space-x-2 space-y-1">
            {laptop.gpuBrand.toLowerCase().includes("nvidia") && (
              <Badge className="border-neutral-700/20 cursor-pointer border bg-green-700/80 font-bold shadow-sm transition-all hover:bg-green-600/80">
                {laptop.gpuModel}
              </Badge>
            )}
            {laptop.gpuBrand.toLowerCase().includes("AMD") && (
              <Badge className="border-neutral-700/20 cursor-pointer border bg-red-600/80 font-bold shadow-sm transition-all hover:bg-red-500/80">
                {laptop.gpuModel}
              </Badge>
            )}
            {laptop.processorBrand.includes("Intel") && (
              <Badge className="border-neutral-700/20 cursor-pointer border bg-blue-600/80 font-bold shadow-sm transition-all hover:bg-blue-500/80">
                {laptop.processorModel}
              </Badge>
            )}
            {laptop.processorBrand.toLowerCase().includes("amd") && (
              <Badge className="border-neutral-700/20 cursor-pointer border bg-red-600/80 font-bold shadow-sm transition-all hover:bg-red-500/80">
                {laptop.processorModel}
              </Badge>
            )}
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold shadow-sm transition-all hover:bg-neutral-700">
              {laptop.refreshRate}Hz
            </Badge>
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold shadow-sm transition-all hover:bg-neutral-700">
              {laptop.storageCapacity}
            </Badge>
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold shadow-sm transition-all hover:bg-neutral-700">
              {laptop.ram}GB
            </Badge>
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold shadow-sm transition-all hover:bg-neutral-700">
              {laptop.ramType}
            </Badge>
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold shadow-sm transition-all hover:bg-neutral-700">
              {laptop.screenResolution}
            </Badge>

            {/* <Badge className="bg-blue-600/80 font-bold">Intel Core</Badge> */}
          </div>

          {/* Display laptop tags */}

          <div className="border-neutral-700/50 mt-auto flex items-center justify-between border-t pt-3">
            <div className="font-bold text-purple-300">
              <span className="block text-sm text-neutral-400">Price</span>$
              {laptop.price.toLocaleString()}
            </div>

            <Link
              to="/laptop/$laptopId"
              params={{ laptopId: laptop.id.toString() }}
              className="group/btn before:from-primary-500/0 before:via-secondary-400/50 before:to-primary-500/0 relative flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-md bg-secondary-700 px-4 py-2 text-base font-medium text-white transition-all duration-300 before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:transition-transform before:duration-500 before:ease-in-out hover:bg-secondary-700 hover:before:translate-x-[100%]"
            >
              <span className="relative z-10 font-bold">View Details</span>
              <ArrowRight
                size={16}
                className="relative z-10 transition-all duration-300 group-hover/btn:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
