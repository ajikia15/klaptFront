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
    <div className="min-h-screen bg-neutral-900 text-neutral-200 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-amber-700/30 p-4 sm:p-8">
          <h1 className="text-2xl font-bold text-white mb-4">
            Content Moderation
          </h1>
          <p className="text-neutral-400 mb-6">
            Review and moderate user laptop listings
          </p>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "pending", "approved", "rejected", "archived"].map(
              (status) => {
                let activeClass = "";
                let inactiveClass = "";

                switch (status) {
                  case "approved":
                    activeClass = "bg-green-600 text-white";
                    inactiveClass =
                      "bg-green-900/20 hover:bg-green-900/40 text-green-400 hover:text-green-300 border border-green-800/30";
                    break;
                  case "rejected":
                    activeClass = "bg-red-600 text-white";
                    inactiveClass =
                      "bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-800/30";
                    break;
                  case "pending":
                    activeClass = "bg-amber-600 text-white";
                    inactiveClass =
                      "bg-amber-900/20 hover:bg-amber-900/40 text-amber-400 hover:text-amber-300 border border-amber-800/30";
                    break;
                  case "archived":
                    activeClass = "bg-neutral-600 text-white";
                    inactiveClass =
                      "bg-neutral-800/70 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-300 border border-neutral-700/30";
                    break;
                  default: // "all"
                    activeClass = "bg-blue-600 text-white";
                    inactiveClass =
                      "bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 hover:text-blue-300 border border-blue-800/30";
                }

                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs sm:text-sm ${
                      statusFilter === status ? activeClass : inactiveClass
                    }`}
                  >
                    {status === "approved" && <CheckCircle size={14} />}
                    {status === "rejected" && <XCircle size={14} />}
                    {status === "pending" && <AlertTriangle size={14} />}
                    {status === "archived" && <Archive size={14} />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              }
            )}
          </div>

          {/* NUKE Button Section */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setNukeDialogOpen(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-800/30 text-xs sm:text-sm"
            >
              <AlertTriangle size={16} />
              Delete All Listings
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-neutral-700/30">
            {/* Table header - using grid - only visible on medium screens and up */}
            <div className="hidden md:grid grid-cols-12 bg-neutral-800 text-xs uppercase font-medium">
              <div className="col-span-4 px-6 py-3">Title</div>
              <div className="col-span-2 px-6 py-3">Price</div>
              <div className="col-span-2 px-6 py-3">User</div>
              <div className="col-span-2 px-6 py-3">Status</div>
              <div className="col-span-2 px-6 py-3">Actions</div>
            </div>

            {/* Table body - using grid for md+ and cards for mobile */}
            <div ref={contentTable}>
              {isLoading ? (
                <div className="py-8 text-center bg-neutral-800/30">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                    <span className="ml-3">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-900/20 border border-red-700/30 p-6 text-center">
                  <h3 className="text-red-300 font-semibold text-lg">
                    Error Loading Laptops
                  </h3>
                  <p className="text-neutral-300 mt-2">
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
                      className="md:grid md:grid-cols-12 block bg-neutral-800/30 border-b border-neutral-700/30 hover:bg-neutral-800/50 transition-colors"
                    >
                      {/* Mobile card view */}
                      <div className="p-4 md:hidden">
                        <div className="flex items-start mb-3">
                          {laptop.images && laptop.images.length > 0 && (
                            <img
                              src={laptop.images[0]}
                              alt={laptop.title}
                              className="w-16 h-16 mr-3 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{laptop.title}</h3>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-amber-400 font-medium">
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
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Link
                            to="/laptop/$laptopId"
                            params={{ laptopId: laptop.id.toString() }}
                            className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/30 rounded transition-colors flex items-center gap-1"
                          >
                            <Eye size={16} />
                            <span className="text-xs">View</span>
                          </Link>
                          <button
                            className="p-1.5 text-green-400 hover:text-green-300 bg-green-900/20 hover:bg-green-900/30 rounded transition-colors flex items-center gap-1"
                            onClick={() => handleApproveClick(laptop.id)}
                          >
                            <CheckCircle size={16} />
                            <span className="text-xs">Approve</span>
                          </button>
                          <button
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors flex items-center gap-1"
                            onClick={() => handleRejectClick(laptop.id)}
                          >
                            <XCircle size={16} />
                            <span className="text-xs">Reject</span>
                          </button>
                          <button
                            className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-900/20 hover:bg-amber-900/30 rounded transition-colors flex items-center gap-1"
                            onClick={() => handleArchiveClick(laptop.id)}
                          >
                            <Archive size={16} />
                            <span className="text-xs">Archive</span>
                          </button>
                          <button
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors flex items-center gap-1"
                            onClick={() => handleDeleteClick(laptop.id)}
                          >
                            <Trash2 size={16} />
                            <span className="text-xs">Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Desktop table view - hidden on mobile */}
                      <div className="col-span-4 px-6 py-4 min-h-[72px] items-center hidden md:flex">
                        <div className="flex items-center">
                          {laptop.images && laptop.images.length > 0 && (
                            <img
                              src={laptop.images[0]}
                              alt={laptop.title}
                              className="w-10 h-10 mr-3 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <span className="line-clamp-2 text-sm">
                            {laptop.title}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2 px-6 py-4 items-center font-medium text-amber-400 hidden md:flex">
                        ${laptop.price}
                      </div>
                      <div className="col-span-2 px-6 py-4 items-center text-sm hidden md:flex">
                        {laptop.userId || "Unknown"}
                      </div>
                      <div className="col-span-2 px-6 py-4 items-center hidden md:flex">
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
                      <div className="col-span-2 px-6 py-4 items-center hidden md:flex">
                        <div className="flex space-x-1.5">
                          <Link
                            to="/laptop/$laptopId"
                            params={{ laptopId: laptop.id.toString() }}
                            className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/30 rounded transition-colors"
                            title="View listing"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            className="p-1.5 text-green-400 hover:text-green-300 bg-green-900/20 hover:bg-green-900/30 rounded transition-colors"
                            title="Approve listing"
                            onClick={() => handleApproveClick(laptop.id)}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors"
                            title="Reject listing"
                            onClick={() => handleRejectClick(laptop.id)}
                          >
                            <XCircle size={16} />
                          </button>
                          <button
                            className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-900/20 hover:bg-amber-900/30 rounded transition-colors"
                            title="Archive listing"
                            onClick={() => handleArchiveClick(laptop.id)}
                          >
                            <Archive size={16} />
                          </button>
                          <button
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors"
                            title="Delete listing"
                            onClick={() => handleDeleteClick(laptop.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-8 bg-neutral-800/40 text-center">
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
