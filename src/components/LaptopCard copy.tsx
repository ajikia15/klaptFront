import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Maximize2 } from "@deemlol/next-icons";
import { Badge } from "@/components/ui/badge";
import HeartBtn from "./HeartBtn";
import LaptopTags from "./LaptopTags";
import { LaptopT } from "@/interfaces/laptopT";

interface LaptopCardProps extends LaptopT {
  isAuthenticated: boolean;
  tags?: string[];
}

export const LaptopCard: FC<LaptopCardProps> = (laptop) => {
  return (
    <div className="group relative flex flex-col h-full rounded-2xl transition-all duration-300 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 border border-neutral-700/30 overflow-hidden group/card">
      <div className="relative w-full pt-6 pb-4 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent"></div>
        {/* overlay is behind the image */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 z-5"></div>

        {laptop.images ? (
          <div className="relative z-10 flex items-center justify-center h-36 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
            <img
              src={laptop.images[0]}
              alt={laptop.title}
              className="h-full object-contain drop-shadow-[0_10px_10px_rgba(138,43,226,0.15)]"
            />
          </div>
        ) : (
          <div className="h-36 w-full flex items-center justify-center text-neutral-500 border border-dashed border-neutral-700 rounded-lg">
            <span>No image available</span>
          </div>
        )}

        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button className="cursor-pointer bg-neutral-800/70 hover:bg-purple-800/90 p-2 rounded-lg shadow-lg transition-all w-10 h-10 flex items-center justify-center">
            <Maximize2 size={20} className="text-white" />
          </button>
          <HeartBtn
            laptopId={laptop.id}
            className="bg-neutral-800/70 hover:bg-purple-800/90 p-2 rounded-lg shadow-lg transition-all"
            isAuthenticated={laptop.isAuthenticated}
          />
        </div>
      </div>

      <div className="relative flex flex-col flex-grow p-5 bg-neutral-800/60 before:absolute before:top-0 before:left-[10%] before:right-[10%] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-purple-500/30 before:to-transparent">
        <div className="flex flex-col flex-grow">
          <Link
            to="/laptop/$laptopId"
            params={{ laptopId: laptop.id.toString() }}
            className="inline-block"
          >
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 hover:text-purple-400 transition-colors">
              {laptop.title}
            </h3>
          </Link>

          <div className="mb-4 space-x-2 space-y-1">
            {laptop.gpuBrand.toLowerCase().includes("nvidia") && (
              <Badge className="bg-green-700/80 hover:bg-green-600/80 font-bold transition-all cursor-pointer shadow-sm border border-neutral-700/20">
                {laptop.gpuModel}
              </Badge>
            )}
            {laptop.gpuBrand.toLowerCase().includes("AMD") && (
              <Badge className="bg-red-600/80 hover:bg-red-500/80 font-bold transition-all cursor-pointer shadow-sm border border-neutral-700/20">
                {laptop.gpuModel}
              </Badge>
            )}
            {laptop.processorBrand.includes("Intel") && (
              <Badge className="bg-blue-600/80 hover:bg-blue-500/80 font-bold transition-all cursor-pointer shadow-sm border border-neutral-700/20">
                {laptop.processorModel}
              </Badge>
            )}
            {laptop.processorBrand.toLowerCase().includes("amd") && (
              <Badge className="bg-red-600/80 hover:bg-red-500/80 font-bold transition-all cursor-pointer shadow-sm border border-neutral-700/20">
                {laptop.processorModel}
              </Badge>
            )}
            <Badge className="font-bold bg-neutral-800  hover:bg-neutral-700 transition-all cursor-pointer shadow-sm border border-neutral-700/20">
              {laptop.refreshRate}Hz
            </Badge>
            <Badge className="font-bold bg-neutral-800  hover:bg-neutral-700 transition-all cursor-pointer shadow-sm border border-neutral-700/20">
              {laptop.storageCapacity}
            </Badge>
            <Badge className="font-bold bg-neutral-800  hover:bg-neutral-700 transition-all cursor-pointer shadow-sm border border-neutral-700/20">
              {laptop.ram}GB
            </Badge>
            <Badge className="font-bold bg-neutral-800  hover:bg-neutral-700 transition-all cursor-pointer shadow-sm border border-neutral-700/20">
              {laptop.ramType}
            </Badge>
            <Badge className="font-bold bg-neutral-800  hover:bg-neutral-700 transition-all cursor-pointer shadow-sm border border-neutral-700/20">
              {laptop.screenResolution}
            </Badge>

            {/* <Badge className="bg-blue-600/80 font-bold ">Intel Core</Badge> */}
          </div>

          {/* Display laptop tags */}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-700/50">
            <div className="text-purple-300 font-bold">
              <span className="text-sm text-neutral-400 block">Price</span>$
              {laptop.price.toLocaleString()}
            </div>

            <Link
              to="/laptop/$laptopId"
              params={{ laptopId: laptop.id.toString() }}
              className="relative overflow-hidden bg-secondary-700 hover:bg-secondary-700 px-4 py-2 rounded-md text-white text-base font-medium flex items-center gap-1.5 group/btn transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-500/0 before:via-secondary-400/50 before:to-primary-500/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-in-out cursor-pointer"
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
