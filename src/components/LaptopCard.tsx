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
    <div className="relative max-h-84 bg-neutral-900 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-xl border border-neutral-800 hover:border-purple-700/40">
      <div className="h-40 p-2 flex items-center justify-center relative">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full object-contain transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-neutral-800 rounded-md">
            <span className="text-neutral-400">No image available</span>
          </div>
        )}
        <div className="absolute inset-0 gap-2 bg-black/0 hover:bg-black/50 transition-all duration-300 group flex items-center justify-center">
          <button className="bg-black/70 p-2 rounded-lg cursor-pointer opacity-0 hover:opacity-100 hover:bg-black/90 transition-all group-hover:opacity-50">
            <Maximize2 size={24} />
          </button>
          <HeartBtn
            laptopId={id}
            className={
              "bg-black/70 p-2 rounded-lg cursor-pointer opacity-0 hover:opacity-100 hover:bg-black/90 transition-all group-hover:opacity-50"
            }
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      <Link
        to="/laptop/$laptopId"
        params={{ laptopId: id.toString() }}
        className=" "
      >
        <div className="space-y-2 bg-neutral-800 p-4">
          <h3 className="text-xl font-extrabold text-white line-clamp-1 transition-colors duration-300">
            {title}
          </h3>

          <p className="text-neutral-200 line-clamp-2">
            {shortDesc.toUpperCase()}
          </p>

          <div className="flex items-center justify-between pt-3">
            <div className="bg-purple-900/40 px-3 py-1 rounded-md transition-all duration-300 hover:bg-purple-900/60">
              <span className="text-purple-300 font-bold">
                {price.toLocaleString()} $
              </span>
            </div>

            <button className="bg-secondary-500 hover:bg-secondary-600 font-bold transition-all duration-300 px-4 py-2 cursor-pointer rounded-md text-white flex items-center gap-1 group">
              Details
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};
