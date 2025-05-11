import { useState } from "react";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useSearchLaptops } from "../../hooks/useSearch";
import { CheckCircle, XCircle, AlertTriangle, Archive } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ApproveDialog,
  RejectDialog,
  DeleteDialog,
  ArchiveDialog,
} from "../../components/admin/ModerationDialogs";
import { useChangeStatus } from "@/hooks/useModeration";
import { useDeleteLaptop } from "@/hooks/useModeration";
import { Button } from "@/components/ui/button";
import ContentLaptopCard from "@/components/ContentLaptopCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function ContentModeration() {
  useRequireAuth();

  const { laptops, isLoading, error, page, setPage, pageCount } =
    useSearchLaptops();

  const { mutate: changeStatus } = useChangeStatus();
  const { mutate: deleteLaptop } = useDeleteLaptop();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLaptopId, setSelectedLaptopId] = useState<number | null>(null);

  // Dialog state
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  const [contentTable] = useAutoAnimate();

  // Action handlers
  function approveListing(laptopId: number) {
    console.log("Approving listing with ID:", laptopId);
    changeStatus({
      laptopId,
      status: "approved",
    });
    setApproveDialogOpen(false);
  }

  function rejectListing(laptopId: number) {
    changeStatus({
      laptopId,
      status: "rejected",
    });
    setRejectDialogOpen(false);
  }

  function deleteListing(laptopId: number) {
    deleteLaptop(laptopId);
    setDeleteDialogOpen(false);
  }

  function archiveListing(laptopId: number) {
    changeStatus({
      laptopId,
      status: "archived",
    });
    setArchiveDialogOpen(false);
  }

  // Dialog open handlers
  function handleApproveClick(id: number) {
    setSelectedLaptopId(id);
    setApproveDialogOpen(true);
  }

  function handleRejectClick(id: number) {
    setSelectedLaptopId(id);
    setRejectDialogOpen(true);
  }

  function handleDeleteClick(id: number) {
    setSelectedLaptopId(id);
    setDeleteDialogOpen(true);
  }
  function handleArchiveClick(id: number) {
    setSelectedLaptopId(id);
    setArchiveDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-10 text-neutral-200">
      <div className="container mx-auto px-4">
        <div className="from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-amber-700/30 bg-gradient-to-br p-4 sm:p-8">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Content Moderation
          </h1>
          <p className="mb-6 text-neutral-400">
            Review and moderate user laptop listings
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            {["all", "pending", "approved", "rejected", "archived"].map(
              (status) => {
                let activeClass = "";
                let inactiveClass = "";

                switch (status) {
                  case "approved":
                    activeClass =
                      "bg-green-600 text-white hover:bg-green-700 hover:text-white";
                    inactiveClass =
                      "border border-green-800/30 bg-green-900/20 text-green-400 hover:bg-green-900/40 hover:text-green-300";
                    break;
                  case "rejected":
                    activeClass =
                      "bg-red-600 text-white hover:bg-red-700 hover:text-white";
                    inactiveClass =
                      "border border-red-800/30 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300";
                    break;
                  case "pending":
                    activeClass =
                      "bg-amber-600 text-white hover:bg-amber-700 hover:text-white";
                    inactiveClass =
                      "border border-amber-800/30 bg-amber-900/20 text-amber-400 hover:bg-amber-900/40 hover:text-amber-300";
                    break;
                  case "archived":
                    activeClass =
                      "bg-neutral-600 text-white hover:bg-neutral-700 hover:text-white";
                    inactiveClass =
                      "bg-neutral-800/70 border-neutral-700/30 border text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300";
                    break;
                  default: // "all"
                    activeClass =
                      "bg-blue-600 text-white hover:bg-blue-700 hover:text-white";
                    inactiveClass =
                      "border border-blue-800/30 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 hover:text-blue-300";
                }

                return (
                  <Button
                    key={status}
                    variant="ghost"
                    onClick={() => setStatusFilter(status)}
                    className={`${
                      statusFilter === status ? activeClass : inactiveClass
                    }`}
                  >
                    {status === "approved" && <CheckCircle size={14} />}
                    {status === "rejected" && <XCircle size={14} />}
                    {status === "pending" && <AlertTriangle size={14} />}
                    {status === "archived" && <Archive size={14} />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                );
              }
            )}
          </div>

          <div className="border-neutral-700/30 overflow-x-auto rounded-lg border">
            {/* Table header - using grid - only visible on medium screens and up */}
            <div className="hidden grid-cols-12 bg-neutral-800 text-xs font-medium uppercase md:grid">
              <div className="col-span-4 px-6 py-3">Title</div>
              <div className="col-span-2 px-6 py-3">Price</div>
              <div className="col-span-2 px-6 py-3">User</div>
              <div className="col-span-2 px-6 py-3">Status</div>
              <div className="col-span-2 px-6 py-3">Actions</div>
            </div>

            {/* Table body - using grid for md+ and cards for mobile */}
            <div ref={contentTable}>
              {isLoading ? (
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
                    We encountered a problem while fetching laptop listings.
                  </p>
                </div>
              ) : laptops && laptops.length > 0 ? (
                laptops
                  .filter(
                    (laptop) =>
                      statusFilter === "all" || laptop.status === statusFilter
                  )
                  .map((laptop) => (
                    <ContentLaptopCard
                      key={laptop.id}
                      laptop={laptop}
                      onApprove={handleApproveClick}
                      onReject={handleRejectClick}
                      onDelete={handleDeleteClick}
                      onArchive={handleArchiveClick}
                    />
                  ))
              ) : (
                <div className="bg-neutral-800/40 py-8 text-center">
                  <p className="text-neutral-400">
                    No laptops found matching the selected filter.
                  </p>
                </div>
              )}
            </div>
          </div>

          {pageCount > 1 && (
            <div className="mt-8 flex items-center justify-center">
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
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
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
                        page === pageCount
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Moderation Dialogs */}
      <ApproveDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        laptopId={selectedLaptopId}
        onAction={approveListing}
      />

      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        laptopId={selectedLaptopId}
        onAction={rejectListing}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        laptopId={selectedLaptopId}
        onAction={deleteListing}
      />

      <ArchiveDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        laptopId={selectedLaptopId}
        onAction={archiveListing}
      />
    </div>
  );
}
