import { FC } from "react";
import { Link } from "@tanstack/react-router";

interface LaptopCardProps {
  id: number;
  title: string;
  price: number;
  image?: string;
}

export const LaptopCard: FC<LaptopCardProps> = ({
  id,
  title,
  price,
  image,
}) => {
  return (
    <Link
      to="/laptop/$laptopId"
      params={{ laptopId: id.toString() }}
      className="block bg-neutral-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 bg-neutral-700">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-neutral-400">No image available</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-primary-200 mb-2">{title}</h3>
        <p className="text-secondary-300 text-lg font-bold">
          ${price.toLocaleString()}
        </p>
      </div>

      <div className="p-4 bg-neutral-700">
        <span className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md text-center transition-colors duration-300">
          View Details
        </span>
      </div>
    </Link>
  );
};
