import React from "react";
import { Link } from "@tanstack/react-router";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MyPostLaptopProps {
  id: number;
  title: string;
  price: number;
  status?: "pending" | "approved" | "rejected" | "archived";
  images?: string[];
  onDelete: (id: number) => void;
}

export function MyPostsLaptopCard({
  id,
  title,
  price,
  status = "pending",
  images,
  onDelete,
}: MyPostLaptopProps) {
  // Status specific styling - borrowed from ContentLaptopCard
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
              <span>View</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/"
              params={{ laptopId: laptopId.toString() }}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4 text-amber-400" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(laptopId)}>
            <Trash2 className="mr-2 h-4 w-4 text-red-400" />
            <span>Delete</span>
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
          {images && images.length > 0 && (
            <img
              src={images[0]}
              alt={title}
              className="mr-3 h-16 w-16 flex-shrink-0 rounded object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="mb-1 font-medium">{title}</h3>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-amber-400">${price}</span>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${getStatusStyle(
                status
              )}`}
            >
              {status || "pending"}
            </span>
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <ActionsDropdown laptopId={id} />
        </div>
      </div>

      {/* Desktop table view - hidden on mobile */}
      <div className="col-span-6 hidden min-h-[72px] items-center px-6 py-4 md:flex">
        <div className="flex items-center">
          {images && images.length > 0 && (
            <img
              src={images[0]}
              alt={title}
              className="mr-3 h-10 w-10 flex-shrink-0 rounded object-cover"
            />
          )}
          <span className="line-clamp-2 text-sm">{title}</span>
        </div>
      </div>
      <div className="col-span-2 hidden items-center px-6 py-4 font-medium text-amber-400 md:flex">
        ${price}
      </div>
      <div className="col-span-2 hidden items-center px-6 py-4 md:flex">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(
            status
          )}`}
        >
          {status || "pending"}
        </span>
      </div>
      <div className="col-span-2 hidden items-center px-6 py-4 md:flex">
        <div className="flex justify-end">
          <ActionsDropdown laptopId={id} />
        </div>
      </div>
    </div>
  );
}
