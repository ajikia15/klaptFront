import {
  ShieldCheck,
  Cpu,
  Monitor,
  Zap,
  Battery,
  Wifi,
  HardDrive,
  Headphones,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export interface FeatureCardData {
  icon: React.ReactNode;
  labelKey: string;
  color: string;
}

export const featuresData: FeatureCardData[] = [
  {
    icon: <Zap size={20} className="text-purple-400" />,
    labelKey: "rtx4090",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: <Monitor size={20} className="text-blue-400" />,
    labelKey: "display240hz",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <ShieldCheck size={20} className="text-green-400" />,
    labelKey: "warranty2year",
    color: "from-green-500 to-emerald-400",
  },
  {
    icon: <Cpu size={20} className="text-orange-400" />,
    labelKey: "intelI9",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: <Battery size={20} className="text-yellow-400" />,
    labelKey: "battery6h",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: <Wifi size={20} className="text-sky-400" />,
    labelKey: "wifi6e",
    color: "from-sky-400 to-blue-500",
  },
  {
    icon: <HardDrive size={20} className="text-emerald-400" />,
    labelKey: "ssd2tb",
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: <Headphones size={20} className="text-indigo-400" />,
    labelKey: "hifiAudio",
    color: "from-indigo-500 to-purple-400",
  },
];

interface FeatureCardProps {
  feature: FeatureCardData;
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  const { t } = useTranslation();
  const label = t(feature.labelKey) as string;
  const firstSpaceIndex = label.indexOf(" ");
  const hasTwoWords = firstSpaceIndex !== -1;
  return (
    <div className="bg-neutral-900/80 relative isolate flex aspect-square w-24 flex-col items-center justify-center rounded-2xl border border-neutral-700 px-2.5 py-2.5 shadow-xl sm:w-28 md:w-32">
      <div className="z-10 mb-2 flex items-center justify-center">
        {feature.icon}
      </div>
      <div className="z-10 flex h-[3em] items-center justify-center whitespace-normal break-words text-center text-sm font-bold leading-tight text-white sm:text-base">
        {hasTwoWords ? (
          <>
            {label.slice(0, firstSpaceIndex)}
            <br />
            {label.slice(firstSpaceIndex + 1)}
          </>
        ) : (
          label
        )}
      </div>
      <div
        className={`pointer-events-none absolute z-0 left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${feature.color} opacity-30 blur-2xl`}
      />
    </div>
  );
};
