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
    icon: <Zap size={32} className="text-purple-400" />,
    labelKey: "rtx4090",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: <Monitor size={32} className="text-blue-400" />,
    labelKey: "display240hz",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <ShieldCheck size={32} className="text-green-400" />,
    labelKey: "warranty2year",
    color: "from-green-500 to-emerald-400",
  },
  {
    icon: <Cpu size={32} className="text-orange-400" />,
    labelKey: "intelI9",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: <Battery size={32} className="text-yellow-400" />,
    labelKey: "battery6h",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: <Wifi size={32} className="text-sky-400" />,
    labelKey: "wifi6e",
    color: "from-sky-400 to-blue-500",
  },
  {
    icon: <HardDrive size={32} className="text-emerald-400" />,
    labelKey: "ssd2tb",
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: <Headphones size={32} className="text-indigo-400" />,
    labelKey: "hifiAudio",
    color: "from-indigo-500 to-purple-400",
  },
];

interface FeatureCardProps {
  feature: FeatureCardData;
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-neutral-900/80 relative flex h-[120px] min-w-[90px] flex-col items-center justify-center rounded-2xl border border-neutral-700 px-4 py-4 shadow-xl">
      <div className="mb-2 flex items-center justify-center">
        {feature.icon}
      </div>
      <div className="flex h-[2.5em] items-center justify-center text-center text-base font-bold text-white">
        {t(feature.labelKey)}
      </div>
      <div
        className={`absolute -z-10 left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${feature.color} opacity-30 blur-2xl`}
      />
    </div>
  );
};
