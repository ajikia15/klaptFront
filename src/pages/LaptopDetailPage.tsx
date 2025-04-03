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
import { MailIcon } from "../assets/Icons";
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

export default function LaptopDetailPage() {
  const { laptopId } = useParams({ from: "/laptop/$laptopId" });
  const [animationParent] = useAutoAnimate();
  const [selectedImage, setSelectedImage] = useState(0);

  const {
    data: laptop,
    isLoading,
    error,
  } = useQuery<LaptopT>({
    queryKey: ["laptop", laptopId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/laptops/${laptopId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch laptop details");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-secondary-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-secondary-500 text-sm font-medium">
              Loading
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-900 flex justify-center items-center">
        <div className="bg-neutral-800 border border-red-500/30 rounded-lg p-8 max-w-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-neutral-300">{error.toString()}</p>
        </div>
      </div>
    );
  }

  if (!laptop) {
    return (
      <div className="min-h-screen bg-neutral-900 flex justify-center items-center">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-8 max-w-lg">
          <h2 className="text-2xl font-bold text-neutral-200 mb-4">
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
    <div className="min-h-screen bg-neutral-900 text-neutral-200 pt-6 pb-16">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <div className="order-2 lg:order-1 space-y-6" ref={animationParent}>
            {/* Main Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-purple-900/10 rounded-2xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,58,183,0.1),transparent_70%)]"></div>
              <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 overflow-hidden aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <img
                  src={laptop.images[selectedImage] || laptop.images[0]}
                  alt={laptop.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/800x600/111827/444?text=No+Image`;
                  }}
                  className="max-h-[400px] max-w-full object-contain transition-transform duration-500 ease-out transform group-hover:scale-105"
                />
              </div>
            </div>

            {/* Thumbnails */}
            {laptop.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 px-1">
                {laptop.images.map((image, index) => (
                  <button
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
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl p-8 border border-neutral-700/50 h-full flex flex-col">
              <div className="flex gap-3 mb-6">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStockStatusColor(
                    laptop.stockStatus
                  )}`}
                >
                  {laptop.stockStatus.charAt(0).toUpperCase() +
                    laptop.stockStatus.slice(1)}
                </span>

                {laptop.year && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full border border-neutral-700 text-neutral-400 bg-neutral-800/50">
                    {laptop.year}
                  </span>
                )}
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-secondary-400 uppercase tracking-wider">
                  {laptop.brand} {laptop.model}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                {laptop.title}
              </h1>

              <div className="mb-6">
                <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-secondary-300">
                  $
                  {laptop.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="prose prose-invert prose-sm max-w-none mb-8">
                <p className="text-neutral-300 leading-relaxed">
                  {laptop.description}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Key Highlights
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <li className="flex items-start gap-2 text-neutral-300">
                    <span className="text-secondary-500 mt-0.5">•</span>
                    <span>
                      {laptop.processorBrand} {laptop.processorModel}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-300">
                    <span className="text-secondary-500 mt-0.5">•</span>
                    <span>
                      {laptop.ram} {laptop.ramType} RAM
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-300">
                    <span className="text-secondary-500 mt-0.5">•</span>
                    <span>
                      {laptop.gpuBrand} {laptop.gpuModel}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-300">
                    <span className="text-secondary-500 mt-0.5">•</span>
                    <span>
                      {laptop.screenSize}" {laptop.refreshRate}Hz Display
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto">
                <button className="w-full py-4 cursor-pointer px-6 flex items-center justify-center gap-3 text-white font-semibold rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50 animated-gradient">
                  <PhoneIcon size={24} />
                  <span>Contact Us</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Key Specifications
          </h2>

          {/* Replace the inline implementation with the imported component */}
          <KeySpecsCard laptop={laptop} keySpecs={keySpecs} />

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Detailed Specifications
          </h2>

          {/* Detailed Specs Section - with fixed padding */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {specGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl overflow-hidden border border-neutral-700/50 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(79,38,144,0.15)]"
              >
                <div className="px-6 py-4 border-b border-neutral-700/50 bg-neutral-800/50 flex items-center">
                  {group.items.length > 0 &&
                    (() => {
                      const IconComponent = group.items[0].Icon;
                      return (
                        <span className="text-secondary-400 mr-3">
                          <IconComponent size={18} />
                        </span>
                      );
                    })()}
                  <h3 className="text-lg font-semibold text-white">
                    {group.title}
                  </h3>
                </div>

                <div className="divide-y divide-neutral-700/30">
                  {group.items.map((spec, specIndex) => (
                    <div
                      key={specIndex}
                      className="px-6 py-2 grid grid-cols-2 transition-all duration-200 hover:bg-neutral-800/30 relative overflow-hidden group"
                    >
                      {/* Hover effect */}
                      <div className="absolute inset-y-0 left-0 w-1 bg-secondary-500/0 transition-all duration-300 group-hover:bg-secondary-500/50"></div>

                      <div className="text-neutral-400 text-sm flex items-center">
                        {spec.label}
                      </div>

                      <div className="text-neutral-200 font-medium flex items-center">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl p-8 border border-neutral-700/50">
          <h2 className="text-2xl font-bold text-white mb-6">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-10">
            {laptop.weight && (
              <div>
                <h4 className="text-sm uppercase tracking-wider text-neutral-500 mb-1">
                  Weight
                </h4>
                <div className="text-neutral-200">{laptop.weight}</div>
              </div>
            )}

            {laptop.backlightType && (
              <div>
                <h4 className="text-sm uppercase tracking-wider text-neutral-500 mb-1">
                  Keyboard Backlight
                </h4>
                <div className="text-neutral-200">{laptop.backlightType}</div>
              </div>
            )}

            {laptop.year && (
              <div>
                <h4 className="text-sm uppercase tracking-wider text-neutral-500 mb-1">
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
