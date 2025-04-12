import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";

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
      className="w-full block"
    >
      <div className="group relative rounded-xl overflow-hidden border border-neutral-700/30 h-36 transition-all duration-300 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 hover:border-neutral-600/50 hover:shadow-lg hover:shadow-purple-900/20">
        <div className="flex h-full">
          {/* Image area */}
          <div className="w-1/3 relative overflow-hidden bg-gradient-to-br from-neutral-800/80 to-black/80 p-3">
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent"></div>

            {/* Image with hover effect - removing scale animation */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-contain "
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://placehold.co/200x200/201E30/444?text=No+Image";
                }}
              />
            </div>

            {/* New badge */}
            <div className="absolute top-2 right-2 z-20">
              <div className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center">
                <Clock size={10} className="mr-1" /> New
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="w-2/3 p-4 flex flex-col justify-between relative before:absolute before:left-0 before:top-[10%] before:bottom-[10%] before:w-[1px] before:bg-neutral-700">
            <div>
              <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-1">
                {title}
              </h3>
              <p className="text-sm text-neutral-400 mb-1 line-clamp-2">
                {shortDesc.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="text-purple-300 font-bold">
                <span className="text-sm text-neutral-400 block">Price</span>₾
                {price.toLocaleString()}
              </div>
              {/* More visible, clickable button */}
              <button className="bg-secondary-600 hover:bg-secondary-500 px-3.5 py-1.5 rounded-md text-white text-sm font-bold flex items-center gap-1.5 transition-colors">
                View Details
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalLaptopCard;
