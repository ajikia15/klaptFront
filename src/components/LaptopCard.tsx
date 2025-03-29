import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "@deemlol/next-icons";
import { Maximize2 } from "@deemlol/next-icons";
import {
  useAddToFavorites,
  useFavoriteStatus,
  useRemoveFromFavorites,
} from "@/hooks/useFavorites";

interface LaptopCardProps {
  id: number;
  title: string;
  price: number;
  shortDesc: string;
  image: string;
}

export const LaptopCard: FC<LaptopCardProps> = ({
  id,
  title,
  price,
  shortDesc,
  image,
}) => {
  const { data } = useFavoriteStatus(id);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  return (
    <div className="relative bg-neutral-900 overflow-hidden hover:shadow-xl transition-all duration-300  rounded-xl border border-neutral-700">
      {/* Image Container */}
      <div className="h-40 p-2 flex items-center justify-center relative">
        {image ? (
          <img src={image} alt={title} className="h-full object-contain" />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-neutral-800 rounded-md">
            <span className="text-neutral-400">No image available</span>
          </div>
        )}
        <div className="absolute inset-0 gap-2 bg-black/0 hover:bg-black/50 transition-all duration-300 group flex items-center justify-center ">
          <button className=" bg-black/70 p-2 rounded-lg cursor-pointer opacity-0 hover:opacity-100 transition-all group-hover:opacity-50">
            <Maximize2 size={24} />
          </button>
          {data !== null ? (
            <button
              className=" bg-black/70  text-red-400 p-2 rounded-lg cursor-pointer opacity-0 hover:opacity-100 transition-all group-hover:opacity-50"
              onClick={() => removeFromFavorites.mutate(id)}
            >
              <Heart size={24} />
            </button>
          ) : (
            <button
              className=" bg-black/70  p-2 rounded-lg cursor-pointer opacity-0 hover:opacity-100 transition-all group-hover:opacity-50"
              onClick={() => addToFavorites.mutate(id)}
            >
              <Heart size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <Link
        to="/laptop/$laptopId"
        params={{ laptopId: id.toString() }}
        className=" "
      >
        <div className="space-y-2 bg-neutral-800 p-4">
          {/* Title */}
          <h3 className="text-xl font-extrabold text-white line-clamp-1">
            {title}
          </h3>

          {/* Specs/Description */}
          <p className=" text-neutral-200 line-clamp-2">
            {shortDesc.toUpperCase()}
          </p>

          {/* Price and Button Row */}
          <div className="flex items-center justify-between pt-3">
            <div className="bg-purple-900/40 px-3 py-1 rounded-md">
              <span className="text-purple-300 font-bold">
                {price.toLocaleString()} $
              </span>
            </div>

            <button className="bg-secondary-500 hover:bg-secondary-600 font-bold transition-colors px-4 py-2 cursor-pointer rounded-md text-white  flex items-center gap-1">
              Details
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};
