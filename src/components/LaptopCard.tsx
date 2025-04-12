import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Maximize2 } from "@deemlol/next-icons";

import HeartBtn from "./HeartBtn";

interface LaptopCardProps {
  id: number;
  title: string;
  price: number;
  shortDesc: string;
  image: string;
  isAuthenticated: boolean;
}

export const LaptopCard: FC<LaptopCardProps> = ({
  id,
  title,
  price,
  shortDesc,
  image,
  isAuthenticated,
}) => {
  return (
    <div className="group relative flex flex-col h-full rounded-2xl transition-all duration-300 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 border border-neutral-700/30 overflow-hidden">
      {/* Image area with floating effect */}
      <div className="group/image relative w-full pt-10 pb-6 px-6">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent"></div>

        {/* Dark overlay that appears on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 transition-all duration-300"></div>

        {image ? (
          <div className="relative z-10 flex items-center justify-center h-48 transition-all duration-500 group-hover/image:translate-y-[-8px] group-hover/image:scale-[1.02]">
            <img
              src={image}
              alt={title}
              className="h-full object-contain drop-shadow-[0_10px_10px_rgba(138,43,226,0.15)]"
            />
          </div>
        ) : (
          <div className="h-48 w-full flex items-center justify-center text-neutral-500 border border-dashed border-neutral-700 rounded-lg">
            <span>No image available</span>
          </div>
        )}

        {/* Action buttons - appear on hover */}
        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transform translate-y-2 group-hover/image:opacity-100 group-hover/image:translate-y-0 transition-all duration-300">
          <button className="bg-neutral-800/90 hover:bg-purple-800/90 p-2 rounded-lg shadow-lg transition-all w-10 h-10 flex items-center justify-center">
            <Maximize2 size={18} className="text-white" />
          </button>
          <HeartBtn
            laptopId={id}
            className="bg-neutral-800/90 hover:bg-purple-800/90 p-2 rounded-lg shadow-lg transition-all"
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      {/* Content section with subtle divider */}
      <div className="relative flex flex-col flex-grow p-5 bg-neutral-900/80 before:absolute before:top-0 before:left-[10%] before:right-[10%] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-purple-500/30 before:to-transparent">
        <Link
          to="/laptop/$laptopId"
          params={{ laptopId: id.toString() }}
          className="flex flex-col flex-grow"
        >
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 hover:text-purple-400 transition-colors">
            {title}
          </h3>

          <p className="text-sm text-neutral-400 line-clamp-2 mb-5">
            {shortDesc.toUpperCase()}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="text-purple-300 font-bold">
              <span className="text-xs text-neutral-400 block">Price</span>$
              {price.toLocaleString()}
            </div>

            <button className="bg-transparent hover:bg-purple-800 border border-purple-700 px-4 py-1.5 rounded-lg text-white text-sm font-medium flex items-center gap-1 group/btn transition-all">
              Details
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};
