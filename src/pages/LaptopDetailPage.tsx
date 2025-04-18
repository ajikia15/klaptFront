import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { LaptopT } from "../interfaces/laptopT";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CpuIcon } from "../assets/Icons";
import { GpuIcon } from "../assets/Icons";
import { RamIcon } from "../assets/Icons";
import { StorageIcon } from "../assets/Icons";
import { DisplayIcon } from "../assets/Icons";
import { InfoIcon } from "../assets/Icons";
import { useMediaQuery } from "../hooks/useMediaQuery";

import "./laptopDetailPage.css";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PhoneIcon } from "lucide-react";
import KeySpecsCard from "./LaptopDetailPageCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { LaptopDetailSkeleton } from "./LaptopDetailSkeleton";
import { Button } from "@/components/ui/button";

export default function LaptopDetailPage() {
  const { laptopId } = useParams({ from: "/laptop/$laptopId" });
  const [animationParent] = useAutoAnimate();
  const [selectedImage, setSelectedImage] = useState(0);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const {
    data: laptop,
    isLoading,
    error,
  } = useQuery<LaptopT>({
    queryKey: ["laptop", laptopId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/${laptopId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch laptop details");
      }
      return response.json();
    },
  });

  // Replace loading spinner with skeleton loader
  if (isLoading) {
    return <LaptopDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="max-w-lg rounded-lg border border-red-500/30 bg-neutral-800 p-8">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Error</h2>
          <p className="text-neutral-300">{error.toString()}</p>
        </div>
      </div>
    );
  }

  if (!laptop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="max-w-lg rounded-lg border border-neutral-700 bg-neutral-800 p-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-200">
            Not Found
          </h2>
          <p className="text-neutral-400">
            The laptop you're looking for could not be found.
          </p>
        </div>
      </div>
    );
  }

  const specGroups = [
    {
      title: "Processor",
      items: [
        {
          label: "CPU Brand",
          value: laptop.processorBrand,
          Icon: CpuIcon,
        },
        {
          label: "CPU Model",
          value: laptop.processorModel,
          Icon: CpuIcon,
        },
        {
          label: "Cores",
          value: laptop.cores,
          Icon: CpuIcon,
        },
        {
          label: "Threads",
          value: laptop.threads,
          Icon: CpuIcon,
        },
      ],
    },
    {
      title: "Graphics",
      items: [
        {
          label: "GPU Type",
          value: laptop.graphicsType,
          Icon: GpuIcon,
        },
        {
          label: "GPU Brand",
          value: laptop.gpuBrand,
          Icon: GpuIcon,
        },
        {
          label: "GPU Model",
          value: laptop.gpuModel,
          Icon: GpuIcon,
        },
        {
          label: "VRAM",
          value: laptop.vram ? `${laptop.vram} GB` : "N/A",
          Icon: GpuIcon,
        },
      ],
    },
    {
      title: "Memory & Storage",
      items: [
        {
          label: "RAM",
          value: `${laptop.ram} GB`,
          Icon: RamIcon,
        },
        {
          label: "RAM Type",
          value: laptop.ramType,
          Icon: RamIcon,
        },
        {
          label: "Storage Type",
          value: laptop.storageType,
          Icon: StorageIcon,
        },
        {
          label: "Storage Capacity",
          value: laptop.storageCapacity,
          Icon: StorageIcon,
        },
      ],
    },
    {
      title: "Display",
      items: [
        {
          label: "Screen Size",
          value: `${laptop.screenSize}"`,
          Icon: DisplayIcon,
        },
        {
          label: "Resolution",
          value: laptop.screenResolution,
          Icon: DisplayIcon,
        },
        {
          label: "Refresh Rate",
          value: `${laptop.refreshRate} Hz`,
          Icon: DisplayIcon,
        },
        {
          label: "Backlight Type",
          value: laptop.backlightType || "N/A",
          Icon: DisplayIcon,
        },
      ],
    },
    {
      title: "Physical",
      items: [
        {
          label: "Weight",
          value: laptop.weight || "N/A",
          Icon: InfoIcon,
        },
        {
          label: "Year",
          value: laptop.year.toString(),
          Icon: InfoIcon,
        },
      ],
    },
  ];

  const keySpecs = [
    {
      title: "Processor",
      value: `${laptop.processorBrand} ${laptop.processorModel}`,
      details: `${laptop.cores} Cores, ${laptop.threads} Threads`,
      Icon: CpuIcon,
    },
    {
      title: "Graphics",
      value: `${laptop.gpuBrand} ${laptop.gpuModel}`,
      details: laptop.vram
        ? `${laptop.graphicsType}, ${laptop.vram}GB VRAM`
        : laptop.graphicsType,
      Icon: GpuIcon,
    },
    {
      title: "Memory",
      value: `${laptop.ram}GB ${laptop.ramType}`,
      details: null,
      Icon: RamIcon,
    },
    {
      title: "Storage",
      value: laptop.storageCapacity,
      details: laptop.storageType,
      Icon: StorageIcon,
    },
    {
      title: "Display",
      value: `${laptop.screenSize}" ${laptop.screenResolution}`,
      details: `${laptop.refreshRate}Hz Refresh Rate`,
      Icon: DisplayIcon,
    },
  ];

  const getStockStatusColor = (status: any) => {
    switch (status) {
      case "in stock":
        return "text-green-500 bg-green-900/20 border-green-900/30";
      case "reserved":
        return "text-yellow-500 bg-yellow-900/20 border-yellow-900/30";
      default:
        return "text-red-500 bg-red-900/20 border-red-900/30";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 pb-16 pt-6 text-neutral-200">
      <div className="container mx-auto">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-secondary-500">
                Search
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-secondary-500">
                {laptop.brand}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-neutral-300">
                {laptop.model}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Image Gallery - Now appears first on mobile */}
          <div className="order-1 space-y-6" ref={animationParent}>
            {/* Main Image */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/5 to-purple-900/10"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,58,183,0.1),transparent_70%)]"></div>
              <div className="border-neutral-700/50 bg-neutral-800/50 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border p-8">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>
                <img
                  src={laptop.images[selectedImage] || laptop.images[0]}
                  alt={laptop.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/800x600/111827/444?text=No+Image`;
                  }}
                  className="max-h-[400px] max-w-full transform object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Thumbnails */}
            {laptop.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto px-1 pb-2">
                {laptop.images.map((image, index) => (
                  <Button
                    key={index}
                    className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-secondary-500 shadow-[0_0_10px_rgba(147,112,219,0.3)]"
                        : "border-neutral-700 opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${laptop.title} - view ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://placehold.co/200x200/111827/444?text=No+Image`;
                      }}
                    />
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Details section - Now appears second on mobile */}
          <div className="order-2">
            <div className="border-neutral-700/50 bg-neutral-800/90 relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 shadow-lg backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.07),transparent_70%)]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>

              <div className="relative z-10">
                <div className="mb-6 flex flex-wrap gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStockStatusColor(
                      laptop.stockStatus
                    )}`}
                  >
                    {laptop.stockStatus.charAt(0).toUpperCase() +
                      laptop.stockStatus.slice(1)}
                  </span>

                  {laptop.year && (
                    <span className="bg-neutral-800/50 rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-300">
                      {laptop.year}
                    </span>
                  )}
                </div>

                {/* Brand & Model */}
                <div className="mb-2">
                  <span className="text-sm font-medium uppercase tracking-wider text-secondary-400">
                    {laptop.brand} {laptop.model}
                  </span>
                </div>

                <h1 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl">
                  {laptop.title}
                </h1>

                <div className="mb-6">
                  <div className="border-neutral-700/30 bg-neutral-800/80 inline-block rounded-md border px-3 py-2">
                    <span className="bg-gradient-to-r from-purple-400 to-secondary-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                      ₾
                      {laptop.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-invert prose-sm mb-8 max-w-none">
                  <p className="leading-relaxed text-neutral-300">
                    {laptop.description}
                  </p>
                </div>

                {/* Key Highlights as Accordion */}
                <div className="mb-8">
                  <Accordion
                    type="single"
                    defaultValue={isMobile ? "key-highlights" : undefined}
                    collapsible
                    className="bg-transparent"
                  >
                    <AccordionItem
                      value="key-highlights"
                      className="border-none"
                    >
                      <AccordionPrimitive.Trigger className="flex w-full items-center px-0 py-2 text-lg font-semibold text-white hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-5 rounded-full bg-secondary-500"></div>
                          <span>Key Highlights</span>
                        </div>
                      </AccordionPrimitive.Trigger>
                      <AccordionContent className="pl-7 pt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="border-neutral-700/30 bg-neutral-700/20 rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                              <CpuIcon
                                size={18}
                                className="text-secondary-400"
                              />
                              <span className="text-neutral-200">
                                {laptop.processorBrand} {laptop.processorModel}
                              </span>
                            </div>
                          </div>
                          <div className="border-neutral-700/30 bg-neutral-700/20 rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                              <RamIcon
                                size={18}
                                className="text-secondary-400"
                              />
                              <span className="text-neutral-200">
                                {laptop.ram} {laptop.ramType} RAM
                              </span>
                            </div>
                          </div>
                          <div className="border-neutral-700/30 bg-neutral-700/20 rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                              <GpuIcon
                                size={18}
                                className="text-secondary-400"
                              />
                              <span className="text-neutral-200">
                                {laptop.gpuBrand} {laptop.gpuModel}
                              </span>
                            </div>
                          </div>
                          <div className="border-neutral-700/30 bg-neutral-700/20 rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                              <DisplayIcon
                                size={18}
                                className="text-secondary-400"
                              />
                              <span className="text-neutral-200">
                                {laptop.screenSize}" {laptop.refreshRate}Hz
                                Display
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="mt-auto">
                  <Button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-secondary-600 px-6 py-4 font-semibold text-white shadow-md transition-all duration-300 hover:bg-secondary-700">
                    <PhoneIcon size={22} />
                    <span>Contact Us</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          {!isMobile && (
            <>
              <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
                Key Specifications
              </h2>

              {/* Replace the inline implementation with the imported component */}
              <KeySpecsCard laptop={laptop} keySpecs={keySpecs} />
            </>
          )}

          <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
            Detailed Specifications
          </h2>

          {/* Detailed Specs Section - with fixed padding */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {specGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="border-neutral-700/50 from-neutral-800/70 to-neutral-900/90 overflow-hidden rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:shadow-[0_4px_20px_rgba(79,38,144,0.15)]"
              >
                <div className="border-neutral-700/50 bg-neutral-800/50 flex items-center border-b px-6 py-4">
                  {group.items.length > 0 &&
                    (() => {
                      const IconComponent = group.items[0].Icon;
                      return (
                        <span className="mr-3 text-secondary-400">
                          <IconComponent size={18} />
                        </span>
                      );
                    })()}
                  <h3 className="text-lg font-semibold text-white">
                    {group.title}
                  </h3>
                </div>

                <div className="divide-neutral-700/30 divide-y">
                  {group.items.map((spec, specIndex) => (
                    <div
                      key={specIndex}
                      className="hover:bg-neutral-800/30 group relative grid grid-cols-2 overflow-hidden px-6 py-2 transition-all duration-200"
                    >
                      <div className="bg-secondary-500/0 group-hover:bg-secondary-500/50 absolute inset-y-0 left-0 w-1 transition-all duration-300"></div>

                      <div className="flex items-center text-sm text-neutral-400">
                        {spec.label}
                      </div>

                      <div className="flex items-center font-medium text-neutral-200">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-neutral-700/50 from-neutral-800/70 to-neutral-900/90 rounded-2xl border bg-gradient-to-br p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            {laptop.weight && (
              <div>
                <h4 className="mb-1 text-sm uppercase tracking-wider text-neutral-500">
                  Weight
                </h4>
                <div className="text-neutral-200">{laptop.weight}</div>
              </div>
            )}

            {laptop.backlightType && (
              <div>
                <h4 className="mb-1 text-sm uppercase tracking-wider text-neutral-500">
                  Keyboard Backlight
                </h4>
                <div className="text-neutral-200">{laptop.backlightType}</div>
              </div>
            )}

            {laptop.year && (
              <div>
                <h4 className="mb-1 text-sm uppercase tracking-wider text-neutral-500">
                  Release Year
                </h4>
                <div className="text-neutral-200">{laptop.year}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
