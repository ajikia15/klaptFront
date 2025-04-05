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
        <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-amber-700/30 p-8">
          <h1 className="text-2xl font-bold text-white mb-4">
            Content Moderation
          </h1>
          <p className="text-neutral-400 mb-6">
            Review and moderate user laptop listings
          </p>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === "all"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === "pending"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === "approved"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === "rejected"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setStatusFilter("archived")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === "archived"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              Archived
            </button>
          </div>

          {/* NUKE Button Section */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setNukeDialogOpen(true)}
              className="px-4 py-2 flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-800/30"
            >
              <AlertTriangle size={16} />
              Delete All Listings
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-neutral-800 rounded-lg">
                <tr>
                  <th className="px-6 py-3 rounded-l-lg">Title</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody ref={contentTable}>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                        <span className="ml-3">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-6 text-center">
                        <h3 className="text-red-300 font-semibold text-lg">
                          Error Loading Laptops
                        </h3>
                        <p className="text-neutral-300 mt-2">
                          We encountered a problem while fetching laptop
                          listings.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : laptops && laptops.length > 0 ? (
                  laptops
                    .filter(
                      (laptop) =>
                        statusFilter === "all" || laptop.status === statusFilter
                    )
                    .map((laptop) => (
                      <tr
                        key={laptop.id}
                        className="bg-neutral-800/30 border-b border-neutral-700/30"
                      >
                        <td className="px-6 py-4 font-medium">
                          <div className="flex items-center">
                            {laptop.images && laptop.images.length > 0 && (
                              <img
                                src={laptop.images[0]}
                                alt={laptop.title}
                                className="w-10 h-10 mr-3 rounded object-cover"
                              />
                            )}
                            <span className="line-clamp-1">{laptop.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">${laptop.price}</td>
                        <td className="px-6 py-4">
                          {laptop.userId || "Unknown"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium 
                          ${
                            laptop.status === "approved"
                              ? "bg-green-900/30 text-green-400 border border-green-800/30"
                              : laptop.status === "rejected"
                              ? "bg-red-900/30 text-red-400 border border-red-800/30"
                              : "bg-amber-900/30 text-amber-400 border border-amber-800/30"
                          }`}
                          >
                            {laptop.status || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
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
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors"
                              title="Delete listing"
                              onClick={() => handleDeleteClick(laptop.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors"
                              title="Delete listing"
                              onClick={() => handleArchiveClick(laptop.id)}
                            >
                              <Archive size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="bg-neutral-800/40 border border-neutral-700/30 rounded-lg p-8 text-center">
                        <p className="text-neutral-400">
                          No laptops found matching the selected filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
