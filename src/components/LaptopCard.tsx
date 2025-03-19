import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "@deemlol/next-icons";

interface LaptopCardProps {
  id: number;
  title: string;
  price: number;
  description?: string;
  image?: string;
}

export const LaptopCard: FC<LaptopCardProps> = ({
  id,
  title,
  price,
  description = "",
  image,
}) => {
  return (
    <Link
      to="/laptop/$laptopId"
      params={{ laptopId: id.toString() }}
      className=" bg-neutral-900 overflow-hidden hover:shadow-xl transition-all duration-300  rounded-xl border border-neutral-700"
    >
      <div className="relative">
        {/* Image Container */}
        <div className="h-40 mb-4 flex items-center justify-center">
          {image ? (
            <img src={image} alt={title} className="h-full object-contain" />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-neutral-800 rounded-md">
              <span className="text-neutral-400">No image available</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2 bg-neutral-800 p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-white">{title}</h3>

          {/* Specs/Description */}
          <p className="text-sm text-neutral-400 line-clamp-2">{description}</p>

          {/* Price and Button Row */}
          <div className="flex items-center justify-between pt-3">
            <div className="bg-purple-900/40 px-3 py-1 rounded-md">
              <span className="text-purple-300 font-bold">
                {price.toLocaleString()} $
              </span>
            </div>

            <button className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-1 rounded-md text-white font-medium flex items-center gap-1">
              Details
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
