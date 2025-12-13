import { LaptopT } from "@/interfaces/laptopT";
import { Link } from "@tanstack/react-router";
import { PartBadge } from "@/components/PartBadge";

type Props = LaptopT & { isAuthenticated: boolean };

export default function HorizontalCard(laptop: Props) {
  return (
    <div className="relative grid aspect-[2/1] w-full grid-cols-2 gap-2 rounded-xl bg-neutral-800 p-3">
      <Link
        to="/laptop/$laptopId"
        params={{ laptopId: laptop.id.toString() }}
        className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-lg"
      >
        {laptop.images?.length ? (
          <img
            src={laptop.images[0]}
            alt={laptop.title}
            className="h-auto max-h-full w-auto max-w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-neutral-700 text-neutral-500">
            <span>No image</span>
          </div>
        )}
      </Link>
      <div className="flex min-w-0 flex-col justify-center">
        <div className="min-w-0">
          <Link
            to="/laptop/$laptopId"
            params={{ laptopId: laptop.id.toString() }}
            className="mb-4 flex flex-col gap-1"
          >
            <h2 className="line-clamp-1 text-xl font-semibold text-white">
              {laptop.title.toUpperCase()}
            </h2>
            <h3 className="text-sm font-light text-neutral-400">
              Gaming | Rendering | Workstation
            </h3>
            <p className="font-bold text-purple-300">
              ${laptop.price.toLocaleString()}
            </p>
          </Link>
          <div className="mb-4 line-clamp-2 space-x-2 space-y-3">
            <PartBadge
              label={laptop.gpuModel}
              searchParam="gpuModel"
              searchValue={laptop.gpuModel}
              className="rounded-full border-neutral-700 p-3"
            />
            <PartBadge
              label={laptop.processorModel}
              searchParam="processorModel"
              searchValue={laptop.processorModel}
              className="rounded-full border-neutral-700 p-3"
            />
            <PartBadge
              label={laptop.refreshRate}
              searchParam="refreshRate"
              searchValue={laptop.refreshRate}
              className="rounded-full border-neutral-700 p-3"
            />
            <PartBadge
              label={laptop.storageCapacity}
              searchParam="storageCapacity"
              searchValue={laptop.storageCapacity}
              className="rounded-full border-neutral-700 p-3"
            />
            <PartBadge
              label={laptop.ram}
              searchParam="ram"
              searchValue={laptop.ram}
              className="rounded-full border-neutral-700 p-3"
            />
            <PartBadge
              label={laptop.ramType}
              searchParam="ramType"
              searchValue={laptop.ramType}
              className="rounded-full border-neutral-700 p-3"
            />
            <PartBadge
              label={laptop.screenResolution}
              searchParam="screenResolution"
              searchValue={laptop.screenResolution}
              className="rounded-full border-neutral-700 p-3"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Link
            to="/laptop/$laptopId"
            params={{ laptopId: laptop.id.toString() }}
            className="bg-secondary-500/20 hover:bg-secondary-500/30 rounded-md px-3 py-1 text-sm text-secondary-300 transition"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
