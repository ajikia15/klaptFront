import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { LaptopT } from "../interfaces/laptopT";
import { useState, useCallback, useEffect } from "react";
import { CpuIcon } from "../assets/Icons";
import { GpuIcon } from "../assets/Icons";
import { RamIcon } from "../assets/Icons";
import { StorageIcon } from "../assets/Icons";
import { DisplayIcon } from "../assets/Icons";
import { InfoIcon } from "../assets/Icons";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
import { Badge } from "@/components/ui/badge"; // Assuming Badge component is available

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
import { LaptopDetailSkeleton } from "./LaptopDetailSkeleton";
import { Button } from "@/components/ui/button";

export default function LaptopDetailPage() {
  const { t, i18n } = useTranslation(); // Add i18n here
  const { laptopId } = useParams({ from: "/laptop/$laptopId" });
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Embla carousel state for images
  const [emblaRef, emblaApi] = useEmblaCarousel({
    skipSnaps: false,
    loop: true,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = useCallback(
    (idx: number) => {
      if (emblaApi) emblaApi.scrollTo(idx);
    },
    [emblaApi]
  );

  const {
    data: laptop,
    isLoading,
    error,
  } = useQuery<LaptopT>({
    queryKey: ["laptop", laptopId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/${laptopId}`,
        { credentials: "include" }
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
          <h2 className="mb-4 text-2xl font-bold text-red-400">{t("error")}</h2>
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
            {t("notFound")}
          </h2>
          <p className="text-neutral-400">{t("laptopNotFound")}</p>
        </div>
      </div>
    );
  }

  const getDisplayDescription = () => {
    if (!laptop.description) return t("noDescriptionAvailable"); // Or some other placeholder
    const lang = i18n.language; // get current language
    if (lang === "ka" && laptop.description.ka) return laptop.description.ka;
    if (lang === "ru" && laptop.description.ru) return laptop.description.ru;
    if (laptop.description.en) return laptop.description.en;
    if (laptop.description.ka) return laptop.description.ka;
    if (laptop.description.ru) return laptop.description.ru;
    return t("noDescriptionAvailable");
  };

  const displayDescription = getDisplayDescription();
  const descriptionLength = displayDescription ? displayDescription.length : 0;

  const specGroups = [
    {
      title: t("spec.processor"),
      items: [
        {
          label: t("spec.cpuBrand"),
          value: laptop.processorBrand,
          Icon: CpuIcon,
        },
        {
          label: t("spec.cpuModel"),
          value: laptop.processorModel,
          Icon: CpuIcon,
        },
        { label: t("spec.cores"), value: laptop.cores, Icon: CpuIcon },
        { label: t("spec.threads"), value: laptop.threads, Icon: CpuIcon },
      ],
    },
    {
      title: t("spec.graphics"),
      items: [
        { label: t("spec.gpuType"), value: laptop.graphicsType, Icon: GpuIcon },
        { label: t("spec.gpuBrand"), value: laptop.gpuBrand, Icon: GpuIcon },
        { label: t("spec.gpuModel"), value: laptop.gpuModel, Icon: GpuIcon },
        {
          label: t("spec.vram"),
          value: laptop.vram ? `${laptop.vram}` : t("spec.na"),
          Icon: GpuIcon,
        },
      ],
    },
    {
      title: t("spec.memoryStorage"),
      items: [
        { label: t("spec.ram"), value: `${laptop.ram} GB`, Icon: RamIcon },
        { label: t("spec.ramType"), value: laptop.ramType, Icon: RamIcon },
        {
          label: t("spec.storageType"),
          value: laptop.storageType,
          Icon: StorageIcon,
        },
        {
          label: t("spec.storageCapacity"),
          value: laptop.storageCapacity,
          Icon: StorageIcon,
        },
      ],
    },
    {
      title: t("spec.display"),
      items: [
        {
          label: t("spec.screenSize"),
          value: `${laptop.screenSize}`,
          Icon: DisplayIcon,
        },
        {
          label: t("spec.resolution"),
          value: laptop.screenResolution,
          Icon: DisplayIcon,
        },
        {
          label: t("spec.refreshRate"),
          value: `${laptop.refreshRate}`,
          Icon: DisplayIcon,
        },
        {
          label: t("spec.backlightType"),
          value: laptop.backlightType || t("spec.na"),
          Icon: DisplayIcon,
        },
      ],
    },
    {
      title: t("spec.physical"),
      items: [
        {
          label: t("spec.weight"),
          value: laptop.weight || t("spec.na"),
          Icon: InfoIcon,
        },
        {
          label: t("spec.year"),
          value: laptop.year.toString(),
          Icon: InfoIcon,
        },
      ],
    },
  ];

  const keySpecs = [
    {
      title: t("spec.processor"),
      value: `${laptop.processorBrand} ${laptop.processorModel}`,
      details: `${laptop.cores} ${t("spec.cores")}, ${laptop.threads} ${t(
        "spec.threads"
      )}`,
      Icon: CpuIcon,
    },
    {
      title: t("spec.graphics"),
      value: `${laptop.gpuBrand} ${laptop.gpuModel}`,
      details: laptop.vram
        ? `${laptop.graphicsType}, ${laptop.vram}`
        : laptop.graphicsType,
      Icon: GpuIcon,
    },
    {
      title: t("spec.memory"),
      value: `${laptop.ram} ${laptop.ramType}`,
      details: null,
      Icon: RamIcon,
    },
    {
      title: t("spec.storage"),
      value: laptop.storageCapacity,
      details: laptop.storageType,
      Icon: StorageIcon,
    },
    {
      title: t("spec.display"),
      value: `${laptop.screenSize} ${laptop.screenResolution}`,
      details: `${laptop.refreshRate} ${t("spec.refreshRate")}`,
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
    <div className="min-h-screen bg-neutral-900 px-4 pb-16 pt-6 text-neutral-200">
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
              <BreadcrumbLink asChild>
                <Link to="/search">Search</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/search" search={{ brand: [laptop.brand] }}>
                  {laptop.brand}
                </Link>
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
          <div className="order-1 space-y-6">
            {/* Embla Carousel for main image area */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/5 to-purple-900/10"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,58,183,0.1),transparent_70%)]"></div>
              <div className="border-neutral-700/50 bg-neutral-800/50 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border p-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>
                <div
                  ref={emblaRef}
                  className="embla flex h-full w-full cursor-zoom-in select-none items-center justify-center overflow-hidden"
                  style={{ width: "100%", height: "100%" }}
                >
                  <div className="flex h-full w-full">
                    {laptop.images && laptop.images.length > 0 ? (
                      laptop.images.map((img, idx) => (
                        <div
                          className="flex h-full w-full flex-shrink-0 items-center justify-center"
                          key={img + idx}
                          role="group"
                          aria-roledescription="slide"
                          aria-label={`Image ${idx + 1} of ${
                            laptop.images.length
                          }`}
                          style={{ width: "100%", height: "100%" }}
                        >
                          <img
                            src={img}
                            alt={`${laptop.title} - view ${idx + 1}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://placehold.co/800x600/111827/444?text=No+Image`;
                            }}
                            className={`mx-auto max-h-[32vh] max-w-[40vw] rounded-2xl object-contain transition-transform duration-500 ease-out group-hover:scale-105`}
                            style={{ background: "transparent" }}
                            draggable={false}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-neutral-400">
                        <span>No images available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Thumbnails below carousel */}
            {laptop.images && laptop.images.length > 1 && (
              <div className="mt-2 flex gap-3 overflow-x-auto px-1 pb-2">
                {laptop.images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none ${
                      selectedIndex === index
                        ? "border-secondary-500 shadow-[0_0_10px_rgba(147,112,219,0.3)]"
                        : "border-neutral-700 opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => scrollTo(index)}
                    onMouseEnter={() => scrollTo(index)}
                    aria-label={`Go to image ${index + 1}`}
                    tabIndex={0}
                    type="button"
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
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="order-2">
            <div className="border-neutral-700/50 bg-neutral-800/90 relative mx-auto flex w-full flex-col overflow-hidden rounded-2xl border p-8 shadow-lg backdrop-blur-sm lg:mx-0 lg:w-auto">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.07),transparent_70%)]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>

              <div className="relative z-10">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  {" "}
                  {/* Added items-center */}
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
                  {laptop.isCertified && (
                    <Badge className="flex items-center gap-1 border-green-500/30 bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                      🗸
                      {t("certified")}
                    </Badge>
                  )}
                </div>

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
                      {laptop.price.toLocaleString("ge", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-invert prose-sm mb-6 max-w-none">
                  <p
                    className={`leading-relaxed text-neutral-300 transition-all duration-300 ${
                      showFullDescription ? "" : "line-clamp-5"
                    }`}
                    style={{
                      WebkitLineClamp: showFullDescription ? "unset" : 5,
                    }}
                  >
                    {displayDescription}
                  </p>
                  {descriptionLength > 300 && (
                    <button
                      className="mt-2 text-sm font-medium text-secondary-400 hover:underline focus:outline-none"
                      onClick={() => setShowFullDescription((v) => !v)}
                    >
                      {showFullDescription ? t("seeLess") : t("seeMore")}
                    </button>
                  )}
                </div>

                {/* Key Highlights - only show on mobile/tablet */}
                {isMobile && (
                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
                      {t("keySpecs")}
                    </h2>
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="border-neutral-700/30 bg-neutral-700/20 rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <CpuIcon size={18} className="text-secondary-400" />
                          <span className="text-neutral-200">
                            {laptop.processorBrand} {laptop.processorModel}
                          </span>
                        </div>
                      </div>
                      <div className="border-neutral-700/30 bg-neutral-700/20 rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <RamIcon size={18} className="text-secondary-400" />
                          <span className="text-neutral-200">
                            {laptop.ram} {laptop.ramType} RAM
                          </span>
                        </div>
                      </div>
                      <div className="border-neutral-700/30 bg-neutral-700/20 rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <GpuIcon size={18} className="text-secondary-400" />
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
                            {laptop.screenSize} {laptop.refreshRate} Display
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* End Key Highlights */}

                <Button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-secondary-600 p-6 text-xl font-semibold text-white shadow-md transition-all duration-300 hover:bg-secondary-700">
                  <PhoneIcon size={72} />
                  <span>{t("contact")}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          {!isMobile && (
            <>
              <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
                {t("keySpecifications")}
              </h2>

              <KeySpecsCard laptop={laptop} keySpecs={keySpecs} />
            </>
          )}

          <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
            {t("detailedSpecifications")}
          </h2>

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
            {t("additionalInformation")}
          </h2>

          <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            {laptop.weight && (
              <div>
                <h4 className="mb-1 text-sm uppercase tracking-wider text-neutral-500">
                  {t("spec.weight")}
                </h4>
                <div className="text-neutral-200">{laptop.weight}</div>
              </div>
            )}

            {laptop.backlightType && (
              <div>
                <h4 className="mb-1 text-sm uppercase tracking-wider text-neutral-500">
                  {t("spec.keyboardBacklight")}
                </h4>
                <div className="text-neutral-200">{laptop.backlightType}</div>
              </div>
            )}

            {laptop.year && (
              <div>
                <h4 className="mb-1 text-sm uppercase tracking-wider text-neutral-500">
                  {t("spec.releaseYear")}
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
