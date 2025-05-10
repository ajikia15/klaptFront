import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Maximize2 } from "@deemlol/next-icons";
import { Badge } from "@/components/ui/badge";
import HeartBtn from "./HeartBtn";
import { LaptopT } from "@/interfaces/laptopT";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

interface LaptopCardProps extends LaptopT {
  isAuthenticated: boolean;
  tags?: string[];
}

export const LaptopCard: FC<LaptopCardProps> = (laptop) => {
  const { t } = useTranslation();

  return (
    <div className="group/card border-neutral-700/30 group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 transition-all duration-300">
      <Link
        to="/laptop/$laptopId"
        params={{ laptopId: laptop.id.toString() }}
        className="relative w-full px-6 pb-4 pt-6"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent"></div>
        <div className="z-5 absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40"></div>
        {laptop.images ? (
          <div className="relative z-10 flex h-36 items-center justify-center transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
            <img
              src={laptop.images[0]}
              alt={laptop.title}
              className="h-full object-contain drop-shadow-[0_10px_10px_rgba(138,43,226,0.15)]"
            />
          </div>
        ) : (
          <div className="flex h-36 w-full items-center justify-center rounded-lg border border-dashed border-neutral-700 text-neutral-500">
            <span>{t("noImageAvailable")}</span>
          </div>
        )}

        <div className="absolute right-3 top-3 z-20 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            className="h-10 w-10 border-0"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Maximize2 size={20} className="text-white" />
          </Button>
          {laptop.isAuthenticated && ( // TODO: dont fetch when not authenticated instead of disabling the button
            <HeartBtn
              laptopId={laptop.id}
              className="hover:bg-neutral-800/60 dark:hover:bg-neutral-800/8 rounded-lg border-0 bg-background p-2 text-foreground shadow-lg transition-colors duration-200 hover:border-primary-400 dark:text-neutral-100 dark:hover:border-primary-400"
              isAuthenticated={laptop.isAuthenticated}
            />
          )}
        </div>
      </Link>

      <div className="bg-neutral-800/60 relative flex flex-grow flex-col p-5 before:absolute before:left-[10%] before:right-[10%] before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-purple-500/30 before:to-transparent">
        <div className="flex flex-grow flex-col">
          <Link
            to="/laptop/$laptopId"
            params={{ laptopId: laptop.id.toString() }}
            className="inline-block"
          >
            <h3 className="mb-2 line-clamp-1 text-xl font-bold text-white transition-colors hover:text-purple-400">
              {laptop.title}
            </h3>
          </Link>

          <div className="mb-4 line-clamp-2 space-x-2 space-y-1">
            {laptop.gpuBrand.toLowerCase().includes("nvidia") && (
              <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-green-600/80 hover:text-neutral-100">
                <Link to="/search" search={{ gpuModel: [laptop.gpuModel] }}>
                  {laptop.gpuModel}
                </Link>
              </Badge>
            )}
            {laptop.gpuBrand.toLowerCase().includes("AMD") && (
              <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-red-500/80 hover:text-neutral-100">
                <Link to="/search" search={{ gpuModel: [laptop.gpuModel] }}>
                  {laptop.gpuModel}
                </Link>
              </Badge>
            )}
            {laptop.processorBrand.includes("Intel") && (
              <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-blue-500/80 hover:text-neutral-100">
                <Link
                  to="/search"
                  search={{ processorModel: [laptop.processorModel] }}
                >
                  {laptop.processorModel}
                </Link>
              </Badge>
            )}
            {laptop.processorBrand.toLowerCase().includes("amd") && (
              <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-red-500/80 hover:text-neutral-100">
                <Link
                  to="/search"
                  search={{ processorModel: [laptop.processorModel] }}
                >
                  {laptop.processorModel}
                </Link>
              </Badge>
            )}
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-neutral-700 hover:text-neutral-100">
              <Link
                to="/search"
                search={{ refreshRate: [laptop.refreshRate.toString()] }}
              >
                {laptop.refreshRate}
              </Link>
            </Badge>
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-neutral-700 hover:text-neutral-100">
              <Link
                to="/search"
                search={{ storageCapacity: [laptop.storageCapacity] }}
              >
                {laptop.storageCapacity}
              </Link>
            </Badge>
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-neutral-700 hover:text-neutral-100">
              <Link to="/search" search={{ ram: [laptop.ram.toString()] }}>
                {laptop.ram}
              </Link>
            </Badge>
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-neutral-700 hover:text-neutral-100">
              <Link to="/search" search={{ ramType: [laptop.ramType] }}>
                {laptop.ramType}
              </Link>
            </Badge>
            <Badge className="border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-neutral-700 hover:text-neutral-100">
              <Link
                to="/search"
                search={{ screenResolution: [laptop.screenResolution] }}
              >
                {laptop.screenResolution}
              </Link>
            </Badge>

            {/* <Badge className="bg-blue-600/80 font-bold">Intel Core</Badge> */}
          </div>

          {/* Display laptop tags */}

          <div className="border-neutral-700/50 mt-auto flex items-center justify-between border-t pt-3">
            <div className="font-bold text-purple-300">
              <span className="block text-sm text-neutral-400">
                {t("price")}
              </span>
              ${laptop.price.toLocaleString()}
            </div>

            <Link
              to="/laptop/$laptopId"
              params={{ laptopId: laptop.id.toString() }}
            >
              <Button variant={"secondary"} className="group/btn font-bold">
                {t("details")}
                <ArrowRight
                  size={16}
                  className="relative z-10 transition-all duration-300 group-hover/btn:translate-x-1"
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
