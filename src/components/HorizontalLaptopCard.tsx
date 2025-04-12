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
    <Link to={`/`} className="w-full">
      <div className="bg-gradient-to-r from-neutral-800/80 to-neutral-800/60 rounded-xl overflow-hidden border border-neutral-700/50 h-[140px] relative">
        <div className="flex h-full">
          {/* Image area */}
          <div className="w-1/3 bg-gradient-to-br from-neutral-900/70 to-neutral-800/70 p-2 relative overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-contain rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://placehold.co/200x200/201E30/444?text=No+Image";
              }}
            />

            {/* New badge */}
            <div className="absolute top-2 right-2">
              <div className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center shadow-md">
                <Clock size={10} className="mr-1" /> New
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
                {title}
              </h3>
              <p className="text-neutral-300 text-xs mb-1 line-clamp-2">
                {shortDesc}
              </p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-bold text-green-400">
                ₾{price.toLocaleString()}
              </span>
              <div className="flex items-center">
                <span className="text-xs text-neutral-400 mr-1">Details</span>
                <ArrowRight size={12} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalLaptopCard;
