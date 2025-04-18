import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "./ui/button";

interface HorizontalLaptopCardProps {
  id: number;
  title: string;
  price: number;
  shortDesc: string;
  image: string;
  isAuthenticated: boolean;
}

const HorizontalLaptopCard: FC<HorizontalLaptopCardProps> = ({
  id,
  title,
  price,
  shortDesc,
  image,
  isAuthenticated,
}) => {
  return (
    <Link
      to={`/laptop/$laptopId`}
      params={{ laptopId: id.toString() }}
      className="block w-full"
    >
      <div className="border-neutral-700/30 hover:border-neutral-600/50 group relative h-36 overflow-hidden rounded-xl border bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20">
        <div className="flex h-full">
          {/* Image area */}
          <div className="from-neutral-800/80 relative w-1/3 overflow-hidden bg-gradient-to-br to-black/80 p-3">
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent"></div>

            {/* Image with hover effect - removing scale animation */}
            <div className="relative z-10 flex h-full items-center justify-center">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://placehold.co/200x200/201E30/444?text=No+Image";
                }}
              />
            </div>

            {/* New badge */}
            <div className="absolute right-2 top-2 z-20">
              <div className="flex items-center rounded-md bg-green-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                <Clock size={10} className="mr-1" /> New
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="relative flex w-2/3 flex-col justify-between p-4 before:absolute before:bottom-[10%] before:left-0 before:top-[10%] before:w-[1px] before:bg-neutral-700">
            <div>
              <h3 className="mb-1.5 line-clamp-1 text-lg font-bold text-white">
                {title}
              </h3>
              <p className="mb-1 line-clamp-2 text-sm text-neutral-400">
                {shortDesc.toUpperCase()}
              </p>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <div className="font-bold text-purple-300">
                <span className="block text-sm text-neutral-400">Price</span>₾
                {price.toLocaleString()}
              </div>
              {/* More visible, clickable button */}
              <Button className="flex items-center gap-1.5 rounded-md bg-secondary-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-secondary-500">
                View Details
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalLaptopCard;
