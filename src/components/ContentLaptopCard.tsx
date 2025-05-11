import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Archive,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface Laptop {
  id: number;
  title: string;
  price: number;
  userId: string | number;
  status: "pending" | "approved" | "rejected" | "archived";
  images?: string[];
  // Add isCertified and update description
  isCertified: boolean;
  description: {
    en?: string;
    ka?: string;
    ru?: string;
  };
}

interface ContentLaptopCardProps {
  laptop: Laptop;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
}

export default function ContentLaptopCard({
  laptop,
  onApprove,
  onReject,
  onDelete,
  onArchive,
}: ContentLaptopCardProps) {
  const { t } = useTranslation();
  // Status specific styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-900/30 text-green-400 border border-green-800/30";
      case "rejected":
        return "bg-red-900/30 text-red-400 border border-red-800/30";
      case "archived":
        return "bg-neutral-700/30 text-neutral-400 border border-neutral-600/30";
      default:
        return "bg-amber-900/30 text-amber-400 border border-amber-800/30";
    }
  };

  // Actions dropdown component
  function ActionsDropdown({ laptopId }: { laptopId: number }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              to="/laptop/$laptopId"
              params={{ laptopId: laptopId.toString() }}
              className="flex items-center"
            >
              <Eye className="mr-2 h-4 w-4 text-blue-400" />
              <span>{t("view")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onApprove(laptopId)}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
            <span>{t("approve")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onReject(laptopId)}>
            <XCircle className="mr-2 h-4 w-4 text-red-400" />
            <span>{t("reject")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onArchive(laptopId)}>
            <Archive className="mr-2 h-4 w-4 text-amber-400" />
            <span>{t("archive")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(laptopId)}>
            <Trash2 className="mr-2 h-4 w-4 text-red-400" />
            <span>{t("delete")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="bg-neutral-800/30 border-neutral-700/30 hover:bg-neutral-800/50 block border-b transition-colors md:grid md:grid-cols-12">
      {/* Mobile card view */}
      <div className="p-4 md:hidden">
        <div className="mb-3 flex items-start">
          {laptop.images && laptop.images.length > 0 && (
            <img
              src={laptop.images[0]}
              alt={laptop.title}
              className="mr-3 h-16 w-16 flex-shrink-0 rounded object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="mb-1 font-medium">{laptop.title}</h3>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-amber-400">
                ${laptop.price}
              </span>
              <span className="text-sm text-neutral-400">
                {t("user")}: {laptop.userId || t("unknown")}
              </span>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${getStatusStyle(
                laptop.status
              )}`}
            >
              {t(laptop.status || "pending")}
            </span>
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <ActionsDropdown laptopId={laptop.id} />
        </div>
      </div>

      {/* Desktop table view - hidden on mobile */}
      <div className="col-span-4 hidden min-h-[72px] items-center px-6 py-4 md:flex">
        <div className="flex items-center">
          {laptop.images && laptop.images.length > 0 && (
            <img
              src={laptop.images[0]}
              alt={laptop.title}
              className="mr-3 h-10 w-10 flex-shrink-0 rounded object-cover"
            />
          )}
          <span className="line-clamp-2 text-sm">{laptop.title}</span>
        </div>
      </div>
      <div className="col-span-2 hidden items-center px-6 py-4 font-medium text-amber-400 md:flex">
        ${laptop.price}
      </div>
      <div className="col-span-2 hidden items-center px-6 py-4 text-sm md:flex">
        {laptop.userId || t("unknown")}
      </div>
      <div className="col-span-2 hidden items-center px-6 py-4 md:flex">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(
            laptop.status
          )}`}
        >
          {t(laptop.status || "pending")}
        </span>
      </div>
      <div className="col-span-2 hidden items-center px-6 py-4 md:flex">
        <div className="flex justify-end">
          <ActionsDropdown laptopId={laptop.id} />
        </div>
      </div>
    </div>
  );
}
