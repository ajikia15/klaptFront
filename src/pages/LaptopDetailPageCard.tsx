import { JSX } from "react";
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
    <div className="border-neutral-700/50 relative mb-10 overflow-hidden rounded-2xl border bg-neutral-900">
      {/* Background gradients with Tailwind */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(103,58,183,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-5">
        {keySpecs.map((spec, index) => (
          <div
            key={index}
            className={`spec-card group relative p-6 md:p-8 transition-all duration-300 border-b md:border-b-0 md:border-r border-neutral-700/30 last:border-r-0 last:border-b-0 hover:bg-neutral-800/30 hover:-translate-y-0.5 ${getBrandClasses(
              spec.title
            )}`}
          >
            {/* Corner accent with basic positioning in Tailwind */}
            <div className="corner-accent absolute -right-10 -top-10 h-20 w-20 opacity-0"></div>

            <div className="mb-4 flex items-center gap-3">
              {/* Icon container with basic styling in Tailwind */}
              <div className="border-neutral-600/50 spec-icon-container relative flex h-12 w-12 items-center justify-center rounded-full border bg-neutral-800 transition-all duration-500">
                <div className="spec-icon-pulse absolute inset-0 rounded-full opacity-0"></div>
                <div className="flex items-center justify-center">
                  <spec.Icon
                    size={22}
                    className="spec-icon !text-secondary-400"
                  />
                </div>
              </div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-secondary-300">
                {spec.title}
              </h3>
            </div>

            <div className="relative overflow-hidden">
              <p className="spec-value mb-2 text-lg font-medium text-white transition-colors duration-300 group-hover:text-neutral-50 md:text-xl">
                {spec.value}
              </p>

              {spec.details && (
                <p className="text-sm text-neutral-400 transition-colors duration-300 group-hover:text-neutral-300">
                  {spec.details}
                </p>
              )}
            </div>

            {/* Underline effect with basic positioning in Tailwind */}
            <div className="underline-effect absolute bottom-0 left-0 h-0.5 w-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeySpecsCard;
