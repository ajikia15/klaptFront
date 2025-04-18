import { useState } from "react";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useSearchLaptops } from "../../hooks/useSearch";
import {
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  AlertTriangle,
  Archive,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ApproveDialog,
  RejectDialog,
  DeleteDialog,
  NukeAllDialog,
  ArchiveDialog,
} from "../../components/admin/ModerationDialogs";
import { useChangeStatus } from "@/hooks/useModeration";
import { useDeleteLaptop } from "@/hooks/useModeration";
import { Button } from "@/components/ui/button";

export default function ContentModeration() {
  useRequireAuth();

  const { laptops, isLoading, error } = useSearchLaptops();
  const { mutate: changeStatus } = useChangeStatus();
  const { mutate: deleteLaptop } = useDeleteLaptop();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLaptopId, setSelectedLaptopId] = useState<number | null>(null);

  // Dialog state
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [nukeDialogOpen, setNukeDialogOpen] = useState(false);

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

  const handleNukeAll = () => {
    alert(
      "NUKE command initiated! All listings would be deleted if this was connected to the backend."
    );
    setNukeDialogOpen(false);
  };

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

          {/* Filter buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            {["all", "pending", "approved", "rejected", "archived"].map(
              (status) => {
                let activeClass = "";
                let inactiveClass = "";

                switch (status) {
                  case "approved":
                    activeClass = "bg-green-600 text-white";
                    inactiveClass =
                      "border border-green-800/30 bg-green-900/20 text-green-400 hover:bg-green-900/40 hover:text-green-300";
                    break;
                  case "rejected":
                    activeClass = "bg-red-600 text-white";
                    inactiveClass =
                      "border border-red-800/30 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300";
                    break;
                  case "pending":
                    activeClass = "bg-amber-600 text-white";
                    inactiveClass =
                      "border border-amber-800/30 bg-amber-900/20 text-amber-400 hover:bg-amber-900/40 hover:text-amber-300";
                    break;
                  case "archived":
                    activeClass = "bg-neutral-600 text-white";
                    inactiveClass =
                      "bg-neutral-800/70 border-neutral-700/30 border text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300";
                    break;
                  default: // "all"
                    activeClass = "bg-blue-600 text-white";
                    inactiveClass =
                      "border border-blue-800/30 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 hover:text-blue-300";
                }

                return (
                  <Button
                    key={status}
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

          {/* NUKE Button Section */}
          <div className="mb-6 flex justify-end">
            <Button
              onClick={() => setNukeDialogOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-red-800/30 bg-red-900/20 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-900/40 hover:text-red-300 sm:px-4 sm:py-2 sm:text-sm"
            >
              <AlertTriangle size={16} />
              Delete All Listings
            </Button>
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
                    <div
                      key={laptop.id}
                      className="bg-neutral-800/30 border-neutral-700/30 hover:bg-neutral-800/50 block border-b transition-colors md:grid md:grid-cols-12"
                    >
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
                                User: {laptop.userId || "Unknown"}
                              </span>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block
                                ${
                                  laptop.status === "approved"
                                    ? "bg-green-900/30 text-green-400 border border-green-800/30"
                                    : laptop.status === "rejected"
                                    ? "bg-red-900/30 text-red-400 border border-red-800/30"
                                    : laptop.status === "archived"
                                    ? "bg-neutral-700/30 text-neutral-400 border border-neutral-600/30"
                                    : "bg-amber-900/30 text-amber-400 border border-amber-800/30"
                                }`}
                            >
                              {laptop.status || "pending"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Link
                            to="/laptop/$laptopId"
                            params={{ laptopId: laptop.id.toString() }}
                            className="flex items-center gap-1 rounded bg-blue-900/20 p-1.5 text-blue-400 transition-colors hover:bg-blue-900/30 hover:text-blue-300"
                          >
                            <Eye size={16} />
                            <span className="text-xs">View</span>
                          </Link>
                          <Button
                            className="flex items-center gap-1 rounded bg-green-900/20 p-1.5 text-green-400 transition-colors hover:bg-green-900/30 hover:text-green-300"
                            onClick={() => handleApproveClick(laptop.id)}
                          >
                            <CheckCircle size={16} />
                            <span className="text-xs">Approve</span>
                          </Button>
                          <Button
                            className="flex items-center gap-1 rounded bg-red-900/20 p-1.5 text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
                            onClick={() => handleRejectClick(laptop.id)}
                          >
                            <XCircle size={16} />
                            <span className="text-xs">Reject</span>
                          </Button>
                          <Button
                            className="flex items-center gap-1 rounded bg-amber-900/20 p-1.5 text-amber-400 transition-colors hover:bg-amber-900/30 hover:text-amber-300"
                            onClick={() => handleArchiveClick(laptop.id)}
                          >
                            <Archive size={16} />
                            <span className="text-xs">Archive</span>
                          </Button>
                          <Button
                            className="flex items-center gap-1 rounded bg-red-900/20 p-1.5 text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
                            onClick={() => handleDeleteClick(laptop.id)}
                          >
                            <Trash2 size={16} />
                            <span className="text-xs">Delete</span>
                          </Button>
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
                          <span className="line-clamp-2 text-sm">
                            {laptop.title}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2 hidden items-center px-6 py-4 font-medium text-amber-400 md:flex">
                        ${laptop.price}
                      </div>
                      <div className="col-span-2 hidden items-center px-6 py-4 text-sm md:flex">
                        {laptop.userId || "Unknown"}
                      </div>
                      <div className="col-span-2 hidden items-center px-6 py-4 md:flex">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
                        ${
                          laptop.status === "approved"
                            ? "bg-green-900/30 text-green-400 border border-green-800/30"
                            : laptop.status === "rejected"
                            ? "bg-red-900/30 text-red-400 border border-red-800/30"
                            : laptop.status === "archived"
                            ? "bg-neutral-700/30 text-neutral-400 border border-neutral-600/30"
                            : "bg-amber-900/30 text-amber-400 border border-amber-800/30"
                        }`}
                        >
                          {laptop.status || "pending"}
                        </span>
                      </div>
                      <div className="col-span-2 hidden items-center px-6 py-4 md:flex">
                        <div className="flex space-x-1.5">
                          <Link
                            to="/laptop/$laptopId"
                            params={{ laptopId: laptop.id.toString() }}
                            className="rounded bg-blue-900/20 p-1.5 text-blue-400 transition-colors hover:bg-blue-900/30 hover:text-blue-300"
                            title="View listing"
                          >
                            <Eye size={16} />
                          </Link>
                          <Button
                            className="rounded bg-green-900/20 p-1.5 text-green-400 transition-colors hover:bg-green-900/30 hover:text-green-300"
                            title="Approve listing"
                            onClick={() => handleApproveClick(laptop.id)}
                          >
                            <CheckCircle size={16} />
                          </Button>
                          <Button
                            className="rounded bg-red-900/20 p-1.5 text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
                            title="Reject listing"
                            onClick={() => handleRejectClick(laptop.id)}
                          >
                            <XCircle size={16} />
                          </Button>
                          <Button
                            className="rounded bg-amber-900/20 p-1.5 text-amber-400 transition-colors hover:bg-amber-900/30 hover:text-amber-300"
                            title="Archive listing"
                            onClick={() => handleArchiveClick(laptop.id)}
                          >
                            <Archive size={16} />
                          </Button>
                          <Button
                            className="rounded bg-red-900/20 p-1.5 text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
                            title="Delete listing"
                            onClick={() => handleDeleteClick(laptop.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
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

      <NukeAllDialog
        open={nukeDialogOpen}
        onOpenChange={setNukeDialogOpen}
        onAction={handleNukeAll}
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
