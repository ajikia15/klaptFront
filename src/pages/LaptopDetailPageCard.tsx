import { JSX, ReactNode } from "react";
import { LaptopT } from "../interfaces/laptopT";

// Define the props for a single spec item
interface SpecItemProps {
  title: string;
  value: string;
  details: string | null;
  Icon: (props: { size?: number; className?: string }) => JSX.Element;
}

// Define the props for the key specs component
interface KeySpecsCardProps {
  laptop: LaptopT;
  keySpecs: SpecItemProps[];
}

const KeySpecsCard = ({ laptop, keySpecs }: KeySpecsCardProps) => {
  // Function to determine brand-specific class based on component type
  const getBrandClasses = (specTitle: string): string => {
    if (
      specTitle === "Graphics" &&
      laptop?.gpuBrand.toLowerCase().includes("nvidia")
    ) {
      return "brand-nvidia";
    }
    if (
      specTitle === "Processor" &&
      laptop?.processorBrand.toLowerCase().includes("amd")
    ) {
      return "brand-amd";
    }
    if (
      specTitle === "Processor" &&
      laptop?.processorBrand.toLowerCase().includes("intel")
    ) {
      return "brand-intel";
    }
    return "";
  };

  return (
    <div className="relative overflow-hidden bg-neutral-900 rounded-2xl border border-neutral-700/50 mb-10">
      {/* Background gradients with Tailwind */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(103,58,183,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="grid grid-cols-1 md:grid-cols-5 relative z-10">
        {keySpecs.map((spec, index) => (
          <div
            key={index}
            className={`group relative p-6 md:p-8 transition-all duration-300 border-b md:border-b-0 md:border-r border-neutral-700/30 last:border-r-0 last:border-b-0 hover:bg-neutral-800/30 hover:-translate-y-0.5 ${getBrandClasses(
              spec.title
            )}`}
          >
            {/* Corner accent with basic positioning in Tailwind */}
            <div className="absolute -top-10 -right-10 w-20 h-20 opacity-0 corner-accent"></div>

            <div className="flex items-center gap-3 mb-4">
              {/* Icon container with basic styling in Tailwind */}
              <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-600/50 flex items-center justify-center relative transition-all duration-500 spec-icon-container">
                <div className="absolute inset-0 rounded-full opacity-0 spec-icon-pulse"></div>
                <div className="flex items-center justify-center">
                  <spec.Icon
                    size={22}
                    className="!text-secondary-400 spec-icon"
                  />
                </div>
              </div>
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider group-hover:text-secondary-300 group-hover:translate-x-1 transition-all duration-300">
                {spec.title}
              </h3>
            </div>

            <div className="relative overflow-hidden">
              <p className="text-white font-medium text-lg md:text-xl mb-2 transition-colors duration-300 group-hover:text-neutral-50">
                {spec.value}
              </p>

              {spec.details && (
                <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                  {spec.details}
                </p>
              )}
            </div>

            {/* Underline effect with basic positioning in Tailwind */}
            <div className="absolute bottom-0 left-0 w-0 h-0.5 underline-effect"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeySpecsCard;
