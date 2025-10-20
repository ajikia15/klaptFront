import { LaptopT } from "@/interfaces/laptopT";
import { Link } from "@tanstack/react-router";

type Props = LaptopT & { isAuthenticated: boolean };

export default function HorizontalCard(laptop: Props) {
  return (
    <div className="min-h-56 relative grid aspect-[2/1] w-full grid-cols-2 gap-2 rounded-xl bg-neutral-800 p-3">
      <Link
        to="/laptop/$laptopId"
        params={{ laptopId: laptop.id.toString() }}
        className="flex items-center justify-center overflow-hidden"
      >
        {laptop.images?.length ? (
          <img
            src={laptop.images[0]}
            alt={laptop.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-neutral-700 text-neutral-500">
            <span>No image</span>
          </div>
        )}
      </Link>
      <div className="flex min-w-0 flex-col justify-between py-2 pr-1">
        <div className="min-w-0">
          <Link
            to="/laptop/$laptopId"
            params={{ laptopId: laptop.id.toString() }}
            className="block"
          >
            <h3 className="line-clamp-2 font-semibold text-white">
              {laptop.title}
            </h3>
          </Link>
          <div className="mt-1 flex flex-wrap gap-1 text-xs text-neutral-300">
            {laptop.processorModel && (
              <span className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-0.5">
                {laptop.processorModel}
              </span>
            )}
            {laptop.gpuModel && (
              <span className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-0.5">
                {laptop.gpuModel}
              </span>
            )}
            {laptop.ram && (
              <span className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-0.5">
                {laptop.ram}
              </span>
            )}
            {laptop.storageCapacity && (
              <span className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-0.5">
                {laptop.storageCapacity}
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-bold text-purple-300">
            ${laptop.price.toLocaleString()}
          </div>
          <Link
            to="/laptop/$laptopId"
            params={{ laptopId: laptop.id.toString() }}
            className="rounded-md bg-secondary-500/20 px-3 py-1 text-sm text-secondary-300 transition hover:bg-secondary-500/30"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
