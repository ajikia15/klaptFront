import { useAuth } from "@/context/AuthContext";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useSearchLaptops } from "@/hooks/useSearch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDeleteLaptop } from "@/hooks/useModeration";
import { MyPostsLaptopCard } from "@/components/MyPostsLaptopCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function ProfilePosts() {
  const { user } = useAuth();
  const {
    laptops: userLaptops,
    isLoading,
    error,
    page,
    setPage,
    pageCount,
  } = useSearchLaptops("", user?.id);

  const { mutate: deleteLaptop } = useDeleteLaptop();
  const [isDeleting, setIsDeleting] = useState(false);
  const [contentTable] = useAutoAnimate();

  // Handler for deleting laptops
  const handleDelete = (laptopId: number) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      setIsDeleting(true);
      deleteLaptop(laptopId, {
        onSettled: () => {
          setIsDeleting(false);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1 w-5 rounded-full bg-secondary-500"></div>
          <h2 className="text-2xl font-bold text-white">My Laptops</h2>
        </div>

        <Link to="/add-listing" className="">
          <Button variant={"outline"}>
            <span>Add New</span>
            <Plus size={18} />
          </Button>
        </Link>
      </div>

      <div className="border-neutral-700/30 overflow-x-auto rounded-lg border">
        {/* Table header - using grid - only visible on medium screens and up */}
        <div className="hidden grid-cols-12 bg-neutral-800 text-xs font-medium uppercase md:grid">
          <div className="col-span-6 px-6 py-3">Title</div>
          <div className="col-span-2 px-6 py-3">Price</div>
          <div className="col-span-2 px-6 py-3">Status</div>
          <div className="col-span-2 px-6 py-3">Actions</div>
        </div>

        {/* Table body - using grid for md+ and cards for mobile */}
        <div ref={contentTable}>
          {isLoading || isDeleting ? (
            <div className="bg-neutral-800/30 py-8 text-center">
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
                <span className="ml-3">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="border border-red-700/30 bg-red-900/20 p-6 text-center">
              <h3 className="text-lg font-semibold text-red-300">
                Error Loading Laptops
              </h3>
              <p className="mt-2 text-neutral-300">
                We encountered a problem while fetching your laptop listings.
              </p>
            </div>
          ) : userLaptops && userLaptops.length > 0 ? (
            userLaptops.map((laptop) => (
              <MyPostsLaptopCard
                key={laptop.id}
                id={laptop.id}
                title={laptop.title}
                price={laptop.price}
                status={laptop.status}
                images={laptop.images}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="bg-neutral-800/40 py-8 text-center">
              <p className="text-neutral-400">
                You haven't posted any laptops yet.
              </p>
              <div className="mt-4">
                <Link
                  to="/add-listing"
                  className="inline-flex items-center gap-2 rounded-md bg-secondary-500 px-4 py-2 font-medium text-white hover:bg-secondary-600"
                >
                  <Plus size={16} />
                  Create Your First Listing
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : 0}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    aria-current={page === i + 1 ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={page === pageCount}
                  tabIndex={page === pageCount ? -1 : 0}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < pageCount) setPage(page + 1);
                  }}
                  className={
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
