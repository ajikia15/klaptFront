import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

interface PartBadgeProps {
  label: string;
  searchParam: string;
  searchValue: string | number;
  className?: string;
}

export const PartBadge: FC<PartBadgeProps> = ({
  label,
  searchParam,
  searchValue,
  className = "",
}) => {
  return (
    <Badge
      className={`border-neutral-700/20 cursor-pointer border bg-neutral-800 font-bold text-neutral-200 shadow-sm transition-all hover:bg-neutral-700 hover:text-neutral-100 ${className}`}
    >
      <Link to="/search" search={{ [searchParam]: [searchValue.toString()] }}>
        {label}
      </Link>
    </Badge>
  );
};
